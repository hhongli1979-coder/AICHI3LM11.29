<?php

namespace Modules\Taxido\Exports;

use Modules\Taxido\Models\Zone;
use Modules\Taxido\Models\Ride;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class ZonesExport implements FromCollection, WithMapping, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $zones = Zone::whereNull('deleted_at')->latest('created_at');
        
        return $this->filter($zones, request());
    }

    /**
     * Specify the columns for the export.
     *
     * @return array
     */
    public function columns(): array
    {
        return [
            'name',
            'total_rides',
            'total_drivers',
            'total_tax',
            'total_ride_amount',                                       
        ];
    }
    public function map($zone): array
    {
        
        $filteredRides = $zone?->rides();
    
        if (request()->ride_status) {
            $filteredRides = $filteredRides->whereIn('ride_status_id', request()->ride_status);
        }
    
        if (request()->vehicle_type) {
            $filteredRides = $filteredRides->whereIn('vehicle_type_id', request()->vehicle_type);
        }
    
        $totalSum = $filteredRides->sum('total');
        $totalTax = $filteredRides->sum('tax');
    
        $filteredDrivers = $zone->drivers()->count();
    
        return [
            $zone->name,
            $filteredRides->count(),
            $filteredDrivers,
            getDefaultCurrency()?->symbol . $totalTax,
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
            'name',
            'Total Rides',
            'Total Drivers',
            'Total Tax',
            'Total Ride Amount', 
        ];
    }

    public function filter($zones, $request)
    {
        if ($request->zone) {
            $zones = $zones->whereIn('id', $request->zone);
        }
        
        if ($request->ride_status) {
            $rideStatusIds = $request->ride_status;
            $zones = $zones->whereHas('rides', function ($query) use ($rideStatusIds) {
                $query->whereIn('ride_status_id', $rideStatusIds);
            });
        }
    
        if ($request->vehicle_type) {
            $zones = $zones->whereHas('rides', function ($query) use ($request) {
                $query->whereIn('vehicle_type_id', $request->vehicle_type);
            });
        }

        return $zones->get();
    }
}
