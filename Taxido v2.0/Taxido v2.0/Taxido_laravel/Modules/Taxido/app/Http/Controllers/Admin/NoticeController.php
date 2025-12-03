<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Notice;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\NoticeTable;
use Modules\Taxido\Repositories\Admin\NoticeRepository;
use Modules\Taxido\Http\Requests\Admin\CreateNoticeRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateNoticeRequest;

class NoticeController extends Controller
{
    public $repository;

    public function __construct(NoticeRepository $repository)
    {
        $this->authorizeResource(Notice::class, 'notice');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(NoticeTable $noticeTable)
    {
        return $this->repository->index($noticeTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.notice.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateNoticeRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Notice $notice)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Notice $notice)
    {
        return view('taxido::admin.notice.edit', ['notice' => $notice]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNoticeRequest $request, Notice $notice)
    {
        return $this->repository->update($request->all(), $notice->id);
    }

   
    public function destroy(Notice $notice)
    {
        return $this->repository->destroy($notice->id);
    }

  
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

  
    public function restore($id)
    {
        return $this->repository->restore($id);
    }

   
    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
