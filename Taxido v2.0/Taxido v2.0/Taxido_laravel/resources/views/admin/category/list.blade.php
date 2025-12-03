@push('css')
    <link rel="stylesheet" type="text/css" href="{{ asset('css/nestable-style.css') }}">
@endpush

<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <h3 class="mb-0">{{ __('static.categories.categories') }}</h3>
            @if (!Request::is('admin/category'))
                <a href="{{ route('admin.category.index') }}"
                    class="btn btn-primary">{{ __('static.categories.add_category') }}</a>
            @endif
        </div>
        <div class="categories-container">
            <div class="category-body">
                <div class="cf nestable-lists">
                    <div class="dd" id="nestable3">
                        <ol class="dd-list">
                            @if (isset($categories))
                                @forelse ($categories as $category)
                                    <li class="dd-item dd3-item {{ isset($cat) && $cat->id == $category->id ? 'active' : '' }}"
                                        data-id="{{ $category->id }}">
                                        <div class="dd-handle dd3-handle">Drag</div>
                                        <div class="dd3-content">{{ $category->name }}
                                            <button type="button" class="delete delete-category" data-bs-toggle="modal"
                                                data-bs-target="#confirmation"
                                                data-url="{{ route('admin.category.destroy', $category->id) }}">
                                                <i class="ri-delete-bin-line"></i>
                                            </button>
                                            @php
                                                $route =
                                                    route('admin.category.edit', [$category->id]) .
                                                    '?locale=' .
                                                    app()->getLocale();
                                            @endphp
                                            <a href="{{ $route }}" class="edit"><i
                                                    class="ri-edit-2-line"></i></a>
                                            <x-modal.confirm />
                                        </div>
                                        @if (!$category?->childs?->isEmpty())
                                            @include('admin.category.childs', [
                                                'childs' => $category->childs,
                                            ])
                                        @endif
                                    </li>
                                @empty

                                    <div class="no-data mt-3">
                                        <img src="{{ url('/images/no-data.svg') }}" alt="">
                                        <h6 class="mt-2">{{ __('static.categories.no_category_found') }}</h6>
                                    </div>
                                @endforelse
                            @endif
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script type="text/javascript" src="{{ asset('js/nestable/jquery.nestable.min.js') }}"></script>
    <script>
        $(document).ready(function() {
            function updateToDatabase() {
                let idString = $('.dd').nestable('toArray', {
                    attribute: 'data-id'
                });
                let orderIndex = [];
                $('#nestable3 li').each(function(index) {
                    orderIndex.push({
                        id: $(this).attr('data-id'),
                        order: index
                    });
                });
                let mergedArray = Object.values(Object.groupBy([...orderIndex, ...idString], ({
                        id
                    }) => id))
                    .map(e => e.reduce((acc, cur) => ({
                        ...acc,
                        ...cur
                    })));

                $.ajax({
                    url: "{{ route('admin.category.update.orders') }}",
                    method: 'POST',
                    data: {
                        categories: mergedArray
                    },
                    success: function() {
                        //
                    }
                });
            }

            $('.dd').nestable({
                maxDepth: 12
            }).on('change', updateToDatabase);

            $(document).on('click', '.delete-category', function() {
                const url = $(this).data('url');
                $('#deleteForm').attr('action', url);
            });
        });
    </script>
@endpush
