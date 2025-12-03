@push('css')
    <link rel="stylesheet" type="text/css" href="{{ asset('css/nestable-style.css') }}">
@endpush

<div class="contentbox">
    <div class="inside">
        <div class="contentbox-title">
            <h3 class="mb-0">{{ __('ticket::static.categories.categories') }}</h3>
            @if (!Request::is('admin/ticket/category'))
                <a href="{{ route('admin.ticket.category.index') }}"
                    class="btn btn-primary">{{ __('ticket::static.categories.add_category') }}</a>
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
                                        <div class="dd-handle dd3-handle">{{ __('ticket::static.categories.drag') }}</div>
                                        <div class="dd3-content">{{ $category->name }}
                                                <button type="button" class="delete" data-bs-toggle="modal"
                                                        data-bs-target="#confirmation"
                                                        data-url="{{ route('admin.ticket.category.destroy', $category->id) }}">
                                                    <i class="ri-delete-bin-line"></i>
                                                </button>
                                                @php
                                                    $route =
                                                        route('admin.ticket.category.edit', [$category->id]) .
                                                        '?locale=' .
                                                        app()->getLocale();
                                                @endphp
                                                <a href="{{ $route }}"
                                                    class="edit"><i class="ri-edit-2-line"></i></a>
                                        </div>
                                        @if (!$category?->childs?->isEmpty())
                                            @include('ticket::admin.category.childs', [
                                                'childs' => $category->childs,
                                            ])
                                        @endif
                                    </li>
                                @empty
                                    <div class="no-data mt-3">
                                        <img src="{{ url('/images/no-data.png') }}" alt="">
                                        <h6 class="mt-2">{{ __('ticket::static.categories.no_category_found') }}</h6>
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
<!-- confirmation modal modal -->
<div class="modal fade confirmation-modal" id="confirmation" tabindex="-1" role="dialog"
    aria-labelledby="confirmationLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-start">
                <div class="main-img">
                    <i class="ri-delete-bin-line "></i>
                </div>
                <div class="text-center">
                    <div class="modal-title">{{__('static.delete_message')}}</div>
                    <p class="mb-0">{{__('static.delete_note')}}</p>
                </div>
            </div>
            <div class="modal-footer">
                <form method="POST" action="" id="deleteForm">
                    @csrf
                    @method('DELETE')
                    <button type="button" class="btn btn-primary m-0 delete-category"
                        data-bs-dismiss="modal">{{ __('static.cancel') }}</button>
                    <button type="submit" class="btn btn-secondary delete-btn m-0">{{ __('static.delete') }}</button>
                </form>
            </div>
        </div>
    </div>
</div>


@push('scripts')
    <script type="text/javascript" src="{{ asset('js/nestable/jquery.nestable.min.js') }}"></script>
    <script>
        $(document).ready(function() {
            // Update category order in database
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
                    url: "{{ route('admin.ticket.category.update.orders') }}",
                    method: 'POST',
                    data: {
                        categories: mergedArray
                    },
                    success: function() {
                        //
                    }
                });
            }

            // Initialize nestable and set change event
            $('.dd').nestable({
                maxDepth: 12
            }).on('change', updateToDatabase);

            $(document).on('click', '.delete', function() {
                $('#deleteForm').attr('action', $(this).data('url'));
            });
        });
    </script>
@endpush
