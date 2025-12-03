<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Modules\Ticket\Models\Rating;
use Modules\Ticket\Models\Ticket;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class RatingRepository extends BaseRepository
{
    function model()
    {
        return Rating::class;
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            
            $distributeRatings = $this->distributeRatings($request);
            foreach ($distributeRatings as $ratings) {
                $ratings = $this->model->create($ratings);
            }
            
            DB::commit();

            return redirect()->back()->with('success', __('ticket::static.rating.create_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function distributeRatings($request)
    {
        $tickets = Ticket::where('id', $request->ticket_id)->first();
        $distributeRatings = [];
        foreach ($tickets->assigned_tickets as $assignedUsers)
        {
            $ratings['user_id'] = $assignedUsers->id;
            $ratings['ticket_id'] = $request->ticket_id;
            $ratings['rating'] = $request->rating;
            $distributeRatings[] = $ratings;
        }
        return $distributeRatings;
    }

    public function getTicketStatus($id)
    {
        $ticketStatus = Ticket::where('id',$id)->first();

        if ($ticketStatus->ticketStatus->name == 'Closed') {
            $checkTicketRatings = $this->model->where('ticket_id', $id)->first();
            if (!$checkTicketRatings) {
                return true;
            }
        }
    }
}