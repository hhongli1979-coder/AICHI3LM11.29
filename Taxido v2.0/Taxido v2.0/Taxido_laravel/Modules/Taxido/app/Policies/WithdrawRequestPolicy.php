<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\WithdrawRequest;

class WithdrawRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        if ($user->can('withdraw_request.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, WithdrawRequest $withdrawRequest)
    {
        if ($user->can('withdraw_request.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        if ($user->can('withdraw_request.create')) {
            return true;
        }
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, WithdrawRequest $withdrawRequest)
    {
        if ($user->can('withdraw_request.edit')) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, WithdrawRequest $withdrawRequest)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, WithdrawRequest $withdrawRequest)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, WithdrawRequest $withdrawRequest)
    {
        //
    }
}
