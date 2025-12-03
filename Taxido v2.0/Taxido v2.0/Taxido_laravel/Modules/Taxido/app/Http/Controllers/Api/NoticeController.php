<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Notice;
use App\Exceptions\ExceptionHandler;
use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Api\NoticeRepository;

class NoticeController extends Controller
{

    public $repository;

    public function  __construct(NoticeRepository $repository)
    {
        $this->authorizeResource(Notice::class, 'notice', [
            'except' => ['index', 'show'],
        ]);
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

            $notice = $this->filter($this->repository, $request);
            return $notice->latest('created_at')->simplePaginate($request->paginate ?? $notice->count() ?: null);
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
    public function show(Notice $notice)
    {
        return $this->repository->show($notice?->id);
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

    public function filter($notice, $request)
    {
        if ($request->field && $request->sort) {
            $notice = $notice->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $notice = $notice->where('status', $request->status);
        }

        return $notice;
    }
}
