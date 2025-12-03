@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_managers.edit'))
@section('content')
    <div class="fleet-manager-edit">
        <form id="fleetManagerForm" action="{{ route('admin.fleet-manager.update', $fleetManager->id) }}" method="POST" enctype="multipart/form-data">
            @method('PUT')
            @csrf
            @include('taxido::admin.fleet-manager.fields')
        </form>
    </div>
@endsection
