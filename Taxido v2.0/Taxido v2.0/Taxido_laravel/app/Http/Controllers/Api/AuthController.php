<?php

namespace App\Http\Controllers\Api;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Enums\RoleEnum;
use App\Mail\ForgotPassword;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Traits\MessageTrait;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    use MessageTrait;

    public function login(Request $request)
    {
        try {
            $user = $this->verifyLogin($request);
            if (! Hash::check($request->password, $user->password)) {
                throw new Exception(__('static.auth.invalid_credentials'), 400);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $user->tokens()->update([
                'tokenable_type' => $user->getMorphClass(),
                'role_type'      => $user->getRoleNames()->first(),
            ]);

            $user->update([
                'fcm_token' => $request?->fcm_token,
            ]);

            return [
                'access_token' => $token,
                'permissions'  => $user->getAllPermissions(),
                'success'      => true,
            ];

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function login_with_numb(Request $request)
    {
        try {

                $this->verifyLogin($request);
                $token = rand(111111, 999999);

                DB::table('auth_tokens')->insert([
                    'token'      => $token,
                    'phone'      => '+' . $request->country_code . $request->phone,
                    'created_at' => Carbon::now(),
                ]);

                $sendTo  = '+' . $request->country_code . $request->phone;
                $message = 'Your OTP is ' . $token;
                sendSMS($sendTo, $message);

                return [
                    'message' => (_('static.auth.otp_sent')),
                    'success' => true,
                ];

            throw new Exception(_('static.auth.login_method_disabled'), 400);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function adminLogin(Request $request)
    {
        try {

            $user = $this->verifyLogin($request);
            if (! Hash::check($request->password, $user->password) || ! $user->hasRole(RoleEnum::ADMIN)) {
                throw new Exception(__('auth.invalid_backend_credentials'), 400);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $user->tokens()->update([
                'role_type' => $user->getRoleNames()->first(),
            ]);

            $user->update([
                'fcm_token' => $request?->fcm_token,
            ]);

            return [
                'access_token' => $token,
                'permissions'  => $user->getAllPermissions(),
                'success'      => true,
            ];
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verify_auth_token(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'country_code' => 'required',
                'phone'        => 'required',
                'token'        => 'required',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $verify_otp = DB::table('auth_tokens')
                ->where('token', $request->token)
                ->where('phone', '+' . $request->country_code . $request->phone)
                ->where('created_at', '>', Carbon::now()->subHours(1))
                ->first();

            if (! $verify_otp) {
                throw new Exception(__('static.auth.invalid_token'), 400);
            }

            $user  = User::where('phone', (string) $request->phone)->first();
            $token = $user->createToken('auth_token')->plainTextToken;
            $user->tokens()->update([
                'role_type' => $user->getRoleNames()->first(),
            ]);

            return [
                'access_token' => $token,
                'permissions'  => $user->getAllPermissions(),
                'success'      => true,
            ];
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyLogin(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email'        => ['nullable', Rule::requiredIf(! $request->phone), 'email'],
                'password'     => ['nullable', Rule::requiredIf(! $request->phone)],
                'phone'        => ['nullable', Rule::requiredIf(! $request->email)],
                'country_code' => ['nullable', Rule::requiredIf(! $request->email)],
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $user = User::where('email', $request->email)->orWhere('phone', (string) $request->phone)->first();
            if (! $user && isset($request->email)) {
                throw new Exception(__('static.auth.no_linked_email'), 400);
            }

            if (! $user && isset($request->phone)) {
                throw new Exception(_('static.auth.no_linked_number'), 400);
            }

            if (! $user->status) {
                throw new Exception(_('static.auth.disabled_account'), 400);
            }
            return $user;
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function register(Request $request)
    {
        DB::beginTransaction();
        try {
            $validator = Validator::make($request->all(), [
                'name'                  => 'required|string|max:255',
                'email'                 => 'required|string|email|max:255|unique:users,email,NULL,id,deleted_at,NULL',
                'password'              => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required',
                'country_code'          => 'required',
                'phone'                 => 'required|min:9|unique:users,phone,NULL,id,deleted_at,NULL',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $user = User::create([
                'username'     => $request->username,
                'name'         => $request->name,
                'email'        => $request->email,
                'password'     => Hash::make($request->password),
                'country_code' => $request->country_code,
                'phone'        => (string) $request->phone,
                'fcm_token'    => $request->fcm_token,
            ]);

            $user->tokens()->update([
                'role_type' => $user->getRoleNames()->first(),
            ]);

            DB::commit();
            return [
                'access_token' => $user->createToken('auth_token')->plainTextToken,
                'permissions'  => $user->getPermissionNames(),
                'success'      => true,
            ];
        } catch (Exception $e) {
            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forgotPassword(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $token = rand(111111, 999999);
            DB::table('password_resets')->insert([
                'email'      => $request->email,
                'token'      => $token,
                'created_at' => Carbon::now(),
            ]);

            Mail::to($request->email)->send(new ForgotPassword($token));
            return [
                'message' => __('static.verification_code'),
                'success' => true,
            ];
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyToken(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'token' => 'required',
                'email' => 'required|email|max:255',
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
                throw new Exception(__('static.email_not_recognized'), 400);
            }

            return [
                'message' => __('static.verification_token'),
                'success' => true,
            ];
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updatePassword(Request $request)
    {
        DB::beginTransaction();
        try {

            $validator = Validator::make($request->all(), [
                'token'                 => 'required',
                'email'                 => 'required|email|max:255|exists:users',
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
                throw new Exception(__('static.email_not_recognized'), 400);
            }

            User::where('email', $request->email)
                ->update(['password' => Hash::make($request->password)]);

            DB::table('password_resets')->where('email', $request->email)->delete();
            DB::commit();

            return [
                'message' => __('static.change_password'),
                'success' => true,
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function logout(Request $request)
    {
        try {

            $token = PersonalAccessToken::findToken($request->bearerToken());
            if (! $token) {
                throw new Exception(__('static.select_token'), 400);
            }
            $token->delete();

            return [
                'message' => __('static.user_logout'),
                'success' => true,
            ];
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function checkUserValidation(Request $request)
    {
        try {

            $users = DB::table('users')->whereNull('deleted_at')->where(function ($query) use ($request) {
                $query->where('username', $request->username)
                    ->orWhere('phone', $request->phone)
                    ->orWhere('email', $request->email);
            })->exists();

            return 0;

        } catch (Exception $e) {
            return 1;
        }
    }
}
