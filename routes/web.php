<?php

Route::get('/migrate', function () {
    ini_set('max_execution_time', 300);
    Artisan::call('migrate:fresh --seed');
    /*
        Artisan::call('krlove:generate:model CaptinQuotes --table-name=captin_quotes');
        Artisan::call('krlove:generate:model CaptinPlan --table-name=captin_plans');
        Artisan::call('krlove:generate:model LanguageTables --table-name=table_languages');
        Artisan::call('krlove:generate:model captinCategorie --table-name=captin_categories');
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

Route::get('setLang/{lang}', function($lang){

    session(['language' => $lang]);
    App::setLocale($lang);
    return Redirect::back();
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

    // Advertices
    Route::delete('advertices/destroy', 'AdverticeController@massDestroy')->name('advertices.massDestroy');
    Route::resource('advertices', 'AdverticeController');

    // Translations
    Route::delete('translations/destroy', 'TranslationsController@massDestroy')->name('translations.massDestroy');
    Route::resource('translations', 'TranslationsController');

    // Plans
    Route::delete('plans/destroy', 'PlansController@massDestroy')->name('plans.massDestroy');
    Route::resource('plans', 'PlansController');

    // Captins
    Route::delete('captins/destroy', 'CaptinsController@massDestroy')->name('captins.massDestroy');
    Route::resource('captins', 'CaptinsController');

    // Images
    Route::delete('images/destroy', 'ImagesController@massDestroy')->name('images.massDestroy');
    Route::resource('images', 'ImagesController');

    // Reviews Clinets
    Route::delete('reviews-clinets/destroy', 'ReviewsClinetsController@massDestroy')->name('reviews-clinets.massDestroy');
    Route::resource('reviews-clinets', 'ReviewsClinetsController');

    // Reviews Captins
    Route::delete('reviews-captins/destroy', 'ReviewsCaptinController@massDestroy')->name('reviews-captins.massDestroy');
    Route::resource('reviews-captins', 'ReviewsCaptinController');

    // Captin Certificates
    Route::delete('captin-certificates/destroy', 'CaptinCertificateController@massDestroy')->name('captin-certificates.massDestroy');
    Route::resource('captin-certificates', 'CaptinCertificateController');

    // Courses
    Route::delete('courses/destroy', 'CoursesController@massDestroy')->name('courses.massDestroy');
    Route::resource('courses', 'CoursesController');

    // Trainee Courses
    Route::delete('trainee-courses/destroy', 'TraineeCourseController@massDestroy')->name('trainee-courses.massDestroy');
    Route::resource('trainee-courses', 'TraineeCourseController');

    // Trainee Inforamations
    Route::delete('trainee-inforamations/destroy', 'TraineeInforamationController@massDestroy')->name('trainee-inforamations.massDestroy');
    Route::resource('trainee-inforamations', 'TraineeInforamationController');

    // Settings
    Route::delete('settings/destroy', 'SettingsController@massDestroy')->name('settings.massDestroy');
    Route::resource('settings', 'SettingsController');

    // Reportoncaptins
    Route::delete('reportoncaptins/destroy', 'ReportoncaptinsController@massDestroy')->name('reportoncaptins.massDestroy');
    Route::resource('reportoncaptins', 'ReportoncaptinsController');

    // Report Ontrainees
    Route::delete('report-ontrainees/destroy', 'ReportOntraineeController@massDestroy')->name('report-ontrainees.massDestroy');
    Route::resource('report-ontrainees', 'ReportOntraineeController');
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
