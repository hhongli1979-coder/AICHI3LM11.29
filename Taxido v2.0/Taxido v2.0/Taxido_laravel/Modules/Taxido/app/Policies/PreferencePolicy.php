<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Preference;
use Illuminate\Auth\Access\HandlesAuthorization;

class PreferencePolicy
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
        if ($user->can('preference.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Preference  $preference
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Preference $preference)
    {
        if ($user->can('preference.index')) {
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
        if ($user->can('preference.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Preference $preference
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Preference $preference)
    {
        if ($user->can('preference.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Preference $preference
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Preference $preference)
    {
        if ($user->can('preference.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Preference $preference
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Preference $preference)
    {
        if ($user->can('preference.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\Preference $preference
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Preference $preference)
    {
        if ($user->can('preference.forceDelete')) {
            return true;
        }
    }
}
