<?php

namespace Modules\Taxido\Policies;

use App\Models\User;
use Modules\Taxido\Models\Onboarding;
use Illuminate\Auth\Access\HandlesAuthorization;

class OnboardingPolicy
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
        if ($user->can('onboarding.index')) {
            return true;
        }
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Onboarding  $onboarding
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, Onboarding $onboarding)
    {
        if ($user->can('onboarding.index')) {
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
        if ($user->can('onboarding.create')) {
            return true;
        }
    }
}