<?php

namespace Modules\Ticket\Repositories\Admin;

use Exception;
use Modules\Ticket\Models\Status;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class StatusRepository extends BaseRepository
{
    function model()
    {
        return Status::class;
    }

    public function index($statusTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('ticket::admin.status.index', ['tableConfig' => $statusTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $status = $this->model->create([
                'name' => $request->name,
                'color' => $request->color,
                'status' => $request->status
            ]);

            $locale = $request['locale'] ?? app()->getLocale();
            $status->setTranslation('name', $locale, $request['name']);

            DB::commit();
            if ($request->has('save')) {
                return to_route('admin.status.edit', ['status' => $status->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.status.create_successfully'));
            }

            return to_route('admin.status.index')->with('success', __('ticket::static.status.create_successfully'));
        
        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $status = $this->model->findOrFail($id);
            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['name'])) {
                $status->setTranslation('name', $locale, $request['name']);
            }

            $data = array_diff_key($request, array_flip(['name', 'locale']));
            $status->update($data);

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.status.edit', ['status' => $status->id, 'locale' => $locale])
                    ->with('success', __('ticket::static.status.update_successfully'));
            }
            
            return to_route('admin.status.index')->with('success', __('ticket::static.status.update_successfully'));
        
        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {
            
            $ticketStatus = $this->model->findOrFail($id);
            $ticketStatus->update(['status' => $status]);

            return json_encode(["resp" => $ticketStatus]);

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $status = $this->model->onlyTrashed()->findOrFail($id);
            $status->restore();

            return to_route('admin.status.index')->with('success', __('ticket::static.status.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }

    public function forceDelete($id)
    {
        try {

            $status = $this->model->findOrFail($id);
            $status->forceDelete();

            return to_route('admin.status.index')->with('success', __('ticket::static.status.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());

        }
    }
}