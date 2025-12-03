<?php

namespace Modules\Taxido\Repositories\Admin;

use Exception;
use Modules\Taxido\Models\Notice;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class NoticeRepository extends BaseRepository
{
    function model()
    {
        return Notice::class;
    }

    public function index($noticeTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }

        return view('taxido::admin.notice.index', ['tableConfig' => $noticeTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();
        try {
            $notice = $this->model->create([
                'message' => $request->message,
                'send_to' => $request->send_to,
                'color' => $request->color,
                'status' => $request->status,
            ]);

            if ($request->drivers) {
                $notice->drivers()->attach($request->drivers);
                $notice->drivers;
            }

            $locale = $request['locale'] ?? app()->getLocale();
            $notice->setTranslation('message', $locale, $request['message']);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.notice.edit', [
                    'notice' => $notice->id,
                    'locale' => $locale,
                ])->with('success', __('taxido::static.notices.create_successfully'));
            }

            return to_route('admin.notice.index')->with('success', __('taxido::static.notices.create_successfully'));

        } catch (Exception $e) {

            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {
            $notice = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();
            $notice->setTranslation('message', $locale, $request['message']);

            $data = array_diff_key($request, array_flip(['message', 'locale']));
            $notice->update($data);

            if (isset($request['notice_image_id'])) {
                $notice->notice_image()->associate($request['notice_image_id']);
            }

            DB::commit();

            if (array_key_exists('save', $request)) {
                return to_route('admin.notice.edit', ['notice' => $notice->id, 'locale' => $locale])
                    ->with('success', __('taxido::static.notices.update_successfully'));
            }

            return to_route('admin.notice.index')->with('success', __('taxido::static.notices.update_successfully'));

        } catch (Exception $e) {
            DB::rollBack();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $notice = $this->model->findOrFail($id);
            $notice->destroy($id);

            DB::commit();
            return to_route('admin.notice.index')->with('success', __('taxido::static.notices.delete_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $notice = $this->model->findOrFail($id);
            $notice->update(['status' => $status]);

            return json_encode(["resp" => $notice]);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function restore($id)
    {
        try {

            $notice = $this->model->onlyTrashed()->findOrFail($id);
            $notice->restore();

            return redirect()->back()->with('success', __('taxido::static.notices.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
    public function forceDelete($id)
    {
        try {

            $notice = $this->model->onlyTrashed()->findOrFail($id);
            $notice->forceDelete();

            return redirect()->back()->with('success', __('taxido::static.notices.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
