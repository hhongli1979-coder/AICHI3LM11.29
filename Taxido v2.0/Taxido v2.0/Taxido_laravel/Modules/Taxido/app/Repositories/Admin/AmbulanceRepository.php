<?php

namespace Modules\Taxido\Repositories\Admin;

use Modules\Taxido\Models\Ambulance;
use Prettus\Repository\Eloquent\BaseRepository;

class AmbulanceRepository extends BaseRepository
{
    public function model()
    {
        return Ambulance::class;
    }

    public function index($ambulanceTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.ambulance.index', ['tableConfig' => $ambulanceTable]);
    }
}