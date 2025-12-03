@if (is_array($value))
@foreach ($value as $subKey => $subValue)
@include('admin.language.trans-fields', ['key' => "{$key}__{$subKey}", 'value' => $subValue])
@endforeach
@else
<div class="form-group row">
  <label class="col-3 tooltip-width" for="locale" data-bs-toggle="tooltip" data-bs-placement="top"
        data-bs-custom-class="custom-tooltip"
        data-bs-title="{{ str_replace('__', '.', $key) }}">{{ str_replace('__', '.', $key) }}</label>
  <div class="col-9">
    <input type="text" class="form-control" name="{{ $key }}" value="{{ $value }}">
  </div>
</div>
@endif