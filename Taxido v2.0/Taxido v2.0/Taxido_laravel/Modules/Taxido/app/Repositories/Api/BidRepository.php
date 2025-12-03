<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Models\Bid;
use Modules\Taxido\Models\Ride;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\RideRequest;
use Modules\Taxido\Enums\BidStatusEnum;
use Modules\Taxido\Http\Traits\RideTrait;
use Modules\Taxido\Http\Traits\BiddingTrait;
use Modules\Taxido\Http\Resources\RideResource;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Modules\Taxido\Http\Resources\Riders\BidResource;

class BidRepository extends BaseRepository
{
    use BiddingTrait, RideTrait;

    protected $ride;
    protected $rideRequest;

    function model()
    {
        $this->ride = new Ride();
        $this->rideRequest = new RideRequest();
        return Bid::class;
    }

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($id)
    {
        try {

            return $this->model->findOrFail($id);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyBidingAmount($request)
    {
        $rideRequest = RideRequest::where('id', $request?->ride_request_id)?->whereNull('deleted_at')?->first();
        if ($rideRequest) {
            $rideRequest->currency_code = $request?->currency_code;
            $bid_extra_amount = $rideRequest->bid_extra_amount;
            $minAmount = abs($rideRequest->total - $bid_extra_amount);
            $rideRequest->ride_fare = $request?->amount;
            return $this->verifyBiddingFairAmount($rideRequest, $minAmount);
        }

        return false;
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            if (!(getCurrentRoleName() == RoleEnum::DRIVER)) {
                throw new Exception(__('taxido::static.bids.only_drivers_can_place_bids'), 400);
            }

            if ($this->verifyBidingAmount($request)) {
                $driver_id = $request->driver_id ?? getCurrentUserId();
                if (!$this->isExistsBidAtTime($driver_id, $request->ride_request_id)) {
                    $bid = $this->model->create([
                        'ride_request_id' => $request->ride_request_id,
                        'amount' => $request->amount,
                        'driver_id' => $driver_id
                    ]);

                    DB::commit();
                    $bid = $bid->refresh();
                    $bidFireStoreFields = new BidResource($bid);
                    $bid = $bidFireStoreFields?->toArray(request());
                    $this->addBidsFirestore($bid);

                    return $bid;
                }

                throw new Exception(__('taxido::static.bids.create_next_bid'), 400);
            }

            throw new Exception(__('taxido::static.bids.invalid_bidding_amount'), 400);

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $bid = $this->model->select(['id', 'status', 'ride_request_id'])->findOrFail($id);
            if (!is_null($bid->status)) {
                throw new Exception(__('taxido::static.bids.bid_status_already_changed', ['status' => $bid->status]), 403);
            }

            $bid->update(['status' => $request['status']]);
            if (!is_null($bid->status)) {
                DB::commit();
                $bid = $bid->refresh();

                if ($bid->status == BidStatusEnum::ACCEPTED) {
                    $ride = $this->createRide($request, $bid);
                    if(!$ride) {
                        throw new Exception(__('taxido::static.bids.failed_to_create_ride'), 500);
                    }
                    return new RideResource($ride);
                }

                return response()->json(['id'=> $bid?->id, 'driver_id' => $bid?->driver_id]);
            }

            throw new Exception(__('taxido::static.bids.bid_status_already_changed', ['status' => $bid->status]), 403);

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
