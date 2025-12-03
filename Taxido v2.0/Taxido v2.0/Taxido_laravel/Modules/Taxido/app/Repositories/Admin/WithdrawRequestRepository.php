<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use App\Enums\RoleEnum;
use App\Enums\PaymentType;
use Illuminate\Support\Arr;
use App\Enums\WalletPointsDetail;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Maatwebsite\Excel\Facades\Excel;
use Modules\Taxido\Enums\RequestEnum;
use Modules\Taxido\Models\DriverWallet;
use Modules\Taxido\Models\WithdrawRequest;
use Prettus\Repository\Eloquent\BaseRepository;
use Modules\Taxido\Http\Traits\WalletPointsTrait;
use Modules\Taxido\Exports\WithdrawRequestExport;
use Modules\Taxido\Enums\RoleEnum as EnumsRoleEnum;
use Modules\Taxido\Events\CreateWithdrawRequestEvent;
use Modules\Taxido\Events\UpdateWithdrawRequestEvent;

class WithdrawRequestRepository extends BaseRepository
{
    use WalletPointsTrait;

    function model()
    {
        return WithdrawRequest::class;
    }

    public function index($withdrawRequestTable)
    {
        if (request()->action) {
            return redirect()->back();
        }
        $currentRole = getCurrentRoleName();

        if ($currentRole == EnumsRoleEnum::DRIVER) {
            $driver_id = getCurrentUserId();
            $wallet = DriverWallet::where('driver_id', $driver_id)?->first();
            if (!$wallet) {
                $wallet = $this->getDriverWallet($driver_id);
                $wallet = $wallet->fresh();
            }
            return view('taxido::admin.withdraw-request.index', ['balance' => $wallet?->balance, 'tableConfig' => $withdrawRequestTable]);
        }
        return view('taxido::admin.withdraw-request.index', ['tableConfig' => $withdrawRequestTable]);
    }

    public function show($id)
    {
        try {

            $roleName = getCurrentRoleName();
            if ($roleName == EnumsRoleEnum::DRIVER || $roleName == RoleEnum::USER) {
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
            $roleName = getCurrentRoleName();
            $driver_id = $request->driver_id;

            if ($roleName == EnumsRoleEnum::DRIVER) {
                $driver_id = getCurrentUserId();
                $driverPaymentAccount = getPaymentAccount($driver_id);
                $this->verifyPaymentAccount($request, $driverPaymentAccount);
            }

            $driverWallet = $this->getDriverWallet($driver_id);
            $driverBalance = $driverWallet->balance;
            $minWithdrawAmount = $taxidoSettings['driver_commission']['min_withdraw_amount'];

            if ($driverBalance < $request->amount) {
                return redirect()->back()->with('error', 'Your wallet balance is insufficient for this withdrawal');
            }

            if ($minWithdrawAmount > $request->amount) {
                return redirect()->back()->with('error', "The requested amount must be at least $minWithdrawAmount");
            }

            $withdrawRequest = $this->model->create([
                'amount' => $request->amount,
                'message' => $request->message,
                'status' => RequestEnum::PENDING,
                'driver_id' => $driver_id,
                'payment_type' => $request->payment_type,
                'driver_wallet_id' => $driverWallet->id,
            ]);

            $driverWallet = $this->debitDriverWallet($driver_id, $request->amount, WalletPointsDetail::WITHDRAW);
            event(new CreateWithdrawRequestEvent($withdrawRequest));
            $withdrawRequest->user;

            DB::commit();

            return to_route('admin.withdraw-request.index')->with('success', __('Withdraw Successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function verifyPaymentAccount($request, $driverPaymentAccount)
    {
        if (! $driverPaymentAccount) {
            return redirect()->route('admin.withdraw-request.index')->with('warning', 'Please create a payment account before applying for a withdrawal.');
        }

        if ($request->payment_type == PaymentType::PAYPAL && ! $driverPaymentAccount->paypal_email) {
            return redirect()->route('admin.withdraw-request.index')->with('warning', 'Please add a paypal email before applying for a withdrawal.');
        }

        if ($request->payment_type == PaymentType::BANK) {
            if (! $driverPaymentAccount->bank_account_no || ! $driverPaymentAccount->swift || ! $driverPaymentAccount->bank_name || ! $driverPaymentAccount->bank_holder_name) {
                return redirect()->route('admin.withdraw-request.index')->with('warning', 'Please complete a bank detail before applying for a withdrawal.');
            }
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {
            $roleName = getCurrentRoleName();
            $withdrawRequest = $this->model->findOrFail($id);

            if ($roleName == EnumsRoleEnum::DRIVER) {
                throw new Exception("Unauthorized for $roleName", 403);
            }

            $data = [
                'status' => $request['status'],
                'admin_message' => $request['admin_message'] ?? null,
            ];

            $withdrawRequest->update($data);

            $withdrawRequest = $withdrawRequest->fresh();
            if (!$withdrawRequest->is_used && $withdrawRequest->status == RequestEnum::REJECTED) {
                $this->creditDriverWallet($withdrawRequest->driver_id, $withdrawRequest->amount, WalletPointsDetail::REJECTED);
                $withdrawRequest->is_used = true;
                $withdrawRequest->save();
            }

            $withdrawRequest->total_pending_withdraw_requests = $this->model->where('status', 'pending')->count();
            event(new UpdateWithdrawRequestEvent($withdrawRequest));

            DB::commit();

            return redirect()->route('admin.withdraw-request.index')->with('message', "Successfully {$withdrawRequest->status} Request");
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $roleName = getCurrentRoleName();
            $paymentAccount = $this->model->findOrFail($id);
            if ($roleName == EnumsRoleEnum::DRIVER) {
                $paymentAccount = $this->userPaymentAccount($id);
            }

            return $paymentAccount->destroy($id);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($request, $id)
    {
        $withdrawRequest = $this->model->findOrFail($id);
        $withdrawRequest->update(['status' => $request]);

        return redirect()->back()->with('success', __('Withdraw Request Status Updated Successfully'));
    }

    public function export($request)
    {
        try {
            $format = $request->get('format', 'csv');
            switch ($format) {
                case 'excel':
                    return $this->exportExcel();
                case 'csv':
                default:
                    return $this->exportCsv();
            }
        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function exportCsv()
    {
        return Excel::download(new WithdrawRequestExport, 'withdrawRequests.csv');
    }

    public function exportExcel()
    {
        return Excel::download(new WithdrawRequestExport, 'withdrawRequests.xlsx');
    }
}
