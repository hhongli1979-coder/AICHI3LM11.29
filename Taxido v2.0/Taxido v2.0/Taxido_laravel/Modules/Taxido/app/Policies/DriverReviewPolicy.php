<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\DriverReview;
use Illuminate\Auth\Access\HandlesAuthorization;

class DriverReviewPolicy
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
        if ($user->can('driver_review.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\DriverReview $driverReview
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, DriverReview $driverReview)
    {
        if ($user->can('driver_review.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\DriverReview $driverReview
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, DriverReview $driverReview)
    {
        if ($user->id == $driverReview->user_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\DriverReview $driverReview
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, DriverReview $driverReview)
    {
        if ($user->can('driver_review.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, DriverReview $driverReview)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, DriverReview $driverReview)
    {
        //
    }
}
