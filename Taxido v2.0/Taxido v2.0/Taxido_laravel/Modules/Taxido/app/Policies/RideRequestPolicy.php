<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\RideRequest;
use Illuminate\Auth\Access\HandlesAuthorization;

class RideRequestPolicy
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
        if ($user->can('ride_request.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\RideRequest  $rideRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, RideRequest $rideRequest)
    {
        if ($user->can('ride_request.index')) {
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
        if ($user->can('ride_request.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\RideRequest  $rideRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, RideRequest $rideRequest)
    {
        if ($user->can('ride_request.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \Modules\Taxido\Models\RideRequest $rideRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, RideRequest $rideRequest)
    {
        if ($user->can('ride_request.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\RideRequest $rideRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, RideRequest $rideRequest)
    {
        if ($user->can('ride_request.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\RideRequest $rideRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, RideRequest $rideRequest)
    {
        if ($user->can('ride_request.forceDelete')) {
            return true;
        }
    }
}
