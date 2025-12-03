@extends('admin.layouts.master')
@section('title', __('static.users.add'))
@section('content')
<div class="user-create">
  <form id="userForm" action="{{ route('admin.user.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @include('admin.user.fields')
  </form>
</div>
@endsection
