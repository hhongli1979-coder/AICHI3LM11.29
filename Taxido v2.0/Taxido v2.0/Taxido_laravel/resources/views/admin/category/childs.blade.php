<ol class="dd-list">
    @foreach ($childs as $child)
        <li class="dd-item dd3-item" {{ isset($cat) && $cat->id == $child->id ? 'active' : '' }}
            {{ !$child->status ? 'disabled' : '' }} data-id="{{ $child->id }}">
            <div class="dd-handle dd3-handle">{{ __('static.categories.drag') }}</div>
            <div class="dd3-content">
                {{ $child->name }}
                <button type="button" class="delete delete-category" data-bs-toggle="modal" data-bs-target="#confirmation"
                    data-url="{{ route('admin.category.destroy', $child->id) }}">
                    <i class="ri-delete-bin-line"></i>
                </button>
                @php
                    $route =
                        route('admin.category.edit', [$child->id]) .
                        '?locale=' .
                        app()->getLocale();
                @endphp
                <a href="{{ $route }}" class="edit"><i
                        class="ri-edit-2-line"></i></a>
            </div>
        </li>
        @if (count($child->childs))
            @include('admin.category.childs', ['childs' => $child->childs])
        @endif
    @endforeach
</ol>