<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\HourlyPackage;
use Illuminate\Auth\Access\HandlesAuthorization;

class HourlyPackagePolicy
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
        if ($user->can('hourly_package.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\HourlyPackage $hourlyPackage
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, HourlyPackage $hourlyPackage)
    {
        if ($user->can('hourly_package.index')) {
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
        if ($user->can('hourly_package.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param Modules\Taxido\Models\HourlyPackage $hourlyPackage
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, HourlyPackage $hourlyPackage)
    {
        if ($user->can('hourly_package.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\HourlyPackage $hourlyPackage
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, HourlyPackage $hourlyPackage)
    {
        if ($user->can('hourly_package.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\HourlyPackage $hourlyPackage
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, HourlyPackage $hourlyPackage)
    {
        if ($user->can('hourly_package.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param Modules\Taxido\Models\HourlyPackage $hourlyPackage
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, HourlyPackage $hourlyPackage)
    {
        if ($user->can('hourly_package.forceDelete')) {
            return true;
        }
    }
}