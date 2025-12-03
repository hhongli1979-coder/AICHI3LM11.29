<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\WidgetManager;

class DashboardController extends Controller
{

    protected $widgetManager;

    public function __construct(WidgetManager $widgetManager)
    {
        $this->widgetManager = $widgetManager;
    }

    public function index()
    {
        $widgets = $this->widgetManager->getWidgets();
        return view('admin.dashboard.index', ['widgets' => $widgets]);
    }
}
