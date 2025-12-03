<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\DriverDocument;
use Illuminate\Auth\Access\HandlesAuthorization;

class DriverDocumentPolicy
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
        if ($user->can('driver_document.index')) {
            return true;
        }
    }

     /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverDocument  $driverDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, DriverDocument $driverDocument)
    {
        if ($user->can('driver_document.index')) {
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
        if ($user->can('driver_document.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverDocument  $driverDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, DriverDocument $driverDocument)
    {
        if ($user->can('driver_document.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverDocument  $driverDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, DriverDocument $driverDocument)
    {
        if ($user->can('driver_document.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverDocument  $driverDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, DriverDocument $driverDocument)
    {
        if ($user->can('driver_document.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverDocument  $driverDocument
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,DriverDocument $driverDocument)
    {
        if ($user->can('driver_document.forceDelete')) {
            return true;
        }
    }
}
