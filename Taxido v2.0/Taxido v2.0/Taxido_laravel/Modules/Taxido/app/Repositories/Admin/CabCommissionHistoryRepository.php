<?php

namespace Modules\Taxido\Repositories\Admin;

use Modules\Taxido\Models\CabCommissionHistory;
use Prettus\Repository\Eloquent\BaseRepository;

class CabCommissionHistoryRepository extends BaseRepository
{
    public function model()
    {
        return CabCommissionHistory::class;
    }

    public function index($cabCommissionHistoryTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.cab-commission-history.index', ['tableConfig' => $cabCommissionHistoryTable]);
    }

}   