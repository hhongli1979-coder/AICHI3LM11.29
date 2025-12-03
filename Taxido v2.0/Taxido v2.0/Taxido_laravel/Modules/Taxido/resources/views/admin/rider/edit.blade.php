@extends('admin.layouts.master')
@section('title', __('taxido::static.riders.edit'))
@section('content')
<div class="user-edit">
  <form id="riderForm" action="{{ route('admin.rider.update', $rider->id) }}" method="POST" enctype="multipart/form-data">
     <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('taxido::admin.rider.fields')
        </div>
    </form>
</div>
@endsection
