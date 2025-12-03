<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Carbon\Carbon;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use App\Mail\ForgotPassword;
use Kreait\Firebase\Factory;
use Illuminate\Validation\Rule;
use Modules\Taxido\Models\Rider;
use App\Http\Traits\MessageTrait;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Modules\Taxido\Emails\VerifyEmail;
use Illuminate\Support\Facades\Validator;
use Modules\Taxido\Http\Traits\ReferralTrait;
use Modules\Taxido\Http\Resources\Riders\SelfResource;
use Modules\Taxido\Http\Requests\Api\SocialLoginRequest;

class AuthController extends Controller
{
    use MessageTrait, ReferralTrait;

    protected $fields = [
        'name',
        'profile_image_id',
        'profile_image'
    ];

    public function updateProfile(Request $request)
    {
        DB::beginTransaction();
        try {

            $rider_id = getCurrentUserId();
            $rider = Rider::findOrFail($rider_id);

            if (isset($request['profile_image_id'])) {
                $rider->profile_image()->associate($request['profile_image_id']);
            }

            if ($request->hasFile('profile_image')) {
                $attachments = createAttachment();
                $media = storeImage([$request->profile_image], $attachments, 'attachment');
                $rider->profile_image_id = head($media)?->id;
                $rider->profile_image()->associate(head($media)?->id);
            }

            DB::commit();
            return response()->json(['id' => $rider->id], 200);

        } catch (Exception $e) {

            DB::rollback();
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

            $rider_id = getCurrentUserId();
            $rider = Rider::findOrFail($rider_id);
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
                $rider->email = $request->email_or_phone;
            } else {
                $rider->country_code = $request->country_code;
                $rider->phone = $request->email_or_phone;
            }

            $rider->save();
            DB::table('auth_tokens')
                ->where('token', $request->token)
                ->delete();

            return response()->json([
                'message' => __('Profile updated successfully'),
                'success' => true,
                'rider' => new SelfResource($rider->refresh()),
            ], 200);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function self()
    {
        try {

            $rider_id = getCurrentUserId();
            $rider = Rider::without(['reviews'])?->findOrFail($rider_id);
            $rider?->setAppends([
                'total_active_rides',
            ]);

            return new SelfResource($rider);
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
            'success' => true
        ], 200);
    }

    private function sendPhoneToken($country_code, $phone)
    {
        if (!$country_code) {
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
            'token' => $token,
            'phone' => '+' . $country_code . $phone,
            'email' => $email,
            'created_at' => Carbon::now()
        ]);

        return $token;
    }

    public function forgotPassword(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email,deleted_at,NULL|string',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $token = rand(11111, 99999);
            if (!isDemoMode()) {
                $token = 123456;
            }
            DB::table('password_resets')->insert([
                'email' => $request->email,
                'token' => $token,
                'created_at' => Carbon::now()
            ]);

            if (!isDemoMode()) {
                try {

                    Mail::to($request->email)->send(new ForgotPassword($token));

                } catch (Exception $e) {

                    Log::error($e->getMessage());
                }
            }

            return [
                'message' => __('auth.email_verification_sent'),
                'success' => true
            ];
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }


    public function verifyRiderToken(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'email_or_phone' => 'required|string',
                'fcm_token' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $isEmail = filter_var($request->email_or_phone, FILTER_VALIDATE_EMAIL);

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

            $riderQuery = Rider::whereNull('deleted_at');
            if ($isEmail) {
                $rider = $riderQuery->where('email', $request->email_or_phone)->first();
            } else {
                $rider = $riderQuery->where('phone', $request->email_or_phone)->first();
                if ($rider) {
                    $riderCountryCode = ltrim($rider->country_code, '+');
                    if ($riderCountryCode != $country_code) {
                        $rider = null;
                    }
                }
            }

            if ($rider) {
                if ($rider->role->name != RoleEnum::RIDER) {
                    throw new Exception(__('Only Riders are allowed'), 403);
                }

                if (!$rider->status) {
                    throw new Exception(__('Account is disabled'), 403);
                }

                $token = $rider->createToken('auth_token')->plainTextToken;
                $rider->tokens()->update([
                    'role_type' => $rider->getRoleNames()->first(),
                ]);

                $rider->update([
                    'fcm_token' => $request->fcm_token,
                ]);

                return response()->json([
                    'id' => $rider?->id,
                    'access_token' => $token,
                    'is_registered' => true,
                    'success' => true,
                    'role'  => RoleEnum::RIDER
                ], 200);
            }

            return response()->json([
                'id' => null,
                'message' => __('Token verified successfully'),
                'is_registered' => false,
                'success' => true,
                'role'  => RoleEnum::RIDER
            ], 200);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function socialLogin(SocialLoginRequest $request)
    {

        try {
            $rider = $this->createOrGetUser($request);
            if ($request->fcm_token) {
                $rider->fcm_token = $request->fcm_token;
                $rider->save();
            }

            if ($rider->status) {
                $token = $rider->createToken('auth_token')->plainTextToken;
                $rider->tokens()->update([
                    'role_type' => $rider->getRoleNames()->first(),
                ]);

                return response()->json([
                    'success' => true,
                    'role_type'  => $rider->getRoleNames()->first(),
                    'access_token' => $token,
                ], 200);
            }

            throw new Exception(__('auth.user_deactivated'), 403);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    private function createOrGetUser($request)
    {
        DB::beginTransaction();
        try {

            $user = $request->user;
            if ($request->login_type === 'phone') {
                $phone = $user?->phone;
                $code = $user?->code;

                $existingRider = Rider::where('phone', $phone)->whereNull('deleted_at')->first();

                if ($existingRider) {
                    return $existingRider;
                }

                $newRider = Rider::create([
                    'status' => true,
                    'phone' => $phone,
                    'country_code' => $code,
                    'name' => $user->name ?? null,
                    'email' => $user->email ?? null,
                    'referral_code' => getReferralCodeByName($user->name ?? 'Rider'),
                ]);
            } elseif ($request->login_type === 'apple') {

                if (!$user) {
                    if ($request->apple_token) {
                        $user = Rider::where('remember_token', $request->apple_token)?->whereNull('deleted_at')?->where('status', true)?->first();
                        if ($user) {
                            return $user;
                        } else {
                            $newRider = Rider::create([
                                'status' => true,
                                'email' => $user->email ?? null,
                                'name' => $user->name ?? null,
                                'remember_token' => $request->apple_token,
                                'referral_code' => getReferralCodeByName($user->name  ?? 'Rider'),
                            ]);
                        }
                    }
                } else {

                    if ($user->phone) {
                        $existingRider = Rider::where('phone', $request->phone)->whereNull('deleted_at')->first();
                    }

                    if ($user->email) {
                        $existingRider = Rider::where('email', $request->email)->whereNull('deleted_at')->first();
                    }

                    if ($user->email || $user->phone) {
                        if ($existingRider) {
                            return $existingRider;
                        } else {
                            $newRider = Rider::create([
                                'status' => true,
                                'email' => $user->email ?? null,
                                'name' => $user->name ?? null,
                                'remember_token' => $request->apple_token,
                                'referral_code' => getReferralCodeByName($user->name ?? 'Rider'),
                            ]);
                        }
                    }
                }
            } else {

                $user = (object) $request->user;
                if($user?->email && $user?->name){
                    $email = $user?->email;
                    $name = $user?->name;
                    $newRider = Rider::where('email', $email)->whereNull('deleted_at')->first();
                    if (!$newRider) {
                        $newRider = Rider::create([
                            'status' => true,
                            'email' => $email ?? null,
                            'name' => $name ?? null,
                            'referral_code' => getReferralCodeByName($name ?? 'Rider'),
                        ]);
                    }

                } else {

                    throw new Exception("Email and Name are required for social login.", 400);
                }
            }

            $riderRole = Role::where('name', RoleEnum::RIDER)->first();
            if ($riderRole) {
                $newRider->assignRole($riderRole);
            }

            $newRider->wallet()->create();
            DB::commit();

            return $newRider;

        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyFirebaseAuthToken(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'country_code' => 'required',
                'phone' => 'required|min:6|max:15',
                'firebase_token' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $firebaseToken = $request->firebase_token;
            $firebaseAuth = (new Factory)->withServiceAccount(config('services.firebase.credentials'))?->createAuth();
            $verifiedToken = $firebaseAuth->verifyIdToken($firebaseToken);
            $rider = Rider::where('phone', $request->phone)?->where('country_code', $request->country_code)?->whereNull('deleted_at')?->first();
            if ($verifiedToken) {
                if (!$rider) {
                    return response()->json([
                        'id' => null,
                        'is_registered' => false,
                        'success' => true,
                        'role'  => RoleEnum::RIDER
                    ], 200);
                }

                $token = $rider->createToken('auth_token')?->plainTextToken;
                return response()->json([
                    'id' => $rider?->id,
                    'access_token'  => $token,
                    'is_registered' => true,
                    'success' => true,
                    'role'  => RoleEnum::RIDER
                ], 200);
            }

            throw new Exception("Token Not found", 422);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function riderRegister(Request $request)
    {
        DB::beginTransaction();
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email|max:255',
                'password' => 'nullable|string|min:8|confirmed',
                'password_confirmation' => 'nullable',
                'country_code' => 'required',
                'phone' => 'required|min:6|max:15',
                'referral_code' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            // Simplified referral code validation for rider-to-rider referrals
            if ($request->referral_code) {
                $referrer = Rider::where('referral_code', $request->referral_code)
                    ->where('status', true)
                    ->whereNull('deleted_at')
                    ->first();

                if (!$referrer) {
                    throw new Exception('Invalid referral code or referrer not found.', 422);
                }

                // Ensure referrer is also a rider (user type validation)
                if (!$referrer->hasRole(RoleEnum::RIDER)) {
                    throw new Exception('Referral code belongs to a different user type.', 422);
                }
            }

            $rider = Rider::create([
                'name' => $request->name,
                'email' => $request->email,
                'country_code' => $request->country_code,
                'phone' => (string) $request->phone,
                'fcm_token' => $request->fcm_token,
                'password' => Hash::make($request->password),
                'referral_code' => getReferralCodeByName($request->name ?? 'Rider')
            ]);

            $rider->assignRole(RoleEnum::RIDER);
            $rider->wallet()->create();
            $rider->wallet;

            DB::commit();

            // Apply referral code using simplified ReferralTrait for referral relationship creation
            if ($request->referral_code) {
                $this->applyReferralCode($request->referral_code, $rider, 'rider');
            }

            $token = $rider->createToken('auth_token')->plainTextToken;
            $rider->tokens()->update([
                'role_type' => $rider->getRoleNames()->first(),
            ]);

            return [
                'id' => $rider?->id,
                'access_token' => $token,
                'success' => true,
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
                'token' => 'required',
                'email' => 'required|email|max:255|exists:users,email,deleted_at,NULL|strings',
                'password' => 'required|min:8|confirmed',
                'password_confirmation' => 'required'
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $user = DB::table('password_resets')
                ->where('token', $request->token)
                ->where('email', $request->email)
                ->where('created_at', '>', Carbon::now()->subHours(1))
                ->first();

            if (!$user) {
                throw new Exception(__('auth.invalid_email_token'), 400);
            }

            User::where('email', $request->email)->update(['password' => Hash::make($request->password)]);
            DB::table('password_resets')->where('email', $request->email)->delete();
            DB::commit();

            return [
                'message' => __('auth.password_changed'),
                'success' => true
            ];
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getReferredRiderId($referral_code)
    {
        return Rider::where('referral_code', $referral_code)?->whereNull('deleted_at')?->pluck('id');
    }

    public function deleteAccount()
    {
        DB::beginTransaction();

        try {

            $rider = Rider::findOrFail(auth('sanctum')->user()->id);
            $rider->delete();

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
