<?php

namespace Modules\Ticket\Policies;

use App\Models\User;
use Modules\Ticket\Models\Executive;
use Illuminate\Auth\Access\HandlesAuthorization;

class ExecutivePolicy
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
        if ($user->can('ticket.executive.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Ticket\Models\Executive  $executive
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Executive $executive)
    {
        if ($user->can('ticket.executive.index')) {
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
        if ($user->can('ticket.executive.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Ticket\Models\Executive  $executive
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Executive $executive)
    {
        // if ($user->can('ticket.executive.edit') && $user->id == $executive->created_by_id) {
        if ($user->can('ticket.executive.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Ticket\Models\Executive  $executive
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Executive $executive)
    {
        // if ($user->can('ticket.executive.destroy') && $user->id == $executive->created_by_id) {
        if ($user->can('ticket.executive.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Ticket\Models\Executive  $executive
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Executive $executive)
    {
        if ($user->can('ticket.executive.restore') && $user->id == $executive->created_by_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Ticket\Models\Executive  $executive
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Executive $executive)
    {
        if ($user->can('ticket.executive.forceDelete') && $user->id == $executive->created_by_id) {
            return true;
        }
    }
}
