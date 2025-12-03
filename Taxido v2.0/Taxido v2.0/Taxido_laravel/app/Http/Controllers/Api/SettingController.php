<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Api\SettingRepository;

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
     */
    public function index()
    {
        return $this->repository->index();
    }
}
