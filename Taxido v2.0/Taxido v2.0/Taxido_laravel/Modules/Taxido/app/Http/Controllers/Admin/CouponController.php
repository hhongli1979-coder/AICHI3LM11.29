<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Coupon;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\CouponTable;
use Modules\Taxido\Repositories\Admin\CouponRepository;
use Modules\Taxido\Http\Requests\Admin\CreateCouponRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateCouponRequest;

class CouponController extends Controller
{
    public $repository;

    public function __construct(CouponRepository $repository)
    {
        $this->authorizeResource(Coupon::class, 'coupon');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(CouponTable $couponTable)
    {
        return $this->repository->index($couponTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.coupon.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateCouponRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Coupon $coupon)
    {
        return view('taxido::admin.coupon.edit', ['coupon' => $coupon]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCouponRequest $request, Coupon $coupon)
    {
        return $this->repository->update($request->all(), $coupon->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coupon $coupon)
    {
        return $this->repository->destroy($coupon->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        return $this->repository->restore($id);
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
