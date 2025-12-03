@extends('admin.layouts.master')
@section('title', __('ticket::static.department.edit'))
@section('content')
    <div class="department-edit">
        <form id="departmentForm" action="{{ route('admin.department.update', $department->id) }}" method="POST"
            enctype="multipart/form-data">
            @method('PUT')
            @csrf
            <div class="row g-xl-4 g-3">
                <div class="col-12">
                    @include('ticket::admin.department.fields')
                </div>
            </div>
        </form>
    </div>
@endsection
