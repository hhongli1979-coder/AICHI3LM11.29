<?php

namespace Modules\Taxido\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReferralBonus extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'cab_referral_bonuses';

    protected $fillable = [
        'referrer_id',
        'referred_id',
        'referrer_type',
        'referred_type',
        'referrer_bonus_amount',
        'referred_bonus_amount',
        'ride_amount',
        'referrer_percentage',
        'referred_percentage',
        'currency_symbol',
        'bonus_amount',
        'status',
        'credited_at'
    ];

    protected $casts = [
        'bonus_amount' => 'double',
        'referred_bonus_amount' => 'double',
        'ride_amount' => 'double',
        'referrer_percentage' => 'double',
        'referred_percentage' => 'double',
        'credited_at' => 'datetime',
    ];

    /**
     * Get the referrer (custom polymorphic relationship)
     * @return BelongsTo
     */
    public function referrer(): BelongsTo
    {
        $modelClass = $this->getUserModelClass($this->referrer_type);
        return $this->belongsTo($modelClass, 'referrer_id');
    }

    /**
     * Get the referred user (custom polymorphic relationship)
     * @return BelongsTo
     */
    public function referred(): BelongsTo
    {
        $modelClass = $this->getUserModelClass($this->referred_type);
        return $this->belongsTo($modelClass, 'referred_id');
    }

    /**
     * Get the appropriate model class based on user type
     * @param string $userType
     * @return string
     */
    private function getUserModelClass($userType): string
    {
        return match($userType) {
            'rider' => Rider::class,
            'driver' => Driver::class, // Both riders and drivers are User models
            default => User::class,
        };
    }

    /**
     * Check if referrer is a rider
     * @return bool
     */
    public function isReferrerRider(): bool
    {
        return $this->referrer_type === 'rider';
    }

    /**
     * Check if referrer is a driver
     * @return bool
     */
    public function isReferrerDriver(): bool
    {
        return $this->referrer_type === 'driver';
    }

    /**
     * Check if referred user is a rider
     * @return bool
     */
    public function isReferredRider(): bool
    {
        return $this->referred_type === 'rider';
    }

    /**
     * Check if referred user is a driver
     * @return bool
     */
    public function isReferredDriver(): bool
    {
        return $this->referred_type === 'driver';
    }
}
