@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_vehicles.edit'))
@section('content')
<div class="vehicle-info-edit">
    <form id="vehicleInfoForm" action="{{ route('admin.vehicle-info.update', $vehicleInfo->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.vehicle-info.fields')
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
    (function($) {
        "use strict";

        $('#vehicleInfoForm').validate({
            rules: {
                "name": "required",
                "vehicle_type_id": "required",
                "plate_number": "required",
            }
        });
    })(jQuery);
</script>
@endpush


