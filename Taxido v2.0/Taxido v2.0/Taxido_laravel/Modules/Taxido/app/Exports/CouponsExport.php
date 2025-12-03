<?php

namespace Modules\Taxido\Exports;

use Modules\Taxido\Models\Coupon;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Tables\CouponTable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class CouponsExport implements FromCollection, WithMapping, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $couponTable = new CouponTable(request()->merge([
            'export' => true,
        ]));

        return $couponTable->getData();
    }

    /**
     * Specify the columns for the export.
     *
     * @return array
     */
    public function columns(): array
    {
        return [
            'coupon_code',
            'total_rides',
            'total_coupon_discount',
            'total_ride_amount'
        ];
    }

    public function map($coupon): array
    {
        $filteredRides = $coupon->rides();
        if (request()->ride_status) {
            $filteredRides = $filteredRides->whereIn('ride_status_id', request()->ride_status);
        }

        if (request()->vehicle_type) {
            $filteredRides = $filteredRides->whereIn('vehicle_type_id', request()->vehicle_type);
        }

        $totalSum = $filteredRides->sum('total');
        $totalDiscount = $filteredRides->sum('coupon_total_discount');

        return [
            $coupon->id,
            $coupon->code,
            $filteredRides->count(),
            getDefaultCurrency()?->symbol . $totalDiscount,
            getDefaultCurrency()?->symbol . $totalSum,
        ];
    }


    /**
     * Get the headings for the export file.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'Coupon Code',
            'Total Rides',
            'Total Coupon Discount',
            'Total Ride Amount',
        ];
    }

    public function filter($coupons, $request)
    {
        if($request->coupon) {
            $coupons = $coupons->whereIn('id',$request->coupon);
        }

        if($request->start_end_date)
        {
            $dateRange = explode(' - ', $request->start_end_date);
            $startDate = \Carbon\Carbon::createFromFormat('m/d/Y', trim($dateRange[0]))->startOfDay();
            $endDate = \Carbon\Carbon::createFromFormat('m/d/Y', trim($dateRange[1]))->endOfDay();

            $coupons = Coupon::whereBetween('created_at', [$startDate, $endDate]);
        }

        if($request->ride_status)
        {
            $rideStatusIds = $request->ride_status;
            $coupons = $coupons->whereHas('rides', function ($query) use ($rideStatusIds) {
                $query->whereIn('ride_status_id', $rideStatusIds);
            });
        }
        return $coupons->get();
    }
}
