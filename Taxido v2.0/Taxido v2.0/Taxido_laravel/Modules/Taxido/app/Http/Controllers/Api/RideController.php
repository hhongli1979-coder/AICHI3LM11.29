<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Http\Requests\Api\UpdateRideLocationRequest;
use Modules\Taxido\Models\Ride;
use Modules\Taxido\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Http\Resources\RideResource;
use Modules\Taxido\Repositories\Api\RideRepository;
use Modules\Taxido\Http\Requests\Api\StartRideRequest;
use Modules\Taxido\Http\Requests\Api\CreateRideRequest;
use Modules\Taxido\Http\Requests\Api\StartAmbulanceRideRequest;
use Modules\Taxido\Http\Requests\Api\VerifyCouponRequest;

class RideController extends Controller
{
    public $repository;

    public function  __construct(RideRepository $repository)
    {
        $this->authorizeResource(Ride::class, 'ride');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $rides = $this->repository->whereNull('deleted_at');
            $rides = $this->filter($rides, $request);
            $rides = $rides->latest('created_at')->simplePaginate($request->paginate ?? $rides->count() ?: null );
            return RideResource::collection($rides);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateRideRequest $request)
    {
        return $this->repository->store($request);
    }

    public function show(Ride $ride)
    {
        return $this->repository->show($ride?->id);
    }

    public function getRideLocation(Ride $ride)
    {
        return $this->repository->getRideLocation($ride?->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
       //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ride $ride)
    {
        return $this->repository->update($request->all(), $ride->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }

    public function generateOtp($rideId)
    {
        return $this->repository->generateOtp($rideId);
    }

    public function startRide(StartRideRequest $request)
    {
        return $this->repository->startRide($request);
    }

    public function ambulanceStartRide(StartAmbulanceRideRequest $request)
    {
        return $this->repository->ambulanceStartRide($request);
    }

    public function verifyCoupon(VerifyCouponRequest $request)
    {
        return $this->repository->verifyCoupon($request);
    }

    public function verifyOtp(Request $request)
    {
        return $this->repository->verifyOtp($request);
    }

    public function payment(Request $request)
    {
        return $this->repository->payment($request);
    }

    public function verifyPayment(Request $request)
    {
        return $this->repository->verifyPayment($request);
    }

    public function getRiderInvoice($invoice_id, Request $request)
    {
        return $this->repository->getRiderInvoice($request->merge(['invoice_id' => $invoice_id]));
    }

    public function getDriverInvoice($invoice_id, Request $request)
    {
        return $this->repository->getDriverInvoice($request->merge(['invoice_id' => $invoice_id]));
    }

    public function fetchTodayScheduleRide()
    {
        return $this->repository->fetchTodayScheduleRide();
    }

    public function offlineDrivers()
    {
        return $this->repository->offlineDrivers();
    }

    public function getRideLocationCharges(UpdateRideLocationRequest $request)
    {
        return $this->repository->getRideLocationCharges($request->all());
    }

    public function rentalVehicleStatus()
    {
        return $this->repository->rentalVehicleStatus();
    }

    public function filter($rides, $request)
    {
        $roleName = getCurrentRoleName();
        if ($roleName == RoleEnum::RIDER) {
            $rides = $rides->where('rider_id', getCurrentUserId());
        }

        if ($roleName == RoleEnum::DRIVER) {
            $rides = $rides->where('driver_id', getCurrentUserId());
        }

        if ($roleName == RoleEnum::FLEET_MANAGER) {
            if(!$request->driver_id){
                throw new Exception("Fleet Manager must provide a Driver ID.", 400);
            }
            $driver_id = validateFleetManagerDriver($request->driver_id);
            $rides = $rides->where('driver_id', $driver_id);
        }

        if ($request->field && $request->sort) {
            $rides = $rides->orderBy($request->field, $request->sort);
        }

        if ($request->status) {
            $rides = $rides->where('ride_status_id', getRideStatusIdBySlug($request->status));
        }

        if ($request->start_date && $request->end_date) {
            $rides = $rides->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        return $rides;
    }
}
