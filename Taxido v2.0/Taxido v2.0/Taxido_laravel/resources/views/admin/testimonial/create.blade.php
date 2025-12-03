@extends('admin.layouts.master')
@section('title', __('static.testimonials.add_testimonial'))
@section('content')
    <div class="">
        <form id="testimonialForm" action="{{ route('admin.testimonial.store') }}" method="POST" enctype="multipart/form-data">
            <div class="row g-xl-4 g-3">
                @method('POST')
                @csrf
                @include('admin.testimonial.fields')
            </div>
        </form>
    </div>
@endsection
