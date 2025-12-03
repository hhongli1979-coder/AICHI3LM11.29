@extends('admin.layouts.master')
@section('title', __('taxido::static.fleet_managers.add'))
@section('content')
    <div class="fleet-manager-create">
        <form id="fleetManagerForm" action="{{ route('admin.fleet-manager.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('taxido::admin.fleet-manager.fields')
        </form>
    </div>
@endsection
