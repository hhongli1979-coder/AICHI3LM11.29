<?php

namespace Modules\Ticket\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Ticket\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $values = [
            'general' => [
                'ticket_prefix' => 'ID',
                'ticket_suffix' => 'random',
                'ticket_priority' => 1
            ],
            'activation' => [
                'assign_notification_enable' => 1,
                'create_notification_enable' => 1,
                'replied_notification_enable' => 1,
                'status_notification_enable' => 1,
                'ticket_recaptcha_enable' => 1
            ],
            'storage_configuration' => [
                'supported_file_types' => ['pdf', 'csv', 'doc', 'jpeg', 'jpg', 'zip', 'png', 'docx'],
                'max_file_upload' => 6,
                'max_file_upload_size' => 2000000
            ],
            'email' => [
                'mail_host' => 'ENTER_YOUR_HOST',
                'mail_port' => 465,
                'mail_mailer' => 'smtp',
                'mail_username' => 'ENTER_YOUR_USERNAME',
                'mail_password' => 'ENTER_YOUR_PASSWORD',
                'mail_encryption' => 'ssl',
                'mail_from_name' => 'no-reply',
                'mail_from_address' => 'ENTER_YOUR_EMAIL@MAIL.COM',
                'mailgun_domain' => 'ENTER_YOUR_MAILGUN_DOMAIN',
                'mailgun_secret' => 'ENTER_YOUR_MAILGUN_SECRET',
                'system_test_mail' => true,
                'password_reset_mail' => true,
            ],
            'email_piping' => [
                'mail_host' => 'ENTER_YOUR_HOST',
                'mail_port' => 993,
                'mail_username' => 'ENTER_YOUR_USERNAME',
                'mail_password' => 'ENTER_YOUR_PASSWORD',
                'mail_encryption' => 'ssl',
                'mail_protocol' => 'imap',
            ],

        ];

        Setting::updateOrCreate(['values' => $values]);
    }
}
