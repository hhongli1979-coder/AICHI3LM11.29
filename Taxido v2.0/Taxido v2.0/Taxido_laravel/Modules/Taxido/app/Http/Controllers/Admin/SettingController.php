<?php

namespace Modules\Taxido\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Modules\Taxido\Models\TaxidoSetting;
use Modules\Taxido\Repositories\Admin\SettingRepository;

class SettingController extends Controller
{
    public $repository;

    public function __construct(SettingRepository $repository)
    {
        $this->authorizeResource(TaxidoSetting::class, 'taxido_setting');
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }

    public function update(Request $request, TaxidoSetting $taxidoSetting)
    {
        return $this->repository->update($request->all(), $taxidoSetting?->id);
    }
    
}
