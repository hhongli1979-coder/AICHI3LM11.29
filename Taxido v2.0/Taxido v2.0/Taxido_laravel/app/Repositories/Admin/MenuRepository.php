<?php

namespace App\Repositories\Admin;

use Exception;
use App\Models\Menus;
use App\Models\MenuItems;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\App;
use App\Exceptions\ExceptionHandler;
use Illuminate\Support\Facades\Route;
use Prettus\Repository\Eloquent\BaseRepository;

class MenuRepository extends BaseRepository
{
    protected $menuItems;
    protected $widgets;

    function model()
    {
        $this->menuItems = new MenuItems();
        $this->widgets = App::make('widgetDirectories');
        return Menus::class;
    }

    public function index($request)
    {
        $menuList = $this->model->select(['id', 'name'])->get();
        $menuList = $menuList->pluck('name', 'id')->prepend('Select menu', 0)->all();
        $menuName = $this->model->where('id', $request->menu)->first('name');

        return view('admin.menu.index')->with(["menuList" => $menuList, "menuName" => $menuName, 'widgets' => $this->widgets, "depth" => 1]);
    }

    public function getMenuItems($menu_id)
    {
        $menuItems = $this->menuItems->getParentMenuById($menu_id);
        $menuItems = $menuItems->groupBy('section');
        $adminRouteList = $this->getAdminIndexRouteNames();
        return view('admin.menu.menu_items')->with(['menus' => $menuItems, "adminRouteList" => $adminRouteList])->render();
    }

    public function getAdminIndexRouteNames()
    {
        // Get all routes
        $routes = Route::getRoutes();
        $adminIndexRouteNames = [];
        foreach ($routes as $route) {
            if ($route->methods()[0] === 'GET') {
                $routeName = $route->getName();
                if ($routeName && preg_match('/^admin\..+\.index$/', $routeName)) {
                    if (!str_starts_with($routeName, 'api.')) {
                        $adminIndexRouteNames[] = $routeName;
                    }
                }
            }
        }

        return $adminIndexRouteNames;
    }

    public function createMenu($request)
    {
        DB::beginTransaction();
        try {

            $menu = $this->model->create([
                'name' => $request->menuName
            ]);

            DB::commit();
            return json_encode(array("resp" => $menu->id));
        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteItemMenu($id)
    {
        try {

            return $this->menuItems->findOrFail($id)->destroy($id);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function deleteMenu($id)
    {
        try {

            $menuItems = $this->menuItems->getall($id);
            if (count($menuItems)) {
                return json_encode(array("resp" => "You have to delete all items first", "error" => 1));
            }

            return $this->model->findOrFail($id)->destroy($id);
        } catch (Exception $e) {

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function updateItem($request)
    {
        DB::beginTransaction();
        try {

            $data = $request->item_data;
            if (is_array($data)) {
                foreach ($data as $value) {
                    $menuItem = $this->menuItems->findOrFail($value['id']);
                    if (!empty($menuItem)) {
                        $menuItem->update([
                            'label' => $value['label'],
                            'route' => $value['route'],
                            'class' => $value['class'],
                            'icon' => $value['icon']
                        ]);

                        if (config('header-menu.use_roles')) {
                            $menuItem->role_id = $value['role_id'] ?? 0;
                        }
                    }
                }
            } else {

                if ($request->id) {
                    $menuItem = $this->menuItems->findOrFail($request->id);
                    if (isset($menuItem)) {
                        $menuItem->update([
                            'label' => $request->label,
                            'route' => $request->route,
                            'class' => $request->class,
                            'icon' => $request->icon
                        ]);

                        if (config('header-menu.use_roles')) {
                            $menuItem->role_id = $request->role_id ?? 0;
                        }

                        $menuItem->save();
                    }
                }
            }

            DB::commit();
        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function addCustomMenu($requests)
    {
        DB::beginTransaction();
        try {

            foreach ($requests->all() as $request) {
                $menuItem = $this->menuItems->create([
                    'label' => $request['label'],
                    'route' => $request['route'],
                    'menu' => $request['menu'],
                    'sort' => $this->menuItems->getNextSortRoot($request['menu'])
                ]);

                if (config('header-menu.use_roles')) {
                    $menuItem->role_id = $request['rolemenu'] ?? 0;
                }
            }

            DB::commit();
            return $menuItem;
        } catch (Exception $e) {

            DB::rollback();
            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }

    public function generateMenuControl($request)
    {
        DB::beginTransaction();
        try {

            $menu = $this->model->findOrFail($request->id);
            $menu->update([
                'name' => $request->name
            ]);

            if (is_array($request->item_data)) {
                foreach ($request->item_data as $value) {
                    $menuItem = $this->menuItems->findOrFail($value["id"]);
                    $menuItem->update([
                        'sort' => $value["sort"],
                        'depth' => $value["depth"],
                    ]);

                    if (config('header-menu.use_roles')) {
                        $menuItem->role_id = $request->role_id;
                    }
                }
            }

            $menus = $this->menuItems?->getByMenuId($menuItem->menu);
            foreach ($menus as $menu) {
                $child = $this->menuItems?->where('id', $menu->id)->first();
                $child->parent = 0;
                if ($menu->depth > 0) {
                    $index = 1;
                    while ($menus[$menu->sort - $index]->depth == 1 && $menu->count() > $index) {
                        ++$index;
                    }

                    $child->parent = $menus[$menu->sort - $index]->id;
                }
                $child->save();
            }

            DB::commit();
            return json_encode(array("resp" => 1));
        } catch (Exception $e) {

            DB::rollback();

            throw new ExceptionHandler($e->getMessage(), $e->getCode());
        }
    }
}
