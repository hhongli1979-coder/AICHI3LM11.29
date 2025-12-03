<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Modules\Ticket\Models\Ticket;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Models\Message;
use Illuminate\Support\Facades\Log;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Mail;
use Modules\Ticket\Events\TicketRepliedEvent;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Ticket\Mail\TicketReplied as MailReplied;

class MessageRepository extends BaseRepository
{
    function model()
    {
        return Message::class;
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $message = $this->model->create([
                'created_by_id' => getCurrentUserId(),
                'ticket_id' => $request->ticket_id,
                'message' => $request->message,
                'reply_id' => $request->reply_id ?? null
            ]);

            $ticket = Ticket::with('ticketStatus')->findOrFail($request->ticket_id);
            $ticket->update(['ticket_status_id' => $request->ticket_status]);
            if ($request->hasFile('image')) {
                $fileAdders = $message->addMultipleMediaFromRequest(['image'])->each(function ($fileAdder) {
                    $fileAdder->toMediaCollection('attachment');
                });
            }

            DB::commit();
            $message = $message->fresh();
            try {

                if ($message->ticket->email ?? $message?->ticket?->user?->email){
                    Mail::mailer('ticket_email')->to($message->ticket->email ?? $message->ticket->user->email)->send(new MailReplied($message));
                    event(new TicketRepliedEvent($message));
                }

            } catch (Exception $e) {
                Log::error($e->getMessage());
            }

            $isClosed = $ticket->ticketStatus && $ticket->ticketStatus->name === 'Closed';
            return response()->json(['status' => $isClosed ? 'closed' : 'open'], 200);

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
