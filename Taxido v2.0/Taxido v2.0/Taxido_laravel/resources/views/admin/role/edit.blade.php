@extends('admin.layouts.master')
@section('title', __('static.roles.edit_role'))
@section('content')
<div>
    <form id="roleForm" action="{{ route('admin.role.update', $role->id) }}" method="POST">
        @csrf
        @method('PUT')
        @include('admin.role.fields')
    </form>
</div>
@endsection
