@props([
'columns',
'data',
'filters',
'total',
'search',
'actions',
'bulkactions',
'viewActionBox' => [],
'actionButtons' => [],
'modalActionButtons' => [],
'showCheckbox' => true,
])

<div class="table-main">
        <form method="GET" class="table-form mb-0">
            <div class="table-top-panel">
                @if (isset($filters) || (isset($search) && $search))
                <div class="top-part mb-md-4 mb-0">
                    @isset($filters)
                    <ul class="top-part-left m-0">
                        @foreach ($filters as $filter)
                        @php
                        $filterActive =
                        (request()->filled('filter') && request()->filter == $filter['slug']) ||
                        (!request()->filled('filter') && $loop->first);
                        @endphp
                        <li class="{{ $filter['slug'] }}">
                            <a href="{{ url()->current() . '?filter=' . $filter['slug'] }}"
                                @if ($filterActive) class="current" @endif>
                                {{ $filter['title'] }}
                                <span class="count">({{ isset($filter['count']) ? $filter['count'] : 0 }})</span>
                            </a>
                        </li>
                        @endforeach
                    </ul>
                    @endisset
                    @if (isset($search) && $search)
                    @include('components.table.table-search')
                    @endif
                </div>
                @endif
                @include('components.table.table-action', ['total' => $total, 'bulkactions' => $bulkactions])
            </div>
        </form>
        <div class="table-responsive custom-scrollbar">
            <table class="table">
                <thead>
                    <tr>
                        @include('components.table.table-header', [
                        'columns' => $columns,
                        'showCheckbox' => $showCheckbox
                        ])
                    </tr>
                </thead>
                <tbody>
                    <div class="progress-loader-wrapper" style="display:none;">
                        <div class="loader"></div>
                    </div>
                    @forelse($data as $row)
                    <tr>
                        @if ($showCheckbox && !is_string($row))
                        <td class="check-column">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" name="ids[]"
                                    value="{{ $row['id'] ?? null }}"
                                    data-system-reserved="{{ @$row['system_reserve'] ?? 0 }}">
                            </div>
                        </td>
                        @endif

                        @foreach ($columns as $column)
                        @include('components.table.table-body', [
                        'system_reserved' => !is_string($row) ? $row['system_reserve'] ?? 0 : 0,
                        'column' => $column,
                        'row' => $row,
                        'actionButtons' => $actionButtons,
                        'modalActionButtons' => $modalActionButtons,
                        ])
                        @endforeach
                    </tr>
                    @empty
                    <tr class="no-items">
                        <td class="colspan" colspan="{{ count($columns) + ($showCheckbox ? 1 : 0) }}">
                            {{ __('No') }} <span>{{ __('Data') }}</span> {{ __('Found') }}
                        </td>
                    </tr>
                    @endforelse
                </tbody>
                <tfoot>
                    <tr>
                        @include('components.table.table-header', [
                        'columns' => $columns,
                        'showCheckbox' => $showCheckbox
                        ])
                    </tr>
                </tfoot>
            </table>
        </div>
        @if ($data)
        {{ $data?->appends(['paginate' => request()?->paginate])->links() }}
        @endif

</div>

@push('scripts')
<script>
    $(document).ready(function() {
        $(document).on('click', '.permanentDeleteBtn', function() {
            $('#permanentDeleteForm').attr('action', $(this).data('url'));
        });

        // Only initialize if checkboxes exist
        if ($('.form-check-input[name="ids[]"]').length) {
            function updateCheckAll() {
                const totalCheckboxes = $('.form-check-input[name="ids[]"]').not(':disabled').length;
                const checkedCheckboxes = $('.form-check-input[name="ids[]"]:checked').not(':disabled').length;
                $('.checkAll').prop('checked', totalCheckboxes > 0 && totalCheckboxes === checkedCheckboxes);
            }

            $('.form-check-input[name="ids[]"]').change(updateCheckAll);

            $('.checkAll').change(function() {
                const isChecked = $(this).is(':checked');
                $('.form-check-input[name="ids[]"]').not(':disabled').prop('checked', isChecked);
                updateCheckAll();
            });

            $('.form-check-input[name="ids[]"]').each(function() {
                var isReserved = $(this).data('system-reserved');
                if (isReserved) {
                    $(this).prop('disabled', true);
                }
            });
        }

        $(document).on('change', '.toggle-class', function() {
            let checked = $(this).prop('checked') ? 1 : 0;
            let url = $(this).data('route');
            let clickedToggle = $(this);
            $('.progress-loader-wrapper').show();
            $.ajax({
                type: "PUT",
                url: url,
                data: {
                    status: checked,
                    _token: '{{ csrf_token() }}',
                },
                success: function(data) {
                    clickedToggle.prop('checked', checked);
                    $('.progress-loader-wrapper').hide();
                    location.reload();
                    toastr.success("{{ __('static.toastr.status') }}");
                },
                error: function(xhr, status, error) {
                    $('.progress-loader-wrapper').hide();
                    let message = xhr.responseJSON?.message ?? null;
                    if(message) {
                        toastr.error(message);
                    }else {
                        toastr.error(error);
                    }

                    clickedToggle.prop('checked', !checked);
                }
            });
        });
    });

    $(document).ready(function() {
    $('#applyBtn').on('click', function(e) {
        e.preventDefault();
        var form = $(this).closest('form');
        if (!form.length) {
            toastr.error('No form found.');
            return;
        }

        var action = form.find('select[name="action"]').val();
        if (!action) {
            toastr.error('Please select a bulk action.');
            return;
        }
        var selectedIds = [];
        $('input[name="ids[]"]:checked').each(function() {
            selectedIds.push($(this).val());
        });

        if (selectedIds.length === 0) {
            toastr.error('Please select at least one item.');
            return;
        }

       var baseUrl = window.location.pathname;
        var params = new URLSearchParams();
        params.set('action', action);
        selectedIds.forEach(function(id) {
            params.append('ids[]', id);
        });
        var actionUrl = baseUrl + '?' + params.toString();
        window.location.href = actionUrl;
    });

    // Handle "Select All" checkbox
    $('.checkAll').on('change', function() {
        $('input[name="ids[]"]').prop('checked', $(this).prop('checked'));
    });
});
</script>
@endpush
