<?php

namespace App\Repositories\Api;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Hash;
use Prettus\Repository\Eloquent\BaseRepository;

class AccountRepository extends BaseRepository
{
    protected $store;

    protected $fields = [
        'name',
        'email',
        'phone',
        'country_code',
        'profile_image_id',
        'profile_image'
    ];

    function model()
    {
        return User::class;
    }

    public function self()
    {
        try {

            $user_id = getCurrentUserId();
            $user = $this->model->findOrFail($user_id);
            return $user->setAppends([
                'role', 'permission'
            ]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateProfile($request)
    {
        DB::beginTransaction();

        try {

            $user = $this->model->findOrFail(getCurrentUserId());
            $user->update($request->only($this->fields));

            if (isset($request['profile_image_id'])) {
                $user->profile_image()->associate($request['profile_image_id']);
            }

            if ($request->hasFile('profile_image')) {
                $attachments = createAttachment();
                $media = storeImage([$request->profile_image], $attachments, 'attachment');
                $user->profile_image_id = head($media)?->id;
                $user->profile_image()->associate(head($media)?->id);
            }

            $user->save();
            $user->profile_image;
            if (!empty($request['address'])) {
                foreach ($request['address'] as $addressData) {
                    if (empty($addressData['id'])) {
                        $user->address()->create($addressData);
                    } else {
                        $address = $user->address()->findOrFail($addressData['id']);
                        $address->update($addressData);
                    }
                }
            }

            $user->address;
            DB::commit();

            return $user;
            
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
            DB::commit();

            return $user->update(['password' => Hash::make($request->password)]);
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteAccount()
    {
        DB::beginTransaction();
        try{

            $user = DB::table('users')->whereNull('deleted_at')->where('id',auth('sanctum')?->user()?->id);
            $user->forceDelete(auth('sanctum')?->user()?->id);
            DB::commit();
            return [
                'message' => __('static.users.user_delete'),
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(),$e->getCode());
        }
    }
}
