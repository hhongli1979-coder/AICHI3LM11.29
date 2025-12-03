<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Enums\RoleEnum;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\WithdrawRequest;
use Modules\Taxido\Http\Traits\WalletPointsTrait;
use Modules\Taxido\Repositories\Api\DriverWalletRepository;
use Modules\Taxido\Http\Resources\Drivers\DriverWalletResource;

class DriverWalletController extends Controller
{
    use WalletPointsTrait;

    protected $repository;

    public function __construct(DriverWalletRepository $repository)
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
        $driver_id = $request->driver_id ?? getCurrentUserId();
        $driverWallet = $this->repository->findByField('driver_id', $driver_id)->first();

        if(!$driverWallet)
        {
            $driverWallet = $this->getDriverWallet($request->driver_id ?? getCurrentUserId());
            $driverWallet = $driverWallet->fresh();
        }

        $driverWalletHistory = $driverWallet?->histories()->where('type', 'LIKE', "%{$request->search}%");
        if ($request->start_date && $request->end_date) {
            $driverWalletHistory->whereBetween('created_at', [$request->start_date, $request->end_date]);
        }

        return new DriverWalletResource($driverWallet);
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
        $withdrawRequest = WithdrawRequest::whereNull('deleted_at');
        if ($roleName == RoleEnum::DRIVER) {
            $withdrawRequest = $withdrawRequest->where('driver_id',getCurrentUserId());
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
