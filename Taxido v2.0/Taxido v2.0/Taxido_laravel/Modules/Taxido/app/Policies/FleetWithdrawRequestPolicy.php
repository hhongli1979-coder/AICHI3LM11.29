<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\FleetWithdrawRequest;

class FleetWithdrawRequestPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user)
    {
        return $user->can('fleet_withdraw_request.index');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FleetWithdrawRequest $fleetWithdrawRequest)
    {
        return $user->can('fleet_withdraw_request.index');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->can('fleet_withdraw_request.create');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FleetWithdrawRequest $fleetWithdrawRequest)
    {
        return $user->can('fleet_withdraw_request.edit');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FleetWithdrawRequest $fleetWithdrawRequest)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, FleetWithdrawRequest $fleetWithdrawRequest)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, FleetWithdrawRequest $fleetWithdrawRequest)
    {
        //
    }
}
