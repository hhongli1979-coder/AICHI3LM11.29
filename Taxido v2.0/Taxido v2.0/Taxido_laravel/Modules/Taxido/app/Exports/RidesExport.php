<?php

namespace Modules\Taxido\Exports;

use Modules\Taxido\Models\Ride;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Tables\RideTable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;

class RidesExport implements FromCollection, WithMapping, WithHeadings
{

    protected $rides;

    public function __construct($rides)
    {
        $this->rides = $rides;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (isDemoModeEnabled()) {
            throw new ExceptionHandler("This action is disabled in demo mode", 400);
        }

        $rideTable = new RideTable(request()->merge([
            'export' => true,
        ]));

        return $rideTable->getData();
    }

    /**
     * Specify the columns for the export.
     *
     */
    public function columns(): array
    {
        return [
            'ride_number',
            'rider_id',
            'driver_id',
            'vehicle_type_id',
            'start_time',
            'end_time',
            'ride_status_id',
            'total',
            'distance',
            'duration',
            'payment_method',
            'ride_status',
            'payment_status',
            'cancellation_reason',
            'created_by_id',
            'created_at',
        ];
    }

    /**
     * Map the ride data to be exported in the correct format for the Excel file.
     *
     * @param Ride $ride
     */
    public function map($ride): array
    {
        return [
            $ride->ride_number,
            $ride->rider ? ($ride->rider['name'] ?? 'N/A') : 'N/A',
            $ride->driver ? ($ride->driver->name ?? 'N/A') : 'N/A',
            $ride->vehicle_type ? $ride->vehicle_type->name : 'N/A',
            $ride->start_time,
            $ride->end_time,
            $ride->ride_status ? $ride->ride_status->name : 'N/A',
            $ride->total,
            $ride->distance,
            $ride->duration,
            $ride->payment_method,
            $ride->ride_status->name,
            $ride->payment_status,
            $ride->cancellation_reason ?? 'N/A',
            $ride->created_by_id,
            $ride->created_at,
        ];
    }

    /**
     * Get the headings for the export file.
     *
     */
    public function headings(): array
    {
        return [
            'Ride Number',
            'Rider Name',
            'Driver Name',
            'Vehicle Type',
            'Start Time',
            'End Time',
            'Ride Status',
            'Total Fare',
            'Distance',
            'Duration',
            'Payment Method',
            'Ride Status',
            'Payment Status',
            'Cancellation Reason',
            'Created By',
            'Created At',
        ];
    }

    /**
     * Apply filters to the collection based on the request.
     */
    public function filter($rides, $request)
    {
        if($request->driver) {

            $rides = $rides->whereIn('driver_id',$request->driver);
        }

        if($request->user) {
            $rides = $rides->whereIn('rider_id',$request->user);
        }

        if($request->ride_status) {
            $rides = $rides->whereIn('ride_status_id',$request->ride_status);
        }

        if($request->payment_method) {
            $rides = $rides->whereIn('payment_method',$request->payment_method);
        }

        if($request->payment_status) {
            $rides = $rides->whereIn('payment_status',$request->payment_status);
        }

        if($request->payment_status) {
            $rides = $rides->whereIn('payment_status',$request->payment_status);
        }

        if($request->service) {
            $rides = $rides->whereIn('service_id',$request->service);
        }

        if($request->service_category) {
            $rides = $rides->whereIn('service_category_id',$request->service_category);
        }

        if($request->vehicle_type) {
            $rides = $rides->whereIn('vehicle_type_id',$request->vehicle_type);
        }

        $currentUserRole = getCurrentRoleName();
        $currentUserId = getCurrentUserId();

        if ($currentUserRole == RoleEnum::DRIVER) {
            $rides = $rides->where('driver_id', $currentUserId);
        }

        if ($currentUserRole == RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentUserId();
            $rides          = $rides->whereHas('driver', function ($query) use ($fleetManagerId) {
                $query->where('fleet_manager_id', $fleetManagerId);
            });
        }

        if ($currentUserRole == RoleEnum::DISPATCHER) {
            $rides = $rides->whereHas('zones', function ($q) {
                $q->whereHas('dispatchers', function ($q) {
                    $q->where('dispatcher_id', getCurrentUserId());
                });
            });
        }

        return $rides->get();
    }
}


