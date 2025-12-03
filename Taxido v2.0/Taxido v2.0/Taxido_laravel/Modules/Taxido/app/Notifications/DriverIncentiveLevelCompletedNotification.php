<?php

namespace Modules\Taxido\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;
use Modules\Taxido\Models\Incentive;
use Modules\Taxido\Models\IncentiveLevel;

class DriverIncentiveLevelCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    private Incentive $incentive;
    private string $language;

    /**
     * Create a new notification instance.
     *
     * @param Incentive $incentive
     * @param string $language
     */
    public function __construct(Incentive $incentive, string $language = 'en')
    {
        $this->incentive = $incentive;
        $this->language = $language;
        app()->setLocale($language);
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param mixed $notifiable
     * @return MailMessage
     */
    public function toMail($notifiable): MailMessage
    {
        $placeholders = $this->getPlaceholders();

        $subject = __('taxido::static.incentive_level.email.subject', $placeholders);
        $greeting = __('taxido::static.incentive_level.email.greeting', $placeholders);
        $body = __('taxido::static.incentive_level.email.body', $placeholders);
        $details = __('taxido::static.incentive_level.email.details', $placeholders);
        $levelNumber = __('taxido::static.incentive_level.email.level_number', $placeholders);
        $targetRides = __('taxido::static.incentive_level.email.target_rides', $placeholders);
        $bonusAmount = __('taxido::static.incentive_level.email.bonus_amount', $placeholders);
        $periodType = __('taxido::static.incentive_level.email.period_type', $placeholders);
        $footer = __('taxido::static.incentive_level.email.footer', $placeholders);
        $salutation = __('taxido::static.incentive_level.email.salutation', $placeholders);

        $mailMessage = (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($body)
            ->line($details)
            ->line($levelNumber)
            ->line($targetRides)
            ->line($bonusAmount)
            ->line($periodType);

        // Add next level information if available
        if (!empty($placeholders['next_level_number'])) {
            $nextLevel = __('taxido::static.incentive_level.email.next_level', $placeholders);
            $mailMessage->line($nextLevel);
        }

        $mailMessage->line($footer)
            ->salutation($salutation);

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable): array
    {
        $levelNumber = $this->incentive->level_number;
        $bonusAmount = number_format($this->incentive->bonus_amount, 2);
        $targetRides = $this->incentive->target_rides;

        // Level-specific messages with emojis
        $messages = [
            1 => [
                'title' => "🎯 Level 1 Complete!",
                'message' => "Amazing start! You earned {$bonusAmount} for completing {$targetRides} rides! Keep going! 🚀"
            ],
            2 => [
                'title' => "🔥 Level 2 Unlocked!",
                'message' => "You're on fire! {$bonusAmount} earned for {$targetRides} rides! Next level awaits! 💪"
            ],
            3 => [
                'title' => "⭐ Level 3 Achieved!",
                'message' => "Superstar! {$bonusAmount} is yours for {$targetRides} rides! You're unstoppable! 🌟"
            ],
            4 => [
                'title' => "🏆 Level 4 Mastered!",
                'message' => "Elite driver! {$bonusAmount} earned for {$targetRides} rides! Almost at the top! 👑"
            ],
        ];

        // Default message for level 5 and above
        $default = [
            'title' => "👑 Level {$levelNumber} Conquered!",
            'message' => "Legendary! {$bonusAmount} for {$targetRides} rides! You're a champion! 🎊🚗"
        ];

        $messageData = $messages[$levelNumber] ?? $default;

        return [
            'title' => $messageData['title'],
            'message' => $messageData['message'],
            'type' => 'incentive_level',
        ];
    }

    /**
     * Get placeholders for email template.
     *
     * @return array
     */
    private function getPlaceholders(): array
    {
        $companyName = config('app.name', 'Taxido');
        $incentiveLevel = $this->incentive->incentiveLevel;

        $placeholders = [
            'driver_name' => $this->incentive->driver?->name ?? 'Driver',
            'level_number' => $this->incentive->level_number,
            'target_rides' => $this->incentive->target_rides,
            'bonus_amount' => number_format($this->incentive->bonus_amount, 2),
            'period_type' => ucfirst($this->incentive->period_type ?? 'daily'),
            'company_name' => $companyName,
        ];

        // Get next level information if available
        if ($incentiveLevel) {
            $nextLevel = IncentiveLevel::where('vehicle_type_zone_id', $incentiveLevel->vehicle_type_zone_id)
                ->where('period_type', $incentiveLevel->period_type)
                ->where('level_number', $incentiveLevel->level_number + 1)
                ->where('is_active', true)
                ->first();

            if ($nextLevel) {
                $placeholders['next_level_number'] = $nextLevel->level_number;
                $placeholders['next_level_target'] = $nextLevel->target_rides;
                $placeholders['next_level_bonus'] = number_format($nextLevel->incentive_amount, 2);
            }
        }

        return $placeholders;
    }
}
