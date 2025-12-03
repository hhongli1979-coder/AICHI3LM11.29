<?php

namespace App\Http\Controllers\Admin;

use App\Services\Prerequisites;
use App\Http\Controllers\Controller;

class AboutSystemController extends Controller
{
    protected $prerequisites;

    public function __construct(Prerequisites $prerequisites)
    {
        $this->prerequisites = $prerequisites;
    }

    public function index()
    {
        return view('admin.about-system.index', ['prerequisites' => $this->prerequisites->getPrerequisites()]);
    }
}
