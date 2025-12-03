<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use App\Models\Address;
use App\Models\Attachment;
use App\Enums\PaymentStatus;
use Spatie\MediaLibrary\HasMedia;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Enums\RequestEnum;
use Modules\Taxido\Enums\RideStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Driver extends User implements HasMedia
{
    use SoftDeletes;

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
        'is_verified',
        'is_online',
        'is_on_ride',
        'fleet_manager_id',
        'location',
        'referral_code',
        'fcm_token',
        'can_accept_ride_request',
        'can_accept_parcel_request',
        'service_id',
        'service_category_id',
        'referred_by_id',
        'created_by_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at'   => 'datetime',
            'is_verified' => 'integer',
            'password' => 'hashed',
            'phone'  => 'integer',
            'status'  => 'integer',
            'can_accept_ride'     => 'integer',
            'can_accept_parcel'   => 'integer',
            'created_by_id' => 'integer',
            'service_id'  => 'integer',
            'fleet_manager_id' => 'integer',
            'profile_image_id'    => 'integer',
            'service_category_id' => 'integer',
            'is_online'  => 'integer',
            'is_on_ride' => 'integer',
            'location'  => 'json',

        ];
    }

    protected $appends = [
        'role'
    ];

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
            $builder->role(RoleEnum::DRIVER);
        });

        static::saving(function ($model) {
            $model->created_by_id = isUserLogin() ? getCurrentUserId() : $model?->id;
        });

        static::deleted(function ($driver) {
            $driver->vehicle_info()->delete();
            $driver->reviews()->delete();
            $driver->documents()->delete();
            $driver->rides()->delete();
            $driver->wallet()->delete();
            $driver->payment_account()->delete();
            $driver->withdrawRequests()->delete();
            $driver->subscription()->delete();
        });

        static::restored(function ($driver) {
            $driver->vehicle_info()->withTrashed()->restore();
            $driver->reviews()->withTrashed()->restore();
            $driver->documents()->withTrashed()->restore();
            $driver->wallet()->withTrashed()->restore();
            $driver->rides()->withTrashed()->restore();
            $driver->payment_account()->withTrashed()->restore();
            $driver->withdrawRequests()->withTrashed()->restore();
            $driver->subscription()->withTrashed()->restore();
        });
    }

    public function getMorphClass()
    {
        return 'App\Models\User';
    }

    public function routeNotificationForFcm()
    {
        return $this->fcm_token;
    }

    public function getTotalDriverCommissionAttribute(): float
    {
        return CabCommissionHistory::where('driver_id', $this->id)->sum('driver_commission') ?? 0.0;
    }

    public function getPendingWithdrawRequestsCountAttribute(): int
    {
        return WithdrawRequest::where('driver_id', $this->id)?->where('status', RequestEnum::PENDING)?->count();
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
     * Get the total pending rides.
     */
    public function getTotalPendingRidesAttribute()
    {
        return getTotalRidesByStatus(RideStatusEnum::REQUESTED);
    }

    /**
     * Get the total completed rides.
     */
    public function getTotalCompleteRidesAttribute()
    {
        return getTotalRidesByStatus(RideStatusEnum::COMPLETED);
    }

    /**
     * Get the total cancelled rides.
     */
    public function getTotalCancelRidesAttribute()
    {
        return getTotalRidesByStatus(RideStatusEnum::CANCELLED);
    }

    /**
     * Get the total active rides.
     */
    public function getTotalActiveRidesAttribute()
    {
        return getTotalRidesByStatus(RideStatusEnum::STARTED);
    }

    /**
     * Get the total rating count.
     */
    public function getRatingCountAttribute()
    {
        return (float) $this->reviews?->avg('rating');
    }

    /**
     * Get the total rating count.
     */
    public function getReviewCountAttribute()
    {
        return (int) $this->reviews?->count();
    }

    /**
     * @return HasOne
     */
    public function ambulance(): HasOne
    {
        return $this->hasOne(Ambulance::class, 'driver_id');
    }

    /**
     * @return HasOne
     */
    public function subscription(): HasOne
    {
        return $this->hasOne(DriverSubscription::class, 'driver_id')?->where('payment_status', PaymentStatus::COMPLETED)?->where('is_active', true)?->where('end_date', '>', now());
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
    public function vehicle_info(): HasOne
    {
        return $this->hasOne(VehicleInfo::class, 'driver_id');
    }

    /**
     * @return HasOne
     */
    public function address(): HasOne
    {
        return $this->hasOne(Address::class, 'user_id');
    }

    /**
     * @return HasOne
     */
    public function wallet(): HasOne
    {
        return $this->hasOne(DriverWallet::class, 'driver_id');
    }

    /**
     * @return HasMany
     */
    public function documents(): HasMany
    {
        return $this->hasMany(DriverDocument::class, 'driver_id');
    }

    /**
     * @return HasMany
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(RiderReview::class, 'driver_id');
    }

    /**
     * @return HasMany
     */
    public function driver_rules(): HasMany
    {
        return $this->hasMany(DriverRule::class, 'created_by_id');
    }

    /**
     * @return HasMany
     */
    public function withdrawRequests(): HasMany
    {
        return $this->hasMany(WithdrawRequest::class, 'driver_id');
    }



    /**
     * Referral bonuses where this driver is the referrer
     * @return HasMany
     */
    public function referralBonuses(): HasMany
    {
        return $this->hasMany(ReferralBonus::class, 'referrer_id')
            ->where('referrer_type', 'driver');
    }

    /**
     * Referral bonuses where this driver is the referred user
     * @return HasMany
     */
    public function referredBonuses(): HasMany
    {
        return $this->hasMany(ReferralBonus::class, 'referred_id')
            ->where('referred_type', 'driver');
    }

    /**
     * Drivers referred by this driver
     * @return HasMany
     */
    public function referredDrivers(): HasMany
    {
        return $this->hasMany(Driver::class, 'referred_by_id');
    }

    /**
     * @return HasMany
     */
    public function rental_vehicle(): HasMany
    {
        return $this->hasMany(RentalVehicle::class, 'driver_id');
    }

    /**
     * @return HasMany
     */
    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class, 'driver_id');
    }

    /**
     * @return HasMany
     */
    public function onRides(): HasMany
    {
        return $this->hasMany(Ride::class)
            ->whereIn('ride_status_id', getRideStatusIdsBySlugs([RideStatusEnum::STARTED]))
            ->latest()?->limit(1);
    }

    /**
     * @return BelongsTo
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    /**
     * @return BelongsTo
     */
    public function profile_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'profile_image_id');
    }

    /**
     * @return BelongsTo
     */
    public function service_category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service__category_id');
    }

    /**
     * @return BelongsTo
     */
    public function document_image(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'document_image_id');
    }

    /**
     * @return BelongsTo
     */
    public function fleet_manager(): BelongsTo
    {
        return $this->belongsTo(FleetManager::class, 'fleet_manager_id');
    }

    /**
     * @return BelongsToMany
     */
    public function zones(): BelongsToMany
    {
        return $this->belongsToMany(Zone::class, 'driver_zones');
    }

    /**
     * @return BelongsToMany
     */
    public function preferences(): BelongsToMany
    {
        return $this->belongsToMany(Preference::class, 'driver_preferences');
    }

    /**
     * Relationship to DriverIncentiveProgress
     * @return HasMany
     */
    public function incentiveProgress(): HasMany
    {
        return $this->hasMany(DriverIncentiveProgress::class, 'driver_id');
    }

    /**
     * Relationship to Incentives (earned incentives)
     * @return HasMany
     */
    public function incentives(): HasMany
    {
        return $this->hasMany(Incentive::class, 'driver_id');
    }
}
