<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\VehicleInfo;
use Illuminate\Auth\Access\HandlesAuthorization;

class VehicleInfoPolicy
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
        if ($user->can('vehicle_info.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleInfo $vehicleInfo
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, VehicleInfo $vehicleInfo)
    {
        if ($user->can('vehicle_info.index')) {
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
        if ($user->can('vehicle_info.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleInfo $vehicleInfo
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, VehicleInfo $vehicleInfo)
    {
        if ($user->can('vehicle_info.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleInfo $vehicleInfo
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, VehicleInfo $vehicleInfo)
    {
        if ($user->can('vehicle_info.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleInfo $vehicleInfo
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, VehicleInfo $vehicleInfo)
    {
        if ($user->can('vehicle_info.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\VehicleInfo $vehicleInfo
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, VehicleInfo $vehicleInfo)
    {
        if ($user->can('vehicle_info.forceDelete')) {
            return true;
        }
    }
}
