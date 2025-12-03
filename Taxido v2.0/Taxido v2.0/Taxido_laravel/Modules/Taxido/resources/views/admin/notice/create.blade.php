@extends('admin.layouts.master')
@section('title', __('taxido::static.notices.add_notice'))
@section('content')
    <div class="notice-main">
        <form id="noticeForm" action="{{ route('admin.notice.store') }}" method="POST" enctype="multipart/form-data">
            @csrf
            @include('taxido::admin.notice.fields')
        </form>
    </div>
@endsection
