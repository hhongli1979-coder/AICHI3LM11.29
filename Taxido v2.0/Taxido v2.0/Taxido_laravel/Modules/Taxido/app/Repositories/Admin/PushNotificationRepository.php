<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Models\User;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\Driver;
use Modules\Taxido\Models\PushNotification;
use Modules\Taxido\Models\Rider;
use Prettus\Repository\Eloquent\BaseRepository;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
class PushNotificationRepository extends BaseRepository
{
    protected $ride;

    protected $user;

    public function model()
    {
        $this->user = new User();
        return PushNotification::class;
    }

    public function index($pushNotificationTable)
    {
        return view('taxido::admin.push-notification.index', ['tableConfig' => $pushNotificationTable]);
    }

    public function create($request)
    {
        return view('taxido::admin.push-notification.create');
    }

    public function sendNotification($request)
    {
        DB::beginTransaction();
        try {
            $pushNotification = $this->model->create([
                'send_to' => $request->send_to,
                'ride_id' => $request->ride_id ?? null,
                'title' => $request->title,
                'message' => $request->message,
                // 'url' => $request->url,
                'notification_type' => $request->send_to,
                'user_id' => getCurrentUserId(),
                'image_id' => $request->image_id,
                'is_scheduled' => $request->schedule,
                'scheduled_at' => $request->scheduleat,
            ]);

            if ($request->hasFile('image')) {
                $pushNotification->addMedia($request->file('image'))?->toMediaCollection('notification_image');
                $pushNotification->image_url = $pushNotification->getFirstMediaUrl('notification_image');
                $pushNotification->save();
            }
            $userIds = [];
            if ($request->send_to === 'all_riders') {
                $userIds = Rider::whereNull('deleted_at')->pluck('id')?->toArray();

            } elseif ($request->send_to === 'all_drivers') {
                $userIds = Driver::whereNull('deleted_at')->pluck('id')?->toArray();
            }

            if (empty($userIds)) {
                throw new Exception('No users found for the selected group.');
            }
            $topics = array_map(fn($userId) => "user_{$userId}", $userIds);
            $topicBatches = array_chunk($topics, 5);
            foreach ($topicBatches as $batch) {
                if (empty($batch))
                    continue;
                foreach ($batch as $topic) {
                    $notificationData = [];
                    if ($request->url) {
                        $notificationData['url'] = $request->url;
                    }

                    $notification = [
                        'message' => [
                            'topic' => $topic,
                            'data' => $notificationData,
                            'notification' => [
                                'title' => $request->title,
                                'body' => $request->message,
                                'image' => $pushNotification?->image_notify?->original_url ?? null,
                            ],
                        ],
                    ];

                    if (empty($notificationData)) {
                        unset($notification['message']['data']);
                    }

                    pushNotification($notification);
                }
            }

            DB::commit();
            return redirect()->route('admin.push-notification.index')->with('success', __('taxido::static.push_notification.sent_notification'));

        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $pushNotification = $this->model->findOrFail($id);
            $pushNotification->destroy($id);

            DB::commit();
            return to_route('admin.push-notification.index')->with('success', __('taxido::static.push_notification.delete_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $pushNotification = $this->model->onlyTrashed()->findOrFail($id);
            $pushNotification->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.push_notification.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function scheduleStatus()
    {
        try {

            $now = Carbon::now();
            $pushNotifications = PushNotification::where('is_scheduled', '!=', 0)->where('scheduled_at', '<', $now)?->get();
            foreach($pushNotifications as $pushNotification) {

                if ($pushNotification->send_to === 'all_riders') {
                    $userIds = Rider::whereNull('deleted_at')->pluck('id')?->toArray();

                } elseif ($pushNotification->send_to === 'all_drivers') {
                    $userIds = Driver::whereNull('deleted_at')->pluck('id')?->toArray();
                }



                $topics = array_map(fn($userId) => "user_{$userId}", $userIds);
                $topicBatches = array_chunk($topics, 5);
                foreach ($topicBatches as $batch) {
                    if (empty($batch))
                        continue;
                    foreach ($batch as $topic) {
                        $notificationData = [];
                        if ($pushNotification->url) {
                            $notificationData['url'] = $pushNotification->url;
                        }

                        $notification = [
                            'message' => [
                                'topic' => $topic,
                                'data' => $notificationData,
                                'notification' => [
                                    'title' => $pushNotification->title,
                                    'body' => $pushNotification->message,
                                    'image' => $pushNotification?->image_notify?->original_url ?? null,
                                ],
                            ],
                        ];

                        if (empty($notificationData)) {
                            unset($notification['message']['data']);
                        }

                        pushNotification($notification);
                    }
                }

                DB::table('push_notifications')->update(['is_scheduled' => 0]);
            }

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
