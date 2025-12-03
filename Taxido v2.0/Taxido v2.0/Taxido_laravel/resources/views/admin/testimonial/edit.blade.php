@extends('admin.layouts.master')
@section('title', __('static.testimonials.edit'))
@section('content')
    <div class="">
        <form id="testimonialForm" action="{{ route('admin.testimonial.update', $testimonial->id) }}" method="POST" enctype="multipart/form-data">
            <div class="row g-xl-4 g-3">
                @method('PUT')
                @csrf
                @include('admin.testimonial.fields')
            </div>
        </form>
    </div>
@endsection
