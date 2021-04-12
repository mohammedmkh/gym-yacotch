<?php


Route::group(['prefix' => 'v1', 'as' => 'api.', 'namespace' => 'Api\V1'], function () {
    // Permissions
    Route::post('loginTranee', 'UsersApiController@loginTranee');
    Route::post('signPhoneTranee', 'UsersApiController@signPhoneTranee');
    Route::post('registerTranee', 'UsersApiController@registerTranee');
    Route::post('validationCode', 'UsersApiController@validationCode');

});

Route::group(['prefix' => 'v1', 'as' => 'api.', 'namespace' => 'Api\V1', 'middleware' => ['auth:api']], function () {

    Route::get('myInfo', 'UsersApiController@myInfo');
    Route::post('updateProfile', 'UsersApiController@updateProfile');
    Route::post('updatePassword', 'UsersApiController@updatePassword');


});
