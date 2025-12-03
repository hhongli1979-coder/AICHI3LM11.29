@extends('admin.layouts.master')
@section('title', __('taxido::static.riders.rider_details'))
@php
    $colorClasses = [
        'Pending' => 'warning',
        'Approved' => 'primary',
        'Rejected' => 'danger',
    ];
    $services = getAllServices();
    $rides = $rider?->rides;
    $paymentMethodColorClasses = getPaymentStatusColorClasses();
    $ridestatuscolorClasses = getRideStatusColorClasses();
@endphp
@section('content')
    <div class="row driver-dashboard">
        <div class="col-xxl-5">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.riders.personal_information') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0">
                    <div class="personal">
                        <div class="information">
                            <div class="border-image">
                                <div class="profile-img">
                                    @if ($rider?->profile_image)
                                        <img src="{{ $rider?->profile_image?->original_url }}" alt="">
                                    @else
                                        <div class="initial-letter">
                                            <span>{{ strtoupper($rider?->name[0]) }}</span>
                                        </div>
                                    @endif
                                </div>
                            </div>
                            <div class="personal-rating">
                                <h5>{{ $rider?->name }}</h5>
                                <span>{{ __('taxido::static.riders.rating') }}
                                    @php
                                        $averageRating = (int) $rider?->reviews?->avg('rating');
                                        $totalStars = 5;
                                    @endphp

                                    @for ($i = 0; $i < $averageRating; $i++)
                                        <img src="{{ asset('images/dashboard/star.svg') }}" alt="Filled Star">
                                    @endfor
                                    @for ($i = $averageRating; $i < $totalStars; $i++)
                                        <img src="{{ asset('images/dashboard/outline-star.svg') }}" alt="Outlined Star">
                                    @endfor
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="information-details">
                        <ul>
                            <li><strong>{{ __('taxido::static.riders.contact_number') }} : </strong> @if(isDemoModeEnabled())
                                        {{ __('taxido::static.demo_mode') }}
                                    @else
                                        + {{ $rider?->country_code }} {{ $rider?->phone }}
                                    @endif</li>
                            <li><strong>{{ __('taxido::static.riders.emails') }} : </strong> @if(isDemoModeEnabled())
                                    {{ __('static.demo_mode') }}
                                @else
                                    {{ $rider->email ?? '' }}
                                @endif</li>
                            <li><strong>{{ __('taxido::static.riders.country') }} :
                                </strong>{{ $rider?->address?->country?->name ?? 'N/A' }}
                            </li>
                        </ul>
                        <ul>
                            <li><strong>{{ __('taxido::static.riders.total_rides') }} :
                                </strong>{{ $rider?->rides?->count() }}</li>
                            <li><strong>{{ __('taxido::static.riders.wallet') }} :
                                </strong>
                                <a href="{{ url('admin/rider-wallet') }}?rider_id={{ $rider->id }}">
                                    {{ number_format($rider?->wallet?->balance, 2) }}</a>
                            </li>
                            <li><strong>{{ __('taxido::static.riders.city') }} : </strong>{{ $rider?->address?->city }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-3">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.riders.bank_details') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="vehicle-information bank-details h-custom-scrollbar">
                        <ul>
                            @if ($rider->payment_account)
                                <li><strong>{{ __('taxido::static.riders.account_holder_name') }} :
                                    </strong>{{ $rider->payment_account->bank_holder_name }}
                                </li>
                                <li><strong>{{ __('taxido::static.riders.bank_name') }} :
                                    </strong>{{ $rider->payment_account->bank_name }}
                                </li>
                                <li><strong>{{ __('taxido::static.riders.account_number') }} :
                                    </strong>{{ $rider->payment_account->bank_account_no }}
                                </li>
                                <li><strong>{{ __('taxido::static.riders.routing_code') }} :
                                    </strong>{{ $rider->payment_account->routing_number ?? 'N/A' }}</li>
                                <li><strong>{{ __('taxido::static.riders.swift_code') }} :
                                    </strong>{{ $rider->payment_account->swift ?? 'N/A' }}</li>
                            @else
                                <li class="table-no-data d-flex">
                                    <img src = "{{ asset('images/dashboard/data-not-found.svg') }}" alt="data not found">
                                    <h6 class="text-center">{{ __('taxido::static.riders.no_bank_details') }}</h6>
                                </li>
                            @endif
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-4">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.riders.driver_reviews') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body driver-document driver-review p-0">
                    <div class="table-responsive h-custom-scrollbar">
                        <table class="table display" style="width:100%">
                            <thead>
                                <tr>
                                    <th>{{ __('taxido::static.riders.name') }}</th>
                                    <th>{{ __('taxido::static.riders.ratings') }}</th>
                                    <th>{{ __('taxido::static.riders.description') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($rider->reviews as $review)
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="customer-image">
                                                    @if ($review?->driver?->profile_image?->original_url)
                                                        <img src="{{ $review?->driver?->profile_image->original_url }}"
                                                            alt="">
                                                    @else
                                                        <div class="initial-letter">
                                                            <span>{{ strtoupper($review->driver->name[0]) }}</span>
                                                        </div>
                                                    @endif
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h5>{{ $review->driver->name }}</h5>
                                                    <span>
                                                        @if(isDemoModeEnabled())
                                                            {{ __('static.demo_mode') }}
                                                        @else
                                                            {{ $review->driver->email }}
                                                        @endif
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="rating">
                                                @php
                                                    $averageRating = (int) $review->rating;
                                                    $totalStars = 5;
                                                @endphp
                                                @for ($i = 0; $i < $averageRating; $i++)
                                                    <img src="{{ asset('images/dashboard/star.svg') }}" alt="Filled Star">
                                                @endfor
                                                @for ($i = $averageRating; $i < $totalStars; $i++)
                                                    <img src="{{ asset('images/dashboard/outline-star.svg') }}"
                                                        alt="Outlined Star">
                                                @endfor
                                            </div>
                                        </td>
                                        <td>
                                            <p>{{ $review->message }}</p>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        {{-- <h6 class="text-center">{{ __('taxido::static.riders.no_bank_details') }}</h6> --}}
                                        <td colspan="3">
                                            <div class="table-no-data d-flex">
                                                <img src = "{{ asset('images/dashboard/data-not-found.svg') }}"
                                                    alt="data not found">
                                                <h6>{{ __('taxido::static.riders.no_reviews') }}</h6>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="card">
                <div class="card-body drivers-details-tabs pb-0">
                    <div class="tabs-container">
                        <div>
                            <ul class="nav nav-tabs horizontal-tab custom-scroll" id="account" role="tablist">
                                @forelse ($services as $key => $service)
                                    <li class="nav-item" role="presentation">
                                        <a class="nav-link @if ($key === 0) active @endif"
                                            id="tab-{{ $service->id }}-tab" data-bs-toggle="tab"
                                            data-bs-target="#tab-{{ $service->id }}" type="button" role="tab"
                                            aria-controls="tab-{{ $service->id }}"
                                            aria-selected="{{ $key === 0 ? 'true' : 'false' }}">
                                            <i class="ri-roadster-line"></i>
                                            {{ $service->name }}
                                        </a>
                                    </li>
                                @empty
                                @endforelse
                            </ul>
                        </div>
                        <div class="tab-content" id="myTabContent">
                            @forelse ($services as $key => $service)
                                <div class="tab-pane fade @if ($key === 0) show active @endif"
                                    id="tab-{{ $service->id }}" role="tabpanel"
                                    aria-labelledby="tab-{{ $service->id }}-tab">

                                    <div class="driver-document driver-details">
                                        <div class="table-responsive h-custom-scrollbar">
                                            <table class="table display" style="width:100%">
                                                <thead>
                                                    <tr>
                                                    <tr>
                                                        <th>{{ __('taxido::static.riders.ride_number') }}</th>
                                                        <th>{{ __('taxido::static.riders.driver') }}</th>
                                                        <th>{{ __('taxido::static.riders.service') }}</th>
                                                        <th>{{ __('taxido::static.riders.service_category') }}</th>
                                                        <th>{{ __('taxido::static.riders.ride_status') }}</th>
                                                        <th>{{ __('taxido::static.riders.total_amount') }}</th>
                                                        <th>{{ __('taxido::static.riders.created_at') }}</th>
                                                        <th>{{ __('taxido::static.riders.action') }}</th>
                                                    </tr>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    @forelse ($rides?->where('service_id', $service?->id) as $ride)
                                                        <tr>
                                                            <td>
                                                                <span
                                                                    class="bg-light-primary">#{{ $ride?->ride_number }}</span>
                                                            </td>
                                                            <td>
                                                                <div class="d-flex align-items-center">
                                                                    <div class="customer-image">
                                                                        @if ($ride?->driver?->profile_image?->original_url)
                                                                            <img src="{{ $ride?->driver?->profile_image?->original_url }}" alt="">
                                                                        @else
                                                                            <div class="initial-letter">
                                                                                <span>
                                                                                    {{ $ride?->driver?->name ? strtoupper($ride->driver->name[0]) : '' }}
                                                                                </span>
                                                                            </div>
                                                                        @endif

                                                                    </div>
                                                                    <div class="flex-grow-1">
                                                                        <h5>{{ $ride?->driver?->name }}</h5>
                                                                        <span>
                                                                            @if(isDemoModeEnabled())
                                                                                {{ __('static.demo_mode') }}
                                                                            @else
                                                                                {{ $ride?->driver?->email }}
                                                                            @endif
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{{ $ride?->service?->name }}</td>
                                                            <td>{{ $ride?->service_category?->name }}</td>
                                                            <td>
                                                                <div
                                                                    class='badge badge-{{ $ridestatuscolorClasses[ucfirst($ride->ride_status->name)] }}'>
                                                                    {{ $ride->ride_status->name }}</div>
                                                            </td>
                                                            <td>{{ getDefaultCurrency()->symbol }}{{ $ride->total }}</td>
                                                            <td>{{ $ride?->created_at->format('Y-m-d h:i:s A') }}</td>

                                                            <td>
                                                                <a href="{{ route('admin.ride.details', $ride->id) }}"
                                                                    class="action-icon">
                                                                    <i class="ri-eye-line"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    @empty
                                                        <tr>
                                                            {{-- <h6 class="text-center">{{ __('taxido::static.riders.no_bank_details') }}</h6> --}}
                                                            <td colspan="9">
                                                                <div class="table-no-data d-flex">
                                                                    <img src = "{{ asset('images/dashboard/data-not-found.svg') }}"
                                                                        alt="data not found">
                                                                    <h6>{{ __('taxido::static.riders.no_rides') }}</h6>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    @endforelse
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            @empty
                            @endforelse
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
