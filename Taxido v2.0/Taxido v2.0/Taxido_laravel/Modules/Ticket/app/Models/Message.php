<?php

namespace Modules\Ticket\Models;

use App\Models\User;
use Modules\Ticket\Models\Ticket;
use Spatie\MediaLibrary\HasMedia;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'ticket_id',
        'message',
        'reply_id',
        'message_id',
        'created_by_id',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at'
    ];

    public function scopeGetRepliedTickets($query)
    {

        return $query->whereNotNull('ticket_id')
            ->groupBy('ticket_id')
            ->select(
                'ticket_id',
                DB::raw('count(*) as total_replies'),
                DB::raw('GROUP_CONCAT(DISTINCT reply_id) as reply_id')
            );
    }

    public function replies()
    {
        return $this->hasMany(Message::class, 'message_id');
    }
    /**
     * @return BelongsTo
     */
    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    /**
     * @return BelongsTo
     */
    public function replied_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reply_id');
    }

    /**
     * @return BelongsTo
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function getRating()
    {
        return Rating::where('ticket_id', $this->ticket_id)
            ->where('user_id', $this->reply_id)
            ->pluck('rating')
            ->first();
    }
}
