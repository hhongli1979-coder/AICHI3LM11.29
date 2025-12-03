<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Traits\FireStoreTrait;
use Modules\Taxido\Tables\RideRequestTable;
use Modules\Taxido\Http\Requests\Admin\CreateRideRequest;
use Modules\Taxido\Repositories\Admin\RideRequestRepository;

class RideRequestController extends Controller
{
    use FireStoreTrait;

    private $repository;

    public function __construct(RideRequestRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(RideRequestTable $rideRequestTable)
    {
        return $this->repository->index($rideRequestTable->generate());
    }

    public function create()
    {
        return view('taxido::admin.ride.create');
    }

    public function store(CreateRideRequest $request)
    {
        return $this->repository->store($request);
    }

    public function details(Request $request)
    {
        return $this->repository->details($request->id);
    }

    public function showHeatMap()
    {
       return $this->repository->showHeatMap();
    }

    public function fetchDrivers($lat, $lng, $serviceId = null, $serviceCategoryId = null, $vehicleTypeId = null)
    {
        $this->initializeFireStore();

        $filters = [
            ['is_verified', '==', 1],
            ['is_online', '==', '1'],
            ['is_on_ride', '==', '0'],
        ];

        if ($serviceId) {
            $filters[] = ['service_id', '==', (int) $serviceId];
        }
        if ($serviceCategoryId) {
            $filters[] = ['service_category_id', '==', (int) $serviceCategoryId];
        }
        if ($vehicleTypeId) {
            $filters[] = ['vehicle_type_id', '==', (int) $vehicleTypeId];
        }

        $cabSettings = getTaxidoSettings();
        $radiusMeter = $cabSettings['location']['radius_meter'] ?? 3000; // Adjust as needed
        $drivers = $this->fireStoreQueryCollection('driverTrack', $filters);
        $filteredDrivers = [];
        foreach ($drivers as $driver) {
            $driverLat = floatval($driver['lat'] ?? 0);
            $driverLng = floatval($driver['lng'] ?? 0);
            $distance = calculateDistance($lat, $lng, $driverLat, $driverLng);
            if ($distance <= $radiusMeter) {
                $filteredDrivers[] = [
                    'id' => $driver['id'] ?? null,
                    'name' => $driver['driver_name'] ?? 'Unknown Driver',
                    'phone' => $driver['phone'] ?? 'N/A',
                    'profile_image_url' => $driver['profile_image_url'] ?? 'https://avatar.iran.liara.run/public/39',
                    'vehicle_type_id' => $driver['vehicle_type_id'] ?? 'N/A',
                    'rating' => $driver['rating_count'] ?? 'Unrated',
                    'vehicle_model' => $driver['vehicle_model'] ?? 'N/A',
                    'plate_number' => $driver['plate_number'] ?? 'N/A',
                    'lat' => $driverLat,
                    'lng' => $driverLng,
                    'vehicle_map_icon_url' => $driver['vehicle_map_icon_url'] ?? 'https://avatar.iran.liara.run/public/39',
                ];
            }
        }

        return response()->json($filteredDrivers);
    }


}
