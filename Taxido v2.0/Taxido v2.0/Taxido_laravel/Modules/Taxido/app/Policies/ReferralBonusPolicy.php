<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\ReferralBonus;

class ReferralBonusPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        if ($user->can('cab_referral.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ReferralBonus $referralBonus)
    {
        if ($user->can('cab_referral.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        if ($user->can('cab_referral.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ReferralBonus $referralBonus)
    {
        if ($user->can('cab_referral.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ReferralBonus $referralBonus)
    {
        if ($user->can('cab_referral.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ReferralBonus $referralBonus)
    {
        if ($user->can('cab_referral.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ReferralBonus $referralBonus)
    {
        if ($user->can('cab_referral.forceDelete')) {
            return true;
        }
    }
}
