<?php
namespace App\Facades;

use Illuminate\Support\Facades\App;
use App\Http\Requests;
use App\Models\MenuItems;
use App\Models\Menus;
use Illuminate\Support\Facades\DB;

class WMenu
{

    public function render()
    {
        $menu = new Menus();
        $menuitems = new MenuItems();
        $menulist = $menu->select(['id', 'name'])->get();
        $menulist = $menulist->pluck('name', 'id')->prepend('Select menu', 0)->all();

        if ((request()->has("action") && empty(request()->input("menu"))) || request()->input("menu") == '0') {
            return view('admin.menu.index')->with("menulist" , $menulist);
        } else {

            $menu = Menus::find(request()->input("menu"));
            $menus = $menuitems->getall(request()->input("menu"));

            $data = ['menus' => $menus, 'indmenu' => $menu, 'menulist' => $menulist];
            if( config('header-menu.use_roles')) {
                $data['roles'] = DB::table(config('header-menu.roles_table'))->select([config('header-menu.roles_pk'),config('header-menu.roles_title_field')])->get();
                $data['role_pk'] = config('header-menu.roles_pk');
                $data['role_title_field'] = config('header-menu.roles_title_field');
            }
            return view('admin.menu.index', $data);
        }

    }

    public function scripts()
    {
        return view('admin.menu.scripts');
    }

    public static function select($name = "menu", $menulist = array())
    {
        $html = '<select id="selectMenu" class="form-select" name="' . $name . '" >';

        foreach ($menulist as $key => $val) {
            $active = '';
            if (request()->input('menu') == $key) {
                $active = 'selected="selected"';
            }
            $html .= '<option ' . $active . ' value="' . $key . '">' . $val . '</option>';
        }
        $html .= '</select>';
        return $html;
    }


    /**
     * Returns empty array if menu not found now.
     * Thanks @sovichet
     *
     * @param $name
     * @return array
     */
    public static function getByName($name)
    {
        $menu = Menus::byName($name);
        return is_null($menu) ? [] : self::get($menu->id);
    }

    public static function get($menu_id)
    {
        $menuItem = new MenuItems;
        $menu_list = $menuItem->getall($menu_id);

        $roots = $menu_list->where('menu', (integer) $menu_id)->where('parent', 0);

        $items = self::tree($roots, $menu_list);
        return $items;
    }

    private static function tree($items, $all_items)
    {
        $data_arr = array();
        $i = 0;
        foreach ($items as $item) {
            $data_arr[$i] = $item->toArray();
            $find = $all_items->where('parent', $item->id);

            $data_arr[$i]['child'] = array();

            if ($find->count()) {
                $data_arr[$i]['child'] = self::tree($find, $all_items);
            }

            $i++;
        }

        return $data_arr;
    }

}
