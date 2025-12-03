<?php

namespace Modules\Taxido\Http\Controllers\Front;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Front\WalletRepository;

class WalletController extends Controller
{
    protected $repository;

    public function __construct(WalletRepository $walletRepository)
    {
        $this->repository = $walletRepository;
    }

    public function index()
    {
        return $this->repository->index();
    }

    public function wallet()
    {
        return $this->repository->index();
    }

    public function topUp(Request $request)
    {

        return $this->repository->topUp($request);
    }

    public function verifyPayment($item_id)
    {
        return $this->repository->verifyPayment($item_id);
    }
}
