<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\ExtraCharge;
use Modules\Taxido\Repositories\Admin\ExtraChargeRepository;

class ExtraChargeController extends Controller
{
    public $repository;

    public function  __construct(ExtraChargeRepository $repository)
    {
        $this->authorizeResource(ExtraCharge::class, 'extraCharge', [
            'except' => [ 'index', 'show' ],
        ]);
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        try {

            $banner = $this->filter($this->repository, $request);
            return $banner->latest('created_at')->paginate($request->paginate ?? $banner->count() ?: null );

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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ExtraCharge $extraCharge)
    {
        return $this->repository->show($extraCharge?->id);
    }

    public function filter($extraCharge, $request)
    {
        if (isset($request->status)) {
            $extraCharge = $extraCharge->where('status', $request->status);
        }

        return $extraCharge;
    }
}
