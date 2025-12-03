<div class="top-part-right">
    <div class="search-form d-flex align-items-center gap-2 m-0">
        <input type="text" name="s" id="search-input" class="form-control search-input" value="{{ isset(request()->s) ? request()->s : '' }}">
        <button type="submit" id="search-btn" class="btn btn-outline">{{ __('static.search') }}</button>
        <button type="button" class="btn btn-primary" id="clear" style="display: none">{{ __('static.clear') }}</button>
        <i class="ri-search-line" icon-name="search-normal-2"></i>
    </div>
</div>

@push('scripts')
<script>
    $(document).ready(function() {
    const $searchButton = $('#search-btn'); // Updated to match the search button class
    const $searchInput = $('#search-input');
    const $searchForm = $('.search-form'); // Reference to the form
    const $searchBtn = $('#search-btn');

    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(window.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function updateSearchParam() {
        let queryString = window.location.search;
        let params = new URLSearchParams(queryString);
        const searchValue = $searchInput.val().trim();
        if (searchValue) {
            params.set('s', searchValue);
        } else {
            params.delete('s');
        }
        return params.toString();
    }

    $(window).on('popstate', function() {
        const searchValue = getUrlParameter('s');
        $searchInput.val(searchValue);
        toggleSearchButton();
    });

    function toggleSearchButton() {
        const hasText = $searchInput.val().trim() !== '';
        $searchButton.prop('disabled', !hasText);
        $('#clear').toggle(hasText); // Show/hide clear button based on input
    }

    toggleSearchButton();
    $searchInput.on('input', toggleSearchButton);

    $searchBtn.on('click', function(e) {
        e.preventDefault();
        const newQueryString = updateSearchParam();
        const newUrl = window.location.pathname + (newQueryString ? '?' + newQueryString : '');
        window.history.pushState({}, '', newUrl);
        window.location.href = newUrl; // Reload to apply the new URL
    });

    $('#clear').on('click', function(e) {
        e.preventDefault();
        $searchInput.val('');
        const newQueryString = updateSearchParam();
        const newUrl = window.location.pathname + (newQueryString ? '?' + newQueryString : '');
        window.history.pushState({}, '', newUrl);
        window.location.href = newUrl; // Reload to apply the cleared URL
        toggleSearchButton();
    });

    if ($searchInput.val().trim() !== '') {
        $('#clear').show();
    }
});
</script>
@endpush
