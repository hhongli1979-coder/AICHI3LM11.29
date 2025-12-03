@extends('admin.layouts.master')
@section('title', __('taxido::static.drivers.driver_details'))

@section('content')
    @php
        $colorClasses = [
            'Pending' => 'warning',
            'Approved' => 'primary',
            'Rejected' => 'danger',
        ];
        $services = getAllServices();
        $rides = $driver?->rides;
        $paymentMethodColorClasses = getPaymentStatusColorClasses();
        $ridestatuscolorClasses = getRideStatusColorClasses();
        $settings = getTaxidoSettings();
    @endphp

    <div class="row driver-dashboard">
        <div class="col-12">
            <div class="default-sorting mt-0">
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.drivers.personal_information') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0">
                    <div class="personal">
                        <div class="information">
                            <div class="border-image">
                                <div class="profile-img">
                                    @if ($driver?->profile_image?->original_url)
                                        <img src="{{ $driver?->profile_image?->original_url }}" alt="">
                                    @else
                                        <div class="initial-letter">
                                            <span>{{ strtoupper($driver?->name[0]) }}</span>
                                        </div>
                                    @endif
                                </div>
                            </div>
                            <div class="personal-rating">
                                <h5>{{ $driver?->name }}</h5>

                                <span>{{ __('taxido::static.drivers.rating') }}:
                                    @php
                                        $averageRating = (int) $driver?->reviews?->avg('rating');
                                        $totalStars = 5;
                                    @endphp


                                    @for ($i = 0; $i < $averageRating; $i++)
                                        <img src="{{ asset('images/dashboard/star.svg') }}" alt="Filled Star">
                                    @endfor
                                    @for ($i = $averageRating; $i < $totalStars; $i++)
                                        <img src="{{ asset('images/dashboard/outline-star.svg') }}" alt="Outlined Star">
                                    @endfor
                            </div>
                        </div>
                        <a href="{{ route('admin.driver.edit', ['driver' => $driver?->id]) }}"
                            class="btn btn-primary">{{ __('taxido::static.drivers.edit_profile') }}</a>
                    </div>
                    <div class="information-details">
                        <ul>

                            <li> <strong> {{ __('taxido::static.drivers.contact_number') }} : </strong>
                                @if (isDemoModeEnabled())
                                    {{ __('static.demo_mode') }}
                                @else
                                    + {{ $driver?->country_code }} {{ $driver?->phone }}
                                @endif
                            </li>
                            <li><strong>{{ __('taxido::static.drivers.email') }} :
                                </strong>{{ isDemoModeEnabled() ? __('static.demo_mode') : (isset($driver?->email) ? $driver?->email : '') }}
                            </li>
                            <li><strong>{{ __('taxido::static.drivers.city') }} : </strong>{{ $driver?->address?->city }}
                            </li>
                            <li><strong>{{ __('taxido::static.drivers.country') }} :
                                </strong>{{ $driver?->address?->country?->name }}</li>
                        </ul>
                        <ul>
                            <li><strong>{{ __('taxido::static.drivers.total_rides') }} :
                                </strong>{{ $driver?->rides?->count() }}</li>
                            <li><strong>{{ __('taxido::static.drivers.total_earnings') }} :
                                </strong>{{ getDefaultCurrency()?->symbol }}
                                {{ number_format($driver?->total_driver_commission, 2) }}
                            </li>
                            <li><strong>{{ __('taxido::static.drivers.wallet') }} :
                                </strong>
                                <a href="{{ url('admin/driver-wallet') }}?driver_id={{ $driver->id }}">
                                    {{ number_format($driver?->wallet?->balance, 2) }}</a>
                            </li>
                            </li>
                            <li><strong>{{ __('taxido::static.drivers.pending_withdraw_request') }} :
                                </strong>{{ $driver?->pending_withdraw_requests_count }}
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.drivers.driver_documents') }}</h5>
                        </div>
                        <a href="{{ route('admin.driver.document', ['id' => $driver->id]) }}" class="text-decoration-none">
                            <span>{{ __('taxido::static.drivers.view_all') }}</span>
                        </a>

                    </div>
                </div>
                <div class="card-body driver-document p-0">
                    <div class="table-responsive h-custom-scrollbar">
                        <table class="table display" style="width:100%">
                            <thead>
                                <tr>
                                    <th>{{ __('taxido::static.drivers.document') }}</th>
                                    <th>{{ __('taxido::static.drivers.status') }}</th>
                                    <th>{{ __('taxido::static.drivers.created_at') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($driver?->documents as $document)
                                    <tr>
                                        <td>
                                            <div class="licence">
                                                @if ($document?->document_image?->original_url)
                                                    <img src="{{ $document?->document_image?->original_url }}"
                                                        class="img-fluid" alt="">
                                                @else
                                                    <div class="initial-letter">
                                                        <span>{{ strtoupper($driver?->name[0]) }}</span>
                                                    </div>
                                                @endif
                                                <span>{{ $document?->document?->name }}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                class="badge badge-{{ $colorClasses[ucfirst($document->status)] ?? 'primary' }}">{{ ucfirst($document->status) }}</span>
                                        </td>
                                        <td>
                                            {{ $document?->created_at->format('Y-m-d h:i:s A') }}
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="9">
                                            <div class="table-no-data d-flex">
                                                <img src="{{ asset('images/dashboard/data-not-found.svg') }}"
                                                    alt="data not found">
                                                <h6>{{ __('taxido::static.drivers.no_documents') }}</h6>
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
        <div class="col-xxl-12">
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
                                                        <th>{{ __('taxido::static.drivers.ride_number') }}</th>
                                                        <th>{{ __('taxido::static.drivers.rider') }}</th>
                                                        <th>{{ __('taxido::static.drivers.service') }}</th>
                                                        <th>{{ __('taxido::static.drivers.category') }}</th>
                                                        <th>{{ __('taxido::static.drivers.ride_status') }}</th>
                                                        <th>{{ __('taxido::static.drivers.total') }}</th>
                                                        <th>{{ __('taxido::static.drivers.created_at') }}</th>
                                                        <th>{{ __('taxido::static.drivers.action') }}</th>
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
                                                                        @if ($ride?->rider['profile_image']?->original_url ?? null)
                                                                            <img src="{{ $ride?->rider['profile_image']?->original_url }}"
                                                                                alt="">
                                                                        @else
                                                                            <div class="initial-letter">
                                                                                <span>{{ strtoupper($ride?->rider['name'][0]) }}</span>
                                                                            </div>
                                                                        @endif
                                                                    </div>
                                                                    <div class="flex-grow-1">

                                                                        <h5>{{ $ride?->rider['name'] }}</h5>
                                                                        <span>
                                                                            @if (isDemoModeEnabled())
                                                                                {{ __('static.demo_mode') }}
                                                                            @else
                                                                                {{ $ride?->rider['email'] }}
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
                                                                    {{ $ride->ride_status->name }}
                                                                </div>
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

        <div class="col-xxl-3 col-md-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.drivers.vehicle_information') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0 px-0">
                    <div class="vehicle-information h-custom-scrollbar">
                        <ul>
                            @if ($driver->vehicle_info)
                                <li><strong>{{ __('taxido::static.drivers.model') }} :
                                    </strong> {{ $driver?->vehicle_info?->model }}</li>
                                <li><strong>{{ __('taxido::static.drivers.vehicle_type') }} :
                                    </strong> {{ $driver?->vehicle_info?->vehicle?->name }}</li>
                                <li><strong>{{ __('taxido::static.drivers.color') }} :
                                    </strong> {{ $driver?->vehicle_info?->color }}</li>
                                <li><strong>{{ __('taxido::static.drivers.seats') }} :
                                    </strong> {{ $driver?->vehicle_info?->seat }}</li>
                                <li><strong>{{ __('taxido::static.drivers.plate_number') }} :
                                    </strong> {{ $driver?->vehicle_info?->plate_number }}</li>
                            @else
                                <li class="table-no-data d-flex">
                                    <img src="{{ asset('images/dashboard/data-not-found.svg') }}" alt="data not found">
                                    <h6 class="text-center">{{ __('taxido::static.drivers.vehicle_info') }}</h6>
                                </li>
                            @endif
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-md-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.drivers.bank_details') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body pt-0 px-0">
                    <div class="vehicle-information bank-details h-custom-scrollbar">
                        <ul>
                            @if ($driver->payment_account)
                                <li><strong>{{ __('taxido::static.drivers.account_holder_name') }} :
                                    </strong> {{ $driver?->payment_account?->bank_holder_name }}
                                </li>
                                <li><strong>{{ __('taxido::static.drivers.bank_name') }} :
                                    </strong> {{ $driver?->payment_account?->bank_name }}</li>
                                <li><strong>{{ __('taxido::static.drivers.account_number') }} :
                                    </strong> {{ $driver?->payment_account?->bank_account_no }}</li>
                                <li><strong>{{ __('taxido::static.drivers.routing_number') }} :
                                    </strong> {{ $driver?->payment_account?->routing_number }}</li>
                                <li><strong>{{ __('taxido::static.drivers.swift_code') }} :
                                    </strong> {{ $driver?->payment_account?->swift }}</li>
                            @else
                                <li class="table-no-data d-flex">
                                    <img src="{{ asset('images/dashboard/data-not-found.svg') }}" alt="data not found">
                                    <h6 class="text-center">{{ __('taxido::static.riders.no_bank_details') }}</h6>
                                </li>
                            @endif
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.drivers.current_driver_location') }}</h5>
                        </div>
                    </div>
                </div>
                <div class="card-body driver-document driver-rules pt-0">
                    <div class="location-map" style="flex-grow: 1;">
                        <div id="map_canvas"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.drivers.rider_reviews') }}</h5>
                        </div>
                        <a href="{{ route('admin.rider-review.index') }}" class="text-decoration-none">
                            <span>{{ __('taxido::static.drivers.view_all') }}</span>
                        </a>
                    </div>
                </div>
                <div class="card-body driver-document driver-review p-0">
                    <div class="table-responsive h-custom-scrollbar">
                        <table class="table display" style="width:100%">
                            <thead>
                                <tr>
                                    <th>{{ __('taxido::static.drivers.rider') }}</th>
                                    <th>{{ __('taxido::static.drivers.rating') }}</th>
                                    <th>{{ __('taxido::static.drivers.message') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($driver?->reviews as $review)
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="customer-image">
                                                    @if ($review && $review->rider)
                                                        @if ($review->rider->profile_image && $review->rider->profile_image->original_url)
                                                            <img src="{{ $review->rider->profile_image->original_url }}" alt="">
                                                        @else
                                                            <div class="initial-letter">
                                                                <span>{{ strtoupper($review->rider->name[0]) }}</span>
                                                            </div>
                                                        @endif
                                                    @endif
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h5>{{ $review?->rider?->name }}</h5>
                                                    <span>
                                                        @if (isDemoModeEnabled())
                                                            {{ __('static.demo_mode') }}
                                                        @else
                                                            {{ $review?->rider?->email }}
                                                        @endif
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="rating">
                                                @php
                                                    $averageRating = (int) $review?->rating;
                                                    $totalStars = 5;
                                                @endphp
                                                @for ($i = 0; $i < $averageRating; $i++)
                                                    <img src="{{ asset('images/dashboard/star.svg') }}"
                                                        alt="Filled Star">
                                                @endfor
                                                @for ($i = $averageRating; $i < $totalStars; $i++)
                                                    <img src="{{ asset('images/dashboard/outline-star.svg') }}"
                                                        alt="Outlined Star">
                                                @endfor

                                            </div>
                                        </td>
                                        <td>
                                            <p>{{ $review?->message }}</p>
                                        </td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3">
                                            <div class="table-no-data d-flex">
                                                <img src="{{ asset('images/dashboard/data-not-found.svg') }}"
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
        <div class="col-xxl-6">
            <div class="card">
                <div class="card-header card-no-border">
                    <div class="header-top">
                        <div>
                            <h5 class="m-0">{{ __('taxido::static.drivers.withdraw_requests') }}</h5>
                        </div>
                        <a href="{{ route('admin.withdraw-request.index') }}" class="text-decoration-none">
                            <span>{{ __('taxido::static.drivers.view_all') }}</span>
                        </a>
                    </div>
                </div>
                <div class="card-body driver-document withdraw-request p-0">
                    <div class="table-responsive h-custom-scrollbar">
                        <table class="table display" style="width:100%">
                            <thead>
                                <tr>
                                    <th>{{ __('taxido::static.drivers.amount') }}</th>
                                    <th>{{ __('taxido::static.drivers.status') }}</th>
                                    <th>{{ __('taxido::static.drivers.payment_type') }}</th>
                                    <th>{{ __('taxido::static.drivers.created_at') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse ($driver?->withdrawRequests as $withdrawRequest)
                                    <tr>
                                        <td>{{ $withdrawRequest?->amount }}</td>
                                        <td>
                                            <span
                                                class="badge badge-{{ $colorClasses[ucfirst($withdrawRequest->status)] ?? 'primary' }}">{{ ucfirst($withdrawRequest->status) }}</span>
                                        </td>
                                        <td>{{ $withdrawRequest?->payment_type }}</td>
                                        <td>{{ $withdrawRequest?->created_at->format('Y-m-d h:i:s A') }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="9">
                                            <div class="table-no-data d-flex">
                                                <img src="{{ asset('images/dashboard/data-not-found.svg') }}"
                                                    alt="data not found">
                                                <h6>{{ __('taxido::static.drivers.no_withdraw_requests') }}</h6>
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
    </div>
@endsection

@if ($settings['location']['map_provider'] == 'google_map')
    @includeIf('taxido::admin.driver.google')
@elseIf($settings['location']['map_provider'] == 'osm')
    @includeIf('taxido::admin.driver.osm')
@endif
