<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Http\Resources\Drivers\FleetWalletResource;
use Modules\Taxido\Models\FleetWithdrawRequest;
use Modules\Taxido\Models\WithdrawRequest;
use Modules\Taxido\Http\Traits\WalletPointsTrait;
use Modules\Taxido\Repositories\Api\DriverWalletRepository;
use Modules\Taxido\Http\Resources\Drivers\DriverWalletResource;
use Modules\Taxido\Repositories\Api\FleetWalletRepository;

class FleetWalletController extends Controller
{
    use WalletPointsTrait;

    protected $repository;

    public function __construct(FleetWalletRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display Rider Wallet Transactions.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            return $this->filter($request);

        } catch (Exception $e) {
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function filter(Request $request)
    {
        $fleet_manager_id = $request->fleet_manager_id ?? getCurrentUserId();
        $fleetManagerWallet = $this->repository->findByField('fleet_manager_id', $fleet_manager_id)->first();

        if(!$fleetManagerWallet) {
            $fleetManagerWallet = $this->getDriverWallet($request->fleet_manager_id ?? getCurrentUserId());
            $fleetManagerWallet = $fleetManagerWallet->fresh();
        }

        $fleetWalletHistory = $fleetManagerWallet?->histories()->where('type', 'LIKE', "%{$request->search}%");
        if ($request->start_date && $request->end_date) {
            $fleetWalletHistory->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        return new FleetWalletResource($fleetManagerWallet);
    }

    public function getWithdrawRequest(Request $request)
    {
        try {

            $WithdrawRequest = $this->withdrawRequestFilter($request);
            return $WithdrawRequest->latest('created_at')->simplePaginate($request->paginate ?? $WithdrawRequest->count() ?: null);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function withdrawRequestFilter($request)
    {
        $roleName = getCurrentRoleName();
        $withdrawRequest = FleetWithdrawRequest::whereNull('deleted_at');
        if ($roleName == RoleEnum::FLEET_MANAGER) {
            $withdrawRequest = $withdrawRequest->where('fleet_wallet_id',getCurrentUserId());
        }

        if ($request->field && $request->sort) {
            $withdrawRequest = $withdrawRequest->orderBy($request->field, $request->sort);
        }

        if ($request->start_date && $request->end_date) {
            $withdrawRequest = $withdrawRequest->whereBetween('created_at',[$request->start_date, $request->end_date]);
        }

        return $withdrawRequest;
    }


    public function withdrawRequest(Request $request)
    {
        return $this->repository->withdrawRequest($request);
    }

    public function topUp(Request $request)
    {
        return $this->repository->topUp($request);
    }
}
