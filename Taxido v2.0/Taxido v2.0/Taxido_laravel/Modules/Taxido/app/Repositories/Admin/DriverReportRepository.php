<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Driver;
use Maatwebsite\Excel\Facades\Excel;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\RideStatusEnum;
use Modules\Taxido\Exports\DriversExport;
use Prettus\Repository\Eloquent\BaseRepository;

class DriverReportRepository extends BaseRepository
{
    /**
     * Display a listing of the resource.
     */
    function model()
    {
        return Driver::class;
    }
    public function index()
    {
        return view('taxido::admin.reports.driver');

    }

    public function filter(Request $request)
    {
        $drivers = $this->model;

        if($request->driver && !in_array('all', $request->driver)) {

            $drivers = $drivers->whereIn('id',$request->driver);
        }

        if ($request->vehicle_type && !in_array('all', $request->vehicle_type)) {
            $drivers = $drivers->whereHas('vehicle_info', function ($query) use ($request) {
                $query->whereIn('vehicle_type_id', $request->vehicle_type);
            });
        }

        if ($request->has('zone') && !in_array('all', $request->zone)) {
                $drivers = $drivers->whereHas('zones', function ($query) use ($request) {
                $query->whereIn('zones.id', $request->zone);
            });
        }


        $drivers = $drivers->paginate(15);
        $driverReportTable = $this->getDriverReportTable($drivers);

        return response()->json([
            'driverReportTable' => $driverReportTable,
            'pagination' => $drivers->links('pagination::bootstrap-4')->render()
        ]);
    }


    public function getDriverReportTable($drivers)
    {
        $driverReportTable = "";

        foreach ($drivers as $driver) {

            $driverReportTable .= "
                <tr>

                    <td>" . $driver->name . "</td>
                    <td>" . $driver->email . "</td>
                    <td> <i class='ri-star-fill'></i>(".$driver->getRatingCountAttribute().")</td>
                    
                    <td>".getDefaultCurrency()?->symbol . $driver?->total_driver_commission."</td>
                    <td>".getTotalDriverRidesByStatus(RideStatusEnum::STARTED,$driver->id)."</td>
                    <td>".getTotalDriverRidesByStatus(RideStatusEnum::COMPLETED,$driver->id)."</td>
                    <td>".getTotalDriverRidesByStatus(RideStatusEnum::SCHEDULED,$driver->id)."</td>
                    <td>".getTotalDriverRidesByStatus(RideStatusEnum::CANCELLED,$driver->id)."</td>
                </tr>";
        }
        return $driverReportTable;
    }

    public function export(Request $request)
    {
        try {

            $format = $request->get('format', 'csv');
            switch ($format) {
                case 'excel':
                    return $this->exportExcel();
                case 'csv':
                default:
                    return $this->exportCsv();
            }

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public  function exportExcel()
    {
        return Excel::download(new DriversExport, 'drivers.xlsx');
    }

    public function exportCsv()
    {
        return Excel::download(new DriversExport, 'drivers.csv');
    }
}
