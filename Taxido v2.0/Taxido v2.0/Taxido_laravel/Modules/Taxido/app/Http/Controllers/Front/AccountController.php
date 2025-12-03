<?php

namespace Modules\Taxido\Http\Controllers\Front;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Rider;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Http\Requests\Admin\UpdatePasswordRequest;
use Modules\Taxido\Repositories\Front\AccountRepository;

class AccountController extends Controller
{
    public $repository;

    public function __construct(AccountRepository $repository)
    {
        $this->repository = $repository;
    }

    public function dashboard()
    {
        $userId = Auth::id();

        if (!$userId) {
            return redirect()->route('front.cab.login.index');
        }

        $rider = Rider::where('id', $userId)->first();

        return view('taxido::front.account.dashboard', ['rider' => $rider]);
    }

    public function notifications()
    {
        return view('taxido::front.account.notification');
    }

    public function markAsRead(Request $request)
    {
        return $this->repository->markAsRead($request);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        return $this->repository->updateProfile($request);
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        return $this->repository->updatePassword($request);
    }

    public function updateProfileImage(Request $request)
    {
        return $this->repository->updateProfileImage($request);
    }

    public function logout()
    {
        $keysToKeep = ['locale', 'front-locale', 'theme', 'dir', 'front_theme', 'currency'];

        foreach (Session::all() as $key => $value) {
            if (!in_array($key, $keysToKeep)) {
                Session::forget($key);
            }
        }
        
        Auth::logout();
        return redirect()->route('home');
    }
}