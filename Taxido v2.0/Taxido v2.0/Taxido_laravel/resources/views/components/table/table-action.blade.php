@if (count($bulkactions))
    @php
        $filter = request()->filled('filter') ? request()->filter : 'all';
    @endphp
    <div class="bottom-part mt-2">
        <div class="d-flex align-items-center gap-2 flex-wrap">
            <div class="d-flex align-items-cente gap-2">
                <select class="form-select" name="paginate">
                    <option value="5" {{ request()?->paginate == '5' ? 'selected' : '' }}>5</option>
                    <option value="10" {{ request()?->paginate == '10' ? 'selected' : '' }}>10</option>
                    <option value="15" {{ request()?->paginate == '15' || !request()->paginate ? 'selected' : '' }}>
                        15</option>
                    <option value="20" {{ request()?->paginate == '20' ? 'selected' : '' }}>20</option>
                </select>
            </div>
            <div class="d-flex align-items-cente gap-2">
                @php
                    $permissions = array_column($bulkactions, 'permission');
                @endphp
                @canAny($permissions)
                    <select class="form-select" name="action" >
                        <option value="">{{ __('static.bulk_actions') }}</option>
                        @foreach ($bulkactions as $action)
                            @can($action['permission'])
                                @if (empty($action['whenFilter']) || (!empty($action['whenFilter']) && in_array($filter, $action['whenFilter'])))
                                    <option value="{{ $action['action'] }}">{{ $action['title'] }}</option>
                                @endif
                            @endcan
                        @endforeach
                    </select>
                @endcanAny
                <button type="submit" class="btn btn-outline" id="applyBtn">{{ __('static.media.apply') }}</button>
            </div>
        </div>
        <div class="total-data mt-2">
            <span>{{ $data->total() ?? 0 }} {{ __('static.items') }}</span>
        </div>
    </div>
@endif
