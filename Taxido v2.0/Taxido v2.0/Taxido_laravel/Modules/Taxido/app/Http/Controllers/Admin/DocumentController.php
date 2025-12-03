<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Taxido\Models\Document;
use App\Http\Controllers\Controller;
use Modules\Taxido\Tables\DocumentTable;
use Modules\Taxido\Repositories\Admin\DocumentRepository;
use Modules\Taxido\Http\Requests\Admin\CreateDocumentRequest;
use Modules\Taxido\Http\Requests\Admin\UpdateDocumentRequest;

class DocumentController extends Controller
{
    public $repository;

    public function __construct(DocumentRepository $repository)
    {
        $this->authorizeResource(Document::class,'document');
        $this->repository = $repository;
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index(DocumentTable $documentTable)
    {
        return $this->repository->index($documentTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('taxido::admin.document.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateDocumentRequest $request)
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
    public function edit(Document $document)
    {
        return view('taxido::admin.document.edit',['document'=> $document]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDocumentRequest $request, Document $document)
    {
        return $this->repository->update($request->all(),$document->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        return $this->repository->destroy($document->id);
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
}
