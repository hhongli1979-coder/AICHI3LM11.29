<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\PushNotification;
use Illuminate\Auth\Access\HandlesAuthorization;

class PushNotificationPolicy
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
        if ($user->can('push_notification.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\PushNotification $pushNotification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, PushNotification $pushNotification)
    {
        if ($user->can('push_notification.index')) {
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
        if ($user->can('push_notification.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\PushNotification $pushNotification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, PushNotification $pushNotification)
    {
        if ($user->can('push_notification.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\PushNotification  $pushNotification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, PushNotification $pushNotification)
    {

        if ($user->can('push_notification.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\PushNotification  $pushNotification
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,PushNotification  $pushNotification)
    {
        if ($user->can('pushNotification.forceDelete')) {
            return true;
        }
    }

}
