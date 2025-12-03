@extends('admin.layouts.master')
@section('title', __('ticket::static.executive.add_support_executive'))
@section('content')
<div class="user-create">
  <form id="executiveForm" action="{{ route('admin.executive.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @include('ticket::admin.executive.fields')
  </form>
</div>
@endsection
