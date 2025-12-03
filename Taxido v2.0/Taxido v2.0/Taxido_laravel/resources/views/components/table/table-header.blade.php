@php
$order = isset(request()->order) && request()->order == 'asc' ? 'desc' : 'asc';
@endphp

@if($showCheckbox ?? true)
<th class="check-column">
    <div class="form-check"><input type="checkbox" class="form-check-input checkAll"></div>
</th>
@endif

@foreach ($columns as $column)
<th @if (isset($column['sortable']) && $column['sortable']) class="sorting-hover" @endif>
    @if ($column['sortable'])
        @php
            $column['field'] = $column['sortField'] ?? $column['field'];
            $updatedQueryParams = array_merge(request()->query(), [
                'orderby' => $column['field'],
                'order' => $order,
            ]);
            $updatedUrl = url()->current() . '?' . http_build_query($updatedQueryParams);
        @endphp
        <a href="{{ $updatedUrl }}">
            <span>{{ $column['title'] }}</span>
            <span class="sorting-indicators">
                @if(isset(request()->order) && request()->order == 'asc')
                    <span class="sorting-indicator asc"></span>
                @elseif(isset(request()->order) && request()->order == 'desc')
                    <span class="sorting-indicator desc"></span>
                @else
                    <span class="sorting-indicator asc desc"></span>
                @endif
            </span>
        </a>
    @else
        {{ $column['title'] }}
    @endif
</th>
@endforeach
