<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Session::has('locale')) {
            app()->setLocale(Session::get('locale'));
        } elseif ($request->hasHeader("Accept-Lang")) {
            app()->setLocale($request->header("Accept-Lang"));
        } else {
            app()->setLocale(getDefaultLangLocale());
        }
        return $next($request);
    }
}
