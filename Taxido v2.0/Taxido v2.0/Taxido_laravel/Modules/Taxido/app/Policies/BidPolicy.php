<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Bid;
use Illuminate\Auth\Access\HandlesAuthorization;

class BidPolicy
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
        if ($user->can('bid.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Bid  $bid
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user,Bid $bid)
    {
        if ($user->can('bid.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        if ($user->can('bid.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Bid  $bid
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user,Bid $bid)
    {
        if ($user->can('bid.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \Modules\Taxido\Models\Bid $bid
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user,Bid $bid)
    {
        if ($user->can('bid.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Bid $bid
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user,Bid $bid)
    {
        if ($user->can('bid.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User $user
     * @param  \Modules\Taxido\Models\Bid $bid
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user,Bid $bid)
    {
        if ($user->can('bid.forceDelete')) {
            return true;
        }
    }
}
