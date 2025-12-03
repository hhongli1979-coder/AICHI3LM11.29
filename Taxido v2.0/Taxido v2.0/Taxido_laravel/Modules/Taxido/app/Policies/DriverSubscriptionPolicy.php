<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\DriverSubscription;
use Illuminate\Auth\Access\HandlesAuthorization;

class DriverSubscriptionPolicy
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
        if ($user->can('subscription.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DriverSubscription  $driverSubscription
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, DriverSubscription $driverSubscription)
    {
        if ($user->can('subscription.index')) {
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
        if ($user->can('subscription.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DriverSubscription  $driverSubscription
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, DriverSubscription $driverSubscription)
    {
        if ($user->can('subscription.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DriverSubscription  $driverSubscription
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, DriverSubscription $driverSubscription)
    {
        if ($user->can('subscription.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DriverSubscription  $driverSubscription
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, DriverSubscription  $driverSubscription)
    {
        if ($user->can('subscription.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DriverSubscription  $driverSubscription
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, DriverSubscription  $driverSubscription)
    {
        if ($user->can('subscription.forceDelete')) {
            return true;
        }
    }
}
