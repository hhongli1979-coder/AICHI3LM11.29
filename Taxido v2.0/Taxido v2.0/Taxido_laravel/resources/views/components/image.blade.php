
@props(['text', 'name', 'multiple', 'data'])
<div class="d-flex gap-3 align-items-start media-relative">
    <div>
        <div class="media-manager" data-name="{{ $name }}" data-multiple="{{ $multiple }}">
            <i class="ri-add-line"></i>
        </div>
        <input type="hidden" name="{{ $name }}" value="">
    </div>
    <ul class="image-select-list cursor-pointer" data-name="{{ $name }}">
        @if ($multiple == false && !is_null($data))
            <li class="selected-media">
                <div class="image-list-detail">
                    <input type="hidden" name="{{ $name }}" value="{{ optional($data)->id }}">
                    <img src="{{ optional($data)->original_url }}" class="img-fluid">
                    <a href="javascript:void(0)" class="remove-media" data-id="{{ optional($data)->id }}" data-name="{{ $name }}">
                        <i class="ri-close-line remove-icon"></i>
                    </a>
                </div>
            </li>
        @elseif ($multiple == true && !is_null($data) && is_array($data))
            @foreach ($data as $media)
                <li class="selected-media">
                    <div class="image-list-detail">
                        <input type="hidden" name="{{ $name }}" value="{{ $media?->id }}">
                        <img src="{{ $media?->original_url }}" class="img-fluid">
                        <a href="javascript:void(0)" class="remove-media" data-id="{{ $media?->id }}" data-name="{{ $name }}">
                            <i class="ri-close-line remove-icon"></i>
                        </a>
                    </div>
                </li>
            @endforeach
        @endif
    </ul>
</div>
<p class="description">{{ $text }}</p>
@push('scripts')
<script>
(function($) {
    // Media Manager
    window.Media = {
        data: [],
        selectedFiles: [],
        values: [],
        multiple: false,
        id: null,
        name: null
    }
    <?php if (isset($data) && isset($name)): ?>
        window.Media.name = '<?php echo $name; ?>';
        var imageIds = $('input[name="' + window.Media.name + '"]').map(function() {
            return parseInt($(this).val());
        }).get();
        window.Media.values.push({ name: window.Media.name, id: imageIds });
    <?php endif; ?>
})(jQuery);
</script>
@endpush
