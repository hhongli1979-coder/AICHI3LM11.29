<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\PeakZone;

class PeakZonePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        if ($user->can('peak_zone.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PeakZone $peakZone)
    {
        if ($user->can('peak_zone.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        if ($user->can('peak_zone.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PeakZone $peakZone)
    {
        if ($user->can('peak_zone.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PeakZone $peakZone)
    {
        if ($user->can('peak_zone.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PeakZone $peakZone)
    {
        if ($user->can('peak_zone.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PeakZone $peakZone)
    {
        if ($user->can('peak_zone.forceDelete')) {
            return true;
        }
    }
}
