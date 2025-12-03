<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Modules\Taxido\Models\FleetDocument;

class FleetDocumentPolicy
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
        if ($user->can('fleet_document.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\FleetDocument  $driverDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, FleetDocument $fleetDocument)
    {
        if ($user->can('fleet_document.index')) {
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
        if ($user->can('fleet_document.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\FleetDocument  $FleetDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, FleetDocument $fleetDocument)
    {
        if ($user->can('fleet_document.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\FleetDocument  $FleetDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, FleetDocument $fleetDocument)
    {
        if ($user->can('fleet_document.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\FleetDocument  $FleetDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, FleetDocument $fleetDocument)
    {
        if ($user->can('fleet_document.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\FleetDocument  $FleetDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,FleetDocument $fleetDocument)
    {
        if ($user->can('fleet_document.forceDelete')) {
            return true;
        }
    }

}