<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Models\FormField;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class FormFieldRepository extends BaseRepository
{
    function model()
    {
        return FormField::class;
    }

    public function index()
    {
        $formfields = $this->model->get();
        return view('ticket::admin.formfield.index', ['formfields' => $formfields]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $options = $this->getOptions($request);
            $this->model->create([
                'label' => $request->label,
                'name' => $request->name,
                'type' => $request->type,
                'placeholder' => $request->placeholder,
                'is_required' => $request->is_required,
                'select_type' => $request->select_type,
                'options' => $options ?? null,
                'status' => $request->status
            ]);

            DB::commit();

            return to_route('admin.formfield.index')->with('success', __('ticket::static.formfield.create_successfully'));
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function edit($id)
    {
        $field = $this->model->where('id', $id)->first();
        return response()->json($field);
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $formfields = $this->model->findOrFail($id);
            $options = $this->getOptions($request);
            $formfields->options = $options;
            $formfields->update($request);

            DB::commit();

            return to_route('admin.formfield.index')->with('success', __('ticket::static.formfield.update_successfully'));
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {
            $formfield = $this->model->findOrFail($id);
            $formfield->destroy($id);

            return to_route('admin.formfield.index')->with('success', __('ticket::static.formfield.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function getOptions($request)
    {
        $options = [];
        $optionNames = $request['option_name'];
        $optionValues = $request['option_value'];

        foreach ($optionValues as $key => $value) {
            if ($value) {
                $options[] = [
                    'option_value' => $value,
                    'option_name' => $optionNames[$key]
                ];
            }
        }

        return $options;
    }
}
