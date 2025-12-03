@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_vehicles.add'))
@section('content')
<div class="vehicle-info-create">
    <form id="vehicleInfoForm" action="{{ route('admin.vehicle-info.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
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


