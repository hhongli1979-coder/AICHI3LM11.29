<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Zone;
use Maatwebsite\Excel\Facades\Excel;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Exports\ZonesExport;
use Prettus\Repository\Eloquent\BaseRepository;

class ZoneReportRepository extends BaseRepository
{
    /**
     * Display a listing of the resource.
     */

    function model()
    {
        return Zone::class;
    }

    public function index()
    {
        return view('taxido::admin.reports.zone');
    }

    public function filter($request)
    {
        $zones = $this->model;

        if ($request->zone && !in_array('all', $request->zone)) {
            $zones = $zones->whereIn('id', $request->zone);
        }

        if ($request->ride_status && !in_array('all', $request->ride_status)) {
            $rideStatusIds = $request->ride_status;
            $zones = $zones->whereHas('rides', function ($query) use ($rideStatusIds) {
                $query->whereIn('ride_status_id', $rideStatusIds);
            });
        }

        if ($request->vehicle_type && !in_array('all', $request->vehicle_type)) {
            $zones = $zones->whereHas('rides', function ($query) use ($request) {
                $query->whereIn('vehicle_type_id', $request->vehicle_type);
            });
        }

        $zones = $zones->with(['rides', 'drivers'])->paginate(15);

        $zoneReportTable = $this->getZoneReportTable($zones, $request);

        return response()->json([
            'zoneReportTable' => $zoneReportTable,
            'pagination' => $zones->links('pagination::bootstrap-4')->render(),
        ]);
    }

    public function getZoneReportTable($zones, $request)
    {
        $zoneReportTable = "";

        if($zones?->isNotEmpty()) {
            foreach ($zones as $zone) {


                $filteredRides = $zone?->rides();

                if ($request->ride_status && !in_array('all', $request->ride_status)) {
                    $filteredRides = $filteredRides->whereIn('ride_status_id', $request->ride_status);
                }

                if ($request->vehicle_type && !in_array('all', $request->vehicle_type)) {
                    $filteredRides = $filteredRides->whereIn('vehicle_type_id', $request->vehicle_type);
                }


                $totalSum = $filteredRides->sum('total');
                $totalTax = $filteredRides->sum('tax');


                $filteredDrivers = $zone->drivers()->count();

                $zoneReportTable .= "
                    <tr>
                        <td>{$zone->name}</td>
                        <td>{$filteredRides->count()}</td>
                        <td>{$filteredDrivers}</td>
                        <td>" . getDefaultCurrency()?->symbol . $totalTax . "</td>
                        <td>" . getDefaultCurrency()?->symbol . $totalSum . "</td>
                    </tr>";
            }
        }
        else {
            $zoneReportTable .= "
            <tr>
                <td colspan='6' class='text-center'>
                    <div class='no-data'>
                        <img src='" . asset('images/no-data.png') . "' class='img-lg' alt='no-data'>
                            <span>" . __('taxido::static.no_result') . "</span>
                    </div>
                </td>
            </tr>";
        }
        return $zoneReportTable;
    }

    public function export(Request $request)
    {
        try{

            $format = $request->get('format', 'csv');
            switch ($format) {
                case 'excel':
                    return $this->exportExcel();
                case 'csv':
                default:
                    return $this->exportCsv();
            }

        }catch(Exception $e)
        {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public  function exportExcel()
    {
        return Excel::download(new ZonesExport, 'zones.xlsx');
    }

    public function exportCsv()
    {
        return Excel::download(new ZonesExport, 'zones.csv');
    }
}
