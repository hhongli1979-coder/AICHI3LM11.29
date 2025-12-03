@extends('taxido::front.account.master')
@section('title', __('taxido::front.dashboard'))
@section('detailBox')
    <div class="dashboard-details-box">
        <div class="dashboard-title">
            <h3>{{ __('taxido::front.dashboard') }}</h3>
        </div>
        <div class="wallet-main-box">
            <div class="row g-xl-4 g-lg-3 g-md-4 g-3">
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                    <div class="wallet-box wallet-color-1">
                        <div class="wallet-number">
                            <h2>{{ getDefaultCurrency()?->symbol }}{{ $rider?->wallet?->balance ?? 0 }}</h2>
                            <h5>{{ __('taxido::front.my_wallet') }}</h5>
                        </div>
                        <div class="icon-box">
                            <svg>
                                <use xlink:href="{{ asset('images/svg/wallet.svg#wallet') }}">
                                </use>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                    <div class="wallet-box wallet-color-2">
                        <div class="wallet-number">
                            <h2>{{ $rider->total_active_rides ?? 0 }}</h2>
                            <h5>{{ __('taxido::front.total_active_rides') }}</h5>
                        </div>
                        <div class="icon-box">
                            <svg>
                                <use xlink:href="{{ asset('images/svg/car.svg#car') }}">
                                </use>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                    <div class="wallet-box wallet-color-3">
                        <div class="wallet-number">
                            <h2>{{ $rider->total_complete_rides ?? 0 }}</h2>
                            <h5>{{ __('taxido::front.total_completed_rides') }}</h5>
                        </div>
                        <div class="icon-box">
                            <svg>
                                <use xlink:href="{{ asset('images/svg/car.svg#car') }}">
                                </use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row g-sm-4 g-3">
            <div class="col-xxl-6 col-xl-6 col-lg-12 col-md-6">
                <div class="row gy-xxl-5 g-xl-3 gy-lg-4 gy-3">
                    <div class="col-xxl-12 col-xl-6">
                        <div class="dashboard-sub-title">
                            <h3>{{ __('taxido::front.personal_information') }}</h3>
                        </div>

                        <ul class="profile-info-list">
                            <li><span>{{ __('taxido::front.name') }}:</span>{{ $rider?->name ?? 'N/A' }}</li>
                            <li><span>{{ __('taxido::front.phone') }}:</span>
                                {{ $rider?->country_code ? '+' . $rider?->country_code : '' }}
                                {{ $rider?->phone ?? 'N/A' }}</li>
                            <li><span>{{ __('taxido::front.address') }}:</span> {{ $rider?->address ?? 'N/A' }}
                            </li>
                            <li><span>Maximum Seats:</span> </li>
                            
                        </ul>
                    </div>

                    <div class="col-xxl-12 col-xl-6">
                        <div class="dashboard-sub-title">
                            <h3>{{ __('taxido::front.login_details') }}</h3>
                        </div>

                        <ul class="profile-info-list">
                            <li><span>{{ __('taxido::front.email') }}:</span> {{ $rider?->email }} <a
                                    data-bs-toggle="modal" href="#editProfileModal">{{ __('taxido::front.edit') }}</a></li>
                            <li><span>{{ __('taxido::front.password') }}:</span> ******* <a data-bs-toggle="modal"
                                    href="#changePasswordModal">{{ __('taxido::front.edit') }}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-xxl-6 col-xl-6 col-lg-12 col-md-6 text-center">
                <svg class="dashboard-svg">
                    <use xlink:href="{{ asset('images/user-dashboard.svg#userDashboard') }}"></use>
                </svg>
            </div>
        </div>
    </div>

    <!-- Edit Profile Modal Start -->
    <div class="modal fade theme-modal" id="editProfileModal">
        <div class="modal-dialog modal-dialog-centered custom-width">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">{{ __('taxido::front.edit_profile') }}</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        <i class="ri-close-line"></i>
                    </button>
                </div>
                <form action="{{ route('front.cab.updateProfile') }}" method="POST" id="updateProfileForm">
                    @csrf
                    <div class="modal-body">
                        <div class="form-box form-icon">
                            <label for="name" class="form-label">{{ __('taxido::front.full_name') }}</label>
                            <div class="position-relative">
                                <i class="ri-user-3-line"></i>
                                <input type="text" name="name" class="form-control" id="name"
                                    value="{{ $rider?->name ?? '' }}"
                                    placeholder="{{ __('taxido::front.enter_full_name') }}">
                            </div>
                            @error('name')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="form-box form-icon">
                            <label for="mail" class="form-label">{{ __('taxido::front.email_address') }}</label>
                            <div class="position-relative">
                                <i class="ri-mail-line"></i>
                                <input type="email" name="email" class="form-control" id="mail"
                                    value="{{ $rider?->email ?? '' }}"
                                    placeholder="{{ __('taxido::front.enter_email') }}">
                            </div>
                            @error('email')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="form-box">
                            <label for="phoneNumber" class="form-label">{{ __('taxido::front.phone_number') }}</label>
                            <div class="number-mail-box">
                                <div class="country-code-section">
                                    <select class="select-2 form-control" id="select-country-code" name="country_code">
                                        @foreach (getCountryCodes() as $option)
                                            <option class="option" value="{{ $option->calling_code }}"
                                                data-image="{{ asset('images/flags/' . $option->flag) }}"
                                                @selected($option->calling_code == old('country_code', $rider?->country_code ?? '1'))>
                                                {{ $option->calling_code }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>
                                    <input type="number" name="phone" class="form-control" id="phoneNumber"
                                        value="{{ old('phone', $rider?->phone ?? '') }}"
                                        placeholder="{{ __('taxido::front.enter_phone_number') }}" required>
                                    @error('phone')
                                        <span class="invalid-feedback d-block" role="alert">
                                            <strong>{{ $message }}</strong>
                                        </span>
                                    @enderror
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn cancel-btn"
                            data-bs-dismiss="modal">{{ __('taxido::front.cancel') }}</button>
                        <button type="submit"
                            class="btn gradient-bg-color spinner-btn">{{ __('taxido::front.update') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Edit Profile Modal End -->

    <!-- Change Password Modal -->
    <div class="modal fade theme-modal" id="changePasswordModal">
        <div class="modal-dialog modal-dialog-centered custom-width">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">{{ __('taxido::front.change_password') }}</h3>
                    <button type="button" class="btn-close" data-bs-dismiss="modal">
                        <i class="ri-close-line"></i>
                    </button>
                </div>

                <form action="{{ route('front.cab.updatePassword') }}" method="POST" id="changePasswordForm">
                    @csrf
                    @method('POST')
                    <div class="modal-body">
                        <div class="form-box form-icon">
                            <label for="current" class="form-label">{{ __('taxido::front.current_password') }}</label>
                            <div class="position-relative">
                                <i class="ri-lock-password-line"></i>
                                <input type="password" name="current_password" class="form-control"
                                    id="current_password" placeholder="{{ __('taxido::front.enter_current_password') }}">
                                <i class="ri-eye-line toggle-password right-icon"></i>
                            </div>
                            @error('current_password')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="form-box form-icon">
                            <label for="new" class="form-label">{{ __('taxido::front.new_password') }}</label>
                            <div class="position-relative">
                                <i class="ri-lock-password-line"></i>
                                <input type="password" name="new_password" class="form-control" id="new_password"
                                    placeholder="{{ __('taxido::front.enter_new_password') }}">
                                <i class="ri-eye-line toggle-password right-icon"></i>
                            </div>
                            @error('new_password')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                        <div class="form-box form-icon">
                            <label for="confirm" class="form-label">{{ __('taxido::front.confirm_password') }}</label>
                            <div class="position-relative">
                                <i class="ri-lock-password-line"></i>
                                <input type="password" name="confirm_password" class="form-control"
                                    id="confirm_password" placeholder="{{ __('taxido::front.enter_confirm_password') }}">
                                <i class="ri-eye-line toggle-password right-icon"></i>
                            </div>
                            @error('confirm_password')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn cancel-btn"
                            data-bs-dismiss="modal">{{ __('taxido::front.cancel') }}</button>
                        <button type="submit"
                            class="btn gradient-bg-color spinner-btn">{{ __('taxido::front.update') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Change Password Modal End -->
@endsection

@push('scripts')
    <script>
        (function($) {
            "use strict";
            $(document).ready(function() {
                $("#changePasswordForm").validate({
                    ignore: [],
                    rules: {
                        "current_password": "required",
                        "new_password": {
                            required: true,
                            minlength: 8
                        },
                        "confirm_password": {
                            required: true,
                            equalTo: "#new_password"
                        },
                    },
                });

                $("#updateProfileForm").validate({
                    ignore: [],
                    rules: {
                        "name": "required",
                        "email": "required",
                        "phone": "required"
                    },
                });
            });
        })(jQuery);
    </script>
    <script>
        $(document).ready(function() {
            $('#select-country-code').select2({
                dropdownParent: $('#updateProfileForm').closest('.modal'),
                templateResult: function(data) {
                    if (!data.id) return data.text;

                    const imageUrl = $(data.element).data('image');
                    const $result = $(`
                            <span>
                                <img src="${imageUrl}" class="flag-img" onerror="this.onerror=null;this.src='{{ asset('front/images/placeholder/49x37.png') }}';" />
                                + ${data.text.trim()}
                            </span>
                        `);
                    return $result;
                },
                templateSelection: function(data) {
                    if (!data.id) return data.text;

                    const imageUrl = $(data.element).data('image');
                    const $result = $(`
                            <span>
                                <img src="${imageUrl}" class="flag-img" onerror="this.onerror=null;this.src='{{ asset('front/images/placeholder/49x37.png') }}';" />
                                + ${data.text.trim()}
                            </span>
                        `);
                    return $result;
                },
                escapeMarkup: function(m) {
                    return m;
                }
            });
        });
    </script>
@endpush
