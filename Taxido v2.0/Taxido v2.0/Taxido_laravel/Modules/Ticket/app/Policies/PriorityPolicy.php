<?php

namespace Modules\Ticket\Policies;

use App\Models\User;
use Modules\Ticket\Models\Priority;
use Illuminate\Auth\Access\HandlesAuthorization;

class PriorityPolicy
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
        if ($user->can('ticket.priority.index')) {
            return true;
        }
    }

     /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Priority  $priority
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Priority $priority)
    {
        if ($user->can('ticket.priority.index')) {
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
        if ($user->can('ticket.priority.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Priority  $priority
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Priority $priority)
    {
        if ($user->can('ticket.priority.edit') && $user->id == $priority->created_by_id) {
            return true;
        }
    }

     /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Priority  $priority
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Priority $priority)
    {
        if ($user->can('ticket.priority.destroy') && $user->id == $priority->created_by_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Priority  $priority
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Priority  $priority)
    {
        if ($user->can('ticket.priority.restore') && $user->id == $priority->created_by_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Priority  $priority
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,Priority  $priority)
    {
        if ($user->can('ticket.priority.forceDelete') && $user->id == $priority->created_by_id) {
            return true;
        }
    }
}
