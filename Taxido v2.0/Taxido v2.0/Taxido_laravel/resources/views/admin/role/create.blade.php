@extends('admin.layouts.master')
@section('title', __('static.roles.add_role'))
@section('content')
<div>
    <form id="roleForm" action="{{ route('admin.role.store') }}" method="POST">
        @csrf
        @include('admin.role.fields')
    </form>
</div>
@endsection
