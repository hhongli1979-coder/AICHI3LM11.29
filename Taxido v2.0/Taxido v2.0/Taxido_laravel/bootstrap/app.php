<?php

use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use Illuminate\Foundation\Application;
use Illuminate\Database\QueryException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Modules\CabBooking\Models\PushNotification;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

return Application::configure(basePath: dirname(__DIR__))

    ->withRouting(
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'Menu' => App\Facades\WMenu::class,
            'localization' => App\Http\Middleware\Localization::class,
            'demo' => App\Http\Middleware\PreventRequestsDuringDemo::class,
            'maintenance' => App\Http\Middleware\CheckMaintenanceMode::class
        ]);
    })?->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (AuthorizationException $exception, Request $request) {
            throw new ExceptionHandler($exception->getMessage(), 403);
        });

        $exceptions->render(function (AccessDeniedHttpException $exception, Request $request) {
            if ($request->expectsJson()) {
                throw new ExceptionHandler($exception->getMessage(), 403);
            }

            abort(403);
        });

        $exceptions->render(function (NotFoundHttpException $exception, Request $request) {
            if ($request->expectsJson()) {
                throw new ExceptionHandler($exception->getMessage(), 404);
            }

            return response()->view('errors.404', [], 404);
        });

        $exceptions->render(function (QueryException $exception, Request $request) {
            throw new ExceptionHandler($exception->getMessage(), 500);
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            if ($request->expectsJson()) {
                throw new ExceptionHandler($exception->getMessage(), 401);
            }
        });
    })->create();
