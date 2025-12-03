@extends('admin.layouts.master')
@push('css')
    <link rel="stylesheet" href="{{ asset('css/vendors/flatpickr.min.css')}}">
@endpush

@section('title', __('static.dashboard'))
@section('content')
    <div class="row dashboard-default">
        <div class="col-12">
            <div class="default-sorting mt-0">
                <div class="row">
                    <div class="col-xl-6">
                        <div class="welcome-box">
                            <div class="d-flex">
                                <h2>{{ __('static.widgets.hello') }}, {{ getCurrentUser()->name }}</h2>
                                <img src="{{ asset('images/dashboard/hand.gif') }}" alt="">
                            </div>
                            <div class="animation-slides"></div>
                        </div>
                    </div>
                    <div class="col-xl-6">
                        <form action="{{ route('admin.dashboard.index') }}" method="GET" id="sort-form">
                            <div class="support-title sorting m-0">
                                <div class="select-sorting">
                                    <label for="sort">{{ __('static.sort_by') }}</label>
                                    <div class="select-form">
                                        <select class="select-2 form-control sort" id="sort" name="sort">
                                            <option class="select-placeholder" value="today"
                                                {{ request('sort') == 'today' ? 'selected' : '' }}>
                                                {{ __('static.today') }}
                                            </option>
                                            <option class="select-placeholder" value="this_week"
                                                {{ request('sort') == 'this_week' ? 'selected' : '' }}>
                                                {{ __('static.this_week') }}
                                            </option>
                                            <option class="select-placeholder" value="this_month"
                                                {{ request('sort') == 'this_month' ? 'selected' : '' }}>
                                                {{ __('static.this_month') }}
                                            </option>
                                            <option class="select-placeholder" value="this_year"
                                                {{ request('sort') == 'this_year' || !request('sort') ? 'selected' : '' }}>
                                                {{ __('static.this_year') }}
                                            </option>
                                            <option class="select-placeholder" value="custom"
                                                {{ request('sort') == 'custom' ? 'selected' : '' }}>
                                                {{ __('static.custom_range') }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            @php
                                $startDate = request('start');
                                $endDate = request('end');
                                $selectedRange = $startDate && $endDate ? "$startDate to $endDate" : '';
                            @endphp

                            <div class="form-group dashboard-datepicker {{ request('sort') == 'custom' ? '' : 'd-none' }}" id="custom-date-range">
                                <input type="text" class="form-control filter-dropdown" id="start_end_date"
                                    name="start_end_date" placeholder="{{ __('static.select_date') }}"
                                    value="{{ $selectedRange }}">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        @foreach ($widgets as $widget)
            {!! $widget['callback']($widget['data']) !!}
        @endforeach
    </div>
@endsection

@push('scripts')
    <script defer src="{{ asset('js/apex-chart.js') }}"></script>
    <script defer src="{{ asset('js/custom-apexchart.js') }}"></script>
    <script src="{{ asset('js/flatpickr/flatpickr.js')}}"></script>
    <script src="{{ asset('js/flatpickr/rangePlugin.js')}}"></script>

    <script>
        (function ($) {
            "use strict";

            $(document).ready(function () {
                const $sortDropdown = $("#sort");
                const $customDateRange = $("#custom-date-range");
                const $startEndDate = $("#start_end_date");
                const $animationSlides = $(".animation-slides");

                if ($sortDropdown.val() === "custom") {
                    $customDateRange.removeClass("d-none");
                }

                $sortDropdown.on("change", function () {
                    const selectedSort = $(this).val();
                    const urlParams = new URLSearchParams(window.location.search);

                    if (selectedSort === "custom") {
                        $customDateRange.removeClass("d-none");
                    } else {
                        $customDateRange.addClass("d-none");
                        urlParams.delete("start");
                        urlParams.delete("end");
                        urlParams.set("sort", selectedSort);
                        window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
                    }
                });

                // Initialize Flatpickr Date Range Picker
                if ($startEndDate.length) {
                    flatpickr("#start_end_date", {
                        mode: "range",
                        dateFormat: "m-d-Y",
                        defaultDate: "{{ $selectedRange }}",
                        onClose: function (selectedDates, dateStr, instance) {
                            if (selectedDates.length === 2) {
                                const startDate = flatpickr.formatDate(selectedDates[0], "m-d-Y");
                                const endDate = flatpickr.formatDate(selectedDates[1], "m-d-Y");
                                const urlParams = new URLSearchParams(window.location.search);
                                urlParams.set("sort", "custom");
                                urlParams.set("start", startDate);
                                urlParams.set("end", endDate);
                                history.pushState(null, null, `${window.location.pathname}?${urlParams.toString()}`);
                                location.reload();

                            }
                        }
                    });
                }

                // Initialize Slick Slider if element exists
                if ($animationSlides.length) {
                    $animationSlides.slick({
                        slidesToShow: 1,
                        vertical: true,
                        autoplay: true,
                        autoplaySpeed: 1200,
                        arrows: false,
                    });

                    const slides = [
                        "<p>{{ __('static.slides.first_slide') }}</p>",
                        "<p>{{ __('static.slides.second_slide') }}</p>",
                        "<p>{{ __('static.slides.third_slide') }}</p>",
                    ];

                    slides.forEach(slide => {
                        $animationSlides.slick("slickAdd", slide);
                    });
                }
            });
        })(jQuery);
    </script>
@endpush
