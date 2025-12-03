<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Ride;
use Illuminate\Auth\Access\HandlesAuthorization;

class RidePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        if ($user->can('ride.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Ride  $ride
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Ride $ride)
    {
        if ($user->can('ride.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        if ($user->can('ride.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Ride  $ride
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Ride $ride)
    {
        if ($user->can('ride.edit')) {
            return true;
        }
    }

     /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \Modules\Taxido\Models\Ride $ride
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Ride $ride)
    {
       //
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Ride $ride
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Ride $ride)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Ride $ride
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Ride $ride)
    {
        //
    }
}
