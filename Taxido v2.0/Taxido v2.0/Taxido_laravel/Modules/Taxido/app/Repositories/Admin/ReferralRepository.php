<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\ReferralBonus;
use Prettus\Repository\Eloquent\BaseRepository;

class ReferralRepository extends BaseRepository
{

    public function model()
    {
        return ReferralBonus::class;
    }

    public function index($referralTable, $userTypeFilters = [])
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.referral.index', [
            'tableConfig' => $referralTable,
            'userTypeFilters' => $userTypeFilters
        ]);
    }
}
