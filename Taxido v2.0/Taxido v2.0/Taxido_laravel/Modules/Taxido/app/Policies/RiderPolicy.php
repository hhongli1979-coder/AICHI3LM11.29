<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Rider;
use Illuminate\Auth\Access\HandlesAuthorization;

class RiderPolicy
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
        if ($user->can('rider.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Rider  $rider
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Rider $rider)
    {
        if ($user->can('rider.index')) {
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
        if ($user->can('rider.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Rider  $rider
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Rider $rider)
    {
        if ($user->can('rider.edit')){
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Rider  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Rider $rider)
    {
        if ($user->can('rider.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Rider  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Rider $rider)
    {
        if ($user->can('rider.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Rider  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Rider $rider)
    {
        if ($user->can('rider.forceDelete')) {
            return true;
        }
    }
}
