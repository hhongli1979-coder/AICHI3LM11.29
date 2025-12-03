<?php

namespace Modules\Taxido\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Queue\SerializesModels;
use Modules\Taxido\Models\ReferralBonus;

class ReferralBonusCreditedNotification extends Notification implements ShouldQueue
{
    use Queueable, SerializesModels;

    private ReferralBonus $referralBonus;
    private string $roleName;
    private string $language;

    /**
     * Create a new notification instance.
     *
     * @param ReferralBonus $referralBonus
     * @param string $roleName
     * @param string $language
     */
    public function __construct(ReferralBonus $referralBonus, string $roleName, string $language = 'en')
    {
        $this->referralBonus = $referralBonus;
        $this->roleName = $roleName;
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

        $subject = __('taxido::static.referral_bonus.email.subject', $placeholders);
        $greeting = __('taxido::static.referral_bonus.email.greeting', $placeholders);
        $body = __('taxido::static.referral_bonus.email.body', $placeholders);
        $details = __('taxido::static.referral_bonus.email.details', $placeholders);
        $bonusAmount = __('taxido::static.referral_bonus.email.bonus_amount', $placeholders);
        $referredType = __('taxido::static.referral_bonus.email.referred_type', $placeholders);
        $referredName = __('taxido::static.referral_bonus.email.referred_name', $placeholders);
        $rideAmount = __('taxido::static.referral_bonus.email.ride_amount', $placeholders);
        $footer = __('taxido::static.referral_bonus.email.footer', $placeholders);
        $salutation = __('taxido::static.referral_bonus.email.salutation', $placeholders);

        return (new MailMessage)
            ->subject($subject)
            ->greeting($greeting)
            ->line($body)
            ->line($details)
            ->line($bonusAmount)
            ->line($referredType)
            ->line($referredName)
            ->line($rideAmount)
            ->line($footer)
            ->salutation($salutation);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function toArray($notifiable): array
    {
        $referredType = ucfirst($this->referralBonus->referred_type);
        $bonusAmount = number_format($this->referralBonus->referrer_bonus_amount, 2);
        $referredName = $this->referralBonus->referred?->name ?? 'User';

        if ($this->referralBonus->isReferrerRider()) {
            $title = "🎉 Referral Bonus Earned!";
            $message = "Congrats! You earned {$bonusAmount} for referring {$referredName} ({$referredType})! 💰🚀";
        } else {
            $title = "💰 Referral Bonus Credited!";
            $message = "Great job! {$bonusAmount} added to your wallet for referring a {$referredType}! 🎊🚗";
        }

        return [
            'title' => $title,
            'message' => $message,
            'type' => 'referral_bonus',
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

        return [
            'referrer_name' => $this->referralBonus->referrer?->name ?? 'User',
            'bonus_amount' => number_format($this->referralBonus->referrer_bonus_amount, 2),
            'referred_type' => ucfirst($this->referralBonus->referred_type),
            'referred_name' => $this->referralBonus->referred?->name ?? 'User',
            'ride_amount' => number_format($this->referralBonus->ride_amount, 2),
            'referrer_percentage' => $this->referralBonus->referrer_percentage,
            'company_name' => $companyName,
        ];
    }
}
