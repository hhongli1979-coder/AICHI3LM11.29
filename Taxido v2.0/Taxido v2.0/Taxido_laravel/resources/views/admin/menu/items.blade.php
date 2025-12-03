<li id="menu-item-{{$menu->id}}"
    class="menu-item menu-item-depth-{{$menu->depth}} menu-item-page menu-item-edit-inactive pending" style="display: list-item;">
    <dl class="menu-item-bar">
        <dt class="menu-item-handle">
            <span class="item-title">
                <span class="menu-item-title">
                    <span id="menutitletemp_{{$menu->id}}">{{__($menu->label)}}</span>
                    <span style="color: transparent;">|{{$menu->id}}|</span>
                </span>
                <span class="is-submenu" style="@if($menu->depth==0)display: none;@endif">
                    {{ __('static.menus.sub_element') }}
                </span>
            </span>
            <span class="item-controls">
                <span class="item-type">{{ __('static.menus.link') }}</span>
                <span class="item-order hide-if-js">
                    <a href="{{ $currentUrl }}?action=move-up-menu-item&menu-item={{$menu->id}}&_wpnonce=8b3eb7ac44"
                        class="item-move-up"><abbr title="Move Up">↑</abbr></a> | <a
                        href="{{ $currentUrl }}?action=move-down-menu-item&menu-item={{$menu->id}}&_wpnonce=8b3eb7ac44"
                        class="item-move-down"><abbr title="Move Down">↓</abbr></a>
                </span>
                <a class="item-edit" id="edit-{{$menu->id}}" href="{{ $currentUrl }}?edit-menu-item={{$menu->id}}#menu-item-settings-{{$menu->id}}"></a>
            </span>
        </dt>
    </dl>
    <div class="menu-item-settings" id="menu-item-settings-{{$menu->id}}">
        <input type="hidden" class="edit-menu-item-id" name="menuid_{{$menu->id}}" value="{{$menu->id}}" />
        <p class="description description-thin">
            <label for="edit-menu-item-title-{{$menu->id}}"> {{ __('static.menus.label') }}
                <br>
                <input type="text" id="idlabelmenu_{{$menu->id}}" class="widefat edit-menu-item-title"
                    name="idlabelmenu_{{$menu->id}}" value="{{__($menu->label)}}">
            </label>
        </p>
        <p class="field-css-classes description description-thin">
            <label for="edit-menu-item-classes-{{$menu->id}}">{{ __('static.menus.class_css_(optional)') }}
                <br>
                <input type="text" id="clases_menu_{{$menu->id}}" class="widefat code edit-menu-item-classes"
                    name="clases_menu_{{$menu->id}}" value="{{$menu->class}}">
            </label>
        </p>
        <p class="field-css-icon mb-0 description description-thin">
            <label for="edit-menu-item-icon-{{$menu->id}}">{{ __('static.menus.remix_icon_class') }}
                <br>
                <input type="text" id="icon_menu_{{$menu->id}}" class="widefat code edit-menu-item-icon"
                    id="icon_menu_{{$menu->id}}" placeholder="dashboard-line" @if($menu->icon) value="{{$menu->icon}}"
                @endif>
            </label>

            <span class="mt-1 d-inline-block">{{ __('static.menus.select_remix_icon_class') }}<a class="mt-4 ms-2"
                    href="https://remixicon.com/" target="_blank">{{ __('static.menus.click_here') }}</a></span>
        </p>

        <p class="field-css-route mt-0 description description-thin">
            <label for="edit-menu-item-route-{{$menu->id}}"> {{ __('static.menus.route') }}
                <br>
                <select id="route_menu_{{$menu->id}}" class="widefat code edit-menu-item-route form-select"
                    name="route_menu_[{{$menu->id}}]">
                    <option value="">{{ __('static.menus.select_route_url') }}</option>
                    @foreach($adminRouteList as $route)
                    <option @if($route==$menu->route) selected @endif value="{{ $route }}">{{ $route }}</option>
                    @endforeach
                </select>
            </label>
        </p>
        <p class="field-move hide-if-no-js description description-wide">
            <label>
                <span>{{ __('static.menus.move') }}</span> <a href="{{ $currentUrl }}" class="menus-move-up"
                    style="display: none;">{{ __('static.move_up') }}</a> <a href="{{ $currentUrl }}"
                    class="menus-move-down" title="Mover uno abajo"
                    style="display: inline;">{{ __('static.menus.move_down') }}</a> <a href="{{ $currentUrl }}"
                    class="menus-move-right" style="display: none;"></a> <a href="{{ $currentUrl }}"
                    class="menus-move-top" style="display: none;">{{ __('static.menus.top') }}</a>
            </label>
        </p>
        <div class="menu-item-actions description-wide submitbox">
            <a class="item-delete submitdelete deletion" id="delete-{{$menu->id}}"
                href="{{ $currentUrl }}?action=delete-menu-item&menu-item={{$menu->id}}&_wpnonce=2844002501">{{ __('static.menus.remove') }}</a>
            <span class="meta-sep hide-if-no-js"> | </span>
            <a class="item-cancel submitcancel hide-if-no-js button-secondary" id="cancel-{{$menu->id}}"
                href="{{ $currentUrl }}?edit-menu-item={{$menu->id}}&cancel=1424297719#menu-item-settings-{{$menu->id}}">{{ __('static.menus.Cancel') }}</a>
            <span class="meta-sep hide-if-no-js"> | </span>
        </div>
    </div>
    <ul class="menu-item-transport"></ul>
</li>
