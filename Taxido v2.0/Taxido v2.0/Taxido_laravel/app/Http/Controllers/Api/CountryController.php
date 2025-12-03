<?php

namespace App\Http\Controllers\Api;

use App\Models\Country;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Api\CountryRepository;
use App\Http\Resources\Api\CountriesResource;

class CountryController extends Controller
{
    public $repository;

    public function __construct(CountryRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $countries = $this->filter($this->repository, $request);
        $countries = $countries->simplePaginate($request->paginate ?? $countries->count() ?: null);
        return CountriesResource::collection($countries ?? []);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Country $country)
    {
        return $this->repository->show($country->id);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function getCountryId(Request $request)
    {
       return $this->repository->getCountryId($request);
    }

    public function filter($countries, $request)
    {

        if ($request->field && $request->sort) {
            $countries = $countries->orderBy($request->field, $request->sort);
        }

        return $countries;
    }
}
