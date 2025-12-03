@php
$currentUrl = url()->current();
@endphp
@if(isset($menus))
@foreach($menus as $section => $item)
@foreach($item as $menu)
    @includeIf('admin.menu.items', ['menu' => $menu])
    @if ($menu->isParent())
        @if(!empty($menu->child))
            @foreach ($menu->child as $child)
                @includeIf('admin.menu.items', ['menu' => $child])
            @endforeach
        @endif
    @endif
@endforeach
@endforeach
@endif
