<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;
use App\Repositories\Admin\AccountRepository;
use App\Http\Requests\Admin\UpdateProfileRequest;
use App\Http\Requests\Admin\UpdatePasswordRequest;

class AccountController extends Controller
{
    protected $repository;

    public function __construct(AccountRepository $repository)
    {
        $this->repository = $repository;
    }

    public function profile()
    {
        return view('admin.account.index');
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        return $this->repository->updatePassword($request);
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        return $this->repository->updateProfile($request);
    }
    
    public function logout()
    {
        $keysToKeep = ['locale', 'front-locale', 'theme', 'dir', 'front_theme','currency'];

        foreach (Session::all() as $key => $value) {
            if (! in_array($key, $keysToKeep)) {
                Session::forget($key);
            }
        }
        return redirect()?->back();
    }
}
