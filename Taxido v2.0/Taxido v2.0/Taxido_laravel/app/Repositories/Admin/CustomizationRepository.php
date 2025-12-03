<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Customization;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ExceptionHandler;
use Prettus\Repository\Eloquent\BaseRepository;

class CustomizationRepository extends BaseRepository
{
    public function model()
    {
        return Customization::class;
    }

    public function index()
    {
        $customization = $this->model->first();
        return view('admin.appearance.customization',['customization'=> $customization]);
    }
    public function store($request)
    {
        DB::beginTransaction();
        try {

            $customization = $this->model->updateOrCreate(
                [],
                [
                    'html' => $request->custom_html,
                    'css' => $request->custom_css,
                    'js' => $request->custom_js,
                ]
            );

            DB::commit();
            return to_route('admin.customization.index')->with('success', __('static.currencies.save_successfully'));
        } catch (Exception $e) {
            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

}
