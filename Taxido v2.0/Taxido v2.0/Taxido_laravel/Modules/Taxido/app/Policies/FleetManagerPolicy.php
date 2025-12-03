<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Rider;
use Illuminate\Auth\Access\HandlesAuthorization;
use Modules\Taxido\Models\FleetManager;

class FleetManagerPolicy
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
        if ($user->can('fleet_manager.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FleetManager  $fleetManager
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, FleetManager $fleetManager)
    {
        if ($user->can('fleet_manager.index')) {
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
        if($user->can('fleet_manager.create'))
        {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FleetManager  $fleetManager
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, FleetManager $fleetManager)
    {
        if ($user->can('fleet_manager.edit')){
            return true;
        }
    }

      /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FleetManager  $fleetManager
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, FleetManager $fleetManager)
    {
        if ($user->can('fleet_manager.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FleetManager $fleetManager
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, FleetManager $fleetManager)
    {
        if ($user->can('fleet_manager.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FleetManager  $fleetManager
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,FleetManager $fleetManager)
    {
        if ($user->can('fleet_manager.forceDelete')) {
            return true;
        }
    }

}
