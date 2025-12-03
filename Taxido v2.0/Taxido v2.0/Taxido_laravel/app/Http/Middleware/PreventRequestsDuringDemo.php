<?php

namespace App\Http\Middleware;

use App\Exceptions\ExceptionHandler;
use Closure;
use Illuminate\Http\Request;

class PreventRequestsDuringDemo
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if(env('APP_DEMO')) {
            $message = 'Oops! This action disabled in demo mode.';
            if(shouldRegisterAdminUi()) {

                return back()->with('error', $message);

            } else {

                throw new ExceptionHandler($message, 403);
            }
        }

        return $next($request);
    }
}
