<?php

namespace Modules\Taxido\Repositories\Front;

use App\Exceptions\ExceptionHandler;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Prettus\Repository\Eloquent\BaseRepository;

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

    public function model()
    {
        return User::class;
    }

    public function updateProfile($request)
    {
        DB::beginTransaction();

        try {
            $user = $this->model->findOrFail(getCurrentUserId());

            $data = $request->only($this->fields);
            $data['phone'] = (string) $request->phone;
            if ($request->hasFile('image')) {
                $attachments = createAttachment();
                $media = storeImage([$request->image], $attachments, 'attachment');
                $user->profile_image_id = head($media)?->id;
                $user->profile_image()->associate(head($media)?->id ?? []);
            }

            $user->update($data);

            DB::commit();
            return back()->with('success', __('taxido::front.update_successfully'));

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updatePassword($request)
    {
        DB::beginTransaction();
        try {
            $user = $this->model->findOrFail(getCurrentUserId());
            $user->update(['password' => Hash::make($request->new_password)]);

            DB::commit();
            return back()->with('success', __('taxido::front.password_update_successfully'));
        } catch (Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function markAsRead($request)
    {
        $user = Auth::user();
        foreach ($user->unreadNotifications as $notification) {
            $notification->markAsRead();
        }

        return response()->json(['status' => 'success']);
    }

    public function updateProfileImage($request)
    {
        $user = $this->model->findOrFail(getCurrentUserId());

        if (isset($request['profile_image_id'])) {
            $user->profile_image()->associate($request['profile_image_id']);
        }

        if ($request->hasFile('profile_image')) {
            $attachments = createAttachment();
            $media = storeImage([$request->file('profile_image')], $attachments, 'attachment');
            
            if (! empty($media)) {
                $image = head($media);
                $user->profile_image_id = $image->id;
                $user->profile_image()->associate($image->id);
            }
        }

        $user->save();

        return back()->with('success', __('taxido::front.image_update_successfully'));
    }

}
