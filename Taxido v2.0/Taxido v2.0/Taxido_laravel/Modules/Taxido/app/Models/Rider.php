<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use App\Models\Address;
use App\Models\Attachment;
use Spatie\MediaLibrary\HasMedia;
use Spatie\Activitylog\LogOptions;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Enums\RideStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Rider extends User implements HasMedia
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
        'password',
        'phone',
        'system_reserve',
        'profile_image_id',
        'fcm_token',
        'password',
        'status',
        'referral_code',
        'referred_by_id',
        'created_by_id'
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
            'reviews_count' => 'integer',
            'rating_count' => 'float',
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
            $builder->role(RoleEnum::RIDER);
        });

        static::saving(function ($model) {
            $model->created_by_id = getCurrentUserId() ?? getAdmin()?->id;
        });

        static::deleted(function ($rider) {
            $rider->reviews()->delete();
            $rider->payment_account()->delete();
            $rider->address()->delete();
            $rider->rides()->delete();
            $rider->wallet()->delete();
            $rider->referralBonuses()->delete();
            $rider->referredBonuses()->delete();
        });

        static::restored(function ($rider) {
            $rider->reviews()->restore();
            $rider->payment_account()->restore();
            $rider->address()->restore();
            $rider->rides()->restore();
            $rider->wallet()->restore();
            $rider->referralBonuses()->withTrashed()->restore();
            $rider->referredBonuses()->withTrashed()->restore();
        });
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->useLogName('Rider')
            ->setDescriptionForEvent(fn(string $eventName) => "{$this->name} - Rider has been {$eventName}");
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
     * Get the total pending rides.
     */
    public function getTotalPendingRidesAttribute()
    {
        return getTotalRidesByStatusForRider(RideStatusEnum::REQUESTED);
    }

    /* Get the total completed rides.
     */
    public function getTotalCompleteRidesAttribute()
    {
        return getTotalRidesByStatusForRider(RideStatusEnum::COMPLETED);
    }

    /**
     * Get the total cancelled rides.
     */
    public function getTotalCancelRidesAttribute()
    {
        return getTotalRidesByStatusForRider(RideStatusEnum::CANCELLED);
    }

    /**
     * Get the total active rides.
     */
    public function getTotalActiveRidesAttribute()
    {
        return getTotalRidesByStatusForRider(RideStatusEnum::STARTED);
    }

    public function getRatingCountAttribute()
    {
        return (float) $this->rider_reviews?->avg('rating');
    }

    /**
     * @return HasOne
     */
    public function wallet(): HasOne
    {
        return $this->hasOne(RiderWallet::class, 'rider_id');
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
    public function payment_account(): HasOne
    {
        return $this->hasOne(PaymentAccount::class, 'user_id');
    }

    /**
     * @return HasMany
     */
    public function rides(): HasMany
    {
        return $this->hasMany(Ride::class, 'rider_id');
    }

    /**
     * @return HasMany
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(DriverReview::class, 'rider_id');
    }



    /**
     * Referral bonuses where this rider is the referrer
     * @return HasMany
     */
    public function referralBonuses(): HasMany
    {
        return $this->hasMany(ReferralBonus::class, 'referrer_id')
            ->where('referrer_type', 'rider');
    }

    /**
     * Referral bonuses where this rider is the referred user
     * @return HasMany
     */
    public function referredBonuses(): HasMany
    {
        return $this->hasMany(ReferralBonus::class, 'referred_id')
            ->where('referred_type', 'rider');
    }

    /**
     * Riders referred by this rider
     * @return HasMany
     */
    public function referredRiders(): HasMany
    {
        return $this->hasMany(Rider::class, 'referred_by_id');
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
    public function coupons(): BelongsToMany
    {
        return $this->belongsToMany(Coupon::class, 'coupon_riders');
    }
}
