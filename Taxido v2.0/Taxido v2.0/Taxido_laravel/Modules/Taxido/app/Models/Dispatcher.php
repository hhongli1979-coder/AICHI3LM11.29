<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Modules\Taxido\Enums\RoleEnum;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Dispatcher extends User implements HasMedia
{
    use SoftDeletes, HasFactory,InteractsWithMedia;

    protected $table = 'users';

    protected $guard_name = 'web';

    /**
     * The attributes that should be hidden for serialization.
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
        'fcm_token',
        'password',
        'status',
        'created_by_id'
    ];

    protected $hidden = [
        'roles',
        'password',
        'permissions',
        'remember_token',
        'deleted_at',
        'updated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_verified' => 'integer',
            'password' => 'hashed',
            'phone' => 'integer',
            'status' => 'integer',
            'created_by_id' => 'integer',
        ];
    }
    
    protected $appends = [
        'role',
    ];

    public static function booted()
    {
        parent::boot();
        static::addGlobalScope('roles', function (Builder $builder) {
            $builder->role(RoleEnum::DISPATCHER);
        });

        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });
    }
    

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Dispatcher')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Dispatcher has been {$eventName}");
    }

    public function getMorphClass()
    {
        return 'App\Models\User';
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
    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class, 'dispatcher_zones');
    }
}
