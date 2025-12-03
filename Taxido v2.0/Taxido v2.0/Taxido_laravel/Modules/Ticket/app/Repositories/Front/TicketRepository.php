<?php

namespace Modules\Ticket\Repositories\Front;

use Exception;
use App\Models\User;
use App\Models\LandingPage;
use Modules\Ticket\Models\Status;
use Modules\Ticket\Models\Ticket;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Enums\RoleEnum;
use Modules\Ticket\Models\Priority;
use Illuminate\Support\Facades\Log;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Mail;
use Modules\Ticket\Models\FormField;
use Modules\Ticket\Models\Department;
use Illuminate\Support\Facades\Session;
use Modules\Ticket\Events\TicketCreatedEvent;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Ticket\Mail\TicketCreated as CreatedTicketMail;

class TicketRepository extends BaseRepository
{
    protected $priority;
    protected $department;
    protected $user;
    protected $ticket_status;

    function model()
    {
        $this->ticket_status = new Status();
        $this->department = new Department();
        $this->priority = new Priority();
        $this->user = new User();
        return Ticket::class;
    }

    public function create($attributes = [])
    {
        $formFields = FormField::where('system_reserve', 0)->where('status', 1)->get();
        $statuses = Status::get();
        $settings = tx_getSettings();
        $users = User::whereNull('deleted_at')->whereHas('roles', function ($query) {
            $query->where('name', '=', RoleEnum::USER);
        })->get();
        $locale = Session::get('front-locale', getDefaultLangLocale());
        $content = LandingPage::first();
        $content = $content ? $content->toArray($locale) : [];

        $content = $content['content'];
        return view('ticket::frontend.ticket.create', ['formFeilds' => $formFields, 'statuses' => $statuses, 'settings' => $settings, 'users' => $users, 'content' => $content]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $otherInputFields = $this->isOtherInputFields($request);

            $ticket = $this->model->create([
                "ticket_number" => $this->generateTicketNumber(),
                "name" => $request->name,
                "email" => $request->email,
                "subject" => $request->subject,
                "other_testing" => $otherInputFields ?? null,
                "department_id" => $request->department_id,
                "priority_id" => $request->priority_id,
                "created_by_id" => getCurrentUserId() ?? null
            ]);

            $message = $ticket->messages()->create([
                'message' => $request->description,
                'created_by_id' => $ticket->created_by_id
            ]);

            if ($request->hasFile('image')) {
                $fileAdders = $message->addMultipleMediaFromRequest(['image'])
                    ->each(function ($fileAdder) {
                        $fileAdder->toMediaCollection('attachment');
                    });
            }

            DB::commit();

            $settings = tx_getSettings();

            // user
            try {
                if ($settings['activation']['create_notification_enable']) {
                    Mail::mailer('ticket_email')->to($ticket->email)->send(new CreatedTicketMail($ticket));
                }

            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
         

            event(new TicketCreatedEvent($ticket));

            return redirect()->back();
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function isOtherInputFields($request)
    {
        foreach ($request->all() as $key => $value) {
            if (strpos($key, 'other') === 0) {
                $new_key = substr($key, 6);
                $otherInputFields[$new_key] = $value;
            }
        }

        return $otherInputFields ?? null;
    }

    public function generateTicketNumber($digit = 3)
    {
        $settings = tx_getSettings();
        $ticket_prefix = $settings['general']['ticket_prefix'];
        $ticket_suffix = $settings['general']['ticket_suffix'];

        $index = 0;
        do {
            if ($ticket_suffix == 'incremental') {

                $numbers = pow(10, $digit) + $index++;
                $ticket_number = $ticket_prefix . $numbers;
            } else {

                $numbers = rand(pow(10, $digit), pow(10, ++$digit));
                $ticket_number = $ticket_prefix . $numbers;
            }
        } while ($this->model->where('ticket_number', '=', $ticket_number)->exists());


        return $ticket_number;
    }
}
