<?php

namespace Modules\Ticket\Policies;

use App\Models\User;
use Modules\Ticket\Models\FormField;
use Illuminate\Auth\Access\HandlesAuthorization;

class FormFieldPolicy
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
        if ($user->can('ticket.formfield.index')) {
            return true;
        }
    }

     /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormField  $formfield
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, FormField $formfield)
    {
        if ($user->can('ticket.formfield.index')) {
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
        if ($user->can('ticket.formfield.create')) {
            return true;
        }
    }

    public function update(User $user, $formfield)
    {
        if ($user->can('ticket.formfield.edit') && $user->id == $formfield->created_by_id) {
            return true;
        }
    }

     /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormField  $formfield
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, FormField $formfield)
    {
        if ($user->can('ticket.formfield.destroy') && $user->id == $formfield->created_by_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormField  $formfield
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, FormField  $formfield)
    {
        if ($user->can('ticket.formfield.restore') && $user->id == $formfield->created_by_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\FormField  $formfield
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,FormField  $formfield)
    {
        if ($user->can('ticket.formfield.forceDelete') && $user->id == $formfield->created_by_id) {
            return true;
        }
    }
}
