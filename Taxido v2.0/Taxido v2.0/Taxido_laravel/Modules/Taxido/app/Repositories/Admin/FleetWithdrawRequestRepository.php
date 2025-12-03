<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Enums\PaymentType;
use Illuminate\Support\Arr;
use App\Enums\WalletPointsDetail;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Enums\RoleEnum;
use Modules\Taxido\Enums\RequestEnum;
use Modules\Taxido\Models\FleetManagerWallet;
use Modules\Taxido\Models\FleetWithdrawRequest;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\WalletPointsTrait;
use Modules\Taxido\Events\CreateFleetWithdrawRequestEvent;

class FleetWithdrawRequestRepository extends BaseRepository
{
    use WalletPointsTrait;

    public function model()
    {
        return FleetWithdrawRequest::class;
    }

    public function index($fleetWithdrawRequestTable)
    {
        if (request()->action) {
            return redirect()->back();
        }
        $currentRole = getCurrentRoleName();

        if ($currentRole == RoleEnum::FLEET_MANAGER) {
            $fleetManagerId = getCurrentUserId();
            $wallet         = FleetManagerWallet::where('fleet_manager_id', $fleetManagerId)?->first();
            if (! $wallet) {
                $wallet = $this->getFleetWallet($fleetManagerId);
                $wallet = $wallet->fresh();
            }
            return view('taxido::admin.fleet-withdraw-request.index', ['balance' => $wallet?->balance, 'tableConfig' => $fleetWithdrawRequestTable]);
        }
        return view('taxido::admin.fleet-withdraw-request.index', ['tableConfig' => $fleetWithdrawRequestTable]);
    }

    public function show($id)
    {
        try {
            $roleName = getCurrentRoleName();
            if ($roleName == RoleEnum::FLEET_MANAGER) {
                return $this->userPaymentAccount($id);
            }
            return $this->model->findOrFail($id);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $taxidoSettings = getTaxidoSettings();
            $roleName       = getCurrentRoleName();
            $fleetManagerId = $request->fleet_manager_id;

            if ($roleName == RoleEnum::FLEET_MANAGER) {
                $fleetManagerId      = getCurrentUserId();
                $fleetPaymentAccount = getPaymentAccount($fleetManagerId);
                $this->verifyPaymentAccount($request, $fleetPaymentAccount);
            }

            $fleetWallet       = $this->getFleetWallet($fleetManagerId);
            $fleetBalance      = $fleetWallet->balance;
            $minWithdrawAmount = $taxidoSettings['driver_commission']['min_withdraw_amount'];

            if ($fleetBalance < $request->amount) {
                return redirect()->back()->with('error', 'Your wallet balance is insufficient for this withdrawal');
            }

            if ($minWithdrawAmount > $request->amount) {
                return redirect()->back()->with('error', "The requested amount must be at least $minWithdrawAmount");
            }

            $fleetWithdrawRequest = $this->model->create([
                'amount'           => $request->amount,
                'message'          => $request->message,
                'status'           => RequestEnum::PENDING,
                'fleet_manager_id' => $fleetManagerId,
                'payment_type'     => $request->payment_type,
                'fleet_wallet_id'  => $fleetWallet->id,
            ]);

            $fleetWallet = $this->debitFleetWallet($fleetManagerId, $request->amount, WalletPointsDetail::WITHDRAW);
            event(new CreateFleetWithdrawRequestEvent($fleetWithdrawRequest));
            $fleetWithdrawRequest->fleet;

            DB::commit();
            return to_route('admin.fleet-withdraw-request.index')->with('success', __('Withdraw Successfully'));
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyPaymentAccount($request, $fleetPaymentAccount)
    {
        if (! $fleetPaymentAccount) {
            return redirect()->route('admin.fleet-withdraw-request.index')->with('warning', 'Please create a payment account before applying for a withdrawal.');
        }

        if ($request->payment_type == PaymentType::PAYPAL && ! $fleetPaymentAccount->paypal_email) {
            return redirect()->route('admin.fleet-withdraw-request.index')->with('warning', 'Please add a PayPal email before applying for a withdrawal.');
        }

        if ($request->payment_type == PaymentType::BANK) {
            if (! $fleetPaymentAccount->bank_account_no || ! $fleetPaymentAccount->swift || ! $fleetPaymentAccount->bank_name || ! $fleetPaymentAccount->bank_holder_name) {
                return redirect()->route('admin.fleet-withdraw-request.index')->with('warning', 'Please complete bank details before applying for a withdrawal.');
            }
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $roleName = getCurrentRoleName();
            $fleetWithdrawRequest = $this->model->findOrFail($id);

            if ($roleName == RoleEnum::FLEET_MANAGER) {
                throw new Exception("Unauthorized for $roleName", 403);
            }

            $data = [
                'status' => $request['status'],
                'admin_message' => $request['admin_message'] ?? null,
            ];

            $fleetWithdrawRequest->update($data);

            $fleetWithdrawRequest = $fleetWithdrawRequest->fresh();
            if (!$fleetWithdrawRequest->is_used && $fleetWithdrawRequest->status == RequestEnum::REJECTED) {
                $this->creditFleetWallet($fleetWithdrawRequest->fleet_manager_id, $fleetWithdrawRequest->amount, WalletPointsDetail::REJECTED);
                $fleetWithdrawRequest->is_used = true;
                $fleetWithdrawRequest->save();
            }

            $fleetWithdrawRequest->total_pending_withdraw_requests = $this->model->where('status', 'pending')->count();

            DB::commit();

            return redirect()->route('admin.fleet-withdraw-request.index')->with('message', "Successfully {$fleetWithdrawRequest->status} Request");
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            $roleName       = getCurrentRoleName();
            $paymentAccount = $this->model->findOrFail($id);
            if ($roleName == RoleEnum::FLEET_MANAGER) {
                $paymentAccount = $this->userPaymentAccount($id);
            }
            return $paymentAccount->destroy($id);
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($request, $id)
    {
        $fleetWithdrawRequest = $this->model->findOrFail($id);
        $fleetWithdrawRequest->update(['status' => $request]);

        return redirect()->back()->with('success', __('Withdraw Request Status Updated Successfully'));
    }
}
