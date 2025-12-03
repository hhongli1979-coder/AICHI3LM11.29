<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\SurgePrice;
use Illuminate\Auth\Access\HandlesAuthorization;

class SurgePricePolicy
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
        if ($user->can('surge_price.index')) {
            return true;
        }
    }

     /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\SurgePrice  $surgePrice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, SurgePrice $surgePrice)
    {
        if ($user->can('surge_price.index')) {
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
        if ($user->can('surge_price.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\SurgePrice  $surgePrice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, SurgePrice $surgePrice)
    {
        if ($user->can('surge_price.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\SurgePrice  $surgePrice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, SurgePrice $surgePrice)
    {
        if ($user->can('surge_price.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\SurgePrice  $surgePrice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, SurgePrice $surgePrice)
    {
        if ($user->can('surge_price.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\SurgePrice  $surgePrice
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,SurgePrice $surgePrice)
    {
        if ($user->can('surge_price.forceDelete')) {
            return true;
        }
    }
}
