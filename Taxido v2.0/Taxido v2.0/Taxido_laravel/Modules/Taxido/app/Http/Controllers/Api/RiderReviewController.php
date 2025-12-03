<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\RiderReview;
use Modules\Taxido\Http\Requests\Api\CreateReviewRequest;
use Modules\Taxido\Http\Requests\Api\UpdateReviewRequest;
use Modules\Taxido\Http\Resources\Riders\RiderReviewResource;
use Modules\Taxido\Repositories\Api\RiderReviewRepository;

class RiderReviewController extends Controller
{
    public $repository;

    public function __construct(RiderReviewRepository $repository)
    {
        $this->authorizeResource(RiderReview::class, 'riderReview');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $reviews = $this->filter($this->repository, $request);
        $reviews = $reviews->latest('created_at')->simplePaginate($request->paginate ?? $this->repository->count() ?: null);
        return RiderReviewResource::collection($reviews ?? []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateReviewRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(RiderReview $riderReview)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, $id)
    {
        return $this->repository->update($request->all(), $id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, RiderReview $riderReview)
    {
        return $this->repository->destroy($riderReview->id);
    }

    public function deleteAll(Request $request)
    {
        return $this->repository->deleteAll($request->ids);
    }

    public function filter($reviews, $request)
    {
        if (isUserLogin()) {
            $roleName = getCurrentRoleName();
            if ($roleName == RoleEnum::DRIVER) {
                $reviews = $reviews->where('driver_id', auth()->user()->id);
            } else {
                $reviews = $reviews->where('rider_id', auth()->user()->id);
            }
        }

        if ($request->ride_id) {
            $reviews = $reviews->where('ride_id', $request->ride_id);
        }

        if ($request->field && $request->sort) {
            $reviews = $reviews->orderBy($request->field, $request->sort);
        }

        return $reviews;
    }
}
