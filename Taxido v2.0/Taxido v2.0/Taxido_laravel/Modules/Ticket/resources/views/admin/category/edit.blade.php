@extends('admin.layouts.master')
@section('title', __('ticket::static.categories.edit_category'))
@section('content')
    <div class="row category-main g-md-4 g-3">
        <div class="col-xxl-4 col-xl-5">
            <div class="p-sticky">
                @include('ticket::admin.category.list', ['categories' => $categories])
            </div>
        </div>
        <div class="col-xxl-8 col-xl-7">
            <div class="p-sticky">
                <form id="categoryForm" action="{{ route('admin.ticket.category.update', $cat->id) }}" method="POST"
                    enctype="multipart/form-data">
                    @method('PUT')
                    @csrf
                    @include('ticket::admin.category.fields', ['parents' => $parent])
                </form>
            </div>
        </div>
    </div>
@endsection
