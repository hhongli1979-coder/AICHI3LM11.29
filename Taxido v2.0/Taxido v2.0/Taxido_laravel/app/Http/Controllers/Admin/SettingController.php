<?php

namespace App\Http\Controllers\Admin;

use App\Models\Setting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;
use App\Repositories\Admin\SettingRepository;

class SettingController extends Controller
{

    public $repository;

    public function __construct(SettingRepository $repository)
    {
        $this->authorizeResource(Setting::class, 'setting');
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }

    public function update(Request $request, Setting $setting)
    {
        return $this->repository->update($request->all(), $setting?->id);
    }

    public function setTheme(Request $request)
    {
        Session::put('theme', $request->input('theme'));
        return response()->json(['success' => true]);
    }

}
