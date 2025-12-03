@extends('front.layouts.master')

@section('content')
    <section class="user-dashboard-section section-b-space">
        <div class="container">
            <div class="row">
                @includeIf('taxido::front.account.sidebar')
                <div class="col-xxl-9 col-xl-8 col-lg-7">
                    <div class="right-details-box">
                      <button class="btn-show-menu btn d-xl-none">Show menu</button>
                        @yield('detailBox')
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection

@push('scripts')
<script>
    $(document).ready(function() {
        $(".btn-show-menu").click(function() {
            $(".left-profile-box, .profile-bg-overlay").addClass("show");
        });

        $(".sidebar-close-btn,.profile-bg-overlay").click(function(){
            $(".left-profile-box,.profile-bg-overlay").removeClass("show");
        });
    });
</script>
@endpush
