<?php

namespace Modules\Taxido\Repositories\Api;

use Exception;
use Modules\Taxido\Models\Coupon;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\DB;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;

class CouponRepository extends BaseRepository
{
    protected $fieldSearchable = [
        'name' => 'like',
    ];

    function model()
    {
        return Coupon::class;
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

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $coupon = $this->model->create([
                'title' => $request->title,
                'description' => $request->description,
                'code' => $request->code,
                'type' => $request->type,
                'amount' => $request->amount,
                'min_ride_fare' => $request->min_ride_fare,
                'is_unlimited' => $request->is_unlimited,
                'usage_per_coupon' => $request->usage_per_coupon,
                'usage_per_rider' => $request->usage_per_rider,
                'status' => $request->status,
                'is_expired' => $request->is_expired,
                'is_apply_all' => $request->is_apply_all,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ]);

            if (isset($request['zones'])) {
                $coupon->zones()->attach($request['zones']);
                $coupon->zones;
            }

            if (isset($request['services'])) {
                $coupon->services()->attach($request['services']);
                $coupon->services;
            }

            if (isset($request['service_categories'])) {
                $coupon->service_categories()->attach($request['service_categories']);
                $coupon->service_categories;
            }

            if (isset($request['vehicle_types'])) {
                $coupon->vehicle_types()->attach($request['vehicle_types']);
                $coupon->vehicle_types;
            }

            DB::commit();
            return $coupon;

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
