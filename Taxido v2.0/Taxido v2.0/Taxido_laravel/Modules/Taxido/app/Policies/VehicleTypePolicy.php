<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\VehicleType;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehicleTypePolicy
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
        if ($user->can('vehicle_type.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleType $vehicleType
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, VehicleType $vehicleType)
    {
        if ($user->can('vehicle_type.index')) {
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
        if ($user->can('vehicle_type.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleType $vehicleType
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, VehicleType $vehicleType)
    {
        if ($user->can('vehicle_type.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleType $vehicleType
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, VehicleType $vehicleType)
    {
        if ($user->can('vehicle_type.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleType $vehicleType
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, VehicleType $vehicleType)
    {
        if ($user->can('vehicle_type.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleType $vehicleType
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, VehicleType $vehicleType)
    {
        if ($user->can('vehicle_type.forceDelete')) {
            return true;
        }
    }
}
