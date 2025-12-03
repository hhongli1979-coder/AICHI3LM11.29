<?php

namespace Modules\Taxido\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Modules\Taxido\Models\DriverDocument;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Notifications\Messages\MailMessage;

class NotifyDriverDocStatusNotification extends Notification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $document;

    public function __construct(DriverDocument $document)
    {
        $this->document = $document;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $documentName = optional($this->document->document)->name ?? 'Document';
        $statusText = $this->getStatusMessage($this->document->status);

        return (new MailMessage)
            ->subject("Document Status {$statusText}")
            ->line("Your document '{$documentName}' {$statusText}.");
    }

    public function toArray(object $notifiable): array
    {
        $documentName = optional($this->document->document)->name ?? 'Document';
        $statusText = $this->getStatusMessage($this->document->status);

        return [
            'title' => "Document Status {$statusText}",
            'message' => "Your document '{$documentName}' {$statusText}.",
            'type' => 'driver_document_status'
        ];
    }

    protected function getStatusMessage(string $status): string
    {
        return match (strtolower($status)) {
            'approved' => 'has been approved',
            'rejected' => 'has been rejected',
            'pending'  => 'is pending review',
            'expired'  => 'has been expired',
            default    => "status is now " . ucfirst($status),
        };
    }
}
