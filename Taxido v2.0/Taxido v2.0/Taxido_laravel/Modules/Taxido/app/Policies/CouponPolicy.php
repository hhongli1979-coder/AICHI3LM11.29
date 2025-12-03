<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Coupon;
use Illuminate\Auth\Access\HandlesAuthorization;

class CouponPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        if ($user->can('coupon.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\Coupon  $coupon
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Coupon $coupon)
    {
        if ($user->can('coupon.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        if ($user->can('coupon.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param Modules\Taxido\Models\Coupon  $coupon
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Coupon $coupon)
    {
        if ($user->can('coupon.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\Coupon  $coupon
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Coupon $coupon)
    {
        if ($user->can('coupon.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\Coupon  $coupon
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Coupon $coupon)
    {
        if ($user->can('coupon.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param Modules\Taxido\Models\Coupon  $coupon
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Coupon $coupon)
    {
        if ($user->can('coupon.forceDelete')) {
            return true;
        }
    }
}
