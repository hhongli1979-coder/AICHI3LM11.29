@extends('admin.layouts.master')
@section('title', __('taxido::static.plans.add'))
@section('content')
    <div class="plan-create">
        <form id="planForm" action="{{ route('admin.plan.store') }}" method="POST" enctype="multipart/form-data">
            <div class="row g-xl-4 g-3">
                <div class="col-12">
                    @method('POST')
                    @csrf
                    @include('taxido::admin.plan.fields')
                </div>
            </div>
        </form>
    </div>
@endsection
