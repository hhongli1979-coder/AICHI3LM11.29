<?php

use App\Enums\RoleEnum;
use App\Models\Attachment;
use App\Models\Blog;
use App\Models\Country;
use Carbon\Carbon;
use App\Models\Faq;
use App\Models\Currency;
use App\Models\Language;
use App\Models\Menus;
use App\Models\Page;
use App\Models\User;
use App\Models\Role;
use App\Models\MenuItems;
use App\Models\Plugin;
use App\Models\Setting;
use App\Models\LandingPage;
use App\Models\Testimonial;
use Illuminate\Support\Str;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use App\Services\WidgetManager;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Nwidart\Modules\Facades\Module;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;

if (! function_exists('getSettings'))
    {
    function getSettings()
    {
        return Setting::pluck('values')?->first();
    }
}

if (! function_exists('getDefaultLangLocale')) {
    function getDefaultLangLocale()
    {
        $locale   = 'en';
        $settings = getSettings();
        if ($settings['general']['default_language'] ?? false) {
            $locale = $settings['general']['default_language']['locale'];
        }
        return $locale;
    }
}

if (! function_exists('getCountryCodes')) {
    function getCountryCodes()
    {
        return Country::get(["calling_code", "id", "iso_3166_2", 'flag', 'name']);
    }
}

if (! function_exists('getCountries')) {
    function getCountries()
    {
        return DB::table('countries')->pluck('name', 'id');
    }
}

if (! function_exists('getLanguage')) {
    function getLanguage()
    {
        return DB::table('languages')?->where('status', true)->whereNull('deleted_at')?->pluck('name', 'id');
    }
}

if (! function_exists('getCountryFlags')) {
    function getCountryFlags()
    {
        return Country::get(['name', 'id', 'flag']);
    }
}

if (! function_exists('getStatesByCountryId')) {
    function getStatesByCountryId($country_id)
    {
        return DB::table('states')?->where('country_id', $country_id)?->select('id', 'name')?->get();
    }
}

if (! function_exists('isUserLogin')) {
    function isUserLogin()
    {
        return auth()?->check();
    }
}

if (! function_exists('calTaxAmount')) {
    function calTaxRateAmount($amount, $taxRate)
    {
        return ($amount * $taxRate) / 100;
    }
}

if (! function_exists('getPlatformFee')) {
    function getPlatformFee()
    {
        $platform_fee = 0;
        $settings = getSettings();
        if (isset($settings['activation']['platform_fees'])) {
            if ($settings['activation']['platform_fees']) {
                $platform_fee = $settings['general']['platform_fees'] ?? 0;
            }
        }
        return $platform_fee;
    }

}

if (! function_exists('getCurrentUserId')) {
    function getCurrentUserId()
    {
        static $userId = null;
        if ($userId !== null) {
            return $userId;
        }

        if (isUserLogin()) {
            $userId = auth()->id();
            return $userId;
        }

        return null;
    }
}

if (! function_exists('getCurrentUser')) {
    function getCurrentUser()
    {
        static $user = null;
        if ($user !== null) {
            return $user;
        }
        if (isUserLogin()) {
            $user = auth()->user();
            return $user;
        }

        return null;
    }
}

if (! function_exists('getAdmin')) {
    function getAdmin()
    {
        return Cache::remember('admin_user', 60, function () {
            return User::whereHas('roles', function ($q) {
                $q->where('name', 'admin');
            })?->first();
        });
    }
}

if (! function_exists('getAdminId')) {
    function getAdminId()
    {
        static $adminId = null;
        if ($adminId !== null) {
            return $adminId;
        }

        $admin   = getAdmin();
        $adminId = $admin?->id;

        return $adminId;
    }
}

if (! function_exists('getCurrentRoleName')) {
    function getCurrentRoleName()
    {
        if (isUserLogin()) {
            return auth()?->user()?->role?->name;
        }
    }
}

if (! function_exists('getAllModules')) {
    function getAllModules()
    {
        return Module::all();
    }
}

if (! function_exists('getRoleCredentials')) {
    function getRoleCredentials()
    {
        $roleCredentials   = [];
        $modules           = getAllModules() ?? [];
        $generalRoleConfig = config('role') ?? [];
        foreach ($generalRoleConfig as $roleKey => $roleData) {
            if (isset($roleData['name'], $roleData['email'], $roleData['password'])) {
                $roleCredentials[] = $roleData;
            }
        }

        foreach ($modules as $module) {
            $roleFile = module_path($module->getName(), 'config/role.php');
            if (file_exists($roleFile)) {
                $roleConfig = include $roleFile;
                foreach ($roleConfig as $roleKey => $roleData) {
                    if (isset($roleData['name'], $roleData['email'], $roleData['password'])) {
                        $roleCredentials[] = $roleData;
                    }
                }
            }
        }

        return $roleCredentials;
    }
}

if (! function_exists('getNonAdminRoles')) {
    function getNonAdminRoles()
    {
        $nonAdminRoles = getNonAdminRolesList();
        return getActiveRoles($nonAdminRoles);
    }
}

if (! function_exists('getNonAdminRolesList')) {
    function getNonAdminRolesList()
    {
        return Role::whereNull('module')?->get();
    }
}

if (! function_exists('getActiveRoles')) {
    function getActiveRoles($roles)
    {
        $activeRoles = [];
        foreach ($roles as $role) {
            if (isRoleActive($role)) {
                $activeRoles[] = $role;
            }

            if (! $role->module) {
                $activeRoles[] = $role;
            }
        }

        return collect($activeRoles);
    }
}

if (! function_exists('isRoleActive')) {
    function isRoleActive($role)
    {
        return Plugin::where('id', $role->module)->where('status', true)?->exists();
    }
}

if (! function_exists('getMedia')) {
    function getMedia($id)
    {
        return Attachment::find($id);
    }
}

if (! function_exists('getMediaURLbyId')) {
    function getMediaURLbyId($id)
    {
        return getMedia($id)?->original_url;
    }
}

if (! function_exists('getMediaMimeTypeByType')) {
    function getMediaMimeByType($type)
    {
        $mimeTypeMap = [
            'video' => 'video',
            'image' => 'image',
            'audio' => 'audio',
            'text' => 'application',
        ];


        return $mimeTypeMap[$type] ??  '';
    }
}

if (! function_exists('getMediaMimeTypePathByType')) {
    function getMediaMimeTypePathByType($type)
    {
        $mimeTypeMap = [
            'application/pdf' => 'images/file-icon/pdf.png',
            'text/csv' => 'images/file-icon/csv.png',
            'application/msword' => 'images/file-icon/word.png',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'images/file-icon/word.png',
            'application/vnd.ms-excel' => 'images/file-icon/xls.png',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'images/file-icon/xls.png',
            'application/vnd.ms-powerpoint' => 'images/file-icon/folder.png',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'images/file-icon/folder.png',
            'text/plain' => 'images/file-icon/txt.png',
            'audio/mpeg' => 'images/file-icon/sound.png',
            'audio/wav' => 'images/file-icon/sound.png',
            'audio/ogg' => 'images/file-icon/sound.png',
            'video/mp4' => 'images/file-icon/video.png',
            'video/webm' => 'images/file-icon/video.png',
            'video/ogg' => 'images/file-icon/video.png',
            'application/zip' => 'images/file-icon/zip.png',
            'application/x-tar' => 'images/file-icon/zip.png',
            'application/gzip' => 'images/file-icon/zip.png',
            'image/jpeg' => 'images/file-icon/image.png',
            'image/png' => 'images/file-icon/image.png',
            'image/gif' => 'images/file-icon/image.png',
            'application/json' => 'images/file-icon/json.png',
            'text/html' => 'images/file-icon/html.png',
            'application/xml' => 'images/file-icon/xml.png',
            'audio/aac' => 'images/file-icon/sound.png',
            'video/mpeg' => 'images/file-icon/video.png',
            'application/rar' => 'images/file-icon/zip.png',
            'video' => 'images/file-icon/video.png',
            'image' => 'images/file-icon/image.png',
            'audio' => 'images/file-icon/sound.png',
            'text' => 'images/file-icon/txt.png',
        ];

        $defaultIcon = 'images/file-icon/default.png';
        return $mimeTypeMap[$type] ??  $defaultIcon;
    }
}


if (! function_exists('getRouteList')) {
    function getRouteList($prefix = null, $method = null)
    {
        $routes = collect(Route::getRoutes());
        if ($method) {
            $routes = $routes->filter(function ($item) use ($method) {
                return (head($item->methods()) == $method);
            });
        }

        $routes = $routes->filter(function ($route) {
            return str_ends_with($route->getName(), '.index');
        });

        $routes = $routes->values()->map(function ($route) {
            return [
                $route->getName(),
            ];
        })->flatten();

        return $routes;
    }
}


if (! function_exists('getImageUrl')) {
    function getImageUrl(
        ?string $path = null,
        string $fallback = 'images/placeholder.png',
        bool $remote = false,
        string $disk = 'public'
    ): string {
        $fallbackPath = ltrim($fallback, '/');
        $fallbackUrl  = file_exists(public_path($fallbackPath))
        ? asset($fallbackPath)
        : 'data:image/svg+xml;base64,' . base64_encode(
            '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#ccc"/>
                    <text x="50%" y="50%" font-size="14" text-anchor="middle" dy=".3em" fill="#000">
                        No Image
                    </text>
                </svg>'
        );

        if (blank($path)) {
            return $fallbackUrl;
        }

        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        $relativePath = ltrim($path, '/');

        if (file_exists(public_path($relativePath))) {
            return asset($relativePath);
        }

        if (Storage::disk($disk)->exists($relativePath)) {
            return Storage::url($relativePath);
        }

        return $fallbackUrl;
    }
}

if (! function_exists('isDemoModeEnabled')) {

    function isDemoModeEnabled()
    {
        try {

            return env('DEMO_FIELDS');

        } catch (Exception $e) {

            return false;
        }
    }
}

if (! function_exists('isDemoMode')) {

    function isDemoMode()
    {
        try {

            return env('DEMO_MODE');

        } catch (Exception $e) {

            return false;
        }
    }
}

if (! function_exists('getLanguageByLocale')) {
    function getLanguageByLocale($locale)
    {
        return Language::where('locale', $locale)?->whereNull('deleted_at')?->first();
    }
}

if (! function_exists('getAttachmentId')) {
    function getAttachmentId($file_name)
    {
        return Attachment::where('file_name', $file_name)->pluck('id')->first();
        return DB::table('attachments')->where('file_name', $file_name)
            ->select('id')?->limit(1)->value('id');
    }
}

if (! function_exists('getLanguages')) {
    function getLanguages()
    {
        return Language::where('status', true)?->get();
    }
}

if (! function_exists('getLanguageDir')) {
    function getLanguageDir($locale)
    {
        $is_rtl = DB::selectOne("SELECT is_rtl FROM languages WHERE locale = ?", [$locale])->is_rtl ?? false;
        return $is_rtl ? 'rtl' : 'ltr';
    }
}

if (! function_exists('getCurrencies')) {
    function getCurrencies()
    {
        return DB::table('currencies')->pluck('code', 'id');
    }
}

if (! function_exists('getDefaultCurrency')) {
    function getDefaultCurrency()
    {
        $settings = getSettings();
        return $settings['general']['default_currency'];
    }
}

if (! function_exists('getDefaultCurrencyCode')) {
    function getDefaultCurrencyCode()
    {
        return getDefaultCurrency()?->code;
    }
}

if (! function_exists('getDefaultCurrencySymbol')) {
    function getDefaultCurrencySymbol()
    {
        return getDefaultCurrency()?->symbol;
    }
}

if (! function_exists('getCurrencySymbolByCode')) {
    function getCurrencySymbolByCode($currencyCode)
    {
        return DB::table('currencies')?->where('code', $currencyCode)?->whereNull('deleted_at')?->value('symbol');
    }
}

if (! function_exists('covertDefaultExchangeRate')) {
    function covertDefaultExchangeRate($amount)
    {
        return currencyConvert(getDefaultCurrencyCode(), $amount);
    }
}

if (! function_exists('getCurrencyExchangeRate')) {
    function getCurrencyExchangeRate($currencyCode)
    {
        return DB::table('currencies')?->where('code', $currencyCode)?->whereNull('deleted_at')?->value('exchange_rate');
    }
}

if (! function_exists('getActiveCurrencies')) {
    function getActiveCurrencies()
    {
        return Currency::where('status', true)?->whereNull('deleted_at')?->get();
    }
}

if (! function_exists('currencyConvert')) {
    function currencyConvert($currencySymbol, $amount)
    {
        $exchangeRate = getCurrencyExchangeRate($currencySymbol) ?? 1;
        $price = $amount * $exchangeRate;
        return number_format($price, 2);
    }
}

if (! function_exists('formatCurrency')) {
    function formatCurrency($amount, $currencyCode = null)
    {
        $currencyCode = $currencyCode ?? session('currency', getDefaultCurrencyCode());
        $currencySymbol = DB::selectOne("SELECT symbol FROM currencies WHERE code = ?", [$currencyCode])->symbol ?? getDefaultCurrencySymbol();
        $convertedAmount = (float) currencyConvert($currencyCode, $amount);
        return $currencySymbol . number_format($convertedAmount, 2);
    }
}

if (! function_exists('isDefaultLang')) {
    function isDefaultLang($id)
    {
        $settings = getSettings();
        if ($settings) {
            if (isset($settings['general'])) {
                return $settings['general']['default_language_id'] == $id;
            }
        }
    }
}

if (! function_exists('getPluginBySlug')) {
    function getPluginBySlug($slug)
    {
        return DB::selectOne("SELECT * FROM plugins WHERE slug = ? AND deleted_at IS NULL LIMIT 1", [$slug]);
    }
}

if (! function_exists('getReferralCodeByName')) {
    function getReferralCodeByName(string $name, int $maxLength = 6): string
    {
        $name = strtoupper(preg_replace('/\s+/', '', $name));
        $totalLength   = max(6, $maxLength);
        $letterLength  = $totalLength - 3;
        $letters = substr($name, 0, $letterLength);
        if (strlen($letters) < $letterLength) {
            $letters = str_pad($letters, $letterLength, 'X', STR_PAD_RIGHT);
        }

        do {

            $code = $letters . sprintf('%03d', mt_rand(0, 999));

        } while (User::where('referral_code', $code)->exists());

        return $code;
    }
}

if (! function_exists('addWidget')) {

    function addWidget(string $id, string $name, callable $callback, array $options = [])
    {

        try {

            if (shouldRegisterAdminUi()) {
                $widgetManager = app(WidgetManager::class);
                $widgetManager->registerWidget($id, $name, $callback, $options);
            }

        } catch (Exception $e) {

            throw $e;
        }
    }
}

if (! function_exists('shouldRegisterAdminUi')) {
    function shouldRegisterAdminUi()
    {
        if (app()->runningInConsole()) {
            return false;
        }

        $request = request();
        if ($request->expectsJson() || $request->isJson() || $request->wantsJson() || $request->ajax()) {
            return false;
        }

        return true;
    }
}

if (! function_exists('add_menu')) {
    function add_menu(
        $label,
        $module_slug,
        $permission = null,
        $slug = null,
        $route = null,
        $params = null,
        $section = null,
        $parent_slug = null,
        $icon = null,
        $position = null,
        $badge = 0,
        $badgeable = null,
        $badge_callback = null
    ) {

        if (shouldRegisterAdminUi()) {
            if (DB::connection()?->getPDO() && DB::connection()?->getDatabaseName()) {
                try {

                    $slug     = $slug ?? Str::slug($label);
                    $menuItem = MenuItems::isSlugExists($slug);
                    $module   = Plugin::isSlugExists($module_slug);
                    $parent   = MenuItems::isSlugExists($parent_slug);
                    $menu     = Menus::find(1);
                    if ($module && $menu) {

                        if (! $menuItem) {
                            $menuItem = MenuItems::create([
                                'label'         => $label,
                                'route'         => $route,
                                'params'        => $params,
                                'slug'          => $slug,
                                'permission'    => $permission,
                                'section'       => $section,
                                'icon'          => $icon ?? 'ri-plug-line',
                                'parent'        => $parent?->id ?? 0,
                                'sort'          => $position ?? MenuItems::getNextSortRoot(1),
                                'depth'         => $parent ? 1 : 0,
                                'menu'          => $menu?->id,
                                'module'        => $module?->id,
                                'status'        => 0,
                                'created_by_id' => 1,
                                'badge'         => $badge,
                                'badgeable'     => $badgeable ? 1 : 0,
                            ]);
                        } else {

                            $menuItem->update([
                                'label'      => $label ?? $menuItem->label,
                                'route'      => $route ?? $menuItem->route,
                                'slug'       => $slug ?? $menuItem->slug,
                                'params'     => $params ?? $menuItem->params,
                                'permission' => $permission,
                                'section'    => $section ?? $menuItem->section,
                                'icon'       => $icon ?? $menuItem->icon,
                                'sort'       => $position ?? $menuItem->sort,
                                'parent'     => $parent?->id ?? 0,
                                'menu'       => 1,
                                'status'     => $module?->status,
                                'badge'      => $badge ?? 0,
                                'badgeable'  => $badgeable,
                            ]);
                        }

                        $menuItem->refresh();
                        return $menuItem;
                    }

                } catch (Exception $e) {

                    Log::error("Error in menu item: ".$e->getMessage());
                }
            }
        }
    }

    if (! function_exists('createAttachment')) {
        function createAttachment()
        {
            $attachment = new Attachment();
            $attachment->save();
            return $attachment;
        }
    }

    if (! function_exists('storeImage')) {
        function storeImage($request, $model, $collectionName = 'attachment')
        {
            foreach ($request as $media) {
                $attachments[] = addMedia($model, $media, $collectionName);
            }
            $model->delete($model->id);
            return $attachments;
        }
    }

    if (! function_exists('addMedia')) {
        function addMedia($model, $media, $collectionName = 'attachment')
        {

            $media = $model->addMedia($media)->toMediaCollection($collectionName);
            $model->delete($model->id);
            return $media;
        }
    }

    if (! function_exists('uploadFileMedia')) {
        function uploadFileMedia($model, $media, $collectionName = 'attachment')
        {
            $media = $model->addMedia($media)->toMediaCollection($collectionName);
            return $media;
        }
    }

    if (! function_exists('getDefaultSMSMethod')) {
        function getDefaultSMSMethod()
        {
            $settings = getSettings();
            return $settings['general']['default_sms_gateway'] ?? null;
        }
    }

    if (! function_exists('convertFileSize')) {
        function convertFileSize($size)
        {
            $units = [' bytes', ' KB', ' MB', ' GB', ' TB'];
            for ($i = 0; $size > 1024; $i++) {
                $size /= 1024;
            }
            return round($size, 2) . ' ' . $units[$i];
        }
    }

    if (! function_exists('getAllgetPaymentMethodListModules')) {
        function getAllPaymentModules()
        {
            return Module::all();
        }
    }

    if (! function_exists('getPaymentMethodList')) {
        function getPaymentMethodList($withCash = true)
        {
            $paymentMethods   = [];
            $settings         = getSettings();
            $modules          = getAllPaymentModules();
            if ($withCash) {
                $paymentMethods[] = [
                    'name'   => __('static.cash'),
                    'slug'   => 'cash',
                    'image'  => asset('images/payment/cod.png'),
                    'status' => (bool) @$settings['activation']['cash'] ?? false,
                ];
            }
            foreach ($modules as $module) {
                if ($module?->isEnabled()) {
                    $paymentFile = module_path($module->getName(), 'config/payment.php');
                    if (file_exists($paymentFile)) {
                        $payment          = include $paymentFile;
                        $paymentMethods[] = [
                            'name'           => $payment['name'],
                            'slug'           => $payment['slug'],
                            'title'          => $payment['title'],
                            'processing_fee' => $payment['processing_fee'],
                            'subscription'   => $payment['subscription'],
                            'image'          => url($payment['image']),
                            'status'         => $module?->isEnabled(),
                        ];
                    }
                }
            }

            return $paymentMethods;
        }
    }

    if (! function_exists('getStartAndEndDate')) {
        function getStartAndEndDate($sort, $startDate = null, $endDate = null)
        {
            $startCurrentDate = Carbon::now();
            $endCurrentDate   = Carbon::now();
            switch ($sort) {
                case 'today':
                    return [
                        'start' => $startCurrentDate->startOfDay(),
                        'end'   => $endCurrentDate->endOfDay(),
                    ];

                case 'this_week':
                    return [
                        'start' => $startCurrentDate->startOfWeek(),
                        'end'   => $endCurrentDate->endOfWeek(),
                    ];

                case 'this_month':
                    return [
                        'start' => $startCurrentDate->startOfMonth(),
                        'end'   => $endCurrentDate->endOfMonth(),
                    ];

                case 'this_year':
                    return [
                        'start' => $startCurrentDate->startOfYear(),
                        'end'   => $endCurrentDate->endOfYear(),
                    ];

                case 'custom':
                    if ($startDate && $endDate) {
                        return [
                            'start' => Carbon::createFromFormat('m-d-Y', $startDate)->startOfDay(),
                            'end'   => Carbon::createFromFormat('m-d-Y', $endDate)->endOfDay(),
                        ];
                    }
                    break;
                default:
                    return [
                        'start' => $startCurrentDate->startOfYear(),
                        'end'   => $endCurrentDate->endOfYear(),
                    ];
            }
        }
    }

    if (! function_exists('getPaymentMethodConfigs')) {
        function getPaymentMethodConfigs()
        {
            $paymentMethods = [];
            $modules  = getAllPaymentModules();
            foreach ($modules as $module) {
                $paymentFile = module_path($module->getName(), 'config/payment.php');
                if (file_exists($paymentFile)) {
                    $payment          = include $paymentFile;
                    $paymentMethods[] = [
                        'name'           => $payment['name'],
                        'slug'           => $payment['slug'],
                        'image'          => url($payment['image']),
                        'title'          => $payment['title'],
                        'processing_fee' => $payment['processing_fee'],
                        'status'         => $module?->isEnabled(),
                        'configs'        => $payment['configs'],
                        'fields'         => $payment['fields'],
                        'subscription'   => $payment['subscription'],
                    ];
                }
            }

            return $paymentMethods;
        }
    }

    if (! function_exists('getPaymentLogoUrl')) {
        function getPaymentLogoUrl($paymentMethodSlug)
        {
            $paymentMethods = getPaymentMethodConfigs();
            foreach ($paymentMethods as $paymentMethod) {
                if ($paymentMethod['slug'] === $paymentMethodSlug) {
                    return $paymentMethod['image'];
                }
            }
            return null;
        }
    }

    if (! function_exists('getEncrypter')) {
        function getEncrypter()
        {
            return App::make('encrypter');
        }
    }

    if (! function_exists('isEncrypted')) {
        function isEncrypted($key)
        {
            return strpos($key, 'eyJpdiI') === 0;
        }
    }

    if (! function_exists('getBlogsByIds')) {
        function getBlogsByIds($ids = [])
        {
            if (count($ids)) {
                $locale = Session::get('front-locale', getDefaultLangLocale());
                $blogs  = Blog::whereIn('id', $ids)?->with(['blog_thumbnail'])?->where('status', true)?->orderBy('created_at', 'desc')->paginate(9);
                $blogs  = $blogs ? $blogs->map(function ($blog) use ($locale) {
                    return $blog->toArray($locale);
                })->toArray() : [];

                return $blogs;
            }
            return [];
        }
    }

    if (! function_exists('getFaqsByIds')) {
        function getFaqsByIds($ids = [])
        {
            if (count($ids)) {
                $locale = Session::get('front-locale', getDefaultLangLocale());
                $faqs   = Faq::whereIn('id', $ids)?->where('status', true)?->orderBy('created_at', 'desc')->get();
                $faqs = $faqs ? $faqs->map(function ($faq) use ($locale) {
                    return $faq->toArray($locale);
                })->toArray() : [];

                return $faqs;
            }

            return [];
        }
    }

    if (! function_exists('getTestimonialByIds')) {
        function getTestimonialByIds($ids = [])
        {
            if (count($ids)) {
                return Testimonial::whereIn('id', $ids)?->where('status', true)?->orderBy('created_at', 'desc')?->get();
            }
            return [];
        }
    }

    if (! function_exists('roundNumber')) {
        function roundNumber($numb)
        {
            return number_format($numb, 2, '.', '');
        }
    }

    if (! function_exists('isActiveSection')) {
        function isActiveSection($items)
        {
            $itemPermissions = $items->pluck('permission')->toArray();
            foreach ($itemPermissions as $permission) {
                if (!empty($permission) && auth()?->user()?->can($permission)) {
                    return true;
                }
            }
            return false;
        }
    }

    if (! function_exists('getLandingPage')) {
        function getLandingPage()
        {
            $content = LandingPage::pluck('content')?->first();
            return $content;
        }
    }

    if (! function_exists('isSameModelSlug')) {
        function isSameModelSlug($model, $slug)
        {
            return $model->slug == $slug;
        }
    }

    if (! function_exists('createSitemap')) {
        function createSitemap()
        {
            $sitemap = Sitemap::create();
            Blog::all()->each(function (Blog $blog) use ($sitemap) {
                $sitemap->add(
                    Url::create("/blog/{$blog->slug}")
                        ->setPriority(0.9)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                );
            });

            Page::all()->each(function (Page $page) use ($sitemap) {
                $sitemap->add(
                    Url::create("/page/{$page->slug}")
                        ->setPriority(0.9)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                );
            });

            return $sitemap;
        }
    }

    if (! function_exists('getSMSGatewayList')) {
        function getSMSGatewayList()
        {
            $smsGateways = [];
            $modules     = Module::all();
            $smsGateways[] = [
                'name'   => 'Firebase',
                'slug'   => 'firebase',
                'image'  => null,
                'status' => true,
            ];
            foreach ($modules as $module) {
                $smsFile = module_path($module->getName(), 'config/sms.php');
                if (file_exists($smsFile)) {
                    $sms           = include $smsFile;
                    $smsGateways[] = [
                        'name'   => $sms['name'],
                        'slug'   => $sms['slug'],
                        'image'  => url($sms['image']),
                        'status' => $module?->isEnabled(),
                    ];
                }
            }

            return $smsGateways;
        }
    }

    if (! function_exists('getSMSGatewayConfigs')) {
        function getSMSGatewayConfigs()
        {
            $smsGateways = [];
            $modules = getAllPaymentModules();
            foreach ($modules as $module) {
                $smsFile = module_path($module->getName(), 'config/sms.php');
                if (file_exists($smsFile)) {
                    $sms           = include $smsFile;
                    $smsGateways[] = [
                        'name'    => $sms['name'],
                        'slug'    => $sms['slug'],
                        'image'   => url($sms['image']),
                        'status'  => $module?->isEnabled(),
                        'configs' => $sms['configs'],
                        'fields'  => $sms['fields'],
                    ];
                }
            }

            return $smsGateways;
        }
    }

    if (! function_exists('getDefaultSMSGateway')) {
        function getDefaultSMSGateway()
        {
            $settings = getSettings();
            return $settings['general']['default_sms_gateway'] ?? null;
        }
    }

    if (! function_exists('sendSMS')) {
        function sendSMS($sendTo, $message)
        {
            try {
                $defaultSMSGateway = getDefaultSMSGateway();
                if (!$defaultSMSGateway) {
                    throw new Exception(__('static.sms_gateways.default_not_select'), 400);
                }

                if ($defaultSMSGateway !== 'firebase') {
                    $module = Module::find($defaultSMSGateway);
                    if ($module) {
                        if (! is_null($module) && $module?->isEnabled()) {
                            $moduleName = $module->getName();
                            $sms = 'Modules\\' . $moduleName . '\\SMS\\' . $moduleName;
                            if (class_exists($sms) && method_exists($sms, 'getIntent')) {
                                return $sms::getIntent($sendTo, $message);
                            }
                        }
                    }
                    throw new Exception(__('static.sms_gateways.not_found'), 400);
                }

                return true;

            } catch (Exception $e) {
                throw new ExceptionHandler($e->getMessage(), $e->getCode());
            }
        }
    }

    if (! function_exists('getActiveMenuItem')) {
        function getActiveMenuItem($menuList)
        {
            $activeMenus = [];
            foreach ($menuList as $menuItem) {
                if (isModuleActive($menuItem)) {
                    $activeMenus[] = $menuItem;
                }

                if (!$menuItem->module) {
                    $activeMenus[] = $menuItem;
                }
            }

            return collect($activeMenus);
        }
    }

    if (! function_exists('isModuleActive')) {
        function isModuleActive($model)
        {
            return Plugin::where('id', $model->module)->where('status', true)->exists();
        }
    }

    if (! function_exists('encryptKey')) {
        function encryptKey($key)
        {
            if (config('app.demo')) {
                if ($key) {
                    return getEncrypter()?->encrypt($key);
                }
            }
            return $key;
        }
    }

    if (! function_exists('decryptKey')) {
        function decryptKey($key)
        {
            if (config('app.demo')) {
                if (isEncrypted($key)) {
                    return getEncrypter()?->decrypt($key);
                }

                return $key;
            }

            return $key;
        }
    }

    if (! function_exists('add_quick_link')) {
        function add_quick_link($label, $route, $icon, $permission = null)
        {
            $quickLinks = app('quickLinks') ?? [];
            if (shouldRegisterAdminUi()) {
                if(is_array($quickLinks)) {
                    $quickLinks = collect($quickLinks);
                }

                $quickLinks?->push([
                    'label_key' => $label,
                    'route' => $route,
                    'icon'  => $icon,
                    'permission' => $permission
                ]);

                app()->instance('quickLinks', $quickLinks);
            }
        }
    }


    if (! function_exists('get_quick_links')) {
        function get_quick_links()
        {
            return app('quickLinks');
        }
    }

    if (! function_exists('file_exists_public')) {
        function file_exists_public($url)
        {
            $baseUrl      = config('app.url') . '/';
            $relativePath = str_replace($baseUrl, '', $url);
            $filePath     = public_path($relativePath);
            return file_exists($filePath);
        }
    }

    if (! function_exists('render_image')) {
        function render_image($file, $mimeImageMapping = [], $defaultImage = 'images/nodata1.webp')
        {
            if (substr($file?->mime_type, 0, 5) == 'image' && file_exists_public($file->original_url)) {
                return $file->original_url;
            }

            if ($file?->mime_type !== null && isset($mimeImageMapping[$file->mime_type])) {
                return asset($mimeImageMapping[$file->mime_type]);
            }

            return asset($defaultImage);
        }
    }

    if (! function_exists('getTimeFormat')) {
        function getTimeFormat()
        {
            $settings = getSettings();
            return $settings['general']['time_format'] ?? 12;
        }
    }

    if (! function_exists('formatDateBySetting')) {
        function formatDateBySetting($datetime)
        {
            $format = getTimeFormat() == 24 ? 'Y-m-d H:i:s' : 'Y-m-d h:i:s A';
            return $datetime->format($format);
        }
    }
}
