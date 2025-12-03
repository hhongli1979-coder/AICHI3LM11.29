@extends('admin.layouts.master')
@section('title', __('static.faqs.add_faq'))
@section('content')
<div class="faq-create">
    <form id="faqForm" action="{{ route('admin.faq.store') }}" method="POST" enctype="multipart/form-data">
        <div class="row g-xl-4 g-3">
            @method('POST')
            @csrf
            @include('admin.faq.fields')
        </div>
    </form>
</div>
@endsection
