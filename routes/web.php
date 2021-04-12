<?php

Route::get('/migrate', function () {
    ini_set('max_execution_time', 300);
    Artisan::call('migrate:fresh --seed');
    /*
        Artisan::call('krlove:generate:model Language --table-name=languages');
        Artisan::call('krlove:generate:model LanguageDescription --table-name=language_description');
        Artisan::call('krlove:generate:model LanguageTables --table-name=table_languages');
       Artisan::call('krlove:generate:model Supplier --table-name=suppliers');
        Artisan::call('krlove:generate:model Service --table-name=services');
        Artisan::call('krlove:generate:model Service --table-name=services');
        Artisan::call('krlove:generate:model Country --table-name=countries');
        Artisan::call('krlove:generate:model City --table-name=cities');
        Artisan::call('krlove:generate:model Language --table-name=languages');
        Artisan::call('krlove:generate:model EventType --table-name=event_types');
        Artisan::call('krlove:generate:model UserAddress --table-name=user_address');
        Artisan::call('krlove:generate:model Coupon --table-name=coupons');*/

    return redirect('/');
});

Route::get('/clear-cache', function() {
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('config:clear');
    Artisan::call('view:clear');
});


Route::redirect('/', '/login');
Route::get('/home', function () {
    if (session('status')) {
        return redirect()->route('admin.home')->with('status', session('status'));
    }

    return redirect()->route('admin.home');
});

Auth::routes(['register' => false]);

Route::group(['prefix' => 'admin', 'as' => 'admin.', 'namespace' => 'Admin', 'middleware' => ['auth']], function () {
    Route::get('/', 'HomeController@index')->name('home');
    // Permissions
    Route::delete('permissions/destroy', 'PermissionsController@massDestroy')->name('permissions.massDestroy');
    Route::resource('permissions', 'PermissionsController');

    // Roles
    Route::delete('roles/destroy', 'RolesController@massDestroy')->name('roles.massDestroy');
    Route::resource('roles', 'RolesController');

    // Users
    Route::delete('users/destroy', 'UsersController@massDestroy')->name('users.massDestroy');
    Route::resource('users', 'UsersController');

    // Languages
    Route::delete('languages/destroy', 'LanguagesController@massDestroy')->name('languages.massDestroy');
    Route::resource('languages', 'LanguagesController');

    // Categories
    Route::delete('categories/destroy', 'CategoriesController@massDestroy')->name('categories.massDestroy');
    Route::resource('categories', 'CategoriesController');

    // Categories Trans
    Route::delete('categories-trans/destroy', 'CategoriesTransController@massDestroy')->name('categories-trans.massDestroy');
    Route::resource('categories-trans', 'CategoriesTransController');
});
Route::group(['prefix' => 'profile', 'as' => 'profile.', 'namespace' => 'Auth', 'middleware' => ['auth']], function () {
// Change password
    if (file_exists(app_path('Http/Controllers/Auth/ChangePasswordController.php'))) {
        Route::get('password', 'ChangePasswordController@edit')->name('password.edit');
        Route::post('password', 'ChangePasswordController@update')->name('password.update');
        Route::post('profile', 'ChangePasswordController@updateProfile')->name('password.updateProfile');
        Route::post('profile/destroy', 'ChangePasswordController@destroy')->name('password.destroyProfile');
    }
});
