<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Traits\MessageTrait;
use Modules\Taxido\Enums\RoleEnum;
use Illuminate\Support\Facades\DB;
use App\Http\Traits\FireStoreTrait;
use Modules\Taxido\Models\Document;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Taxido\Emails\VerifyEmail;
use Modules\Taxido\Models\FleetManager;
use Illuminate\Support\Facades\Validator;

class FleetAuthController extends Controller
{
    use MessageTrait, FireStoreTrait;


    public function login(Request $request)
    {
        try {

            $req = $request->validate([
                'email_or_phone' => 'required|string',
                'country_code'   => 'nullable|required_if:email_or_phone,phone|string',
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
        $token = $this->generateToken(email: $email);
        if (! isDemoMode()) {
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

        if (! isDemoMode()) {
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

    public function verifyFleetToken(Request $request)
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


            if (! $isEmail && empty($request->country_code)) {
                throw new Exception(__('Country code is required for phone login'), 422);
            }

            $authTokenQuery = DB::table('auth_tokens')
                ->where('token', $request->token)
                ->where('created_at', '>', Carbon::now()->subHours(1));

            if ($isEmail) {
                $verify_otp = $authTokenQuery->where('email', $request->email_or_phone)->first();
            } else {
                $country_code = ltrim($request->country_code, '+');
                $verify_otp   = $authTokenQuery->where('phone', '+' . $country_code . $request->email_or_phone)->first();
            }

            if (! $verify_otp) {
                throw new Exception(__('Invalid token'), 400);
            }

            $fleetQuery = FleetManager::whereNull('deleted_at');
            if ($isEmail) {
                $fleet = $fleetQuery->where('email', $request->email_or_phone)->first();
            } else {
                $fleet = $fleetQuery->where('phone', $request->email_or_phone)->first();
                if ($fleet) {
                    $fleetCountryCode = ltrim($fleet->country_code, '+');
                    if ($fleetCountryCode != $country_code) {
                        $fleet = null;
                    }
                }
            }

            if ($fleet) {
                if ($fleet->role?->name !== RoleEnum::FLEET_MANAGER) {
                    throw new Exception(__('Only Fleet Manager can login'), 403);
                }

                if (! $fleet->status) {
                    throw new Exception(__('Account is disabled'), 403);
                }

                $token = $fleet->createToken('auth_token')->plainTextToken;
                $fleet->tokens()->update([
                    'role_type' => $fleet->getRoleNames()->first(),
                ]);

                $fleet->update([
                    'fcm_token' => $request->fcm_token,
                ]);

                $fleet          = $fleet->fresh();
                $taxidoSettings = getTaxidoSettings();

                $fleetIsVerified = $fleet?->is_verified;
                if (! $taxidoSettings['activation']['fleet_verification']) {
                    $fleetIsVerified = 1;
                }

                return response()->json([
                    'access_token'  => $token,
                    'is_registered' => true,
                    'is_verified'   => $fleetIsVerified,
                    'success'       => true,
                    'role'  => RoleEnum::FLEET_MANAGER
                ], 200);
            }

            return response()->json([
                'message'       => __('Token verified successfully'),
                'is_registered' => false,
                'success'       => true,
                'role'  => RoleEnum::FLEET_MANAGER
            ], 200);

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function fleetRegister(Request $request)
    {
        DB::beginTransaction();

        try {

            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required',
                'country_code' => 'required',
                'phone' => 'required|min:6|max:15',
                'referral_code' => 'nullable|string|exists:users,referral_code,deleted_at,NULL',
                'documents.*.slug' => 'exists:documents,slug,deleted_at,NULL',
                'company_name' => 'required',
                'company_email' => 'required|email',
                'company_address' => 'required',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $taxidoSettings = getTaxidoSettings();
            $fleetIsVerified = 0;
            if (! $taxidoSettings['activation']['fleet_verification']) {
                $fleetIsVerified = 1;
            }

            $fleetManager = FleetManager::create([
                'name'                => $request->name,
                'email'               => $request->email,
                'country_code'        => $request->country_code,
                'phone'               => (string) $request->phone,
                'fcm_token'           => $request?->fcm_token,
                'password'            => Hash::make($request->password),
                'is_verified' => $fleetIsVerified
            ]);

            $fleetManager->assignRole(RoleEnum::FLEET_MANAGER);
            $fleetManager->wallet()->create();
            $fleetManager->wallet;

            if ($request->company_name && $request->company_email) {
                $fleetManager->address()->create([
                    'company_name' => $request->company_name,
                    'company_email' => $request->company_email,
                    'company_address' => $request->company_address,
                    'postal_code' =>$request->postal_code,
                    'city' => $request->city,
                    'state' => $request->state
                ]);
            }

            if (!empty($request->documents) && is_array($request->documents)) {
                if (count($request->documents)) {
                    foreach ($request->documents as $document) {
                        if (is_array($document)) {
                            $attachmentObj = createAttachment();
                            $attachment_id = addMedia($attachmentObj, $document['file'])?->id;
                            $attachmentObj?->delete();
                            $doc = Document::where('slug', $document['slug'])->first();
                            $expired_at = $document['expired_at'] ?? null;
                            if ($doc?->need_expired_date) {
                                if (! $expired_at) {
                                    throw new Exception(__('taxido::auth.expired_date_required', ['name' => $doc?->name]), 422);
                                }
                            }

                            $fleetManager->documents()?->create([
                                'document_id'       => $doc?->id,
                                'document_image_id' => $attachment_id,
                                'expired_at'        => $expired_at,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            $token = $fleetManager->createToken('auth_token')->plainTextToken;
            $fleetManager->tokens()->update([
                'role_type' => $fleetManager->getRoleNames()->first(),
            ]);

            $taxidoSettings   = getTaxidoSettings();
            $fleetIsVerified = 0;
            if (! $taxidoSettings['activation']['fleet_verification'] ?? 1) {
                $fleetIsVerified = 1;
            }

            return [
                'id'  => $fleetManager?->id,
                'name' => $fleetManager?->name,
                'role'  => RoleEnum::FLEET_MANAGER,
                'is_verified'       => $fleetIsVerified,
                'access_token'      => $token,
            ];

        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function fleetVehicle(Request $request)
    {
        DB::beginTransaction();

        try{

            $validator = Validator::make($request->all(), [
                'vehicle_type' => 'required|string',
                'vehicle_name' => 'required|string',
                'vehicle_number' => 'required|string',
                'vehicle_model' => 'required|string',
                'vehicle_model_year' => 'required|integer',
                'vehicle_color' => 'required|string',
                'documents.*.slug' => 'exists:documents,slug,deleted_at,NULL',
            ]);

            if ($validator->fails()) {
                throw new Exception($validator->messages()->first(), 422);
            }

            $fleetManagerId = getCurrentUserId();
            $fleetManager = FleetManager::findOrFail($fleetManagerId);

            $vehicle = $fleetManager->vehicles()->create([
                'name' => $request->vehicle_name,
                'plate_number' => $request->vehicle_number,
                'model' => $request->vehicle_model,
                'vehicle_type_id' => $request->vehicle_type,
                'color' => $request->vehicle_color,
                'vehicle_model_year' => $request->vehicle_model_year,
                'fleet_manager_id' => $fleetManagerId,
            ]);

            if (!empty($request->documents) && is_array($request->documents)) {
                if (count($request->documents)) {
                    foreach ($request->documents as $document) {
                        if (is_array($document)) {
                            $attachmentObj = createAttachment();
                            $attachment_id = addMedia($attachmentObj, $document['file'])?->id;
                            $attachmentObj?->delete();
                            $doc = Document::where('slug', $document['slug'])->first();
                            $expired_at = $document['expired_at'] ?? null;
                            if ($doc?->need_expired_date) {
                                if (! $expired_at) {
                                    throw new Exception(__('taxido::auth.expired_date_required', ['name' => $doc?->name]), 422);
                                }
                            }

                            $fleetManager->documents()?->create([
                                'document_id'       => $doc?->id,
                                'document_image_id' => $attachment_id,
                                'expired_at'        => $expired_at,
                                'vehicle_id' => $vehicle->id,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => __('Vehicle added successfully'),
                'success' => true,
                'vehicle_id' => $vehicle->id,
            ], 200);

        } catch(Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }


}
