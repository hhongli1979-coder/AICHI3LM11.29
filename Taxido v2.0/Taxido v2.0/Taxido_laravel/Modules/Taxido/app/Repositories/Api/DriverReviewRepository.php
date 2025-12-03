<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Models\Ride;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Models\DriverReview;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class DriverReviewRepository extends BaseRepository
{
    protected $ride;

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));

        } catch (ExceptionHandler $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function model()
    {
        $this->ride = new Ride();
        return DriverReview::class;
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $driver_id = getCurrentUserId();
            $ride = $this->ride->findOrFail($request->ride_id);
            $rider_id = $ride->rider_id;
            if (!isRideCompleted($ride)) {
                throw new Exception(__('taxido::static.reviews.ride_not_completed'), 400);
            }

            if (isAlreadyReviewed($driver_id, $ride->id)) {
                throw new Exception(__('taxido::static.reviews.already_reviewed'), 400);
            }

            $review = $this->model->create([
                'ride_id' => $ride->id,
                'rider_id' => $rider_id,
                'driver_id' => $driver_id,
                'service_id' => $ride->service_id,
                'service_category_id' => $ride->service_category_id,
                'rating' => $request->rating,
                'message' => $request->message,
            ]);

            DB::commit();
            return $review;

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $review = $this->model->findOrFail($id);
            $review->update([
                'rating' => $request['rating'],
                'message' => $request['message'],
            ]);

            DB::commit();
            return $review;

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            return $this->model->findOrFail($id)->delete();

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
