<?php

namespace Modules\Ticket\Console;

use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Console\Command;
use Webklex\IMAP\Facades\Client;
use Modules\Ticket\Models\Ticket;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Models\Message;
use Illuminate\Support\Facades\Mail;
use Modules\Ticket\Models\Department;
use Modules\Ticket\Events\TicketCreatedEvent;
use Modules\Ticket\Mail\TicketCreated as CreatedTicketMail;

class Piping extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'command:piping';

    /**
     * The console command description.
     */
    protected $description = 'Tickets From email';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $departments = Department::get();

        foreach ($departments as $department) {
            $credentials = ($department->imap_credentials['imap_default_account'] == 'custom')
                ? $department->imap_credentials
                : 'default';

            $this->connectEmailPiping($credentials, $department->imap_credentials['account_name'] ?? null);
        }
        $this->info('Processing complete.');
    }

    protected function connectEmailPiping($credentials, $accountName = null)
    {
        $client = ($credentials == 'default')
            ? Client::account('default')
            : Client::account($accountName);

        $client->connect();
        $folders = $client->getFolders();

        foreach ($folders as $folder) {
            $allMessages = $folder->messages()->all()->whereUnseen()->get();
            foreach ($allMessages as $oMessage) {
                $this->processMessage($oMessage, $folder);
            }
        }
    }

    protected function processMessage($oMessage, $folder)
    {
        $from = $oMessage->getFrom();
        $fromData = head($from);
        $body = $oMessage->getHTMLBody();
        $email = $fromData->mail;

        $registerUser = User::where('email', $email)?->first();
        $directTicket = Ticket::where('email', $email)?->orWhere('user_id', $registerUser->id ?? null)?->first();
        if ($registerUser || $directTicket) {
            $this->handleExistingTicket($oMessage, $directTicket, $folder);
        } else {
            $this->handleNewTicket($oMessage, $fromData, $body, $folder);
        }
    }

    protected function handleExistingTicket($oMessage, $directTicket, $folder)
    {
        if (head($oMessage->getFrom())?->mail !== auth()?->user()?->email) {

            $messageIdObj = $oMessage->getMessageId();

            if(!empty($messageIdObj) && isset($messageIdObj[0])){
                $messageId = $messageIdObj[0];
            }

            if ($messageId && !Message::where('message_id', $messageId)?->exists()) {
                DB::transaction(function () use ($oMessage, $directTicket, $messageId) {
                    $message = Message::create([
                        'ticket_id' => $directTicket?->id,
                        'message' => $oMessage->getHTMLBody(),
                        'created_by_id' => $this->getUserId($oMessage->getFrom()[0]->mail),
                        'message_id' => $messageId,
                    ]);

                    $this->handleAttachments($oMessage, $message);
                });

                // Mark as seen or move the message
                // $oMessage->setFlag('SEEN');
            }
        }
    }

    protected function handleNewTicket($oMessage, $fromData, $body, $folder)
    {
        if (head($oMessage->getFrom())?->mail !== auth()?->user()?->email) {
            $messageIdObj = $oMessage->getMessageId();

            if(!empty($messageIdObj) && isset($messageIdObj[0])){
                $messageId = $messageIdObj[0];
            }

                DB::transaction(function () use ($oMessage, $fromData, $body, $folder, $messageId) {

                    $ticket_number = $this->generateTicketNumber();
                    $settings = tx_getSettings();

                    $newTicket = Ticket::create([
                        'ticket_number' => $ticket_number,
                        'name' => $fromData->personal,
                        'email' => $fromData->mail,
                        'subject' => $oMessage->getSubject(),
                        'priority_id' => $settings['general']['ticket_priority'],
                    ]);

                    if ($messageId && !Message::where('message_id', $messageId)->exists()) {
                        $message = Message::create([
                            'ticket_id' => $newTicket->id,
                            'message' => $body,
                            'message_id' => $messageId,
                            'created_by_id' => null,
                        ]);
                    }

                    $this->handleAttachments($oMessage, $message);

                    if ($settings['activation']['create_notification_enable']) {
                        Mail::mailer('ticket_email')->to($newTicket->email)->send(new CreatedTicketMail($newTicket));
                    }

                    event(new TicketCreatedEvent($newTicket));

                    // Mark as seen
                    $oMessage->setFlag('Seen');
                });
        }
    }

    protected function handleAttachments($oMessage, $message)
    {
        $oMessage->getAttachments()->each(function ($attachment) use ($message) {
            $tempFilePath = tempnam(sys_get_temp_dir(), 'attachment_');
            file_put_contents($tempFilePath, $attachment->getContent());

            $message->addMedia($tempFilePath)
                ->usingFileName($attachment->getName())
                ->toMediaCollection('attachment');
        });
    }

    protected function getUserId($email)
    {
        $user = User::where('email', $email)->first();
        return $user ? $user->id : null;
    }

    protected function trim($value)
    {
        return Str::between($value, '#', ' ');
    }

    protected function generateTicketNumber()
    {
        $settings = tx_getSettings();
        $ticket_prefix = $settings['general']['ticket_prefix'];
        $ticket_suffix = $settings['general']['ticket_suffix'];

        $i = 0;
        $digit = 3;

        do {
            if ($ticket_suffix == 'incremental') {

                $ticket_number = pow(10, $digit) + $i++;
                $id = $ticket_prefix.$ticket_number;

            } else{

                $ticket_number = rand(pow(10, $digit), pow(10, ++$digit));
                $id = $ticket_prefix.$ticket_number;

            }

        } while (Ticket::where('ticket_number','=',$id)->exists());
        return $id;
    }
}
