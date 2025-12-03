<?php

namespace Modules\Ticket\Repositories\Admin;

use Modules\Ticket\Models\Report;
use Prettus\Repository\Eloquent\BaseRepository;

class ReportRepository extends BaseRepository
{
    function model()
    {
        return Report::class;
    }

    public function index($reportTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('ticket::admin.report.index', ['tableConfig' => $reportTable]);
    }
}