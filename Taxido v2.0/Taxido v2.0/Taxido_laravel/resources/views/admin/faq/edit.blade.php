@extends('admin.layouts.master')
@section('title', __('static.faqs.edit_faq'))
@section('content')
<div class="faq-main">
    <form id="faqForm" action="{{ route('admin.faq.update', $faq->id) }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('PUT')
            @csrf
            @include('admin.faq.fields')
        </div>
    </form>
</div>
@endsection
