<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\RiderReview;
use Illuminate\Auth\Access\HandlesAuthorization;

class RiderReviewPolicy
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
        if ($user->can('rider_review.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     * @param  \App\Models\User  $user
     * @param  Modules\Taxido\Models\RiderReview $riderReview
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, RiderReview $riderReview)
    {
        if ($user->can('rider_review.index')) {
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
     * @param   Modules\Taxido\Models\RiderReview $riderReview
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user,RiderReview $riderReview)
    {
        if ($user->id == $riderReview->user_id) {
            return true;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param   Modules\Taxido\Models\RiderReview $riderReview
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, RiderReview $riderReview)
    {
        if ($user->can('rider_review.destroy')) {
            return true;
        }
    }

    /**
     * Determine whether the user can restore a specific rider review.
     *
     * @param  \App\Models\User  $user
     * @param  \Modules\Taxido\Models\RiderReview  $riderReview
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, RiderReview $riderReview)
    {
        if ($user->can('rider_review.restore')) {
            return true;
        }
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, RiderReview $riderReview)
    {
        //
    }
}
