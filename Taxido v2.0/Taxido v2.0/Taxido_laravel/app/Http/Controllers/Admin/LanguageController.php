<?php

namespace App\Http\Controllers\Admin;

use App\Models\Language;
use Illuminate\Http\Request;
use App\Tables\LanguageTable;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\LanguageRepository;
use App\Http\Requests\Admin\CreateLanguageRequest;
use App\Http\Requests\Admin\UpdateLanguageRequest;

class LanguageController extends Controller
{
    private $repository;

    public function __construct(LanguageRepository $repository)
    {
        $this->authorizeResource(Language::class, 'language');
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(LanguageTable $languageTable)
    {
        return $this->repository->index($languageTable->generate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.language.create');
    }

    /**
     * Display the specified resource.
     */
    public function show(Language $language)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Language $language)
    {
        return view('admin.language.edit',['language' => $language]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateLanguageRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLanguageRequest $request, Language $language)
    {
        return $this->repository->update($request->all(), $language->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Language $language)
    {
        return $this->repository->destroy($language->id);
    }

    /**
     * Update Status the specified resource from storage.
     *
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    public function rtl(Request $request, $id)
    {
        return $this->repository->rtl($id, $request->status);
    }

    public function translate(Request $request)
    {
        return $this->repository->translate($request);
    }

    public function translate_update(Request $request, $id)
    {
        return $this->repository->translate_update($request, $id);
    }
}
