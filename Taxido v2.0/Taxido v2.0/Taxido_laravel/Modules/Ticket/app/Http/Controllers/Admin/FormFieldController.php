<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Ticket\Models\FormField;
use Modules\Ticket\Tables\FormFieldTable;
use Modules\Ticket\Repositories\Admin\FormFieldRepository;
use Modules\Ticket\Http\Requests\Admin\CreateFormFieldRequest;
use Modules\Ticket\Http\Requests\Admin\UpdateFormFieldRequest;

class FormFieldController extends Controller
{
    private $repository;

    public function __construct(FormFieldRepository $repository)
    {
        $this->authorizeResource(FormField::class, 'formfield');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(FormFieldTable $formfieldTable)
    {
        return $this->repository->index($formfieldTable->generate());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateFormFieldRequest $request)
    {
        return $this->repository->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(FormField $formfield)
    {
        return $this->repository->show($formfield->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FormField $formfield)
    {
        return $this->repository->edit($formfield->id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFormFieldRequest $request, FormField $formfield)
    {
        return $this->repository->update($request->all(), $formfield->id);
    }

    /**
     * Change Status the specified resource from storage.
     */
    public function status(Request $request, $id)
    {
        return $this->repository->status($id, $request->status);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FormField $formfield)
    {
        return $this->repository->destroy($formfield->id);
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
