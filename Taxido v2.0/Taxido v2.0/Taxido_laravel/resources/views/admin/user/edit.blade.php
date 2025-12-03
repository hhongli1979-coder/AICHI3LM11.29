@extends('admin.layouts.master')
@section('title', __('static.users.edit'))
@section('content')
<div class="user-edit">
  <form id="userForm" action="{{ route('admin.user.update', $user->id) }}" method="POST">
    @csrf
    @method('PUT')
    @include('admin.user.fields')
  </form>
</div>
@endsection
