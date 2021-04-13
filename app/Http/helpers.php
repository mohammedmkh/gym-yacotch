<?php



use App\User;
use Illuminate\Support\Facades\Cache;


function  alertSuccessUpdate($message = null , $title = null){


    if(session()->get('language') == 'en'){
        $message = ' The Editing Item Success Updating ' ;
        $title = 'Success Update ' ;
        toastr()->success( $message ,  $title , ['timeOut' => 445000]);
    }else{
        $message = ' تمت عملية التعديل بنجاح ' ;
        $title = ' نجاح الاجراء ' ;
        toastr()->success( $message ,  $title , ['timeOut' => 445000]);
    }


}



function  alertSuccessAdd($message = null , $title = null){


    if(session()->get('language') == 'en'){
        $message = ' The Add Item Success created ' ;
        $title = 'Success Add ' ;
        toastr()->success( $message,  $title , ['timeOut' => 5000]);
    }else{
        $message = ' تمت عملية الاضافة بنجاح ' ;
        $title = ' نجاح الاجراء ' ;
        toastr()->success( $message ,    $title , ['timeOut' => 5000]);
    }


}

function adminPath(){
    return 'panel/';
}

function getFirstMessageError($validator){
    if ($validator && $validator->fails()) {

        $messages = $validator->errors()->toArray();
        foreach ($messages as $key => $row) {
            $errors['field'] = $key;
            return $row[0] .' '. $key;

        }
    }
}

function getDataFromRequest($type = 'user_tech' , $request = []){


    if($type == 'user_tech'){
        $d['phone'] = $request->phone;
        $d['tech_store_email'] = $request->email;
        $d['min_order_value'] = $request->min_order_value;
        $d['tech_store_email'] = $request->email;
        $d['priority'] = $request->priority;
        $d['app_benifit_percentage'] = $request->app_benifit_percentage;
        if($request->hour_work != '')
            $d['hour_work'] = $request->hour_work;

        if(! $request->have_vehicle){
            $d['have_vehicle'] = 0;
        }else{
            $d['have_vehicle'] = $request->have_vehicle;
        }
        if( $request->type_vehicle != ''){
            $d['type_vehicle'] = $request->type_vehicle;
        }

        $d['type'] = 1 ;   //  1 mean is technician
        $d['services'] = json_encode($request->categories) ;

        if($request->work_time_from != ''){
            $d['work_time_from'] = $request->work_time_from ;
        }
        if($request->work_time_to != ''){
            $d['work_time_to'] = $request->work_time_to ;
        }



        return $d ;
    }
    if($type == 'user_tech_store'){
        $d['bank_name'] = $request->bank_name;
        $d['bank_account'] = $request->bank_account;
        $d['owner_account'] = $request->owner_account;
        $d['phone'] = $request->phone;
        $d['tech_store_email'] = $request->email;
        $d['min_order_value'] = $request->order_min;
        $d['tech_store_email'] = $request->email;
        $d['priority'] = $request->priority;
        $d['driver_radius']=$request->driver_radius;
        $d['app_benifit_percentage'] = $request->app_benifit_percentage;
        if($request->hour_work != '')
            $d['hour_work'] = $request->hour_work;

        if( $request->vehicle_type != ''){
            $d['type_vehicle'] = $request->vehicle_type;
        }

        $d['type'] = 2 ;   //  1 mean is technician
        $d['services'] = json_encode($request->categories) ;

        if($request->work_time_from != ''){
            $d['work_time_from'] = $request->work_time_from ;
        }
        if($request->work_time_to != ''){
            $d['work_time_to'] = $request->work_time_to ;
        }



        return $d ;
    }


}



function sendSMS( $phone, $message ){



    // $phone =substr($phone, 1);

    $data = [
        "Username"=> "0555096656",
        "Password"=> "Edah2020",
        "Tagname" => "Edahcompany",
        "RecepientNumber" =>  $phone,
        "ReplacementList"=> "",
        "Message"=>$message,
        "SendDateTime"=> 0,
        "EnableDR"=> false
    ];
    $data = json_encode($data);
    $url = "http://api.yamamah.com/SendSMS" ;
    $ch = curl_init( $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt($ch, CURLOPT_POST,           1 );
    curl_setopt($ch, CURLOPT_POSTFIELDS,     $data );
    curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: application/json'));




    $response = curl_exec($ch);
    $err = curl_error($ch);



    curl_close($ch);







}



function sendFCM($title, $body, $data, $tokens, $badge)
{


    $notif = new  \App\Notifications ;
    $notif->user_id =  $data['user_id'];
    $notif->action_type =$data['action_type']  ;
    $notif->action_id  = $data['action_id'] ;
    $notif-> title = $data['title'] ;
    $notif-> body = $data['body']  ;
    $notif-> is_read = 0 ;
    $notif-> action = json_encode($data['action'] )  ;
    $date = Carbon\Carbon::now()->toDateTimeString();
    if($date){
        $notif-> date =   $date;
        $notif->save();
    }
    $notif->save();

    if(isset($tokens) && $tokens != null){
        $tokens =  $tokens->device_token ;
    }else{
        return ;
    }



    $user = User::where('id' , $notif->user_id)->first() ;
    if($user){

        $count_unread=\App\Notifications::where('user_id' , $data['user_id'] )->where('is_read' , 0 )->count();


        $newData['action_type'] = $data['action_type'] ;
        $newData['action_id'] = $data['action_id'] ;
        $newData['date'] = $data['date'] ;
        $newData['action'] = $data['action'] ;

        $optionBuilder = new \LaravelFCM\Message\OptionsBuilder();
        $optionBuilder->setTimeToLive(60*20);


        $notificationBuilder = new \LaravelFCM\Message\PayloadNotificationBuilder($title);
        $notificationBuilder->setBody($body)
            ->setSound('default')
            ->setBadge($count_unread);

        $dataBuilder = new \LaravelFCM\Message\PayloadDataBuilder();
        $dataBuilder->addData(['data' => (object) $newData ]);

        $option = $optionBuilder->build();
        $notification = $notificationBuilder->build();
        $data = $dataBuilder->build();

        $downstreamResponse = \LaravelFCM\Facades\FCM::sendTo($tokens, $option, $notification, $data);

        // return Array (key:token, value:error) - in production you should remove from your database the tokens
        $object = [
            'numberSuccess' => $downstreamResponse->numberSuccess(),
            'numberFailure' => $downstreamResponse->numberFailure(),
            'numberModification' => $downstreamResponse->numberModification(),
        ];


        return $object;
    }

}


function removeFile($path)
{

    if(file_exists($path)){
        unlink($path);
    };

}




function uploadDocument($file)
{


    $dest = public_path('documentfiles/');


    $name = time() . Str::random(4). '.' . $file->getClientOriginalExtension();
    $destinationPath = $dest ;
    $file->move($destinationPath, $name);

    return $name;
}


function uploadFile($file, $width=500, $dest=null)
{


    $name = time() . Str::random(4). '.' . $file->getClientOriginalExtension();
    $name = $name ;
    if($dest == null) {
        $dest = 'images/upload';
    };
    $final = $dest.'/'.$name;
    $file->move( $dest, $name);


    /*
    $image_new = Image::make(public_path('images/upload/').'/'.$name) ;
    $image_new->resize($width, null, function ($constraint) {
        $constraint->aspectRatio();
    });
    $image_new ->save();
    */

    //dd($name2);



    return   $final;
}


function jsonResponse($status, $message, $data=null, $code=null, $page= null , $page_count=null ,$validator=null)
{

    try {
        $validator=null;

        $result['status'] = $status;
        $result['message'] = $message;


        if($data === []){
            $result['items'] = [];
        }elseif($data != null ){
            $result['items'] = $data ;
        }

        if($code){
            $result['code'] = $code;
        }
        if($page){
            $result['page'] = $page;
        }
        if($page_count){
            $result['page_count'] = $page_count;
        }



        if ($validator && $validator->fails()) {

            $messages = $validator->errors()->toArray();
            foreach ($messages as $key => $row) {
                $errors['field'] = $key;
                $errors['message'] = $row[0];
                $arr[] = $errors;
            }

            $result['items'] =$arr;

        }
        // dd('m');
        // return response()->json($result, 200, [], JSON_NUMERIC_CHECK);

        return response()->json($result);
    } catch (Exception $ex) {
        return response()->json([
            'line' => $ex->getLine(),
            'message' => $ex->getMessage(),
            'getFile' => $ex->getFile(),
            'getTrace' => $ex->getTrace(),
            'getTraceAsString' => $ex->getTraceAsString(),
        ], $code);
    }
}



function admin_assets($dir)
{
    return url('/admin_assets/assets/' . $dir);
}

function getLocal()
{
    return app()->getLocale();
}



function convertAr2En($string)
{
    $persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    $arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    $num = range(0, 9);
    $convertedPersianNums = str_replace($persian, $num, $string);
    $englishNumbersOnly = str_replace($arabic, $num, $convertedPersianNums);
    return $englishNumbersOnly;
}

function payment( $email, $amount, $order_id)
{
    $url = 'https://maktapp.credit/v3/AddTransaction';
    $data =  array('token'=> '5F127A9C-23A2-4787-90BA-427014D735A8',
        'amount'  => $amount ,
        'currencyCode' => 'QAR' ,
        'orderId' => $order_id,
        'note' => ' test payment' ,
        'lang' => 'ar' ,
        'customerEmail' => $email   ,
        'customerCountry' => 'qatar'
    );
    $options = array();
    $defaults = array(
        CURLOPT_POST => 1,
        CURLOPT_HEADER => 0,
        CURLOPT_URL => $url,
        CURLOPT_FRESH_CONNECT => 1,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_FORBID_REUSE => 1,
        CURLOPT_TIMEOUT => 4,
        CURLOPT_POSTFIELDS => http_build_query($data)
    );
    $ch = curl_init();
    curl_setopt_array($ch, ($options + $defaults));
    if( ! $result = curl_exec($ch))
    {
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return $result;
}

function validatePayment($order_id)
{
    $url = 'https://maktapp.credit/v3/ValidatePayment';
    $data =  array('token'=> '5F127A9C-23A2-4787-90BA-427014D735A8',
        'orderId' => $order_id
    );
    $options = array();
    $defaults = array(
        CURLOPT_POST => 1,
        CURLOPT_HEADER => 0,
        CURLOPT_URL => $url,
        CURLOPT_FRESH_CONNECT => 1,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_FORBID_REUSE => 1,
        CURLOPT_TIMEOUT => 4,
        CURLOPT_POSTFIELDS => http_build_query($data)
    );
    $ch = curl_init();
    curl_setopt_array($ch, ($options + $defaults));
    if( ! $result = curl_exec($ch))
    {
        trigger_error(curl_error($ch));
    }
    curl_close($ch);
    return $result;
}

function random_number($digits)
{
    return str_pad(rand(0, pow(10, $digits) - 1), $digits, '0', STR_PAD_LEFT);
}

function type()
{
    return [__('common.store'),__('common.product'),__('common.url')];
}

function position()
{
    return [__('common.site'),__('common.mobile')];
}

function typeArrive()
{


    return[
        '1'=>__('print.delivery'),
        '2'=>__('print.pickup'),
        '3'=>__('print.both')
    ];

}

function optionArrive()
{
    return[

        '1'=>__('print.have_delivery_team'),
        '2'=>__('print.link_delivery_company'),
        '3'=>__('print.both')
    ];

}

function sendNotificationToUsers( $tokens_android, $tokens_ios, $order_id, $message )
{
    try {
        $headers = [
            'Authorization: key=AAAAmx9XTuw:APA91bEhmJOmE4HRvBcuIDZNC40HYD4NNZL5oGM0KkwcLb_wGCPhyiIgZsTiaBPDQZtID2adZU29uy_vUMLXFW8wXBqDAHb1xvoGHuJ1_GbtdJSdaAdVLrslAYOFiYbhyVeJURZmBUrK',
            'Content-Type: application/json'
        ];

        if(!empty($tokens_ios)) {
            $dataForIOS = [
                "registration_ids" => $tokens_ios,
                "notification" => [
                    'body' => $message,
                    'type' => "notify",
                    'title' => 'Karm',
                    'order_id' => $order_id,
                    'badge' => 1,
                    'typeMsg' => 2,//order
                    'icon' => 'myicon',//Default Icon
                    'sound' => 'mySound'//Default sound
                ]
            ];
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataForIOS));
            $result = curl_exec($ch);
            curl_close($ch);
            // $resultOfPushToIOS = "Done";
            //   return $result; // to check does the notification sent or not
        }
        if(!empty($tokens_android)) {
            $dataForAndroid = [
                "registration_ids" => $tokens_android,
                "data" => [
                    'body' => $message,
                    'type' => "notify",
                    'title' => 'Karm',
                    'order_id' => $order_id,
                    'badge' => 1,
                    'typeMsg' => 2,//order
                    'icon' => 'myicon',//Default Icon
                    'sound' => 'mySound'//Default sound
                ]
            ];
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataForAndroid));
            $result = curl_exec($ch);
            curl_close($ch);
            //    $resultOfPushToAndroid = "Done";
        }
        //   return $resultOfPushToIOS." ".$resultOfPushToAndroid;
        //    return $result;
    } catch (\Exception $ex) {
        return $ex->getMessage();
    }





}

function sendNotificationToUsersChat( $tokens_android, $tokens_ios, $order_id, $message )
{
    try {
        $headers = [
            'Authorization: key=AAAAmx9XTuw:APA91bEhmJOmE4HRvBcuIDZNC40HYD4NNZL5oGM0KkwcLb_wGCPhyiIgZsTiaBPDQZtID2adZU29uy_vUMLXFW8wXBqDAHb1xvoGHuJ1_GbtdJSdaAdVLrslAYOFiYbhyVeJURZmBUrK',
            'Content-Type: application/json'
        ];

        if(!empty($tokens_ios)) {
            $dataForIOS = [
                "registration_ids" => $tokens_ios,
                "notification" => [
                    'body' => $message,
                    'type' => "notify",
                    'title' => 'Karm',
                    'order_id' => $order_id,
                    'badge' => 1,
                    'typeMsg' => 1,//chat
                    'icon' => 'myicon',//Default Icon
                    'sound' => 'mySound'//Default sound
                ]
            ];
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataForIOS));
            $result = curl_exec($ch);
            curl_close($ch);
            // $resultOfPushToIOS = "Done";
            //   return $result; // to check does the notification sent or not
        }
        if(!empty($tokens_android)) {
            $dataForAndroid = [
                "registration_ids" => $tokens_android,
                "data" => [
                    'body' => $message,
                    'type' => "notify",
                    'title' => 'Karm',
                    'order_id' => $order_id,
                    'badge' => 1,
                    'typeMsg' => 1,//chat
                    'icon' => 'myicon',//Default Icon
                    'sound' => 'mySound'//Default sound
                ]
            ];
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($dataForAndroid));
            $result = curl_exec($ch);
            curl_close($ch);
            //    $resultOfPushToAndroid = "Done";
        }
        //   return $resultOfPushToIOS." ".$resultOfPushToAndroid;
        //    return $result;
    } catch (\Exception $ex) {
        return $ex->getMessage();
    }





}

function slugURL($title){
    $WrongChar = array('@', '؟', '.', '!','?','&','%','$','#','{','}','(',')','"',':','>','<','/','|','{','^');

    $titleNoChr = str_replace($WrongChar, '', $title);
    $titleSEO = str_replace(' ', '-', $titleNoChr);
    return $titleSEO;
}


function print_number_count($number) {
    $units = array( '', 'K', 'M', 'B');
    $power = $number > 0 ? floor(log($number, 1000)) : 0;
    if($power > 0)
        return @number_format($number / pow(1000, $power), 2, ',', ' ').' '.$units[$power];
    else
        return @number_format($number / pow(1000, $power), 0, '', '');
}


