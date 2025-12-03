<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Illuminate\Support\Facades\DB;
use Modules\Ticket\Models\Priority;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class PriorityRepository extends BaseRepository
{
    function model()
    {
        return Priority::class;
    }

    public function index($priorityTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('ticket::admin.priority.index', ['tableConfig' => $priorityTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {

            $priority =$this->model->create([
                'name' => $request->name,
                'color' => $request->color,
                'response_in' => $request->response_in,
                'response_value_in' => $request->response_value_in,
                'resolve_in' => $request->resolve_in,
                'resolve_value_in' => $request->resolve_value_in,
                'status' => $request->status
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $priority->setTranslation('name', $locale, $request['name']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.priority.edit', ['priority' => $priority->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.priority.create_successfully'));
            }

            return to_route('admin.priority.index')->with('success', __('ticket::static.priority.create_successfully'));
        
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
        
            $priority = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['name'])) {
                $priority->setTranslation('name', $locale, $request['name']);
            }

            $data = array_diff_key($request, array_flip(['name', 'locale']));
            $priority->update($data);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.priority.edit', ['priority' => $priority->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.priority.update_successfully'));
            }
            
            return to_route('admin.priority.index')->with('success', __('ticket::static.priority.update_successfully'));
        
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $priority = $this->model->findOrFail($id);
            $priority->update(['status' => $status]);

            return json_encode(["resp" => $priority]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function restore($id)
    {
        try {

            $priority = $this->model->onlyTrashed()->findOrFail($id);
            $priority->restore();

            return to_route('admin.priority.index')->with('success', __('ticket::static.priority.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function forceDelete($id)
    {
        try {

            $priority = $this->model->findOrFail($id);
            $priority->forceDelete();

            return to_route('admin.priority.index')->with('success', __('ticket::static.priority.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }
}