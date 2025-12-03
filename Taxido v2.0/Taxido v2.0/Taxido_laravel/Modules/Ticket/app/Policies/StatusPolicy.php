<?php

namespace Modules\Ticket\Policies;

use App\Models\User;
use Modules\Ticket\Models\Status;
use Illuminate\Auth\Access\HandlesAuthorization;

class StatusPolicy
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
        if ($user->can('ticket.status.index')) {
            return true;
        }
    }

     /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Status  $status
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Status $status)
    {
        if ($user->can('ticket.status.index')) {
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
        if ($user->can('ticket.status.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Status  $status
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Status $status)
    {
        if ($user->can('ticket.status.edit') && $user->id == $status->created_by_id) {
            return true;
        }
    }

     /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Status  $status
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Status $status)
    {
        if ($user->can('ticket.status.destroy') && $user->id == $status->created_by_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Status  $status
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Status  $status)
    {
        if ($user->can('ticket.status.restore') && $user->id == $status->created_by_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Status  $status
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,Status  $status)
    {
        if ($user->can('ticket.status.forceDelete') && $user->id == $status->created_by_id) {
            return true;
        }
    }
}
