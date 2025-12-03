<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use Kreait\Firebase\Factory;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Traits\MessageTrait;
use Modules\Taxido\Models\Driver;
use Illuminate\Support\Facades\DB;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Models\Document;
use Illuminate\Support\Facades\Log;
use App\Http\Traits\FireStoreTrait;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\Ambulance;
use Modules\Taxido\Emails\VerifyEmail;
use Modules\Taxido\Models\VehicleInfo;
use Modules\Taxido\Models\FleetManager;
use Illuminate\Support\Facades\Validator;
use Modules\Taxido\Models\DriverDocument;
use Modules\Taxido\Models\PaymentAccount;
use Modules\Taxido\Http\Traits\ReferralTrait;
use Modules\Taxido\Http\Resources\Drivers\DriverSelfResource;
use Modules\Taxido\Http\Resources\FleetManagers\FleetSelfResource;

class DriverAuthController extends Controller
{
    use MessageTrait, FireStoreTrait, ReferralTrait;

    public function updateProfile(Request $request)
    {
        try {

            $driver_id = getCurrentUserId();
            $driver = Driver::findOrFail($driver_id);


            if (isset($request['profile_image_id'])) {
                $driver->profile_image()->associate($request['profile_image_id']);
            }

            if ($request->hasFile('profile_image')) {
                $attachments = createAttachment();
                $media = storeImage([$request->profile_image], $attachments, 'attachment');
                $driver->profile_image_id = head($media)?->id;
                $driver->profile_image()->associate(head($media)?->id);
            }

            return response()->json(['id' => $driver->id], 200);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updatePhoneOrEmail(Request $request)
    {
        try {

            $rider_id = getCurrentUserId();
            $validator = Validator::make($request->all(), [
                'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')->ignore($rider_id)->whereNull('deleted_at')],
                'phone' => ['nullable', 'min:6', 'max:15', Rule::unique('users', 'phone')->ignore($rider_id)->whereNull('deleted_at')],
                'country_code' => ['nullable', Rule::requiredIf((boolean) $request->phone)],
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            if (!$request->email && !$request->phone) {
                throw new Exception(__('Please provide either email or phone to update'), 422);
            }

            if ($request->email) {
                return $this->sendEmailToken($request->email);
            }

            if ($request->phone) {
                return $this->sendPhoneToken($request->country_code ?? null, $request->phone);
            }

            throw new Exception(__('Either email or phone not be empty.'), 422);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyPhoneOrEmail(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'email_or_phone' => 'required|string',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $driver_id = getCurrentUserId();
            $driver = Driver::findOrFail($driver_id);
            $isEmail = filter_var($request->email_or_phone, FILTER_VALIDATE_EMAIL);

            $authToken = DB::table('auth_tokens')
                ->where('token', $request->token)
                ->where('created_at', '>', Carbon::now()->subHours(1));

            if ($isEmail) {
                $verify_otp = $authToken->where('email', $request->email_or_phone)->first();
            } else {
                $country_code = ltrim($request->country_code, '+');
                $verify_otp = $authToken->where('phone', '+' . $country_code . $request->email_or_phone)->first();
            }

            if (!$verify_otp) {
                throw new Exception(__('Invalid or expired token'), 400);
            }

            if ($isEmail) {
                $driver->email = $request->email_or_phone;
            } else {
                $driver->country_code = $request->country_code;
                $driver->phone = $request->email_or_phone;
            }

            $driver->save();
            DB::table('auth_tokens')
                ->where('token', $request->token)
                ->delete();

            return response()->json([
                'message' => __('Profile updated successfully'),
                'success' => true,
                'rider' => new DriverSelfResource ($driver->refresh()),
            ], 200);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    public function self()
    {
        try {

            $user_id = getCurrentUserId();
            $roleName = getCurrentRoleName();
            if($roleName == RoleEnum::DRIVER) {
                $driver = Driver::findOrFail($user_id);
                $driver->setAppends([
                    'total_driver_commission',
                    'total_pending_rides',
                    'total_complete_rides',
                    'total_cancel_rides',
                    'total_active_rides',
                ]);

                return new DriverSelfResource($driver);

            } elseif($roleName == RoleEnum::FLEET_MANAGER) {

                $fleet_manager = FleetManager::findOrFail($user_id);
                return new FleetSelfResource($fleet_manager);
            }

            throw new Exception('Invalid access token for driver or fleet manager.', 400);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function login(Request $request)
    {
        try {

            $req = $request->validate([
                'email_or_phone' => 'required|string',
                'country_code' => 'nullable|required_if:email_or_phone,phone|string',
            ]);

            return filter_var($req['email_or_phone'], FILTER_VALIDATE_EMAIL)
                ? $this->sendEmailToken($req['email_or_phone'])
                : $this->sendPhoneToken($req['country_code'] ?? null, $req['email_or_phone']);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function sendEmailToken($email)
    {
        $token = $this->generateToken(null, null, $email);
        if (!isDemoMode()) {
            try {

                Mail::to($email)->send(new VerifyEmail($token));

            } catch(Exception $e) {

                Log::error($e->getMessage());
            }
        }

        return response()->json([
            'message' => __('OTP sent successfully to your email!'),
            'success' => true,
        ], 200);
    }

    private function sendPhoneToken($country_code, $phone)
    {
        if (! $country_code) {
            throw new Exception('Country code is required for login as a phone.', 422);
        }

        $token = $this->generateToken($country_code, $phone);

        if (!isDemoMode()) {
            sendSMS('+' . $country_code . $phone, 'Your OTP is ' . $token);
        }
        return response()->json(['message' => __('OTP sent successfully to your phone!'), 'success' => true], 200);
    }

    public function generateToken($country_code = null, $phone = null, $email = null)
    {
        $token = rand(111111, 999999);
        if (isDemoMode()) {
            $token = 123456;
        }

        DB::table('auth_tokens')->insert([
            'token'      => $token,
            'phone'      => '+' . $country_code . $phone,
            'email'      => $email,
            'created_at' => Carbon::now(),
        ]);

        return $token;
    }

    public function verifyDriverToken(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'token'          => 'required|string',
                'email_or_phone' => 'required|string',
                'fcm_token'      => 'nullable|string',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $isEmail = filter_var($request->email_or_phone, FILTER_VALIDATE_EMAIL);

            // Validate country code only if phone login
            if (!$isEmail && empty($request->country_code)) {
                throw new Exception(__('Country code is required for phone login'), 422);
            }

            $authTokenQuery = DB::table('auth_tokens')
                ->where('token', $request->token)
                ->where('created_at', '>', Carbon::now()->subHours(1));

            if ($isEmail) {
                $verify_otp = $authTokenQuery->where('email', $request->email_or_phone)->first();
            } else {
                $country_code = ltrim($request->country_code, '+');
                $verify_otp = $authTokenQuery->where('phone', '+' . $country_code . $request->email_or_phone)->first();
            }

            if (!$verify_otp) {
                throw new Exception(__('Invalid token'), 400);
            }

            $driverQuery = Driver::whereNull('deleted_at');
            if ($isEmail) {
                $driver = $driverQuery->where('email', $request->email_or_phone)->first();
            } else {
                $driver = $driverQuery->where('phone', $request->email_or_phone)->first();
                if ($driver) {
                    $driverCountryCode = ltrim($driver->country_code, '+');
                    if ($driverCountryCode != $country_code) {
                        $driver = null; // Country code mismatch, invalidate
                    }
                }
            }

            if ($driver) {
                if ($driver->role?->name !== RoleEnum::DRIVER) {
                    throw new Exception(__('Only drivers can login'), 403);
                }

                if (!$driver->status) {
                    throw new Exception(__('Account is disabled'), 403);
                }

                $token = $driver->createToken('auth_token')->plainTextToken;
                $driver->tokens()->update([
                    'role_type' => $driver->getRoleNames()->first(),
                ]);

                $driver->update([
                    'fcm_token' => $request->fcm_token,
                ]);

                $driver = $driver->fresh();
                $taxidoSettings = getTaxidoSettings();

                $driverIsVerified = $driver?->is_verified;
                if (!$taxidoSettings['activation']['driver_verification']) {
                    $driverIsVerified = 1;
                }

                return response()->json([
                    'id' => $driver?->id,
                    'access_token'  => $token,
                    'is_registered' => true,
                    'is_verified'   => $driverIsVerified,
                    'success'       => true,
                    'role'          => RoleEnum::DRIVER
                ], 200);
            }

            return response()->json([
                'message'       => __('Token verified successfully'),
                'is_registered' => false,
                'success'       => true,
                'role'          => RoleEnum::DRIVER
            ], 200);

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyLogin(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email'        => ['nullable', Rule::requiredIf(! $request->phone), 'email'],
                'phone'        => ['nullable', Rule::requiredIf(! $request->email)],
                'country_code' => ['nullable', Rule::requiredIf(! $request->email)],
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $driver = Driver::where('email', $request->email)->orWhere('phone', (string) $request->phone)?->first();
            if ($driver) {
                if (! $driver->status) {
                    throw new Exception(_('taxido::auth.disabled_account'), 400);
                }
            }

            return true;

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function driverRegister(Request $request)
    {
        DB::beginTransaction();
        try {

            $validator = Validator::make($request->all(), [
                'name'                  => 'required',
                'email'                 => 'required|string|email|max:255',
                'password'              => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required',
                'country_code'          => 'required',
                'phone'                 => 'required|min:6|max:15',
                'referral_code'         => 'nullable|string',
                'documents.*.slug'      => 'exists:documents,slug,deleted_at,NULL',
                'service_id'            => 'required|exists:services,id,deleted_at,NULL',
                'service_category_id'   => 'nullable|exists:service_categories,id,deleted_at,NULL',
                'preferences.*'         => 'nullable|exists:preferences,id,deleted_at,NULL',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            if ($request->referral_code) {
                $referrer = Driver::where('referral_code', $request->referral_code)
                    ->where('status', true)?->whereNull('deleted_at')?->first();

                if (!$referrer) {
                    throw new Exception('Invalid referral code or referrer not found.', 422);
                }

                if (!$referrer->hasRole(RoleEnum::DRIVER)) {
                    throw new Exception('Referral code belongs to a different user type.', 422);
                }
            }

            $taxidoSettings = getTaxidoSettings();
            $driverIsVerified = 0;
            if (! $taxidoSettings['activation']['driver_verification']) {
                $driverIsVerified = 1;
            }

            $driver = Driver::create([
                'name'                => $request->name,
                'email'               => $request->email,
                'country_code'        => $request->country_code,
                'phone'               => (string) $request->phone,
                'can_accept_ride'     => $request->can_accept_ride,
                'can_accept_parcel'   => $request->can_accept_parcel,
                'service_id'          => $request->service_id,
                'fcm_token'           => $request?->fcm_token,
                'service_category_id' => $request->service_category_id,
                'password'            => Hash::make($request->password),
                'is_verified'         => $driverIsVerified,
                'referral_code'       => getReferralCodeByName($request->name ?? 'Driver'),
            ]);

            $driver->assignRole(RoleEnum::DRIVER);
            $driver->wallet()->create();
            $driver->wallet;

            if (!empty($request->vehicle)) {
                $driver->vehicle_info()->create($request->vehicle);
            }

            if (! empty($request->ambulance)) {
                if(! empty($request->ambulance?->name) && ! empty($request->ambulance?->description)) {
                    $driver->ambulance()->create($request->ambulance);
                }
            }

            if (!empty($request->preferences) && is_array($request->preferences)) {
                $driver->preferences()->sync($request->preferences ?? []);
            }

            if (!empty($request->documents) && is_array($request->documents)) {
                if (count($request->documents)) {
                    foreach ($request->documents as $document) {
                        if (is_array($document)) {
                            $attachmentObj = createAttachment();
                            $attachment_id = addMedia($attachmentObj, $document['file'])?->id;
                            $attachmentObj?->delete();
                            $doc  = Document::where('slug', $document['slug'])->first();
                            $expired_at = $document['expired_at'] ?? null;
                            if ($doc?->need_expired_date) {
                                if (! $expired_at) {
                                    throw new Exception(__('taxido::auth.expired_date_required', ['name' => $doc?->name]), 422);
                                }
                            }

                            $driver->documents()?->create([
                                'document_id'       => $doc?->id,
                                'document_image_id' => $attachment_id,
                                'expired_at'        => $expired_at,
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            if ($request->referral_code) {
                $this->applyReferralCode($request->referral_code, $driver, 'driver');
            }

            $token = $driver->createToken('auth_token')->plainTextToken;
            $driver->tokens()->update([
                'role_type' => $driver->getRoleNames()->first(),
            ]);

            return [
                'id'                => $driver?->id,
                'name'              => $driver?->name,
                'profile_image_url' => $driver?->profile_image?->original_url,
                'wallet_balance'    => $driver?->wallet?->balance ?? 0.00,
                'rating_count'      => $driver?->rating_count,
                'review_count'      => $driver?->review_count,
                'model'             => $driver?->vehicle_info?->model,
                'plate_number'      => $driver?->vehicle_info?->plate_number,
                'access_token'      => $token,
                'success'           => true,
                'is_verified'       => $driverIsVerified,
                'role'              => RoleEnum::DRIVER
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updatePassword(Request $request)
    {
        DB::beginTransaction();
        try {

            $validator = Validator::make($request->all(), [
                'token'                 => 'required',
                'email'                 => 'required|email|max:255|strings',
                'password'              => 'required|min:8|confirmed',
                'password_confirmation' => 'required',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $user = DB::table('password_resets')
                ->where('token', $request->token)
                ->where('email', $request->email)
                ->where('created_at', '>', Carbon::now()->subHours(1))
                ->first();

            if (! $user) {
                throw new Exception(__('taxido::auth.invalid_email_token'), 400);
            }

            User::where('email', $request->email)?->update(['password' => Hash::make($request->password)]);
            DB::table('password_resets')->where('email', $request->email)->delete();
            DB::commit();
            return [
                'message' => __('taxido::auth.password_changed'),
                'success' => true,
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updatePaymentAccount(Request $request)
    {
        DB::beginTransaction();

        try {
            $validator = Validator::make($request->all(), [
                'bank_name'        => 'nullable|string|max:255',
                'bank_holder_name' => 'nullable|string|max:255',
                'bank_account_no'  => 'nullable|string|max:50',
                'routing_number'   => 'nullable|string|max:20',
                'swift'            => 'nullable|string|max:20',
                'paypal_email'     => 'nullable|email',
                'default'           => 'in:paypal,bank'
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $paymentAccount = PaymentAccount::updateOrCreate(
                ['user_id' => auth()->id()],
                $request->only([
                    'bank_name',
                    'bank_holder_name',
                    'bank_account_no',
                    'routing_number',
                    'swift',
                    'paypal_email',
                    'default'
                ])
            );

            DB::commit();
            return response()->json(['id' => $paymentAccount?->id]);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateVehicle(Request $request)
    {
        DB::beginTransaction();
        try {

            $driver_id = getCurrentUserId();
            $driver = Driver::findOrFail($driver_id);

            if($driver->is_verified) {
                throw new Exception("Once vehicle verified you cannot change.", 422);
            }

            $validator = Validator::make($request->all(), [
                'service'          => 'required|integer|exists:services,id,deleted_at,NULL',
                'service_category' => 'nullable|exists:service_categories,id,deleted_at,NULL',
                'vehicle_type_id'  => 'nullable|exists:vehicle_types,id,deleted_at,NULL',
                'vehicle_name'     => 'nullable|max:255',
                'model'            => 'nullable|max:255',
                'plate_number'     => 'nullable|max:20',
                'seat'             => 'nullable|min:1',
                'color'            => 'nullable|max:50',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            DB::table('users')?->where('id', $driver_id)->update([
                'service_id'          => $request->service,
                'service_category_id' => $request->service_category,
            ]);

            if ($request->ambulance) {
                Ambulance::updateOrCreate(['driver_id' => $driver_id],[
                    'name' => $request->ambulance['name'],
                    'description' => $request->ambulance['description'],
                    'driver_id' => $driver_id
                ]);
            }

            $vehicle = VehicleInfo::updateOrCreate(
                ['driver_id' => $driver_id],
                $request->only([
                    'vehicle_type_id', 'vehicle_name',
                    'model', 'plate_number',
                    'seat', 'color',
                ])
            );

            DB::commit();
            return response()->json(['id' => $vehicle?->id]);

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateDocument(Request $request)
    {
        DB::beginTransaction();
        try {

            $validator = Validator::make($request->all(), [
                'documents'        => 'required|array|min:1',
                'documents.*.slug' => 'required|exists:documents,slug,deleted_at,NULL',
                'documents.*.file' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $driverId = auth()->id();
            foreach ($request->documents as $doc) {
                $document     = Document::where('slug', $doc['slug'])->first();
                $attachmentId = null;
                if (! empty($doc['file'])) {
                    $attachmentId = addMedia(createAttachment(), $doc['file'])?->id;
                }

                $driverDocument = DriverDocument::where('driver_id', $driverId)->where('document_id', $document?->id)?->whereNull('deleted_at')->first();
                $expired_at     = $doc['expired_at'] ?? null;
                if ($document->need_expired_date) {
                    if (! $expired_at) {
                        throw new Exception(__('taxido::auth.expired_date_required', ['name' => $document?->name]), 422);
                    }
                }
                if ($driverDocument) {
                    $driverDocument->update([
                        'driver_id'         => $driverId,
                        'document_id'       => $document?->id,
                        'type'              => $document?->type,
                        'expired_at'        => $doc['expired_at'] ?? $driverDocument?->expired_at,
                        'document_image_id' => $attachmentId,
                        'status'            => 'pending'
                    ]);
                } else {
                    DriverDocument::create(
                        [
                            'driver_id'         => $driverId,
                            'document_id'       => $document?->id,
                            'type'              => $document?->type,
                            'expired_at'        => $doc['expired_at'] ?? $driverDocument?->expired_at,
                            'document_image_id' => $attachmentId,
                            'status'            => 'pending'
                        ]
                    )?->without(['document', 'document_image']);
                }
            }

            DB::commit();
            return [
                "success" => true,
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyFirebaseAuthToken(Request $request)
    {

        try {

            $validator = Validator::make($request->all(), [
                'country_code'   => 'required',
                'phone'          => 'required|min:6|max:15',
                'firebase_token' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $firebaseToken = $request->firebase_token;
            $firebaseAuth  = (new Factory)->withServiceAccount(config('services.firebase.credentials'))?->createAuth();
            $verifiedToken = $firebaseAuth->verifyIdToken($firebaseToken);
            $driver        = Driver::where('phone', $request->phone)?->where('country_code', $request->country_code)?->whereNull('deleted_at')?->first();
            if ($verifiedToken) {
                if (! $driver) {
                    return response()->json([
                        'is_registered' => false,
                        'success'       => true,
                        'role'          => RoleEnum::DRIVER
                    ], 200);
                }

                $token = $driver->createToken('auth_token')?->plainTextToken;
                return response()->json([
                    'id'            => $driver?->id,
                    'access_token'  => $token,
                    'is_registered' => true,
                    'success'       => true,
                    'role'          => RoleEnum::DRIVER
                ], 200);
            }

            throw new Exception("Token Not found", 422);

        } catch (Exception $e) {


            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteAccount()
    {
        DB::beginTransaction();
        try {

            $driver = Driver::findOrFail(auth('sanctum')->user()->id);
            $driver->delete();

            $this->fireStoreDeleteDocument('driverTrack', (string) $driver->id);
            DB::commit();
            return [
                'message' => __('static.users.user_delete'),
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
