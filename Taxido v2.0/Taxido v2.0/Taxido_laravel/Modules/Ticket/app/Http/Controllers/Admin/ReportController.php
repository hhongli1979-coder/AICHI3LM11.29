<?php
namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Report;
use Modules\Ticket\Models\Executive;
use App\Http\Controllers\Controller;
use Modules\Ticket\Tables\ReportTable;
use Modules\Ticket\Tables\DetailedReportTable;
use Modules\Ticket\Repositories\Admin\ReportRepository;

class ReportController extends Controller
{
    private $repository;

    public function __construct(ReportRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(ReportTable $reportTable)
    {
        return $this->repository->index($reportTable->generate());
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Request $request, $id)
    {
        if (request()['action']) {
            return redirect()->back();
        }
        $detailedReportTable = new DetailedReportTable($request, $id);
        $user = Executive::where('id', operator: $id)?->first();
        return view('ticket::admin.report.edit', [
            'tableConfig' => $detailedReportTable->generate(),
            'executive'   => $user,
        ]);
    }

    public function edit(Report $report)
    {
        //
    }

    public function update(Request $request, Report $report)
    {
        //
    }

    public function destroy(Report $report)
    {
        //
    }
}
