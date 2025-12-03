<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\DriverRule;
use Illuminate\Auth\Access\HandlesAuthorization;

class DriverRulePolicy
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
        if ($user->can('driver_rule.index')) {
            return true;
        }
    }

     /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverRule  $driverRule
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, DriverRule $driverRule)
    {
        if ($user->can('driver_rule.index')) {
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
        if ($user->can('driver_rule.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverRule  $driverRule
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, DriverRule $driverRule)
    {
        if ($user->can('driver_rule.edit')) {
            return true;
        }
    }

     /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverRule  $driverRule
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, DriverRule $driverRule)
    {
        if ($user->can('driver_rule.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverRule  $driverRule
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, DriverRule $driverRule)
    {
        if ($user->can('driver_rule.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverRule  $driverRule
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,DriverRule $driverRule)
    {
        if ($user->can('driver_rule.forceDelete')) {
            return true;
        }
    }
}
