<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Dispatcher;
use Illuminate\Auth\Access\HandlesAuthorization;

class DispatcherPolicy
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
        if ($user->can('dispatcher.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Dispatcher  $dispatcher
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Dispatcher $dispatcher)
    {
        if ($user->can('dispatcher.index')) {
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
        if ($user->can('dispatcher.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Dispatcher  $dispatcher
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Dispatcher $dispatcher)
    {
        if ($user->can('dispatcher.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Dispatcher  $dispatcher
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Dispatcher $dispatcher)
    {
        if ($user->can('dispatcher.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Dispatcher  $dispatcher
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Dispatcher $dispatcher)
    {
        if ($user->can('dispatcher.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Dispatcher  $dispatcher
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Dispatcher $dispatcher)
    {
        if ($user->can('dispatcher.forceDelete')) {
            return true;
        }
    }

}
