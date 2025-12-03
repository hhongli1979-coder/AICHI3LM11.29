<?php
namespace Modules\Taxido\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Modules\Taxido\Enums\RoleEnum;

class TaxidoAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::check()) {
            return redirect()->route('front.cab.login.index')->with('error', 'Please log in to access this page.');
        }

        $user = Auth::user();
        if ($user?->role?->name !== RoleEnum::RIDER) {
            return redirect()->route('admin.dashboard.index');
        }

        return $next($request);
    }
}
