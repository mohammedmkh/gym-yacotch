<?php


namespace App\Http\Middleware;
use Closure;
use App;
use Illuminate\Support\Facades\Auth;

class LanguageapiCheck
{



    public function handle($request, Closure $next)
    {
        $header = $request->header('Accept-Language');
        if( $header) {
            app()->setLocale($header);


        }
        return $next($request);

    }
}


