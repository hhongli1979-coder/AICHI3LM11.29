<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Ticket\Models\Rating;
use Modules\Ticket\Tables\RatingTable;
use Modules\Ticket\Repositories\Admin\RatingRepository;
use Modules\Ticket\Http\Requests\Admin\CreateRatingRequest;
use Modules\Ticket\Http\Requests\Admin\UpdateRatingRequest;

class RatingController extends Controller
{
    private $repository;

    public function __construct(RatingRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(RatingTable $ratingTable)
    {
        return $this->repository->index($ratingTable->generate());
    }

    public function create()
    {
        //
    }

    public function store(CreateRatingRequest $request)
    {
        return $this->repository->store($request);
    }

    public function show(Rating $rating)
    {
        //
    }

    public function edit(Rating $rating)
    {
        //
    }

    public function update(UpdateRatingRequest $request, Rating $rating)
    {
        //
    }

    public function status(Request $request, $id)
    {
        //
    }

    public function destroy(Rating $rating)
    {
        //
    }

    public function restore($id)
    {
        //
    }

    public function forceDelete($id)
    {
        //
    }

    public function getTicketStatus($id)
    {
        return $this->repository->getTicketStatus($id);
    }
}
