<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Ride;
use Maatwebsite\Excel\Facades\Excel;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Exports\RidesExport;
use Prettus\Repository\Eloquent\BaseRepository;
class RideReportRepository extends BaseRepository
{

    function model()
    {
        return Ride::class;
    }

    public function index()
    {
        return view('taxido::admin.reports.ride');
    }

    public function filter(Request $request)
    {
        $rides = $this->model;
        if($request->driver && !in_array('all', $request->driver)) {
            $rides = $rides->whereIn('driver_id',$request->driver);
        }

        if($request->user && !in_array('all', $request->user)) {
            $rides = $rides->whereIn('rider_id',$request->user);
        }

        if($request->ride_status && !in_array('all', $request->ride_status)) {
            $rides = $rides->whereIn('ride_status_id',$request->ride_status);
        }

        if($request->payment_status && !in_array('all', $request->payment_status)) {
            $rides = $rides->whereIn('payment_status',$request->payment_status);
        }

        if ($request->start_end_date) {
            $dates     = explode(' to ', $request->start_end_date);
            $startDate = \Carbon\Carbon::parse($dates[0])->startOfDay();
            $endDate   = isset($dates[1])  ? \Carbon\Carbon::parse($dates[1])->endOfDay() : $startDate->copy()->endOfDay();

            $rides = $rides->whereBetween('created_at', [$startDate, $endDate]);
        }

        if($request->service && !in_array('all', $request->service)) {
            $rides = $rides->whereIn('service_id',$request->service);
        }

        if($request->service_category && !in_array('all', $request->service_category)) {
            $rides = $rides->whereIn('service_category_id',$request->service_category);
        }

        if($request->vehicle_type && !in_array('all', $request->vehicle_type)) {
            $rides = $rides->whereIn('vehicle_type_id',$request->vehicle_type);
        }

        $rides = $rides->paginate(15);
        $rideReportTable = $this->getrideReportTable($rides);


        return response()->json([
            'rideReportTable' => $rideReportTable,
            'pagination' => $rides->links('pagination::bootstrap-4')->render()
        ]);
    }

    public function getrideReportTable($rides)
    {

        $paymentMethodColorClasses = getPaymentStatusColorClasses();
        $ridestatuscolorClasses = getRideStatusColorClasses();

        $rideReportTable = "";

        if($rides->isNotEmpty()){
            foreach ($rides as $ride) {
                $rideReportTable .= "
                    <tr>
                        <td>
                            <div class='bg-light-primary'>#" . $ride->ride_number . "</div>
                        </td>
                        <td>" . $ride->driver->name . "</td>
                        <td>" . $ride->rider['name'] . "</td>
                        <td>
                        <div class='badge badge-" . $ridestatuscolorClasses[ucfirst($ride->ride_status->name)] . "'>
                        " . $ride->ride_status->name . "</div>
                        </td>
                        <td>" . ucfirst($ride->payment_method) . "</td>
                        <td>
                        <div class='badge badge-" . $paymentMethodColorClasses[ucfirst($ride->payment_status)] . "'>
                        " . ucfirst($ride->payment_status) . "</div>
                        </td>
                        <td>" . $ride->service?->name . "</td>
                        <td>" . $ride->service_category?->name . "</td>
                        <td>" . $ride->vehicle_type?->name . "</td>
                        <td>" . getDefaultCurrency()->symbol . " " . $ride->total . "</td>
                    </tr>";
            }
        }
        else {
            $rideReportTable .= "
            <tr>
                <td colspan='10' class='text-center'>
                    <div class='no-data'>
                        <img src='" . asset('images/no-data.png') . "' class='img-lg' alt='no-data'>
                        <span>" . __('taxido::static.no_result') . "</span>
                    </div>
                </td>
            </tr>";
        }

        return $rideReportTable;
    }

    public function export($request)
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
        return Excel::download(new RidesExport, 'rides.xlsx');
    }

    public function exportCsv()
    {
        return Excel::download(new RidesExport, 'rides.csv');
    }
}
