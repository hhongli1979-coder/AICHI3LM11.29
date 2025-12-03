<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Repositories\Front\HomeRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class HomeController extends Controller
{
    public $repository;

    public function __construct(HomeRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->index();
    }

    public function setTheme(Request $request)
    {
        Session::put('front_theme', $request->input('theme'));
        return response()->json(['success' => true]);
    }
}
