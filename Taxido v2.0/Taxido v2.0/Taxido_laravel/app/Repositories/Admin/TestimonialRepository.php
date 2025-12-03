<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Testimonial;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class TestimonialRepository extends BaseRepository
{
    public function model()
    {
        return Testimonial::class;
    }

    public function index($testimonialTable)
    {
        if (request()['action']) {
            return redirect()->back();
        }
        return view('admin.testimonial.index', ['tableConfig' => $testimonialTable]);
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {
            $testimonial = $this->model->create(
                [
                    'title' => $request->title,
                    'description' => $request->description,
                    'rating' => $request->rating,
                    'status' => $request->status,
                    'profile_image_id' => $request->profile_image_id,
                ]
            );

            $testimonial->profile_image;

            $locale = $request['locale'] ?? app()->getLocale();
            $testimonial->setTranslation('title', $locale, $request['title']);
            $testimonial->setTranslation('description', $locale, $request['description']);

            DB::commit();

            if ($request->has('save')) {
                return to_route('admin.testimonial.edit', ['testimonial' => $testimonial->id , 'locale' => $locale])
                        ->with('success', __('static.testimonials.create_successfully'));
            }

            return to_route('admin.testimonial.index')->with('success', __('static.testimonials.create_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();
        try {

            $testimonial = $this->model->findOrFail($id);

            $locale = $request['locale'] ?? app()->getLocale();

            if (isset($request['title'])) {
                $testimonial->setTranslation('title', $locale, $request['title']);
            }

            if (isset($request['description'])) {
                $testimonial->setTranslation('description', $locale, $request['description']);
            }

            $data = array_diff_key($request, array_flip(['title', 'description', 'locale']));
            $testimonial->update($data);

            if (isset($request['profile_image_id'])) {
                $testimonial->profile_image()->associate($request['profile_image_id']);
                $testimonial->profile_image;
            }

            DB::commit();
            if (array_key_exists('save', $request)) {
                return to_route('admin.testimonial.edit', ['testimonial' => $testimonial->id,'locale' => $locale])->with('success', __('static.testimonials.update_successfully'));
            }

            return redirect()->route('admin.testimonial.index')->with('success', __('static.testimonials.update_successfully'));
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function destroy($id)
    {
        try {

            $testimonial = $this->model->findOrFail($id);
            $testimonial->destroy($id);

            return redirect()->route('admin.testimonial.index')->with('success', __('static.testimonials.delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function status($id, $status)
    {
        try {

            $testimonial = $this->model->findOrFail($id);
            $testimonial->update(['status' => $status]);

            return json_encode(['resp' => $testimonial]);
        } catch (Exception $e) {

            return back()->with('error', $e->getMessage());
        }
    }

    public function restore($id)
    {
        try {

            $user = $this->model->onlyTrashed()->findOrFail($id);
            $user->restore();

            return redirect()->back()->with('success', __('static.testimonials.restore_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function forceDelete($id)
    {
        try {
            $testimonial = $this->model->onlyTrashed()->findOrFail($id);
            $testimonial->forceDelete();

            return redirect()->back()->with('success', __('static.testimonials.permanent_delete_successfully'));
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
