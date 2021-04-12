<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\User;
use Gate;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use \Validator;
use DB;

class UsersApiController extends Controller
{

    public function signPhoneClient(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'phone' => 'required|numeric|digits:10',
        ]);


        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }


        $user = User::where('phone', $request->phone)->first();

        // check Oauth Credentials
        $cred = DB::table('oauth_clients')->where('name', $request->client_id)
            ->where('secret', $request->client_secret)->first();
        if (!$cred) {
            $message_error = __('api.cred_not_found');
            return jsonResponse(false, $message_error, null, 100);
        }


        if ($user) {
            $message_error = __('api.user_exist_before');
            return jsonResponse(false, $message_error, null, 104);
        }


        $user = new User;
        $user->phone = $request->phone;
        $user->role = 1;
        $user->sms_code = $this->getSmsCode();
        $user->save();


        $message = 'Code : ' . $user->registration_code . ' is For Verification';
        sendSMS($user->phone, $message);

        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);


    }

    private function getSmsCode()
    {

        $digits = 4;
        $random = rand(pow(10, $digits - 1), pow(10, $digits) - 1);
        return $random;

    }
}
