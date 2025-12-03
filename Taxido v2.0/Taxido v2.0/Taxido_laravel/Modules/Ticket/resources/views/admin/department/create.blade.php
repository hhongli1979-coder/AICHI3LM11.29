@extends('admin.layouts.master')
@section('title', __('ticket::static.department.add'))
@section('content')
    <div class="department-create">
        <form id="departmentForm" action="{{ route('admin.department.store') }}" method="POST" enctype="multipart/form-data">
            @method('POST')
            @csrf
            @include('ticket::admin.department.fields')
        </form>
    </div>
@endsection
