<?php

namespace Modules\Ticket\Models;

use App\Models\User;
use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Modules\Ticket\Models\Message;
use Modules\Ticket\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ticket extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia, sluggable;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'ticket_number',
        'subject',
        'email',
        'department_id',
        'priority_id',
        'other_input_field',
        'created_by_id',
        'ticket_status_id',
        'status',
        'note',
        'assign_to',
    ];

    protected $casts = [
        'other_input_field' => 'json',
        'priority_id' => 'integer',
        'department_id' => 'integer',
        'profile_image_id' => 'integer'
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at'
    ];

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'ticket_number',
                'onUpdate' => true,
            ],
        ];
    }

    public function getTicketsForCurrentUser()
    {
        $userId = getCurrentUserId();
        return self::whereHas('assigned_tickets', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        });
    }

    public static function booted()
    {
        parent::boot();
        static::deleted(function ($ticket) {
            $ticket->messages()->forceDelete();
            $ticket->rating()->forceDelete();
        });

        static::saving(function ($model) {
            $model->created_by_id = isUserLogin() ? getCurrentUserId() : $model?->id;
        });
    }

    public function getAverageRatingAttribute()
    {
        return $this->rating ? $this->rating->avg('rating') : 0;
    }

    /**
     * @return HasOne
     */
    public function rating(): HasOne
    {
        return $this->hasOne(Rating::class, 'ticket_id');
    }

    /**
     * @return HasMany
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'ticket_id');
    }

    /**
     * @return HasMany
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
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
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    /**
     * @return BelongsTo
     */
    public function priority(): BelongsTo
    {
        return $this->belongsTo(Priority::class, 'priority_id');
    }

    /**
     * @return BelongsTo
     */
    public function ticketStatus(): BelongsTo
    {
        return $this->belongsTo(Status::class, 'ticket_status_id');
    }

    /**
     * @return BelongsToMany
     */
    public function assigned_tickets(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'assigned_tickets');
    }
}
