<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\RideRequest;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\RideRequestTrait;

class RideRequestRepository extends BaseRepository
{
    use RideRequestTrait;

    protected $rideRequest;

    function model()
    {
        return RideRequest::class;
    }

    public function index($rideRequestTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.ride-request.index', ['tableConfig' => $rideRequestTable]);
    }

    public function details($id)
    {
        try {

            $rideRequest = $this->model->where('id', $id)?->first();
            if ($rideRequest) {
                return view('taxido::admin.ride-request.details', ['rideRequest' => $rideRequest]);
            }

            throw new Exception("Ride not exists", 404);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function store($request)
    {
        try {

            $taxidoSettings = getTaxidoSettings();
            if($taxidoSettings['activation']['bidding']) {
                throw new Exception("Please ensure bidding is disabled in the app settings before booking a ride request.", 404);
            }

            $rideRequest = $this->createCabRideRequest($request);
            return to_route('admin.ride-request.details', $rideRequest['id'])->with('success', __('taxido::static.rides.ride_request_create_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function showHeatMap()
    {
        $rideRequests = RideRequest::whereNotNull('location_coordinates')->get();
        $heatmapPoints = [];
        foreach ($rideRequests as $request) {
            $coordinates = $request->location_coordinates;
            if (is_string($coordinates)) {
                $coordinates = json_decode($coordinates, true);
            }

            if (!is_array($coordinates)) {
                continue;
            }

            foreach ($coordinates as $point) {
                if (isset($point['lat']) && isset($point['lng'])) {
                    $heatmapPoints[] = [
                        'latitude' => (float) $point['lat'],
                        'longitude' => (float) $point['lng'],
                    ];
                }
            }
        }

        return view('taxido::admin.heat-map.index', compact('heatmapPoints'));
    }
}
