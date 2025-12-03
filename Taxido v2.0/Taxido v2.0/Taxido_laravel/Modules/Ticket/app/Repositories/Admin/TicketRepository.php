<?php
    namespace Modules\Ticket\Repositories\Admin;
    use Exception;
    use App\Models\User;
    use Modules\Ticket\Models\Ticket;
    use Modules\Ticket\Models\Status;
    use Illuminate\Support\Facades\DB;
    use Modules\Ticket\Models\Message;
    use Modules\Ticket\Models\Priority;
    use Modules\Ticket\Models\FormField;
    use App\Exceptions\ExceptionHandler;
    use Illuminate\Support\Facades\Mail;
    use Modules\Ticket\Models\Department;
    use Illuminate\Support\Facades\Response;
    use Modules\Ticket\Events\TicketAssignedEvent;
    use Modules\Ticket\Events\TicketCreatedEvent;
    use Modules\Ticket\Models\DepartmentUser;
    use Prettus\Repository\Eloquent\BaseRepository;
    use Spatie\MediaLibrary\MediaCollections\Models\Media;
    use  Modules\Ticket\app\Mail\TicketCreated as CreatedTicketMail;



    class TicketRepository extends BaseRepository
    {
        protected $ticket_status;
        protected $priority;
        protected $department;
        protected $user;

        public function model()
        {
            $this->ticket_status = new Status();
            $this->department = new Department();
            $this->priority = new Priority();
            $this->user = new User();
            return Ticket::class;
        }

        public function index($ticketTable)
        {
            if (request()['action']) {
                return redirect()->back();
            }

            return view('ticket::admin.ticket.index', ['tableConfig' => $ticketTable]);
        }

        public function create($attributes = [])
        {
            $formFields = FormField::where('system_reserve', 0)->where('status', 1)->whereNull('deleted_at')->get();
            $priorities = $this->priority->get();
            $statuses = Status::get();
            $settings = tx_getSettings();
            $users = DB::table('users')->whereNull('deleted_at')->get();
            return view('ticket::admin.ticket.create', ['formFeilds' => $formFields, 'priorities' => $priorities, 'statuses' => $statuses, 'settings' => $settings, 'users' => $users]);
        }

        public function store($request)
        {
            DB::beginTransaction();
            try {
                $otherInputFields = $this->isOtherInputFields($request);

                foreach ($request->user_ids as $userId) {
                    $ticket = $this->model->create([
                        "ticket_number" => $this->generateTicketNumber(),
                        "user_id" => $userId,
                        "subject" => $request->subject,
                        "other_testing" => $otherInputFields ?? null,
                        "department_id" => $request->department_id,
                        "priority_id"   => $request->priority_id,
                        "created_by_id" => getCurrentUserId(),
                    ]);

                    $message = $ticket->messages()->create([
                        'message' => $request->description,
                        'created_by_id' => $userId,
                    ]);

                    if ($request->hasFile('attachments')) {
                        $files = $request->attachments;
                        foreach ($files as $file) {
                            $message->addMedia($file)->toMediaCollection('attachment');
                            $message->media;
                        }
                    }

                    DB::commit();

                    $settings = tx_getSettings();

                    // user
                    if ($settings['activation']['create_notification_enable']) {
                        Mail::mailer('ticket_email')->to($ticket->user->email)->send(new CreatedTicketMail($ticket));
                    }

                    event(new TicketCreatedEvent($ticket));
                }
                return to_route('admin.ticket.index')->with('success', __('ticket::static.ticket.create_successfully'));

            } catch (Exception $e) {

                DB::rollBack();
                throw new ExceptionHandler($e->getMessage(), $e->getCode());
            }
        }

        public function reply($ticket)
        {
            $department = $this->model->where('id', $ticket->id)->pluck('department_id')->first();
            $users = $this->getUsers($department);
            $replies = Message::where('ticket_id', $ticket->id)->orderBy('id', 'desc')->get();
            return view('ticket::admin.ticket.reply', ['ticket' => $ticket, 'replies' => $replies, 'users' => $users]);
        }

        public function assign($request)
        {
            try {
                $ticket = $this->model->findOrFail($request->ticket_id);
                $assigned_users = explode(',', $request->user_id);
                if ($request->note) {
                    $ticket->note = $request->note;
                }
                $ticket->priority_id = $request->priority_id;
                $ticket->assigned_tickets()->syncWithoutDetaching($assigned_users);
                $ticket->save();
                $ticket->refresh();

                event(new TicketAssignedEvent($ticket));

                return redirect()->back()->with('success', __('ticket::static.ticket.ticket_assigned'));

            } catch (Exception $e) {

                throw new ExceptionHandler($e->getMessage(), $e->getCode());
            }
        }

        public function destroy($id)
        {
            try {

                $ticket = $this->model->findOrFail($id);
                $ticket->destroy($id);

                return to_route('admin.ticket.index')->with('success', __('ticket::static.ticket.delete_successfully'));

            } catch (Exception $e) {

                throw new ExceptionHandler($e->getMessage(), $e->getCode());
            }
        }

        public function restore($id)
        {
            try {

                $ticket = $this->model->onlyTrashed()->findOrFail($id);
                $ticket->restore();

                return to_route('admin.ticket.index')->with('success', __('ticket::static.ticket.restore_successfully'));
            } catch (Exception $e) {

                throw new ExceptionHandler($e->getMessage(), $e->getCode());

            }
        }

        public function forceDelete($id)
        {
            try {

                $ticket = $this->model->findOrFail($id);
                $ticket->forceDelete();

                return to_route('admin.ticket.index')->with('success', __('ticket::static.ticket.permanent_delete_successfully'));
            } catch (Exception $e) {

                throw new ExceptionHandler($e->getMessage(), $e->getCode());

            }
        }

        public function download($mediaId)
        {
            $media = Media::findOrFail($mediaId);

            $path = $media->getPath();

            $fileName = $media->file_name;

            return Response::download($path, $fileName);
        }

        public function isOtherInputFields($request)
        {
            foreach ($request->all() as $key => $value) {
                if (strpos($key, 'other') === 0) {
                    $new_key                    = substr($key, 6);
                    $otherInputFields[$new_key] = $value;
                }
            }

            return $otherInputFields ?? null;
        }

        public function generateTicketNumber($digit = 3)
        {
            $settings      = tx_getSettings();
            $ticket_prefix = $settings['general']['ticket_prefix'];
            $ticket_suffix = $settings['general']['ticket_suffix'];

            $index = 0;
            do {
                if ($ticket_suffix == 'incremental') {

                    $numbers       = pow(10, $digit) + $index++;
                    $ticket_number = $ticket_prefix . $numbers;

                } else {

                    $numbers       = rand(pow(10, $digit), pow(10, ++$digit));
                    $ticket_number = $ticket_prefix . $numbers;

                }

            } while ($this->model->where('ticket_number', '=', $ticket_number)->exists());

            return $ticket_number;
        }

        public function checkAllowedExtension($extension)
        {
            $settings           = tx_getSettings();
            $allowed_extensions = $settings['storage_configuration']['supported_file_types'];
            return in_array($extension, $allowed_extensions);
        }

        protected function getUsers($department)
        {
            $users    = [];
            $user_ids = DepartmentUser::where('department_id', $department)->pluck('user_id');
            foreach ($user_ids as $id) {
                $users[] = User::where('id', $id)?->whereNull('deleted_at')->first();
            }
            return $users;
        }

    }
