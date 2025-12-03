<?php

namespace Modules\Taxido\Enums;

enum ReferralTransactionType: string
{
    const REFERRAL_BONUS_REFERRER = 'referral_bonus_referrer';
    const REFERRAL_BONUS_REFERRED = 'referral_bonus_referred';

    /**
     * Get human-readable description for the transaction type (simplified for two core bonus types)
     *
     * @param string $type
     * @return string
     */
    public static function getDescription(string $type): string
    {
        return match ($type) {
            self::REFERRAL_BONUS_REFERRER => 'Referrer Bonus',
            self::REFERRAL_BONUS_REFERRED => 'Referred Bonus',
            default => 'Referral Transaction',
        };
    }

    /**
     * Check if transaction type is a referral bonus (simplified for two core bonus types only)
     *
     * @param string $type
     * @return bool
     */
    public static function isReferralBonus(string $type): bool
    {
        return in_array($type, [
            self::REFERRAL_BONUS_REFERRER,
            self::REFERRAL_BONUS_REFERRED,
        ]);
    }

    /**
     * Get all available referral transaction types (two core bonus types only)
     *
     * @return array
     */
    public static function getAllTypes(): array
    {
        return [
            self::REFERRAL_BONUS_REFERRER,
            self::REFERRAL_BONUS_REFERRED,
        ];
    }
}
