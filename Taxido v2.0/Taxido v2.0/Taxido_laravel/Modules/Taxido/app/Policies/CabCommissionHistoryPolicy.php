<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\CabCommissionHistory;
use Illuminate\Auth\Access\HandlesAuthorization;

class CabCommissionHistoryPolicy
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
        if ($user->can('cab_commission_history.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\CabCommissionHistory  $cabCommissionHistory
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, CabCommissionHistory $cabCommissionHistory)
    {
        if ($user->can('cab_commission_history.index')) {
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
        if ($user->can('cab_commission_history.create')) {
            return true;
        }
    }
}