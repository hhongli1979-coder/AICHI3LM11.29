@use('App\Models\MenuItems')
@php
    $menuItems = MenuItems::getParentMenuById(1)?->where('status', true);
    $menuItems = $menuItems->groupBy('section');
@endphp
<!-- Sidebar Start-->
<div class="page-sidebar">
    <div class="sidebar">
        <div class="sidebar-top">
            <div class="logo-wrapper">
                <a href="{{ route('admin.dashboard.index') }}">
                    @if (isset(getSettings()['general']['dark_logo_image']))
                        <img src="{{ getSettings()['general']['dark_logo_image']?->original_url }}" class="main-logo"
                            alt="logo">
                        <img src="{{ asset('images/favicon.svg') }}" alt="favicon" class="sm-logo">
                    @else
                        <img src="{{ asset('images/logo.svg') }}" alt="logo">
                    @endif
                </a>
            </div>
            <a href="javascript:void(0)">
                <img src="{{ asset('images/svg/toggle.svg') }}" class="sidebar-toggle" alt="">
            </a>
        </div>

        <div class="search-menu">
            <div class="position-relative">
                <input class="form-control w-100" type="text" placeholder="{{ __('static.search_menu') }}" id="menu-item-search"
                    onkeyup="menuItemSearch()">
                <i class="ri-search-line"></i>
            </div>
        </div>

        <ul class="sidebar-menu custom-scrollbar overflow-auto" id="sidebar-menu">
            <li class="pin-title sidebar-main-title">
                <div>
                    <h6>Pinned</h6>
                </div>
            </li>
            @foreach ($menuItems as $section => $item)
                @if (isActiveSection($item))
                    <li class="sidebar-main-title">
                        <div>
                            <h6>{{ __($section) }}</h6>
                        </div>
                    </li>
                @endif
                @foreach ($item as $menuItem)


                        @if (!$menuItem->permission)
                            <li class="sidebar-menu-list {{ $menuItem->isActiveRoute($menuItem) || $menuItem->isActiveMenuRoute($menuItem) ? 'active' : '' }}">
                                <i class="ri-pushpin-2-line"></i>
                                <a class="sidebar-header"
                                    href="{{ !empty($menuItem->route) ? route($menuItem->route) : 'javascript:void(0)' }}">
                                    <i class="{{ $menuItem->icon }}"></i>
                                    <span class="sidebar-label flex-grow-1">{{ __($menuItem->label) }}</span>
                                    @if ($menuItem->badgeable)
                                        <span class="badge">{{ $menuItem->badge }}</span>
                                    @endif
                                    @if ($menuItem->isParent())
                                        <i class="ri-arrow-right-s-line dropdown-arrow"></i>
                                    @endif
                                </a>
                                @if ($menuItem->isParent())
                                    <ul class="sidebar-submenu {{ $menuItem->isActiveRoute($menuItem) || $menuItem->isActiveMenuRoute($menuItem) ? 'menu-open' : '' }}">
                                        @foreach ($menuItem->child as $child)
                                            @if (!empty($child->route))
                                            @can($child->permission)
                                                    <li class="{{ $child->isActiveRoute() ? 'active' : '' }}">
                                                        <a href="{{ route($child->route) }}">
                                                            <span class="sidebar-label-child">{{ __($child->label) }}</span>
                                                            @if ($child->badgeable)
                                                                <span class="badge bg-light-light">{{ $child->badge }}</span>
                                                            @endif
                                                        </a>
                                                    </li>
                                                @endcan
                                            @endif
                                        @endforeach
                                    </ul>
                                @endif
                            </li>
                        @else
                            @if(!empty($menuItem->permission))
                                @can($menuItem->permission)
                                    <li class="sidebar-menu-list {{ $menuItem->isActiveRoute($menuItem) || $menuItem->isActiveMenuRoute($menuItem) ? 'active' : '' }}">
                                        <i class="ri-pushpin-2-line"></i>
                                        <a class="sidebar-header"
                                            href="{{ !empty($menuItem->route) ? route($menuItem->route, $menuItem?->params) : 'javascript:void(0)' }}">
                                            <i class="{{ $menuItem->icon }}"></i>
                                            <span class="sidebar-label flex-grow-1">{{ __($menuItem->label) }}</span>
                                            @if ($menuItem->badgeable)
                                                <span class="badge">{{ $menuItem->badge }}</span>
                                            @endif
                                            @if ($menuItem->isParent())
                                                <i class="ri-arrow-right-s-line dropdown-arrow"></i>
                                            @endif
                                        </a>
                                        @if ($menuItem->isParent())
                                            <ul class="sidebar-submenu {{ $menuItem->isActiveRoute($menuItem) || $menuItem->isActiveMenuRoute($menuItem) ? 'menu-open' : '' }}">
                                                @foreach($menuItem->child as $child)
                                                    @if(!empty($child->route))
                                                        @can($child->permission)
                                                            <li class="{{ $child->isActiveRoute() ? 'active' : '' }}">
                                                                <a href="{{ route($child->route, $child?->params) }}">
                                                                    <span class="sidebar-label-child">{{ __($child->label) }}</span>
                                                                    @if ($child->badgeable)
                                                                        <span class="badge bg-light-light">{{ $child->badge }}</span>
                                                                    @endif
                                                                </a>
                                                            </li>
                                                        @endcan
                                                    @endif
                                                @endforeach
                                            </ul>
                                        @endif
                                    </li>
                                @endcan
                            @endif
                        @endif
                   @if(!empty($menuItem->permission))
                        @endif
                @endforeach
            @endforeach

        </ul>

        <ul class="sidebar-menu custom-scrollbar" id="search-menu"></ul>
        <div class="loader-wrapper">
            <div class="loader"></div>
        </div>
    </div>
</div>

@push('scripts')
<script>
    // Sidebar pin-drops
    (function() {
        var scrollTopPosition = $(".page-sidebar .sidebar-menu li.active")?.offset()?.top - 400;
        $(".page-sidebar .sidebar-menu").scrollTop(scrollTopPosition);

        const pinTitle = document.querySelector(".pin-title");
        let pinIcon = document.querySelectorAll(".sidebar-menu-list .ri-pushpin-2-line");

        function togglePinnedName() {
            if (document.getElementsByClassName("pined").length) {
                if (!pinTitle.classList.contains("show")) pinTitle.classList.add("show");
            } else {
                pinTitle.classList.remove("show");
            }
        }

        pinIcon.forEach((item, index) => {
            var linkName = item.parentNode.querySelector("span").innerHTML;
            var InitialLocalStorage = JSON.parse(localStorage.getItem("pins") || false);

            if (InitialLocalStorage && InitialLocalStorage.includes(linkName)) {
                item.parentNode.classList.add("pined");
            }
            item.addEventListener("click", (event) => {
                var localStoragePins = JSON.parse(localStorage.getItem("pins") || false);
                item.parentNode.classList.toggle("pined");

                if (localStoragePins?.length) {
                    if (item.parentNode.classList.contains("pined")) {
                        if (!localStoragePins.includes(linkName)) {
                            localStoragePins = [...localStoragePins, linkName];
                        }
                    } else {
                        if (localStoragePins.includes(linkName)) {
                            localStoragePins.splice(localStoragePins.indexOf(linkName), 1);
                        }
                    }
                    localStorage.setItem("pins", JSON.stringify(localStoragePins));
                } else {
                    localStorage.setItem("pins", JSON.stringify([linkName]));
                }

                var elem = item;
                var topPos = elem.offsetTop;
                togglePinnedName();
                scrollTo(document.getElementsByClassName("sidebar-menu")[0], elem.parentNode.offsetTop - 200, 600);
            });

            function scrollTo(element, to, duration) {
                var start = element.scrollTop,
                    change = to - start,
                    currentTime = 0,
                    increment = 20;

                var animateScroll = function() {
                    currentTime += increment;
                    var val = Math.easeInOutQuad(currentTime, start, change, duration);
                    element.scrollTop = val;
                    if (currentTime < duration) {
                        setTimeout(animateScroll, increment);
                    }
                };
                animateScroll();
            }

            Math.easeInOutQuad = function(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return (c / 2) * t * t + b;
                t--;
                return (-c / 2) * (t * (t - 2) - 1) + b;
            };
        });
        togglePinnedName();
    })();

    function menuItemSearch() {
        var filter = $("#menu-item-search").val().toUpperCase();
        var loader = $('#skeleton-main');
        loader.css('display', 'block');
        jQuery("body").addClass("notLoaded");

        var menuItems = $("#sidebar-menu").find("li.sidebar-menu-list");
        var menuHeadings = $("#sidebar-menu").find("li.sidebar-main-title");

        if (filter !== '') {
            $("#sidebar-menu").addClass('d-none');
            $("#search-menu").html('');

            let groupedMatches = {};

            menuItems.each(function() {
                const menuItem = $(this);
                const parentLabel = menuItem.find(".sidebar-label").text().trim();
                const parentLink = menuItem.find("a.sidebar-header").attr("href");
                const childItems = menuItem.find(".sidebar-submenu li");
                const sectionTitle = menuItem.prevAll('.sidebar-main-title').first().find('h6').text().trim();
                if (!sectionTitle) return;

                let sectionGroup = groupedMatches[sectionTitle] || {};

                if (childItems.length > 0) {
                    childItems.each(function() {
                        const child = $(this);
                        const childLabel = child.find(".sidebar-label-child").text().trim();
                        const childLink = child.find("a").attr("href");

                        if (childLabel.toUpperCase().includes(filter)) {
                            if (!sectionGroup[parentLabel]) {
                                sectionGroup[parentLabel] = [];
                            }
                            sectionGroup[parentLabel].push({
                                label: childLabel,
                                link: childLink
                            });
                        }
                    });
                } else if (parentLabel.toUpperCase().includes(filter)) {
                    if (!sectionGroup[parentLabel]) {
                        sectionGroup[parentLabel] = [];
                    }
                    sectionGroup[parentLabel].push({
                        label: parentLabel,
                        link: parentLink,
                        isParent: true
                    });
                }

                groupedMatches[sectionTitle] = sectionGroup;
            });

            const hasAnyMatches = Object.values(groupedMatches).some(parents =>
                Object.values(parents).some(children => children.length > 0)
            );

            if (hasAnyMatches) {
                Object.entries(groupedMatches).forEach(([section, parents]) => {
                    const hasMatches = Object.values(parents).some(children => children.length > 0);
                    if (!hasMatches) return;

                    $("#search-menu").append(`
                        <li class="sidebar-main-title"><div><h6>${section}</h6></div></li>
                    `);

                    Object.entries(parents).forEach(([parent, children]) => {
                        if (children.length > 0 && !children[0].isParent) {
                            $("#search-menu").append(`
                                <li class="sidebar-menu-list">
                                    <span class="sidebar-header" style="padding-left: 10px; font-weight: 600;">${parent}</span>
                                </li>
                            `);
                        }

                        children.forEach(item => {
                            $("#search-menu").append(`
                                <li class="sidebar-menu-list">
                                    <a href="${item.link}" class="sidebar-header" style="padding-left: 25px;">
                                        <i class="ri-arrow-right-double-fill"></i>
                                        <span class="sidebar-label-child">${item.label}</span>
                                    </a>
                                </li>
                            `);
                        });
                    });
                });
            } else {
                $("#search-menu").html(`
                    <div class="no-data mt-3 text-center">
                        <img src="{{ url('/images/no-data.png') }}" alt="No Data">
                        <h6 class="mt-2">{{ __('static.no_result') }}</h6>
                    </div>
                `);
            }

        } else {
            $("#sidebar-menu").removeClass('d-none');
            $("#search-menu").html('');
            menuItems.show();
            menuHeadings.show();
        }

        setTimeout(function() {
            loader.css('display', 'none');
            jQuery("body").removeClass("notLoaded");
        }, 300);
    }

    var $searchMenuItems = $('#search-menu .sidebar-menu-list');
    var searchMenuItemCount = $searchMenuItems.length;
    var $skeletonContainer = $('.sidebar-skeleton');

    for (var i = 0; i < searchMenuItemCount; i++) {
        var $loadDiv = $('<div>').addClass('load');
        var $imgDiv = $('<div>').addClass('img');
        var $lineDiv = $('<div>').addClass('line');

        $loadDiv.append($imgDiv).append($lineDiv);
        $skeletonContainer.append($loadDiv);
    }
</script>
@endpush
