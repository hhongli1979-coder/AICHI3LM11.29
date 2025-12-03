@extends('admin.layouts.master')
@section('title',  __('taxido::static.rides.create'))
@section('content')
<div class="banner-create">
        <div class="row g-xl-4 g-3">
            @include('taxido::admin.ride.fields')
        </div>
    </form>
</div>
@endsection
