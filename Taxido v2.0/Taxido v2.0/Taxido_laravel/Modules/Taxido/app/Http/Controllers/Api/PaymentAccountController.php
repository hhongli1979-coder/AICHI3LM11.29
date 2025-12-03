<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\PaymentAccount;
use Modules\Taxido\Repositories\Api\PaymentAccountRepository;

class PaymentAccountController extends Controller
{
    public $repository;

    public function __construct(PaymentAccountRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {

            $paymentAccounts = $this->filter($this->repository, $request);
            return $paymentAccounts->simplePaginate($request->paginate ?? $paymentAccounts->count() ?: null);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(PaymentAccount $paymentAccount)
    {
        return $this->repository->show($paymentAccount->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PaymentAccount $paymentAccount,Request $request)
    {
        return $this->repository->update($request->all(),$paymentAccount->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PaymentAccount $paymentAccount)
    {
        return $this->repository->destroy($paymentAccount->id);
    }

    public function filter($paymentAccounts, $request)
    {
        if ($request->field && $request->sort) {
            $paymentAccounts = $paymentAccounts->orderBy($request->field, $request->sort);
        }
        if (isset($request->status)) {
            $paymentAccounts = $paymentAccounts->where('status', $request->status);
        }
        return $paymentAccounts;
    }
}
