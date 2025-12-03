<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\RentalVehicle;
use Illuminate\Auth\Access\HandlesAuthorization;

class RentalVehiclePolicy
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
        if ($user->can('rental_vehicle.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\RentalVehicle $rentalVehicle
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, RentalVehicle $rentalVehicle)
    {
        if ($user->can('rental_vehicle.index')) {
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
        if ($user->can('rental_vehicle.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\RentalVehicle $rentalVehicle
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, RentalVehicle $rentalVehicle)
    {

        if ($user->can('rental_vehicle.edit') && (($user?->role?->name != RoleEnum::DRIVER )
            || ($user?->role?->name == RoleEnum::DRIVER && $user->id == $rentalVehicle->driver_id))){
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\RentalVehicle $rentalVehicle
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, RentalVehicle $rentalVehicle)
    {
        if ($user->can('rental_vehicle.destroy') && (($user?->role?->name != RoleEnum::DRIVER )
            || ($user?->role?->name == RoleEnum::DRIVER && $user->id == $rentalVehicle->driver_id))){
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\RentalVehicle $rentalVehicle
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, RentalVehicle $rentalVehicle)
    {
        if ($user->can('rental_vehicle.restore') && (($user?->role?->name != RoleEnum::DRIVER)
            || ($user?->role?->name == RoleEnum::DRIVER && $user->id == $rentalVehicle->driver_id))){
            return true;
        }

    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\RentalVehicle $rentalVehicle
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, RentalVehicle $rentalVehicle)
    {
        if ($user->can('rental_vehicle.restore') && (($user?->role?->name != RoleEnum::DRIVER)
            || ($user?->role?->name == RoleEnum::DRIVER && $user->id == $rentalVehicle->driver_id))){
            return true;
        }
    }
}
