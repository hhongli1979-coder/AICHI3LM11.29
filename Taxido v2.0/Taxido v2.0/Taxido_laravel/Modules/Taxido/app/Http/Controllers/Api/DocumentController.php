<?php

namespace Modules\Taxido\Http\Controllers\Api;

use Exception;
use Illuminate\Http\Request;
use Modules\Taxido\Models\Document;
use App\Http\Controllers\Controller;
use App\Exceptions\ExceptionHandler;
use Modules\Taxido\Repositories\Api\DocumentRepository;

class DocumentController extends Controller
{
    public $repository;

    public function  __construct(DocumentRepository $repository)
    {
        $this->authorizeResource(Document::class, 'document', [
            'except' => [ 'index', 'show' ],
        ]);
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $document = $this->filter($this->repository, $request);
            return $document->latest('created_at')->simplePaginate($request->paginate ?? $document->count() ?: null);

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

    }

    /**
     * Display the specified resource.
     */
    public function show(Document $document)
    {
        return $this->repository->findOrFail($document?->id);
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
    public function update(Document $document, Request $request)
    {

    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {

    }

    public function updateExpiredDriverDocuments()
    {
        return $this->repository->updateExpiredDriverDocuments();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function filter($document, $request)
    {
        if ($request->field && $request->sort) {
            $document = $document->orderBy($request->field, $request->sort);
        }

        if (isset($request->status)) {
            $document = $document->where('status', $request->status);
        }

        if (isset($request->type)) {
            $document = $document->where('type', $request->type);
        }

        return $document;
    }
}
