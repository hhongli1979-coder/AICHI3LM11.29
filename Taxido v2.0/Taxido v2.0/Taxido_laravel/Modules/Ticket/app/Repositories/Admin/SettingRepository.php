<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use App\Mail\TestMail;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Models\Setting;
use Modules\Ticket\Models\Priority;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;
use Prettus\Repository\Eloquent\BaseRepository;

class SettingRepository extends BaseRepository
{
    protected $priority;

    function model()
    {
        $this->priority = new Priority();
        return Setting::class;
    }
    public function index()
    {
        $settings = $this->model->pluck('values')->first();
        $settingId = $this->model->pluck('id')->first();
        $priorities = $this->priority->get();
        return view('ticket::admin.setting.index', ['settings' => $settings, 'settingId' => $settingId, 'priorities' => $priorities]);
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $settings = $this->model->findOrFail($id);
            $request['email']['mail_password'] = decryptKey($request['email']['mail_password']);

            if ($request['mail']) {
                return $this->test($request);
            }

            $request = array_diff_key($request, array_flip(['_token', '_method']));

            $settings->update([
                'values' => $request,
            ]);

            $this->env($request);

            DB::commit();
            return to_route('admin.ticket.setting.index')->with('success', __('Settings Updated Successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function test($request)
    {
        try {

            Config::set('mail.default', $request['email']['mail_mailer'] ?? 'smtp');
            if ($request['email']['mail_mailer'] == 'smtp' || $request['email']['mail_mailer'] == 'sendmail') {
                Config::set('mail.mailers.ticket_email.host', $request['email']['mail_host'] ?? '');
                Config::set('mail.mailers.ticket_email.port', $request['email']['mail_port'] ?? 465);
                Config::set('mail.mailers.ticket_email.encryption', $request['email']['mail_encryption'] ?? 'ssl');
                Config::set('mail.mailers.ticket_email.username', $request['email']['mail_username'] ?? '');
                Config::set('mail.mailers.ticket_email.password', $request['email']['mail_password'] ?? '');
                Config::set('mail.from.name', $request['email']['mail_from_name'] ?? env('APP_NAME'));
                Config::set('mail.from.address', $request['email']['mail_from_address'] ?? '');
            }

            Mail::to($request['mail'])->queue(new TestMail());

            return json_encode(['success' => true, 'message' => 'Mail Send Successfully']);
        } catch (Exception $e) {

            return json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function env($value)
    {
        try {
            if (isset($value['email'])) {
                DotenvEditor::setKeys([
                    'TICKET_MAIL_MAILER' => $value['email']['mail_mailer'],
                    'TICKET_MAIL_HOST' => $value['email']['mail_host'],
                    'TICKET_MAIL_PORT' => $value['email']['mail_port'],
                    'TICKET_MAIL_USERNAME' => $value['email']['mail_username'],
                    'TICKET_MAIL_PASSWORD' => $value['email']['mail_password'],
                    'TICKET_MAIL_ENCRYPTION' => $value['email']['mail_encryption'],
                    'TICKET_MAIL_FROM_ADDRESS' => $value['email']['mail_from_address'],
                    'TICKET_MAIL_FROM_NAME' => $value['email']['mail_from_name'],
                ]);

                DotenvEditor::save();
            }

            if (isset($value['email_piping'])) {
                DotenvEditor::setKeys([
                    'IMAP_HOST' => $value['email_piping']['mail_host'],
                    'IMAP_PORT' => $value['email_piping']['mail_port'],
                    'IMAP_USERNAME' => $value['email_piping']['mail_username'],
                    'IMAP_PASSWORD' => $value['email_piping']['mail_password'],
                    'IMAP_ENCRYPTION' => $value['email_piping']['mail_encryption'],
                    'IMAP_PROTOCOL' => $value['email_piping']['mail_protocol'],
                    'IMAP_DEFAULT_ACCOUNT' => 'default',
                ]);

                DotenvEditor::save();
            }

            if (isset($value['google_reCaptcha'])) {
                DotenvEditor::setKeys([
                    'TICKET_GOOGLE_RECAPTCHA_SECRET' => encryptKey($value['google_reCaptcha']["secret"]),
                    'TICKET_GOOGLE_RECAPTCHA_KEY' => encryptKey($value['google_reCaptcha']["site_key"]),
                ]);

                DotenvEditor::save();
            }
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
