<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\WithdrawRequest;
use Modules\Taxido\Tables\WithdrawRequestTable;
use Modules\Taxido\Http\Requests\Admin\CreateWithdrawRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateWithdrawRequest;
use Modules\Taxido\Repositories\Admin\WithdrawRequestRepository;

class WithdrawRequestController extends Controller
{

    public $repository;

    public function __construct(WithdrawRequestRepository $repository)
    {
        $this->authorizeResource(WithdrawRequest::class, 'withdraw_request');
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(WithdrawRequestTable $withdrawRequestTable)
    {
        try {
            return $this->repository->index($withdrawRequestTable->generate());
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create( )
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateWithdrawRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(WithdrawRequest $withdrawRequest)
    {
        return $this->repository->show($withdrawRequest->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WithdrawRequest $withdrawRequest)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(UpdateWithdrawRequest $request, WithdrawRequest $withdrawRequest)
    {
        return $this->repository->update($request->all(), $withdrawRequest->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($request->status, $id);
    }

    public function export(Request $request)
    {
        return $this->repository->export($request);
    }
}
