<li class="control-section accordion-section  open add-page" id="add-page">
    <h3 class="accordion-section-title hndle" tabindex="0"> {{ __('static.menus.custom_link') }}<span
            class="screen-reader-text">{{ __('static.menus.press_return_expand') }}</span></h3>
    <div class="accordion-section-content ">
        <div class="inside">
            <div class="customlinkdiv" id="customlinkdiv">
                <p id="menu-item-route-wrap">
                    <label class="howto" for="custom-menu-item-route">
                        <span>{{ __('static.menus.route') }}</span>&nbsp;&nbsp;&nbsp;
                        <input id="custom-menu-item-route" name="route" type="text" class="menu-item-textbox "
                            placeholder="{{ __('static.menus.route') }}" />
                    </label>
                </p>
                <p id="menu-item-name-wrap">
                    <label class="howto" for="custom-menu-item-name"> <span>{{ __('static.menus.label') }}</span>&nbsp;
                        <input id="custom-menu-item-name" name="label" type="text"
                            class="regular-text menu-item-textbox input-with-default-title"
                            placeholder="{{ __('static.menus.label') }}" />
                    </label>
                </p>
                @if (!empty($roles))
                    <p id="menu-item-role_id-wrap">
                        <label class="howto" for="custom-menu-item-role">
                            <span>{{ __('static.menus.role') }}</span>&nbsp;
                            <select id="custom-menu-item-role" name="role">
                                <option value="0">{{ __('static.menus.select_role') }}</option>
                                @foreach ($roles as $role)
                                    <option value="{{ $role->$role_pk }}">{{ ucfirst($role->$role_title_field) }}
                                    </option>
                                @endforeach
                            </select>
                        </label>
                    </p>
                @endif
                <p class="button-controls">
                    <a href="javascript:void(0)" onclick="addCustomMenu()"
                        class="button-secondary submit-add-to-menu right">
                        {{ __('static.menus.add_menu_item') }}
                    </a>
                    <span class="spinner" id="spincustomu"></span>
                </p>
            </div>
        </div>
    </div>
</li>
