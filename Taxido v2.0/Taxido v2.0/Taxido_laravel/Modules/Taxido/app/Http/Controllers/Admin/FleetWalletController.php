<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\FleetWalletTable;
use Modules\Taxido\Http\Requests\Admin\WalletPointsRequest;
use Modules\Taxido\Repositories\Admin\FleetWalletRepository;
use Modules\Taxido\Http\Requests\Admin\CreditDebitWalletRequest;

class FleetWalletController extends Controller
{

    public $repository;

    public function __construct(FleetWalletRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the fleet manager wallets.
     */
    public function index(Request $request, FleetWalletTable $fleetWalletTable)
    {
        try {
            return $this->repository->index($request, $fleetWalletTable->generate());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Update Balance (Credit or Debit) in Fleet Manager Wallet.
     */
    public function updateBalance(Request $request)
    {
        return $this->repository->updateBalance($request);
    }

    /**
     * Credit Balance to Fleet Manager Wallet.
     */
    public function credit(Request $request)
    {
        return $this->repository->credit($request);
    }

    /**
     * Debit Balance from Fleet Manager Wallet.
     */
    public function debit(Request $request)
    {
        return $this->repository->debit($request);
    }
}