<?php

namespace App\Repositories\Admin;

use Exception;
use App\Mail\TestMail;
use App\Enums\TimeZone;
use App\Models\Setting;
use App\Models\Language;
use App\Models\Currency;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Session;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;
use Prettus\Repository\Eloquent\BaseRepository;

class SettingRepository extends BaseRepository
{
    public function model()
    {
        return Setting::class;
    }

    public function index()
    {
        return view('admin.setting.index', [
            'settings'  => getSettings(),
            'id'        => $this->model->pluck('id')->first(),
            'timeZones' => TimeZone::cases(),
        ]);
    }

    public function test($request)
    {
        try {

            Config::set('mail.default', $request['email']['mail_mailer'] ?? 'smtp');
            if ($request['email']['mail_mailer'] == 'smtp' || $request['email']['mail_mailer'] == 'sendmail') {
                Config::set('mail.mailers.smtp.host', $request['email']['mail_host'] ?? '');
                Config::set('mail.mailers.smtp.port', $request['email']['mail_port'] ?? 465);
                Config::set('mail.mailers.smtp.encryption', $request['email']['mail_encryption'] ?? 'ssl');
                Config::set('mail.mailers.smtp.username', $request['email']['mail_username'] ?? '');
                Config::set('mail.mailers.smtp.password', decryptKey($request['email']['mail_password'] ?? ''));
                Config::set('mail.from.name', $request['email']['mail_from_name'] ?? env('APP_NAME'));
                Config::set('mail.from.address', $request['email']['mail_from_address'] ?? '');
            }

            Mail::to($request['mail'])->queue(new TestMail());

            return json_encode(['success' => true, 'message' => 'Mail Send Successfully']);
        } catch (Exception $e) {

            return json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $settings = $this->model->findOrFail($id);
            if ($request['mail']) {
                return $this->test($request);
            }
            $request = array_diff_key($request, array_flip(['_token', '_method']));
            if (isset($request['appearance']['preloader_image_id']) && $request['appearance']['preloader_image_id']) {
                $request['appearance']['preloader_image_id'] = $request['appearance']['preloader_image_id'];
            } else {
                if (isset($settings->values['appearance']['preloader_image_id'])) {
                    $request['appearance']['preloader_image_id'] = $settings->values['appearance']['preloader_image_id'];
                } else {
                    $request['appearance']['preloader_image_id'] = null;
                }
            } 
            
            if (isset($request['firebase']['service_json']) && $request['firebase']['service_json']) {
                $file= $request['firebase']['service_json'];
                $fileContents = file_get_contents($file->getPathname());
                $json= json_decode($fileContents, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return back()->withErrors(['firebase.firebase_json' => 'The file must be a valid JSON.']);
                }
                
                $existingFilePath = public_path('admin/assets/firebase.json');
                if (file_exists($existingFilePath)) {
                    unlink($existingFilePath);
                }
                
                $file->move(public_path('admin/assets'), 'firebase.json');
                $request['firebase']['service_json'] = $json;
            } else {
                $filePath = 'admin/assets/firebase.json';
                if (file_exists(public_path($filePath))) {
                    $fileContents= file_get_contents(public_path($filePath));
                    $request['firebase']['service_json'] = json_decode($fileContents, true);
                } else {
                    $request['firebase']['service_json'] = null;
                }
            }
            $request['email']['mail_password']                    = decryptKey($request['email']['mail_password']);
            $request['google_reCaptcha']['site_key']              = decryptKey($request['google_reCaptcha']['site_key']);
            $request['google_reCaptcha']['secret']                = decryptKey($request['google_reCaptcha']['secret']);
            $request['social_login']['google']['client_id']       = decryptKey($request['social_login']['google']['client_id']);
            $request['social_login']['google']['client_secret']   = decryptKey($request['social_login']['google']['client_secret']);
            $request['social_login']['apple']['client_id']        = decryptKey($request['social_login']['apple']['client_id']);
            $request['social_login']['apple']['client_secret']    = decryptKey($request['social_login']['apple']['client_secret']);

            $settings->update([
                'values' => $request,
            ]);
            $language = $this->getLanguageById($request['general']['default_language_id']);

            $this->updateSystemReserveLang($request['general']['default_language_id']);
            $this->setAppLocale($language);
            $this->updateExchangeRate($request['general']['default_currency_id']);
            $this->env($request);

            DB::commit();
            return to_route('admin.setting.index')->with('success', __('static.settings.update_successfully'));
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getLanguageById($id)
    {
        return Language::where('id', $id)?->first();
    }
    public function updateSystemReserveLang($id)
    {
        Language::where('id', $id)?->update(['system_reserve' => 1]);
        Language::where('id', '!=', $id)?->update(['system_reserve' => 0]);
    }
    public function updateExchangeRate($id)
    {
        Currency::where('id', $id)?->update(['exchange_rate' => 1]);
    }
    public function setAppLocale($language)
    {
        Session::put('locale', $language?->locale);
        Session::put('dir', $language?->is_rtl ? 'rtl' : 'ltr');
        app()->setLocale($language?->locale);
    }

    public function env($value)
    {
        try {

            if (isset($value['general'])) {
                DotenvEditor::setKeys([
                    'APP_NAME' => $value['general']['site_name'] ?? config('app.name'),
                    'APP_TIMEZONE' => $value['general']['default_timezone']
                ]);

                DotenvEditor::save();
            }

            if (isset($value['activation'])) {
                DotenvEditor::setKeys([
                    'DEMO_MODE' => $value['activation']['demo_mode'],
                ]);

                DotenvEditor::save();
            }

            if (isset($value['email'])) {
                DotenvEditor::setKeys([
                    'MAIL_MAILER'       => $value['email']['mail_mailer'],
                    'MAIL_HOST'         => $value['email']['mail_host'],
                    'MAIL_PORT'         => $value['email']['mail_port'],
                    'MAIL_USERNAME'     => $value['email']['mail_username'],
                    'MAIL_PASSWORD'     => $value['email']['mail_password'],
                    'MAIL_ENCRYPTION'   => $value['email']['mail_encryption'],
                    'MAIL_FROM_ADDRESS' => $value['email']['mail_from_address'],
                    'MAIL_FROM_NAME'    => $value['email']['mail_from_name'],
                ]);

                DotenvEditor::save();
            }

            if (isset($value['google_reCaptcha'])) {
                DotenvEditor::setKeys([
                    'GOOGLE_RECAPTCHA_SECRET' => $value['google_reCaptcha']['secret'],
                    'GOOGLE_RECAPTCHA_KEY'    => $value['google_reCaptcha']['site_key'],
                ]);

                DotenvEditor::save();
            }

            if (isset($value['maintenance']['maintenance_mode'])) {
                DotenvEditor::setKeys([
                    'MAINTENANCE_MODE' => $value['maintenance']['maintenance_mode'],
                ]);

                DotenvEditor::save();
            }

            if (isset($value['firebase'])) {
                DotenvEditor::setKeys([
                    'FIREBASE_API_KEY'   => $value['firebase']['firebase_api_key'],
                    'FIREBASE_AUTH_DOMAIN'  => $value['firebase']['firebase_auth_domain'],
                    'FIREBASE_PROJECT_ID'   => $value['firebase']['firebase_project_id'],
                    'FIREBASE_STORAGE_BUCKET' => $value['firebase']['firebase_storage_bucket'],
                    'FIREBASE_MESSAGING_SENDER_ID' => $value['firebase']['firebase_messaging_sender_id'],
                    'FIREBASE_APP_ID' => $value['firebase']['firebase_app_id'],
                    'FIREBASE_MEASUREMENT_ID' => $value['firebase']['firebase_measurement_id'],
                ]);
                DotenvEditor::save();
            }

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
