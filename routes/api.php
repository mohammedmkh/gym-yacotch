<?php


Route::group(['prefix' => 'v1', 'as' => 'api.', 'namespace' => 'Api\V1'], function () {
    // Permissions
    Route::post('login', 'UsersApiController@login');
    Route::post('signPhoneTranee', 'UsersApiController@signPhoneTranee');
    Route::post('registerTranee', 'UsersApiController@registerTranee');
    Route::post('validationCode', 'UsersApiController@validationCode');
    Route::post('validationCodeResetPasswordTranee', 'UsersApiController@validationCodeResetPasswordTranee');
    Route::post('checkPhoneResetPasswordTranee', 'UsersApiController@checkPhoneResetPasswordTranee');
    Route::post('resetPasswordTranee', 'UsersApiController@resetPasswordTranee');

    /**************************************************************************** CAPTIN APP*/

    Route::post('registerCaptin', 'UsersApiController@registerCaptin');


});

Route::group(['prefix' => 'v1', 'as' => 'api.', 'namespace' => 'Api\V1', 'middleware' => ['auth:api']], function () {

    Route::get('myInfo', 'UsersApiController@myInfo');
    Route::post('updateProfile', 'UsersApiController@updateProfile');
    Route::post('updatePassword', 'UsersApiController@updatePassword');
    Route::get('logout', 'UsersApiController@logout');
    Route::get('getCategories', 'UsersApiController@getCategories');
    Route::get('getPlans', 'UsersApiController@getPlans');
    Route::get('getCaptin', 'UsersApiController@getCaptin');
    Route::post('getCaptinByMap', 'UsersApiController@getCaptinByMap');
    Route::post('setCaptinEvaluation', 'UsersApiController@setCaptinEvaluation');
    Route::get('getCaptinEvaluation', 'UsersApiController@getCaptinEvaluation');
    Route::get('getLastCaptin', 'UsersApiController@getLastCaptin');
    Route::get('getCaptinDetails', 'UsersApiController@getCaptinDetails');
    Route::post('uploadImage', 'UsersApiController@uploadImage');
    Route::get('getCaptinEvaluation/{id}', 'UsersApiController@getCaptinEvaluation');
    Route::get('getCaptinvideos/{id}', 'UsersApiController@getCaptinvideos');
    Route::get('getCaptinCource/{id}', 'UsersApiController@getCaptinCource');

    /**************************************************************************** CAPTIN APP*/

    Route::post('updateCaptinProfile', 'UsersApiController@updateCaptinProfile');

});
