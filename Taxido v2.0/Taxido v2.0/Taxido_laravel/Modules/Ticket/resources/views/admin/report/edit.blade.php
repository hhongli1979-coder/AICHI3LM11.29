@extends('admin.layouts.master')
@section('title', __('ticket::static.report.reports'))
@section('content')
    <div class="row">
        <div class="col-xl-3">
            <div class="p-sticky">
                <div class="contentbox">
                    <div class="inside">
                        <div class="customer-detail">
                            <div class="profile">
                                @php
                                    $imageUrl = getMedia($executive?->Profile_image_id)?->original_url;
                                @endphp
                                <div class="profile-img">
                                    @if ($imageUrl)
                                        <img src="{{ $imageUrl }}" alt="">
                                    @else
                                        <div class="initial-letter">
                                            <span>{{ strtoupper($executive?->name[0]) }}</span>
                                        </div>
                                    @endif
                                </div>
                                <div class="mt-2">
                                    <h4>{{ $executive?->name }}</h4>
                                    <div class="rate-box">
                                        <i class="ri-star-fill"></i>
                                        {{ $executive?->ratings?->avg('rating') ? number_format($executive->ratings->avg('rating'), 1) : 'Unrated' }}
                                    </div>
                                    <p>{{ ucfirst($executive?->role->name) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contentbox">
                    <div class="inside">
                        <div class="contentbox-title">
                            <h3>{{ __('ticket::static.report.user_detail') }}</h3>
                        </div>
                        <div class="customer-detail">
                            <div class="detail-card">
                                <ul class="detail-list">
                                    <li class="detail-item">
                                        <h5>{{ __('ticket::static.report.name') }}</h5>
                                        <span>{{ $executive?->name }}</span>
                                    </li>
                                    <li class="detail-item">
                                        <h5>{{ __('ticket::static.report.role') }}</h5>
                                        <span class="badge badge-primary">{{ ucfirst($executive?->role?->name) }}</span>
                                    </li>
                                    <li class="detail-item">
                                        <h5>{{ __('ticket::static.report.email') }}</h5>
                                        <span>{{ $executive?->email }}</span>
                                    </li>
                                    <li class="detail-item">
                                        <h5>{{ __('ticket::static.report.phone') }}</h5>
                                        <span>
                                            @if ($executive?->phone)
                                                + ({{ $executive?->country_code }}) {{ $executive?->phone }}
                                            @else
                                                -
                                            @endif
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-9">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <div class="contentbox-subtitle">
                            <h3>{{ __('ticket::static.report.reports') }}</h3>
                        </div>
                    </div>
                    <div class="report-table">
                        <x-table :columns="$tableConfig['columns']" :data="$tableConfig['data']" :filters="$tableConfig['filters']" :actions="$tableConfig['actions']" :total="$tableConfig['total']"
                            :actionButtons="$tableConfig['actionButtons']" :bulkactions="$tableConfig['bulkactions']" :search="true">
                        </x-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
