@extends('admin.layouts.master')
@section('title', __('taxido::static.riders.add'))
@section('content')
<div class="user-create">
  <form id="riderForm" action="{{ route('admin.rider.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @include('taxido::admin.rider.fields')
  </form>
</div>
@endsection
