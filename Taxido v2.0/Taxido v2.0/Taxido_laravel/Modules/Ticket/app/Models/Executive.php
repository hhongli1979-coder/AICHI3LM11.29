<?php

namespace Modules\Ticket\Models;

use App\Models\User;
use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Modules\Ticket\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Executive extends User implements HasMedia
{
    use HasFactory,SoftDeletes;

    protected $table = 'users';

    protected $guard_name = 'web';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'country_code',
        'phone',
        'system_reserve',
        'profile_image_id',
        'password',
        'status',
        'created_by_id'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function getMorphClass()
    {
        return 'App\Models\User';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'phone' => 'integer',
            'status' => 'integer',
            'rating_count' => 'float',
        ];
    }

    protected $appends = [
        'role',
        'email',
        'rating_count'
    ];

    protected $withCount = [
        'ratings',
    ];

    protected $with = [
        'profile_image'
    ];

    public static function booted()
    {
        parent::boot();
        static::addGlobalScope('roles', function (Builder $builder) {
            $builder->role(RoleEnum::Executive);
        });

        static::saving(function ($model) {
            $model->created_by_id = isUserLogin() ? getCurrentUserId() : $model?->id;
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Executive')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Executive has been {$eventName}");
    }

    
    /**
     * Get the user's role.
     */
    public function getRoleAttribute()
    {
        return $this->roles->first()?->makeHidden(['created_at', 'updated_at', 'pivot']);
    }

    /**
     * Get the user's all permissions.
     */
    public function getPermissionAttribute()
    {
        return $this->getAllPermissions();
    }

    public function getRatingCountAttribute()
    {
        return (float) $this->ratings?->avg('rating');
    }


    /**
     * @return HasMany
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class, 'user_id');
    }

    /**
     * @return BelongsTo
     */
    public function profile_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'profile_image_id');
    }

    /**
     * @return BelongsToMany
     */
    public function tickets(): BelongsToMany
    {
        return $this->belongsToMany(Ticket::class, 'assigned_tickets', 'user_id');
    }
}
