@extends('admin.layouts.master')
@section('title', __('ticket::static.executive.edit'))
@section('content')
<div class="user-edit">
  <form id="executiveForm" action="{{ route('admin.executive.update', $executive->id) }}" method="POST">
    @csrf
    @method('PUT')
    @include('ticket::admin.executive.fields')
  </form>
</div>
@endsection
