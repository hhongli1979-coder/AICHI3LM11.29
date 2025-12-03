<?php

namespace App\Repositories\Admin;

use Exception;
use App\Exceptions\ExceptionHandler;
use Spatie\Activitylog\Models\Activity;
use Prettus\Repository\Eloquent\BaseRepository;

class ActivityLogRepository extends BaseRepository
{
    function model()
    {
        return Activity::class;
    }

    public function index($activityTable)
    {
        return view('admin.system-tool.activity-log',['tableConfig' => $activityTable]);
    }

    public function destroy($id)
    {
        try {

            $this->model->findOrFail($id)?->destroy($id);
            return redirect()->route('admin.activity-logs.index')->with('success', __('static.system_tools.activity_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteAll()
    {
        try {

            $this->model?->truncate();
            return redirect()->route('admin.activity-logs.index')->with('success', __('static.system_tools.activity_delete_successfully'));

        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
