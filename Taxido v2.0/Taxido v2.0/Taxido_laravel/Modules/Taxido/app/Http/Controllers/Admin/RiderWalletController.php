<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\RiderWalletTable;
use Modules\Taxido\Repositories\Admin\RiderWalletRepository;

class RiderWalletController extends Controller
{
    public $repository;

    public function __construct(RiderWalletRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, RiderWalletTable $riderWalletTable)
    {
        try {

            return $this->repository->index($request, $riderWalletTable->generate());

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Update Balance Credit or Debit from Consumer Wallet.
     *
     */
    public function updateBalance(Request $request)
    {
        return $this->repository->updateBalance($request);
    }

    /**
     * Credit Balance from Consumer Wallet.
     *
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
