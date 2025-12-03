<?php

namespace Modules\Taxido\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Modules\Taxido\Repositories\Api\SettingRepository;

class SettingController extends Controller
{
    public $repository;

    public function __construct(SettingRepository $repository)
    {
        $this->repository = $repository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->repository->index();
    }
}
