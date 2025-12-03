@extends('taxido::front.account.master')
@section('title', __('taxido::front.history'))
@php
        $ridestatuscolorClasses = getRideStatusColorClasses();
        $settings = getTaxidoSettings();
@endphp
@section('detailBox')
<div class="dashboard-details-box table-details-box">
    <div class="dashboard-title">
        <h3>{{ __('taxido::front.history') }}</h3>
        <a href="{{ route('front.cab.ride.create') }}">+ {{ __('taxido::front.create_ride') }}</a>
    </div>

    <div class="driver-document driver-details">
        <div class="table-responsive">
            <table class="table history-table display">
                @if ($rides->count())
                    <thead>
                        <tr>
                            <th>{{ __('taxido::front.ride_number') }}</th>
                            <th>{{ __('taxido::front.driver') }}</th>
                            <th>{{ __('taxido::front.service') }}</th>
                            <th>{{ __('taxido::front.ride_status') }}</th>
                            <th>{{ __('taxido::front.total_amount') }}</th>
                            <th>{{ __('taxido::front.created_at') }}</th>
                            <th>{{ __('taxido::front.action') }}</th>
                        </tr>
                    </thead>
                @endif
                <tbody>
                    @forelse ($rides as $ride)
                        <tr>
                            <td>
                                <span class="badge badge-primary bg-light-primary">#{{ $ride->ride_number }}</span>
                            </td>
                            <td>
                                <div class="d-flex align-items-center profile-box">
                                    <div class="customer-image">
                                        @if ($ride->driver && $ride->driver->profile_image?->original_url)
                                            <img src="{{ $ride->driver->profile_image->original_url }}" alt="{{ $ride->driver->name }}" class="img-fluid">
                                        @else
                                            <div class="initial-letter">
                                                <span>{{ strtoupper($ride->driver->name[0] ?? 'N/A') }}</span>
                                            </div>
                                        @endif
                                    </div>
                                    <div class="profile-name flex-grow-1">
                                        <h5>{{ $ride->driver->name ?? 'Unknown Driver' }}</h5>
                                        <span>
                                            @if(isDemoModeEnabled())
                                                {{ __('demo_mode') }}
                                            @else
                                                {{ $ride->driver->email ?? 'N/A' }}
                                            @endif
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td>{{ $ride->service->name ?? 'N/A' }}</td>
                            <td>
                                <span class="badge badge-{{ $ridestatuscolorClasses[ucfirst($ride->ride_status?->name)] ?? 'completed' }}">
                                    {{ $ride->ride_status->name ?? 'Pending' }}
                                </span>
                            </td>
                            <td>{{ getDefaultCurrency()->symbol }}{{ number_format($ride->total, 2) }}</td>
                            <td>{{ $ride->created_at->format('Y-m-d h:i:s A') }}</td>
                            <td>
                                <a href="{{ route('front.cab.ride.show', $ride->id) }}" class="action-icon">
                                    <i class="ri-eye-line"></i>
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7">
                                <div class="dashboard-no-data">
                                    <svg>
                                        <use xlink:href="{{ asset('images/dashboard/front/no-ride.svg#noRide') }}"></use>
                                    </svg>
                                    <h6>{{ __('taxido::front.no_rides') }}</h6>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="pagination-main">
            <ul class="pagination-box">
                {{ $rides->links() }}
            </ul>
        </div>
    </div>
</div>
@endsection
