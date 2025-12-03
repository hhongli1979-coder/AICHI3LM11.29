<?php

namespace App\Http\Controllers\Admin;

use App\Models\Currency;
use Illuminate\Http\Request;
use App\Tables\CurrencyTable;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\CurrencyRepository;
use App\Http\Requests\Admin\CreateCurrencyRequest;
use App\Http\Requests\Admin\UpdateCurrencyRequest;

class CurrencyController extends Controller
{
    public $repository;
    protected $countries;

    public function __construct(CurrencyRepository $repository)
    {
        $this->authorizeResource(Currency::class,'currency');
        $this->repository = $repository;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(CurrencyTable $currencyTable)
    {
        return $this->repository->index($currencyTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->repository->create();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateCurrencyRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Currency $currency)
    {
        return $this->repository->edit($currency);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCurrencyRequest $request, Currency $currency)
    {
        return $this->repository->update($request->all(), $currency->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Currency $currency)
    {
        return $this->repository->destroy($currency->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        return $this->repository->restore($id);
    }

    /**
     * Permanent delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }

    public function getSymbol(Request $request)
    {
        return $this->repository->getSymbol($request);
    }
}
