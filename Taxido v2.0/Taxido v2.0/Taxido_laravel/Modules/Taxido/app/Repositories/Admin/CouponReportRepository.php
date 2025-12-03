<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Coupon;
use Maatwebsite\Excel\Facades\Excel;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Exports\CouponsExport;
use Prettus\Repository\Eloquent\BaseRepository;

class CouponReportRepository extends BaseRepository
{

    function model()
    {
        return Coupon::class;
    }

    public function index()
    {
        return view('taxido::admin.reports.coupon');
    }

    public function filter(Request $request)
    {
        $coupons = $this->model;

        if($request->coupon && !in_array('all', $request->coupon)) {
            $coupons = $coupons->whereIn('id',$request->coupon);
        }

        if($request->start_end_date)
        {
            $dateRange = explode(' to ', $request->start_end_date);
            $startDate = \Carbon\Carbon::createFromFormat('m/d/Y', trim($dateRange[0]))->startOfDay();
            $endDate = isset($dateRange[1]) 
                ? \Carbon\Carbon::createFromFormat('m/d/Y', trim($dateRange[1]))->endOfDay()
                : $startDate->copy()->endOfDay();

            $coupons = Coupon::whereBetween('created_at', [$startDate, $endDate]);
        }

        if($request->ride_status && !in_array('all', $request->ride_status))
        {
            $rideStatusIds = $request->ride_status;
            $coupons = $coupons->whereHas('rides', function ($query) use ($rideStatusIds) {
                $query->whereIn('ride_status_id', $rideStatusIds);
            });
        }

        $coupons = $coupons->paginate(15);
        $couponReportTable = $this->getCouponReportTable($coupons,$request);

        return response()->json([
            'couponReportTable' => $couponReportTable,
            'pagination' => $coupons->links('pagination::bootstrap-4')->render()
        ]);
    }

    public function getCouponReportTable($coupons, $request)
    {
        $couponReportTable = "";

        if($coupons->isNotEmpty()) {
            foreach ($coupons as $coupon) {
                $filteredRides = $coupon?->rides();

                if (request()->ride_status && !in_array('all', $request->ride_status)) {
                    $filteredRides = $filteredRides->whereIn('ride_status_id', request()->ride_status);
                }

                if (request()->vehicle_type && !in_array('all', $request->vehicle_type)) {
                    $filteredRides = $filteredRides->whereIn('vehicle_type_id', request()->vehicle_type);
                }

                $totalSum = $filteredRides->sum('total');
                $totalDiscount = $filteredRides->sum('coupon_total_discount');

                $couponReportTable .= "
                    <tr>
                        <td>" . $coupon->code . "</td>
                        <td>".$filteredRides?->count()."</td>
                        <td>" . getDefaultCurrency()?->symbol . $totalDiscount . "</td>
                        <td>" . getDefaultCurrency()?->symbol . $totalSum . "</td>
                    </tr>";
            }
        } else {
            $couponReportTable .= "
            <tr>
                <td colspan='6' class='text-center'>
                    <div class='no-data'>
                        <img src='" . asset('images/no-data.png') . "' class='img-lg' alt='no-data'>
                        <span>" . __('taxido::static.no_result') . "</span>
                    </div>
                </td>
            </tr>";
        }
        return $couponReportTable;
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
        return Excel::download(new CouponsExport, 'coupons.xlsx');
    }

    public function exportCsv()
    {
        return Excel::download(new CouponsExport, 'coupons.csv');
    }
}
