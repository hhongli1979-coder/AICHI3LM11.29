<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class NotificationRepository extends BaseRepository
{
    public function model()
    {
        return User::class;
    }

    public function markAsRead($request)
    {
        DB::beginTransaction();

        try {

            $userId = $request->user()->id;
            $user = $this->find($userId);
            $user->unreadNotifications->markAsRead();
            DB::commit();

            return $user->notifications()->paginate($request->paginate);

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy()
    {
        try{

            $user_id = getCurrentUserId();
            $user = $this->model->findOrFail($user_id)->first();
            return $user->notifications()->where('id',$user_id)->first()->destroy($user_id);

        }catch(Exception $e)
        {
            throw new ExceptionHandler($e->getMessage(),$e->getCode());
        }
    }

    public function clearAll()
    {
        try {
            
            $userId = getCurrentUserId();
            $user = $this->model->findOrFail($userId)->first();
            $user->notifications()->delete();
            
            return response()->json(['status' => 'success']);
            
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
