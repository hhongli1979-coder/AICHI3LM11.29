<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Repositories\Admin\MenuRepository;
use App\Http\Requests\Admin\CreateMenuRequest;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public $repository;

    public function __construct(MenuRepository $repository)
    {
        $this->repository = $repository;
    }

    public function index(Request $request)
    {
        return $this->repository->index($request);
    }

    public function getMenuItems(Request $request)
    {
        return $this->repository->getMenuItems($request->menu);
    }

    public function createMenu(CreateMenuRequest $request)
    {
        return $this->repository->createMenu($request);
    }

    public function deleteItemMenu(Request $request)
    {
        return $this->repository->deleteItemMenu($request->id);
    }

    public function deleteMenus(Request $request)
    {
        return $this->repository->deleteMenu($request->id);
    }

    public function updateItem(Request $request)
    {
        return $this->repository->updateItem($request);
    }

    public function addCustomMenu(Request $request)
    {
        return $this->repository->addCustomMenu($request);
    }

    public function generateMenuControl(Request $request)
    {
        return $this->repository->generateMenuControl($request);
    }
}
