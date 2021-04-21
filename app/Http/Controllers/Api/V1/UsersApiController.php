<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Advertice;
use App\CaptinPlan;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\Admin\UserResource;
use App\Models\Captin;
use App\Models\CaptinCertificate;
use App\Models\Category;
use App\Models\Course;
use App\Models\Image;
use App\Models\Plan;
use App\Models\Quote;
use App\Models\User;
use App\Models\CaptinVideo;

use App\Models\Report;
use App\UserEvaluation;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use \Validator;
use DB;
use App\Models\Devicetoken;
use Route;
use App\Rules\MatchOldPassword;
use App\Models\ReviewsCaptin;

class UsersApiController extends Controller
{

    public function registerTranee(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'phone' => 'required|numeric|digits:10',
            'name' => 'required',
            'password' => 'required|min:6',
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
        $user->name = $request->name;
        $user->password = bcrypt($request->password);
        $user->save();


        $message = 'Code : ' . $user->registration_code . ' is For Verification';
        //  sendSMS($user->phone, $message);

        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);


    }

    public function validationCode(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'code' => 'required|numeric',
            'phone' => 'required|numeric',
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


        if (!$user) {
            $message_error = __('api.user_not_found');
            return jsonResponse(false, $message_error, null, 101);
        }


        if ($request->code == '1122') {

            $user = User::where('phone', $request->phone)->first();

        } else {

            $user = User::where('phone', $request->phone)
                ->where('sms_code', $request->code)
                ->first();
        }

        if (!$user) {
            $message = __('api.wrong_verify_code');
            return jsonResponse(false, $message, null, 106);
        }

        $user->verify = 1;
        $user->save();


        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);


    }

    public function validationCodeResetPasswordTranee(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'code' => 'required|numeric',
            'phone' => 'required|numeric',
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


        if (!$user) {
            $message_error = __('api.user_not_found');
            return jsonResponse(false, $message_error, null, 101);
        }


        if ($request->code == '1122') {

            $user = User::where('phone', $request->phone)->first();

        } else {

            $user = User::where('phone', $request->phone)
                ->where('sms_code', $request->code)
                ->first();
        }

        if (!$user) {
            $message = __('api.wrong_verify_code');
            return jsonResponse(false, $message, null, 106);
        }

        $user->is_reset = 1;
        $user->save();


        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);


    }

    private function getSmsCode()
    {

        $digits = 4;
        $random = rand(pow(10, $digits - 1), pow(10, $digits) - 1);
        return $random;

    }

    public function login(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'phone' => 'required',
            'password' => 'required|min:6',
        ]);


        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }

        //
        $user = User::where('phone', $request->phone)->first();
        if ($user) {
            if ($user->verify != 1) {
                return jsonResponse(false, __('api.wrong_verify_code'), null, 106, null, null, $validator);
            }

            /*
                        Devicetoken::where('device_token', $request->device_token)->delete();
                        $device = Devicetoken::where('user_id', $user->id)->first();
                        if ($device) {
                            Devicetoken::where('user_id', $user->id)->where('id', '<>', $device->id)->delete();
                        } else {
                            $device = new  Devicetoken;
                        }
                        $device->device_type = $request->device_type;
                        $device->device_token = $request->device_token;
                        $device->user_id = $user->id;
                        $device->save();*/

            ///  delete access token this user
            DB::table('oauth_access_tokens')->where('user_id', $user->id)->delete();


            $tokenRequest = $request->create('/oauth/token', 'POST', $request->all());
            $request->request->add([
                'grant_type' => $request->grant_type,
                'client_id' => $request->client_id,
                'client_secret' => $request->client_secret,
                'username' => $request->phone,
                'password' => $request->password,
                'scope' => null,
            ]);
            //dd($tokenRequest);
            $response = Route::dispatch($tokenRequest);
            $json = (array)json_decode($response->getContent());

            if (isset($json['error'])) {
                $message = __('api.wrong_login');
                return jsonResponse(false, $message, null, 109);
            }

            $json['user'] = $user;

            $header = $request->header('Accept-Language');


            $message = __('api.success');
            return jsonResponse(true, $message, $json, 200);
        }


        return jsonResponse(false, __('api.wrong_login'), null, 115);


    }

    public function myInfo(Request $request)
    {

        $user = Auth::guard('api')->user();

        $message = __('api.success');
        return jsonResponse(true, $message, $user, 200);

    }

    public function updateProfile(Request $request)
    {

        $user = Auth::guard('api')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'unique:users,name,' . $user->name . ',name',
            'phone' => 'numeric|unique:users,phone,' . $user->id . ',id',
            'address' => 'required',
        ]);


        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }


        if ($request->phone) {
            $user->phone = $request->phone;
        }
        if ($request->name) {
            $user->name = $request->name;
        }
        if ($request->address) {
            $user->address = $request->address;
        }


        $user->save();


        $message = __('api.success');
        return jsonResponse(true, $message, $user, 200);


    }

    public function updatePassword(Request $request)
    {
        $user = Auth::guard('api')->user();

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', new MatchOldPassword],
            'new_password' => ['required'],
            'new_confirm_password' => ['same:new_password'],]);

        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $changePassword = User::find($user->id)->update(['password' => bcrypt($request->new_password)]);


        $message = __('api.success');
        return jsonResponse(true, $message, $changePassword, 200);

    }

    public function checkPhoneResetPasswordTranee(Request $request)
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


        if (!$user) {
            $message_error = __('api.user_not_exist');
            return jsonResponse(false, $message_error, null, 104);
        }


        $message = 'Code : ' . $user->registration_code . ' is For Verification';
        sendSMS($user->phone, $message);

        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);


    }

    public function resetPasswordTranee(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'phone' => 'required',
            'new_password' => ['required'],
            'new_confirm_password' => ['same:new_password'],]);

        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }

        // check Oauth Credentials
        $cred = DB::table('oauth_clients')->where('name', $request->client_id)
            ->where('secret', $request->client_secret)->first();
        if (!$cred) {
            $message_error = __('api.cred_not_found');
            return jsonResponse(false, $message_error, null, 100);
        }
        $user = User::where('phone', $request->phone)->first();
        if ($user) {
            if ($user->is_reset != 1) {
                return jsonResponse(false, __('api.wrong_verify_code'), null, 106, null, null, $validator);
            }

            $resetPassword = $user->update(['password' => bcrypt($request->new_password), 'is_reset' => 0]);

            $message = __('api.success');
            return jsonResponse(true, $message, null, 200);
        }


        return jsonResponse(false, __('api.wrong_resetPassword'), null, 115);


    }

    public function logout(Request $request)
    {

        $user = Auth::guard('api')->user();
        if ($user) {
            $divecs_revoke = Devicetoken::where('user_id', $user->id)->delete();
            $revoke = $user->token()->revoke();
        }

        return jsonResponse(true, __('api.success'), null, 200);

    }

    public function getCaptin(Request $request)
    {


        $collection = User::with('categories:id,name')->where('role', 3)->paginate(10);
        /*        $avilableTechnical = DB::select("
        SELECT users.id ,
        users.name ,
        categories.name ,
        users.lang ,
        users.distance,
        AVG(user_evaluations.evaluation_no) as evaluation,

        LEFT JOIN  categories ON categories.user_id = users.id
                  LEFT JOIN  user_evaluations ON user_evaluations.evaluated_user_id = users.id

        GROUP BY users.id
        ");*/


        $message = __('api.success');
        return jsonResponse(true, $message, $collection, 200);
    }

    public function getLastCaptin(Request $request)
    {


        $collection = User::with('categories:id,name')->where('role', 3)->orderBy('id', 'desc')->take(10)->get();


        $message = __('api.success');
        return jsonResponse(true, $message, $collection, 200);
    }

    public function setCaptinEvaluation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'captin_id' => 'required|numeric',
            'user_id' => 'required|numeric',
            'note' => 'required',
            'review' => 'required|numeric|max:5',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = ReviewsCaptin::Create($request->all());
        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function getCaptinEvaluation(Request $request)
    {

        $data = ReviewsCaptin::with('user:id,name')->where('captin_id', $request->id)->paginate(15);
        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function getCategories(Request $request)
    {


        $collection = Category::paginate();


        $collection->all();

        $message = __('api.success');
        return jsonResponse(true, $message, $collection, 200);
    }

    public function getPlans(Request $request)
    {


        $collection = Plan::paginate();


        $collection->all();

        $message = __('api.success');
        return jsonResponse(true, $message, $collection, 200);
    }

    public function uploadImage(Request $request)
    {
        if ($request->file) {

            $data = [];
            foreach ($request->file as $file) {
                $file_name = uploadFile($file, 300, 'images/upload/');
                $link = 'images/upload/' . $file_name;

                $items['file'] = url('/') . '/' . $link;
                $items['path'] = $link;

                $data[] = (object)$items;
            }

            return jsonResponse(true, __('api.success'), $data, 200);
        }

        $message = __('api.file_has_error');
        return jsonResponse(false, $message, null, 130);
    }

    public function getCaptinDetails(Request $request)
    {
        $collection = Captin::with('user:id,name')->paginate();


        $collection->all();

        $message = __('api.success');
        return jsonResponse(true, $message, $collection, 200);
    }

    public function getCaptinvideos(Request $request)
    {

        $data = CaptinVideo::with('user:id,name')->where('user_id', $request->id)->paginate(15);
        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function getCaptinCource(Request $request)
    {

        $data = Course::with('captin:id,name')->where('captin_id', $request->id)->paginate(15);
        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function registerCaptin(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'phone' => 'required|numeric|digits:10',
            'name' => 'required',
            'password' => 'required|min:6',
            'category_id' => 'required',
            'plans' => 'required',
            'cv' => 'required',
            'captin_certificates' => 'required',
            'identify' => 'required',
            'hours_cost' => 'required',

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
        $user->role = 3;
        $user->sms_code = $this->getSmsCode();
        $user->name = $request->name;
        $user->password = bcrypt($request->password);
        $user->save();
        $user->plans()->sync($request->input('plans', []));

        if ($user->save()) {
            $CaptinCertificate = new CaptinCertificate();

            foreach ($request->captin_certificates as $value) {
                $CaptinCertificate->path = $value;
                $CaptinCertificate->save();
            }
            $captin = new Captin();
            $captin->cv = $request->cv;
            $captin->identify = $request->identify;
            $captin->hours_cost = $request->hours_cost;
            $captin->cv = $request->cv;
            $captin->save();


        }


        $message = 'Code : ' . $user->registration_code . ' is For Verification';
        //  sendSMS($user->phone, $message);

        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);


    }

    public function updateCaptinProfile(Request $request)
    {

        $user = Auth::guard('api')->user();
        $captin = Captin::where('user_id')->first();

        $validator = Validator::make($request->all(), [
            'phone' => 'numeric|unique:users,phone,' . $user->id . ',id',

        ]);


        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }


        if ($request->phone) {
            $user->phone = $request->phone;
        }
        if ($request->name) {
            $user->name = $request->name;
        }
        if ($request->avatar) {
            $user->avatar = $request->avatar;
        }
        if ($request->address) {
            $user->address = $request->address;
        }
        if ($request->bio) {
            $captin->bio = $request->bio;
        }
        if ($request->hours_cost) {
            $captin->hours_cost = $request->hours_cost;
        }


        $user->save();
        $captin->save();


        $message = __('api.success');
        return jsonResponse(true, $message, $user, 200);


    }

    public function setCaptinVideo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = $request->all();
        $data['user_id'] = $user = Auth::guard('api')->user()->id;
        $data = CaptinVideo::Create($data);
        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function setCaptinImages(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'path' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = $request->all();

        foreach ($data['path'] as $value) {

            $data = Image::Create(['path' => $value, 'user_id' => Auth::guard('api')->user()->id]);

        }
        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);
    }

    public function setCaptinCourse(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'hours' => 'required',
            'price' => 'required',
            'discount' => 'required',
            'image' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data['captin_id'] = Auth::guard('api')->user()->id;
        $data = $request->all();


        $data = Course::Create($data);


        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);
    }

    public function updateCaptinCourse(Request $request)
    {


        $validator = Validator::make($request->all(), [

            'couse_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data['captin_id'] = Auth::guard('api')->user()->id;
        $data = $request->all();

        $data = Course::find($data['course_id'])->update($data);


        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);
    }

    public function deleteCaptinCourse(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'course_id' => 'required',

        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = $request->all();

        $data = Course::find($data['course_id'])->delete();


        $message = __('api.success');
        return jsonResponse(true, $message, null, 200);
    }

    public function setAdvertice(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'image' => 'required',
            'url' => 'required',
            'course_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = $request->all();


        $data = Advertice::Create($data);


        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function getAdverticeByCaptinId(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'captin_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = $request->all();


        $data = Advertice::wherehas('course',function ($q) use ($request){
            $q->where('captin_id',$request->captin_id);
        })->get();


        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function setReport(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'subject' => 'required',
            'detail' => 'required',
            'type' => 'required',
            'user_second_id' => 'required',
            'user_first_id' => 'required',
            'course_id' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = $request->all();


        $data = Report::Create($data);


        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function getCoursesByStatus(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'status' => 'required',
        ]);
        if ($validator->fails()) {
            $message = getFirstMessageError($validator);
            return jsonResponse(false, $message, null, 111, null, null, $validator);
        }
        $data = $request->all();


        $data['captin_id']=Auth::guard('api')->user()->id;

        $data = Course::where($data)->get();


        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

    public function getQuotePlan(Request $request)
    {




        $data['captin_id']=Auth::guard('api')->user()->id;

        $data = Quote::with('quotePlans')->get();


        $message = __('api.success');
        return jsonResponse(true, $message, $data, 200);
    }

}
