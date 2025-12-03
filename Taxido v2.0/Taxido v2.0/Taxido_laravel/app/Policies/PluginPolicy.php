<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Plugin;

class PluginPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        if ($user->can('plugin.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Plugin $plugin)
    {
        if ($user->can('plugin.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        if ($user->can('plugin.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Plugin $plugin)
    {
        if ($user->can('plugin.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Plugin $plugin)
    {
        if ($user->can('plugin.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Plugin $plugin)
    {
        if ($user->can('plugin.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Plugin $plugin)
    {
        if ($user->can('plugin.forceDelete')) {
            return true;
        }
    }
}
