<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Incentive;
use Modules\Taxido\Models\IncentiveLevel;
use Modules\Taxido\Models\DriverIncentiveProgress;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Services\IncentiveAnalyticsService;
use Modules\Taxido\Exports\IncentivesExport;
use Maatwebsite\Excel\Facades\Excel;
use Prettus\Repository\Eloquent\BaseRepository;
use Illuminate\Support\Facades\DB;

class IncentiveReportRepository extends BaseRepository
{
    protected $analyticsService;


    /**
     * Display a listing of the resource.
     */
    function model()
    {

        $this->analyticsService = new IncentiveAnalyticsService();
        return Incentive::class;
    }

    public function index()
    {
        return view('taxido::admin.reports.incentive');
    }

    public function filter(Request $request)
    {
        $query = $this->buildFilterQuery($request);

        $incentives = $query->paginate(15);
        $incentiveReportTable = $this->getIncentiveReportTable($incentives);

        return response()->json([
            'incentiveReportTable' => $incentiveReportTable,
            'pagination' => $incentives->links('pagination::bootstrap-4')->toHtml()
        ]);
    }

    private function buildFilterQuery(Request $request)
    {
        $query = $this->model->with(['driver', 'incentiveLevel.vehicleTypeZone.vehicleType', 'incentiveLevel.vehicleTypeZone.zone']);

        // Filter by driver
        if ($request->driver && !in_array('all', $request->driver)) {
            $query->whereIn('driver_id', $request->driver);
        }

        // Filter by vehicle type
        if ($request->vehicle_type && !in_array('all', $request->vehicle_type)) {
            $query->whereHas('incentiveLevel.vehicleTypeZone', function ($q) use ($request) {
                $q->whereIn('vehicle_type_id', $request->vehicle_type);
            });
        }

        // Filter by zone
        if ($request->zone && !in_array('all', $request->zone)) {
            $query->whereHas('incentiveLevel.vehicleTypeZone', function ($q) use ($request) {
                $q->whereIn('zone_id', $request->zone);
            });
        }

        // Filter by period type
        if ($request->period_type && !in_array('all', $request->period_type)) {
            $query->whereHas('incentiveLevel', function ($q) use ($request) {
                $q->whereIn('period_type', $request->period_type);
            });
        }

        // Filter by level
        if ($request->level && !in_array('all', $request->level)) {
            $query->whereHas('incentiveLevel', function ($q) use ($request) {
                $q->whereIn('level_number', $request->level);
            });
        }

        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('applicable_date', [
                Carbon::parse($request->start_date)->startOfDay(),
                Carbon::parse($request->end_date)->endOfDay()
            ]);
        }

        // Filter by achievement status
        if ($request->has('is_achieved') && $request->is_achieved !== 'all') {
            $query->where('is_achieved', $request->is_achieved === '1');
        }

        return $query->orderBy('applicable_date', 'desc');
    }

    public function getIncentiveReportTable($incentives)
    {
        $incentiveReportTable = "";

        foreach ($incentives as $incentive) {
            $vehicleTypeZone = $incentive->incentiveLevel?->vehicleTypeZone;
            $vehicleType = $vehicleTypeZone?->vehicleType;
            $zone = $vehicleTypeZone?->zone;

            $statusBadge = $incentive->is_achieved
                ? '<span class="badge badge-completed">Completed</span>'
                : '<span class="badge badge-pending">Pending</span>';

            $incentiveReportTable .= "
                <tr>
                    <td>" . $incentive->driver?->name . "</td>
                    <td>" . $incentive->driver?->email . "</td>
                    <td>" . ($vehicleType?->name ?? 'N/A') . "</td>
                    <td>" . ($zone?->name ?? 'N/A') . "</td>
                    <td>" . ucfirst($incentive->incentiveLevel?->period_type ?? 'N/A') . "</td>
                    <td>Level " . ($incentive->incentiveLevel?->level_number ?? 'N/A') . "</td>
                    <td>" . $incentive->target_rides . "</td>
                    <td>" . getDefaultCurrency()?->symbol . number_format($incentive->bonus_amount, 2) . "</td>
                    <td>" . $incentive->applicable_date?->format('Y-m-d') . "</td>
                    <td>" . $statusBadge . "</td>
                </tr>";
        }

        return $incentiveReportTable;
    }

    public function export(Request $request)
    {
        try {
            $format = $request->get('format', 'csv');
            switch ($format) {
                case 'excel':
                    return $this->exportExcel($request);
                case 'csv':
                default:
                    return $this->exportCsv($request);
            }
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function exportExcel(Request $request)
    {
        return Excel::download(new IncentivesExport($request), 'incentives.xlsx');
    }

    public function exportCsv(Request $request)
    {
        return Excel::download(new IncentivesExport($request), 'incentives.csv');
    }

    /**
     * Get incentive analytics data
     */
    public function getAnalytics(Request $request)
    {
        return $this->analyticsService->getAnalytics($request);
    }

    /**
     * Get time series data for charts
     */
    public function getTimeSeriesData(Request $request, string $groupBy = 'day')
    {
        return $this->analyticsService->getTimeSeriesData(
            $request->start_date ? Carbon::parse($request->start_date) : Carbon::now()->subDays(30),
            $request->end_date ? Carbon::parse($request->end_date) : Carbon::now(),
            $request,
            $groupBy
        );
    }

    /**
     * Export analytics data
     */
    public function exportAnalyticsData(Request $request, string $format = 'csv')
    {
        return $this->analyticsService->exportAnalytics($request, $format);
    }
}
