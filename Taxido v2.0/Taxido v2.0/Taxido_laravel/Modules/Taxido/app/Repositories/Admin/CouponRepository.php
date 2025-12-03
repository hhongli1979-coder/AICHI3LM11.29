<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\Coupon;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class CouponRepository extends BaseRepository
{
    public function model()
    {
        return Coupon::class;
    }

    public function index($couponTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.coupon.index', ['tableConfig' => $couponTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            [$start_date, $end_date] = parseDateRange($request);

            $coupon = $this->model->create([
                'title' => strtoupper($request->title),
                'description' => $request->description,
                'code' => strtoupper($request->code),
                'type' => $request->type,
                'amount' => $request->amount,
                'min_ride_fare' => $request->min_ride_fare,
                'is_unlimited' => $request->is_unlimited,
                'usage_per_coupon' => $request->usage_per_coupon,
                'usage_per_rider' => $request->usage_per_rider,
                'status' => $request->status,
                'is_expired' => $request->is_expired,
                'is_apply_all' => $request->is_apply_all,
                'start_date' => $start_date,
                'end_date' => $end_date,
            ]);

            if ($request->zones) {
                $coupon->zones()->attach($request->zones);
                $coupon->zones;
            }

            if ($request->riders) {
                $coupon->riders()->attach($request->riders);
                $coupon->riders;
            }

            if ($request->services) {
                $coupon->services()->attach($request->services);
                $coupon->services;
            }

            if ($request->vehicle_types) {
                $coupon->vehicle_types()->attach($request->vehicle_types);
                $coupon->vehicle_types;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $coupon->setTranslation('title', $locale, $request['title']);
            $coupon->setTranslation('description', $locale, $request['description']);

            DB::commit();
            return to_route('admin.coupon.index')->with('success', __('taxido::static.coupons.create_successfully'));
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $coupon = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();
            if (isset($request['title'])) {
                $coupon->setTranslation('title', $locale, $request['title']);
            }

            if (isset($request['description'])) {
                $coupon->setTranslation('description', $locale, $request['description']);
            }

            [$start_date, $end_date] = parseDateRange($request);
            
            $data = array_diff_key($request, array_flip(['title', 'description', 'locale']));
            $data['title'] = strtoupper($request['title']);
            $data['code'] = strtoupper($request['code']);
            
            $coupon->update($data);

            if (isset($request['zones'])) {
                $coupon->zones()->sync($request['zones']);
                $coupon->zones;
            }

            if (isset($request['riders'])) {
                $coupon->riders()->sync($request['riders']);
                $coupon->riders;
            }

            if (isset($request['services'])) {
                $coupon->services()->sync($request['services']);
                $coupon->services;
            }

            if (isset($request['vehicle_types'])) {
                $coupon->vehicle_types()->sync($request['vehicle_types']);
                $coupon->vehicle_types;
            }
            DB::commit();
            $coupon = $coupon->fresh();

            return to_route('admin.coupon.index')->with('success', __('taxido::static.coupons.update_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $coupon = $this->model->findOrFail($id);
            $coupon->destroy($id);

            return to_route('admin.coupon.index')->with('success', __('taxido::static.coupons.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $coupon = $this->model->findOrFail($id);
            $coupon->update(['status' => $status]);

            return json_encode(["resp" => $coupon]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $coupon = $this->model->onlyTrashed()->findOrFail($id);
            $coupon->restore();

            return redirect()->back()->with('success', __('taxido::static.coupons.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {

            $coupon = $this->model->onlyTrashed()->findOrFail($id);
            $coupon->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.coupons.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
