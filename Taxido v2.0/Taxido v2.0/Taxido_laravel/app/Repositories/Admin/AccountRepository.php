<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Hash;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class AccountRepository extends BaseRepository
{
    protected $fields = [
        'name',
        'email',
        'country_code',
        'phone',
        'status',
        'profile_image_id',
    ];

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));
        } catch (Exception $e) {

            throw new $e;
        }
    }

    public function model()
    {
        return User::class;
    }

    public function updateProfile($request)
    {
        DB::beginTransaction();

        try {

            $request->phone = (string) $request->phone;
            $request->profile_image_id = $request->profile_image_id ?? null;
            $user = $this->model->findOrFail(getCurrentUserId());
            $user->update($request->only($this->fields));

            DB::commit();
            return back()->with('success', __('static.accounts.update_successfully'));

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updatePassword($request)
    {
        DB::beginTransaction();

        try {

            $user_id = getCurrentUserId();
            $user = $this->model->findOrFail($user_id);
            $user->update(['password' => Hash::make($request->new_password)]);
            DB::commit();

            return back()->with('success', __('static.accounts.password_update_successfully'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
