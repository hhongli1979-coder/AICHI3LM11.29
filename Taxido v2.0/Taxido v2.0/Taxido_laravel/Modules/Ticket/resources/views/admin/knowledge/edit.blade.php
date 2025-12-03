@extends('admin.layouts.master')
@section('title', __('ticket::static.knowledge.edit'))
@section('content')
    <div class="">
        <form id="knowledgeForm" action="{{ route('admin.knowledge.update', $knowledge->id) }}" method="POST" enctype="multipart/form-data">
            <div class="row g-xl-4 g-3">
                @method('PUT')
                @csrf
                @include('ticket::admin.knowledge.fields')
            </div>
        </form>
    </div>
@endsection
