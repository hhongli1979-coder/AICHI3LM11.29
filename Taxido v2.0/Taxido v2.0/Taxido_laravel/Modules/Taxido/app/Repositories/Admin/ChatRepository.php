<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Models\User;
use Modules\Taxido\Models\Rider;
use Modules\Taxido\Models\Driver;
use App\Http\Traits\FireStoreTrait;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class ChatRepository extends BaseRepository
{
    use FireStoreTrait;

    private $database;

    public function model()
    {
        return Rider::class;
    }

    public function index()
    {
        try {
            $currentUserId = getAdminId();

            $riders      = Rider::whereNull('deleted_at')?->where('id', '!=', $currentUserId)->get();
            $drivers     = Driver::whereNull('deleted_at')?->where('id', '!=', $currentUserId)->get();
            $recentChats = [];

            $chatDocs = $this->fireStoreQueryCollection('chats', [
                ['participants', 'array-contains', (string) $currentUserId],
            ], [
                'orderBy' => ['created_at', 'desc'],
                'limit'   => 50,
            ]);

            foreach ($chatDocs as $doc) {
                $chatId   = $doc['id'];
                $chatData = $doc;
                if (! isset($chatData['participants']) || ! is_array($chatData['participants'])) {
                    throw new Exception('Invalid participants field in document ' . $chatId, 500);
                }

                $otherUserIds = array_diff($chatData['participants'], [$currentUserId]);
                $otherUserId  = reset($otherUserIds);
                if (! $otherUserId) {
                    throw new Exception('No other user found in participants for document ' . $chatId, 500);
                }

                $user = User::find($otherUserId);
                if ($user) {
                    $recentChats[$otherUserId] = [
                        'user_id' => $otherUserId,
                        'name'    => $user->name,
                        'image'   => $user->profile_image?->original_url ?? null,
                        'role'    => $user->role?->name ?? 'Rider',
                        'chat_id' => $chatId,
                    ];
                }
            }

            return view('taxido::admin.chat.index', ['riders' => $riders, 'drivers' => $drivers, 'recentChats' => $recentChats]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
