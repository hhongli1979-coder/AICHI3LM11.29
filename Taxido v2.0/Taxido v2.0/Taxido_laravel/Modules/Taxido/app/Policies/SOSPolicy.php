<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\SOS;
use Illuminate\Auth\Access\HandlesAuthorization;

class SOSPolicy {

    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
    */
    public function viewAny(User $user)
    {
        if($user->can('sos.index')){
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
    */
    public function view(User $user, SOS $sos)
    {
        if ($user->can('sos.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
    */
    public function create(User $user)
    {
        if ($user->can('sos.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SOS $sos)
    {
        if ($user->can('sos.edit')) {
            return true;
        }
    }

      /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\SOS   $sos
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, SOS $sos)
    {
        if ($user->can('sos.destroy') ) {
            return true;
        }
    }

     /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\SOS  $sos
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, SOS $sos)
    {
        if ($user->can('sos.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\SOS  $sos
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, SOS $sos)
    {
        if ($user->can('sos.forceDelete')) {
            return true;
        }
    }
}
