<?php

namespace Modules\Ticket\Repositories\Api;

use Exception;
use App\Models\User;
use App\Enums\RoleEnum;
use Modules\Ticket\Models\Ticket;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Notification;
use Modules\Ticket\Events\TicketCreatedEvent;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Modules\Ticket\Http\Resources\TicketMessageResource;
use Modules\Ticket\Notifications\TicketCreatedNotification;
use Modules\Ticket\Resources\MessageResource;

class TicketRepository extends BaseRepository
{
    public function model()
    {
        return Ticket::class;
    }

    public function boot()
    {
        try {

            $this->pushCriteria(app(RequestCriteria::class));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function show($ticket)
    {
        try {

            return new TicketMessageResource($ticket);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $userId = getCurrentUserId();
            $ticket = $this->model->create([
                "ticket_number" => $this->generateTicketNumber(),
                'user_id' => $userId,
                'subject' => $request->subject,
                'priority_id' => $request->priority_id,
                'department_id' => $request->department_id,
            ]);

            $message = $ticket->messages()->create([
                'message' => $request->description,
                'created_by_id' => $userId,
                'ticket_id' => $ticket->id,
            ]);

            if ($request->hasFile('attachments')) {
                $files = $request->attachments;
                foreach ($files as $file) {
                    $message->addMedia($file)->toMediaCollection('attachment');
                    $message->media;
                }
            }

            $roleName = getCurrentRoleName();
            if ($roleName === RoleEnum::ADMIN) {
                $admin = User::role(RoleEnum::ADMIN)->first();

                if ($admin->isNotEmpty()) {
                    Notification::send($admin, new TicketCreatedNotification($ticket));
                }
            }

            event(new TicketCreatedEvent($ticket));

            DB::commit();
            return response()->json(['id' => $ticket?->id], 200);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function reply($request, $ticketId)
    {
        DB::beginTransaction();

        try {

            $ticket = $this->model->findOrFail($ticketId);
            $message = $ticket->messages()->create([
                'message' => $request->message,
                'ticket_id' => $ticketId,
                'created_by_id' => getCurrentUserId(),
            ]);

            if ($request->hasFile('attachments')) {
                $files = $request->attachments;
                foreach ($files as $file) {
                    $message->addMedia($file)->toMediaCollection('attachment');
                }
            }

            DB::commit();
            $message->load('media');
            return new MessageResource($message);


        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }


    public function destroy($id)
    {
        try {

            return $this->model->findOrFail($id)->destroy($id);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function generateTicketNumber($digit = 3)
    {
        $index = 0;
        $settings = tx_getSettings();
        $ticket_prefix = $settings['general']['ticket_prefix'];
        $ticketMaxId = Ticket::max('id');
        $numbers = pow(10, $digit) + $index++;
        $ticket_number = $ticket_prefix . ($numbers + $ticketMaxId);
        return $ticket_number;
    }
}
