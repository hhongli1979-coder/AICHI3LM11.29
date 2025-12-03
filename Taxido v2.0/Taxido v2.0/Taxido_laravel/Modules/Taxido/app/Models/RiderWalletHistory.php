<?php

namespace Modules\Taxido\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiderWalletHistory extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The Attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'rider_wallet_id',
        'ride_id',
        'detail',
        'amount',
        'type',
        'from_user_id',
        'transaction_id'
    ];

    protected $casts = [
        'rider_wallet_id' => 'integer',
        'ride_id' => 'integer',
        'amount' => 'float',
        'from_user_id' => 'integer',
    ];

    protected $hidden = [
        'updated_at',
        'deleted_at',
    ];

    /**
     * @return HasOne
     */
    public function from(): HasOne
    {
        return $this->hasOne(Rider::class, 'from_user_id');
    }

    /**
     * @return HasMany
     */
    public function histories(): HasMany
    {
        return $this->hasMany(RiderWalletHistory::class, 'rider_wallet_id')->orderBy('created_at', 'desc');
    }

    /**
     * @return BelongsTo
     */
    public function ride(): BelongsTo
    {
        return $this->belongsTo(Ride::class, 'ride_id');
    }

    /**
     * Check if this transaction is a referral bonus (simplified for two core bonus types)
     *
     * @return bool
     */
    public function isReferralBonus(): bool
    {
        return str_contains($this->detail, 'Referrer Bonus') ||
               str_contains($this->detail, 'Referred Bonus') ||
               str_contains($this->transaction_id ?? '', 'REF_');
    }

    /**
     * Get the referral transaction type (simplified for two core bonus types only)
     *
     * @return string|null
     */
    public function getReferralTransactionType(): ?string
    {
        if (!$this->isReferralBonus()) {
            return null;
        }

        if (str_contains($this->detail, 'Referred Bonus')) {
            return 'referral_bonus_referred';
        } elseif (str_contains($this->detail, 'Referrer Bonus')) {
            return 'referral_bonus_referrer';
        }

        return 'referral_bonus';
    }

    /**
     * Get formatted transaction description for display (simplified for two core bonus types)
     *
     * @return string
     */
    public function getFormattedDescription(): string
    {
        if ($this->isReferralBonus()) {
            // Return simplified description for two core bonus types only
            if (str_contains($this->detail, 'Referred Bonus')) {
                return 'Referred Bonus';
            } elseif (str_contains($this->detail, 'Referrer Bonus')) {
                return 'Referrer Bonus';
            }
            return $this->detail;
        }

        return $this->detail ?? 'Wallet Transaction';
    }

    /**
     * Check if this is a referrer bonus transaction
     *
     * @return bool
     */
    public function isReferrerBonus(): bool
    {
        return str_contains($this->detail, 'Referrer Bonus');
    }

    /**
     * Check if this is a referred bonus transaction
     *
     * @return bool
     */
    public function isReferredBonus(): bool
    {
        return str_contains($this->detail, 'Referred Bonus');
    }
}
