@use('Modules\Taxido\Enums\RoleEnum')
@use('Modules\Taxido\Enums\ServiceCategoryEnum')

@php
    $symbol = getDefaultCurrencySymbol();
    $roleName = getCurrentRoleName();
@endphp

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ env('APP_NAME') }} - {{ __('taxido::static.rides.invoice') }}</title>
        <style>
            body {
                font-family: Inter, sans-serif, DejaVu Sans;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #1F1F1F;
            }

            .text-primary {
                color: #199675;
                font-weight: 700;
            }

            .dark-color {
                color: #1F1F1F;
            }

            .common-color {
                color: #8F8F8F;
            }

            .invoice-header h1 {
                margin: 0;
                font-size: 70px;
                color: #199675;
            }

            .invoice-header div {
                text-align: right;
                font-size: 18px;
            }

            .all-details {
                display: flex;
                align-items: center;
                justify-content: space-between
            }

            .invoice-id {
                background-color: #EEEEEE;
                padding: 10px 40px 10px 30px;
                margin-right: -80px;
                border-radius: 50px;
                transform: translate(50%, 0);
            }

            .invoice-id p {
                padding-bottom: 0;
                text-align: left;
                margin-bottom: 5px
            }

            .invoice-id p span {
                margin-left: 20px;
            }

            .invoice-data {
                margin-top: -60px;
            }

            .invoice-data td {
                border: unset;
                background-color: unset;
                text-align: right;
                padding: 0;
            }

            .section-title {
                margin-top: 15px;
                margin-bottom: 5px;
                color: #199675;
            }

            p {
                margin: 0;
                padding-bottom: 6px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                border: unset;
            }

            .table-details td {
                padding: 0;
                border: unset;
                background-color: unset;
                text-align: start !important;
            }

            th,
            td {
                padding: 10px;
                border: 1px solid #EEEEEE;
            }

            th {
                background: #ECECEC;
            }

            .table-Description td {
                text-align: center
            }

            tbody td {
                background-color: #FAFAFA;
                color: #8F8F8F;
            }

            tfoot td {
                font-weight: bold;
                text-align: right;
                background: #ECECEC;
                border: unset;
                text-align: center;
            }

            .total {
                background: #f5f5f5;
            }

            .footer-content .section-title {
                margin-top: 10px;
            }
        </style>
    </head>

    <body>
        <div class="invoice-container">
            <table class="invoice-data">
                <tbody class="invoice-header">
                    <tr>
                        <td></td>
                        <td>
                            <h3>{{ env('APP_NAME') }} - {{ __('taxido::static.rides.invoice') }}</h3>
                            <div class="invoice-id common-color">
                                <p> {{ __('taxido::static.rides.ride_number') }}:
                                    {{ $ride->ride_number }}<span>{{ __('taxido::static.invoice.date') }}:
                                        {{ $ride->created_at->format('d/m/Y') }}</span></p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="table-details">
                <tbody>
                    <tr>
                        <td>
                            <div class="invoice-data">
                                <div class="invoice-to">
                                    <p class="common-color">{{ __('taxido::static.invoice.invoice_to') }}</p>
                                    <p class="dark-color">{{ __('taxido::static.invoice.name') }}: <span
                                            class="text-primary">{{ $ride->rider['name'] }}</span></p>
                                </div>

                                <div class="ride-details">
                                    <h3 class="section-title">{{ __('taxido::static.invoice.ride_details') }}:</h3>
                                    <p class="dark-color">{{ __('taxido::static.invoice.service') }}: <span
                                            class="common-color">{{ $ride->service['name'] ?? 'N/A' }} | <span
                                                class="dark-color">Service Category:</span> <span
                                                class="common-color">{{ $ride->service_category['name'] ?? 'N/A' }}</span></span>
                                    </p>
                                    <p class="dark-color">{{ __('taxido::static.invoice.pickup_time') }}: <span
                                            class="common-color">{{ $ride?->start_time }} | <span
                                                class="dark-color">Drop-off Time:</span> <span
                                                class="common-color">{{ $ride->dropped_at }}</span></span></p>
                                    <p class="dark-color">{{ __('taxido::static.invoice.pickup_location') }}: <span
                                            class="common-color">{{ $ride->locations[0] ?? 'N/A' }}</span></p>
                                    <p class="dark-color">{{ __('taxido::static.invoice.drop_off_location') }}: <span
                                            class="common-color">{{ $ride->locations[1] ?? 'N/A' }}</span></p>
                                </div>

                                <div class="vehicle">
                                    <h3 class="section-title">{{ __('taxido::static.invoice.vehicle_driver_info') }}:</h3>
                                    <p class="dark-color">{{ __('taxido::static.invoice.driver_name') }}: <span
                                            class="common-color">{{ $ride?->driver['name'] ?? 'N/A' }}</span></p>
                                    <p class="dark-color">{{ __('taxido::static.invoice.vehicle_type') }}: <span
                                            class="common-color">{{ $ride->vehicle_type->vehicle_info->vehicle->name ?? 'N/A' }} |</span>
                                        <span class="dark-color">Vehicle Model:</span> <span
                                            class="common-color">{{ $ride?->driver?->vehicle_info['model'] ?? 'N/A' }}</span>
                                    </p>
                                    <p class="dark-color">{{ __('taxido::static.invoice.vehicle_number') }}:
                                        <span class="common-color">{{ $ride?->driver?->vehicle_info['plate_number'] ?? 'N/A' }}</span>
                                    </p>
                                </div>
                            </div>
                        </td>
                        <td>
                    </tr>
                </tbody>
            </table>
            <table class="table-Description">
                <thead>
                    <tr>
                        <th>{{ __('taxido::static.invoice.description') }}</th>
                        <th>{{ __('taxido::static.invoice.amount') }}</th>
                    </tr>
                </thead>
                <tbody>
                     @php

                        $isPackage = $ride?->service_category?->slug == ServiceCategoryEnum::PACKAGE;
                        $isRental = $ride?->service_category?->slug == ServiceCategoryEnum::RENTAL;
                    @endphp
                    <tr>
                        <td>{{ __('taxido::static.invoice.base_fare') }}</td>
                        <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->ride_fare, 2) }}</td>
                    </tr>
                    @if ($ride->additional_distance_charge > 0)
                        <tr>
                            <td>{{ __('taxido::static.invoice.additional_distance_charge') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->additional_distance_charge, 2) }}
                            </td>
                        </tr>
                    @endif
                    @if ($ride->additional_minute_charge > 0)
                        <tr>
                            <td>{{ __('taxido::static.invoice.additional_minute_charge') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->additional_minute_charge, 2) }}
                            </td>
                        </tr>
                    @endif
                    @if ($ride->additional_weight_charge > 0)
                        <tr>
                            <td>{{ __('taxido::static.invoice.additional_weight_charge') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->additional_weight_charge, 2) }}
                            </td>
                        </tr>
                    @endif
                    @if ($isPackage)
                        <tr>
                            <td>{{ __('taxido::static.invoice.extra_charge') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format(round($ride?->extra_charge, 2), 2) }}
                            </td>
                        </tr>
                    @endif
                    @if ($isRental)
                        <tr>
                            <td>{{ __('taxido::static.invoice.vehicle_charge') }}</td>
                            <td>
                                {{ $ride?->currency_symbol ?? $symbol }}{{ number_format(round($ride?->vehicle_per_day_price, 2) * $ride?->no_of_days, 2) }}
                                ({{ round($ride?->vehicle_per_day_price, 2) }} * {{ $ride?->no_of_days }}
                                {{ __('taxido::static.rides.days') }})
                            </td>
                        </tr>
                        <tr>
                            <td>{{ __('taxido::static.invoice.driver_charge') }}</td>
                            <td>
                                {{ $ride?->currency_symbol ?? $symbol }}{{ number_format(round($ride?->driver_per_day_charge, 2) * $ride?->no_of_days, 2) }}
                                ({{ round($ride?->driver_per_day_charge, 2) }} * {{ $ride?->no_of_days }}
                                {{ __('taxido::static.rides.days') }})
                            </td>
                        </tr>
                    @endif
                    @if ($ride->waiting_charges > 0)
                        <tr>
                            <td>{{ __('taxido::static.invoice.waiting_charge') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->waiting_charges, 2) }}
                            </td>
                        </tr>
                    @endif​
                    @if ($ride->bid_extra_amount > 0)
                    <tr>
                        <td>{{ __('Extra Bid Amount') }}</td>
                        <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->bid_extra_amount, 2) }}
                        </td>
                    </tr>
                    @endif
                    @if ($ride->total_extra_charge > 0)
                        <tr>
                            <td>{{ __('Total Extra Charges') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->total_extra_charge, 2) }}
                            </td>
                        </tr>
                    @endif
                    @if ($ride->preference_charge > 0)
                        <tr>
                            <td>{{ __('Total Preference Charges') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->preference_charge, 2) }}
                            </td>
                        </tr>
                    @endif
                    @if ($ride->processing_fee > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.processing_fee') }}</td>
                                <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->processing_fee, 2) }}
                                </td>
                            </tr>
                        @endif
                    @if ($ride->driver_tips > 0)
                        <tr>
                            <td>{{ __('taxido::static.invoice.driver_tips') }}</td>
                            <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format(round($ride->driver_tips, 2), 2) }}
                            </td>
                        </tr>
                    @endif

                        @if ($ride->driver_cancellation_charge > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.driver_cancellation_charge') }}</td>
                                <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->driver_cancellation_charge, 2) }}
                                </td>
                            </tr>
                        @endif
                        @if ($ride->rider_cancellation_charge > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.rider_cancellation_charge') }}</td>
                                <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->rider_cancellation_charge, 2) }}
                                </td>
                            </tr>
                        @endif

                        @if ($ride?->coupon_total_discount > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.coupon_discount') }} @if ($ride?->coupon?->code)
                                        (#{{ $ride?->coupon?->code }})
                                    @endif
                                </td>
                                <td>-{{ $ride?->currency_symbol ?? $symbol }}{{ number_format(round($ride?->coupon_total_discount, 2), 2) }}
                                </td>
                            </tr>
                        @endif
                        @if ($ride->platform_fees > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.platform_fee') }}</td>
                                <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->platform_fees, 2) }}
                                </td>
                            </tr>
                        @endif
                        @if ($ride->tax > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.tax') }}</td>
                                <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format(round($ride->tax, 2), 2) }}
                                </td>
                            </tr>
                        @endif
                        @if ($ride->commission > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.commission') }}</td>
                                <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->commission, 2) }}</td>
                            </tr>
                            </tr>
                        @endif
                        @if ($ride->processing_fee > 0)
                            <tr>
                                <td>{{ __('taxido::static.invoice.processing_fee') }}</td>
                                <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->processing_fee, 2) }}
                                </td>
                            </tr>
                        @endif
                        @if ($roleName == RoleEnum::DRIVER)
                            @if ($ride->driver_commission > 0)
                                <tr>
                                    <td>{{ __('taxido::static.invoice.driver_commission') }}</td>
                                    <td>{{ $ride?->currency_symbol ?? $symbol }}{{ number_format($ride->driver_commission, 2) }}
                                    </td>
                                </tr>
                            @endif
                        @endif

                </tbody>

                <tfoot>
                    <tr class="total">
                        <td colspan="1">{{ __('taxido::static.invoice.total') }}</td>
                        <td>{{ $ride?->currency_symbol ?? $symbol }}{{ $ride->total }}</td>
                    </tr>
                </tfoot>

            </table>

            <div class="payment-method">
                <h3 class="section-title">{{ __('taxido::static.invoice.payment_details') }}:</h3>
                <p>{{ __('taxido::static.invoice.payment_method') }}: <span
                        class="common-color">{{ $ride->payment_method }}</span>
                    {{ __('taxido::static.invoice.payment_status') }}: <span
                        class="common-color">{{ $ride->payment_status }}</span>
                </p>
            </div>

            <div class="footer-content">
                <h3 class="section-title">{{ __('taxido::static.invoice.thank_you') }}</h3>
                <p class="common-color">{{ __('taxido::static.invoice.thank_you_msg') }}</p>
            </div>
        </div>
    </body>
</html>
