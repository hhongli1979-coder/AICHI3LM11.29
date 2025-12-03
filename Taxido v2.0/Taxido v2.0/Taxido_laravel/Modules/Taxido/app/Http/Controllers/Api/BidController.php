<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Bid;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Repositories\Api\BidRepository;
use Modules\Taxido\Http\Requests\Api\CreateBidRequest;
use Modules\Taxido\Http\Requests\Api\UpdateBidRequest;
use Modules\Taxido\Http\Resources\Riders\BidResource;

class BidController extends Controller
{
    public $repository;

    public function __construct(BidRepository $repository)
    {
        $this->authorizeResource(Bid::class, 'bid');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $bids = $this->repository->whereNull('deleted_at')->whereNull('status');
            $bids = $this->filter($bids, $request);
            $bids = $bids->latest('created_at')->simplePaginate($request->paginate ?? $bids->count() ?: null);
            return BidResource::collection($bids ?? []);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Bid $bid)
    {
        return $this->repository->show($bid?->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bid $bid)
    {
       //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateBidRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBidRequest $request, Bid $bid)
    {
        return $this->repository->update($request->all(), $bid->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bid $bid)
    {
        //
    }

    public function filter($bids, $request)
    {
        if ($request->field && $request->sort) {
            $bids = $bids->orderBy($request->field, $request->sort);
        }

        if ($request->ride_request_id) {
            $bids = $bids->where('ride_request_id', $request->ride_request_id);
        }

        if ($request->start_date && $request->end_date) {
            $bids = $bids->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        return $bids;
    }
}
