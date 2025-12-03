<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\CancellationReason;
use Illuminate\Auth\Access\HandlesAuthorization;

class CancellationReasonPolicy
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
        if ($user->can('cancellation_reason.index')) {
            return true;
        }
    }

     /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CancellationReason  $cancellationReason
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, CancellationReason $cancellationReason)
    {
        if ($user->can('cancellation_reason.index')) {
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
        if ($user->can('cancellation_reason.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CancellationReason  $cancellationReason
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, CancellationReason $cancellationReason)
    {
        if ($user->can('cancellation_reason.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CancellationReason  $cancellationReason
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user,CancellationReason $cancellationReason)
    {
        if ($user->can('cancellation_reason.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CancellationReason  $cancellationReason
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user,CancellationReason $cancellationReason)
    {
        if ($user->can('cancellation_reason.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CancellationReason  $cancellationReason
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,CancellationReason  $cancellationReason)
    {
        if ($user->can('cancellation_reason.forceDelete')) {
            return true;
        }
    }

}
