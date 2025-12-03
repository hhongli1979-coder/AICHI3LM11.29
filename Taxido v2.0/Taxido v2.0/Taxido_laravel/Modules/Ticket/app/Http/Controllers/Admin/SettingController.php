<?php

namespace Modules\Ticket\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Modules\Ticket\Models\Setting;
use App\Http\Controllers\Controller;
use Modules\Ticket\Repositories\Admin\SettingRepository;

class SettingController extends Controller
{
    private $repository;

    public function __construct(SettingRepository $repository)
    {
        $this->authorizeResource(Setting::class, 'setting');
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->repository->index();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $setting)
    {
        return $this->repository->update($request->all(), $setting->id);
    }
}
