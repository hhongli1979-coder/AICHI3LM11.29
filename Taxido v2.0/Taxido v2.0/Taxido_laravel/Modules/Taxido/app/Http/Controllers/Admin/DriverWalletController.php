<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\DriverWalletTable;
use Modules\Taxido\Http\Requests\Admin\WalletPointsRequest;
use Modules\Taxido\Repositories\Admin\DriverWalletRepository;
use Modules\Taxido\Http\Requests\Admin\CreditDebitWalletRequest;

class DriverWalletController extends Controller
{
    public $repository;

    public function __construct(DriverWalletRepository $repository)
    {
        $this->repository = $repository;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(WalletPointsRequest $request, DriverWalletTable $driverWalletTable)
    {
        try {
            return $this->repository->index($request, $driverWalletTable->generate());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Update Balance Credit or Debit from Consumer Wallet.
     *
     */
    public function updateBalance(CreditDebitWalletRequest $request)
    {
        return $this->repository->updateBalance($request);
    }

    /**
     * Credit Balance from Consumer Wallet.
     */
    public function credit(Request $request)
    {
        return $this->repository->credit($request);
    }

    /**
     * Debit Balance from Consumer Wallet.
     *
     */
    public function debit(Request $request)
    {
        return $this->repository->debit($request);
    }
}
