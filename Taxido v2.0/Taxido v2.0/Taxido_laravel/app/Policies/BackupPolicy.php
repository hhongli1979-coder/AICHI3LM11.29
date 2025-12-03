<?php

namespace App\Policies;

use App\Models\Backup;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class BackupPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any backups.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        if ($user->can('backup.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view a specific backup.
     *
     * @param  \App\Models\User  $user
     * @param   \App\Models\Backup $backup
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Backup $backup)
    {
        if ($user->can('backup.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create backups.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        if ($user->can('backup.create')) {
            return true;
        }
    }


    /**
     * Determine whether the user can update a specific backup.
     *
     * @param  \App\Models\User  $user
     * @param   \App\Models\Backup $backup
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, Backup $backup)
    {
        if ($user->can('backup.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete a specific backup.
     *
     * @param  \App\Models\User  $user
     * @param   \App\Models\Backup $backup
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, Backup $backup)
    {
        if ($user->can('backup.destroy')) {
            return true;
        }
    }


    /**
     * Determine whether the user can restore a specific backup.
     *
     * @param  \App\Models\User  $user
     * @param   \App\Models\Backup $backup
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, Backup $backup)
    {
        if ($user->can('backup.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete a specific backup.
     *
     * @param  \App\Models\User  $user
     * @param   \App\Models\Backup $backup
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, Backup $backup)
    {
        if ($user->can('backup.forceDelete')) {
            return true;
        }
    }
}