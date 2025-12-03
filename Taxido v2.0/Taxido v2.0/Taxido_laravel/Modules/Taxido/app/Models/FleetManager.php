<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FleetManager extends User implements HasMedia
{
    use SoftDeletes, HasFactory;

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
        'profile_image_id',
        'is_verified',
        'fcm_token',
        'password',
        'status',
        'created_by_id'
    ];

    protected $with = [
        'profile_image',
        'address',
        'payment_account'
    ];

    protected $appends = [
        'role',
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
            'password' => 'hashed',
            'phone' => 'integer',
            'status' => 'integer',
            'created_by_id' => 'integer',
        ];
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'roles',
        'password',
        'permissions',
        'remember_token',
        'deleted_at',
        'updated_at',
    ];

    public static function booted()
    {
        parent::boot();
        static::addGlobalScope('roles', function (Builder $builder) {
            $builder->role(RoleEnum::FLEET_MANAGER);
        });

        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });

        static::deleted(function ($fleetManager) {
            $fleetManager->payment_account()->delete();
            $fleetManager->fleet_drivers()->delete();
            $fleetManager->vehicles()->delete();
            $fleetManager->withdrawRequests()->delete();
        });

        static::restored(function ($fleetManager) {
            $fleetManager->payment_account()->restore();
            $fleetManager->fleet_drivers()->restore();
            $fleetManager->vehicles()->restore();
            $fleetManager->withdrawRequests()->restore();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('FleetManager')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Fleet Manager has been {$eventName}");
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
     * @return HasOne
     */
    public function payment_account(): HasOne
    {
        return $this->hasOne(PaymentAccount::class, 'user_id');
    }

    /**
     * @return HasOne
     */
    public function wallet(): HasOne
    {
        return $this->hasOne(FleetManagerWallet::class, 'fleet_manager_id');
    }

    /**
     * @return HasOne
     */
    public function address(): HasOne
    {
        return $this->hasOne(CompanyAddress::class, 'fleet_manager_id');
    }

    /**
     * @return HasMany
     */
    public function documents(): HasMany
    {
        return $this->hasMany(FleetDocument::class, 'fleet_manager_id');
    }

    /**
     * @return HasMany
     */
    public function withdrawRequests(): HasMany
    {
        return $this->hasMany(WithdrawRequest::class, 'fleet_manager_id');
    }

    /**
     * @return HasMany
     */
    public function vehicles(): HasMany
    {
        return $this->hasMany(VehicleInfo::class, 'fleet_manager_id');
    }

    /**
     * @return HasMany
     */
    public function fleet_drivers(): HasMany
    {
        return $this->hasMany(Driver::class, 'fleet_manager_id');
    }

    /**
     * @return BelongsTo
     */
    public function profile_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'profile_image_id');
    }

}
