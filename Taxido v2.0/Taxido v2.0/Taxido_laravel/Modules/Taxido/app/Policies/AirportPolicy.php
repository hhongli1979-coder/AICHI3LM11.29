<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Airport;
use Illuminate\Auth\Access\HandlesAuthorization;

class AirportPolicy
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
        if ($user->can('airport.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Airport  $airport
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Airport $airport)
    {
        if ($user->can('airport.index')) {
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
        if ($user->can('airport.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Airport $airport
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Airport $airport)
    {
        if ($user->can('airport.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Airport $airport
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Airport $airport)
    {
        if ($user->can('airport.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Airport $airport
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Airport $airport)
    {
        if ($user->can('airport.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Airport $airport
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Airport $airport)
    {
        if ($user->can('airport.forceDelete')) {
            return true;
        }
    }
}
