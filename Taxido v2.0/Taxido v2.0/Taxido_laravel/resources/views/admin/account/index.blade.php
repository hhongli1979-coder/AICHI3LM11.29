@extends('admin.layouts.master')
@section('title', __('static.accounts.edit_profile'))
@section('content')
<div class="profile-main">
    <div class="row">
        <div class="col-xl-10 col-xxl-8 mx-auto">
            <div class="contentbox">
                <div class="inside">
                    <div class="contentbox-title">
                        <h3>{{ __('static.accounts.edit_profile') }}</h3>
                    </div>
                    <ul class="nav nav-tabs horizontal-tab custom-scroll" id="account" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link {{ $errors->has('name') || $errors->has('email') || $errors->has('role') || $errors->has('country_id') || $errors->has('state_id') || $errors->has('city') || $errors->has('phone') || $errors->has('countryCode') || $errors->has('latitude') || $errors->has('longitude') || !$errors->any() ? 'show active' : '' }}" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="true">
                                <i class="ri-shield-user-line"></i>
                                {{ __('static.accounts.general') }}
                            </a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link {{ $errors->has('current_password') || $errors->has('new_password') || $errors->has('confirm_password') ? 'active' : '' }}" id="password-tab" data-bs-toggle="tab" data-bs-target="#password" type="button" role="tab" aria-controls="password" aria-selected="false">
                                <i class="ri-rotate-lock-line"></i>
                                {{ __('static.accounts.change_password') }}
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content" id="accountContent">
                        <div class="tab-pane fade {{ $errors->has('name') || $errors->has('email') || $errors->has('country_id') || $errors->has('state_id') || $errors->has('city') || $errors->has('phone') || $errors->has('countryCode') || $errors->has('latitude') || $errors->has('longitude') || !$errors->any() ? 'show active' : '' }}" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <form id="profileForm" action="{{ route('admin.account.profile.update', [Auth::user()->id]) }}" method="POST" enctype="multipart/form-data" class="mb-0">
                                @method('PUT')
                                @csrf
                                <div class="form-group row">
                                    <label class="col-md-2" for="avatar">{{ __('static.accounts.avatar') }}
                                    </label>
                                    <div class="col-md-10">
                                        <x-image :name="'profile_image_id'" :data="Auth::user()->profile_image" :text="__('static.accounts.image_note')" :multiple="false"></x-image>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="name">{{ __('static.accounts.full_name') }}<span> *</span></label>
                                    <div class="col-md-10">
                                        <div class="position-relative">
                                            <input placeholder="{{ __('static.accounts.enter_full_name') }}" class="form-control" value="{{ isset(Auth::user()->name) ? Auth::user()->name : old('name') }}" type="text" name="name" required>
                                            @error('name')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="email">{{ __('static.accounts.email') }}<span> *</span></label>
                                    <div class="col-md-10">
                                        <div class="position-relative">
                                            <input class="form-control" placeholder="{{ __('static.accounts.enter_email') }}" value="{{ isset(Auth::user()->email) ? Auth::user()->email : old('email') }}" type="email" name="email" required>
                                            @error('email')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="phone">{{ __('static.accounts.phone') }}<span> *</span></label>
                                    <div class="col-md-10">
                                        <div class="input-group mb-3 phone-detail">
                                            <div class="col-sm-1">
                                                <select class="select-2 form-control" id="select-country-code" name="country_code">
                                                    @php
                                                    $default = old('country_code', Auth::user()->country_code ?? 1);
                                                    @endphp
                                                    @foreach (getCountryCodes() as $option)
                                                    <option class="option" value="{{ $option->calling_code }}" data-image="{{ asset('images/flags/' . $option->flag) }}" {{ $option->calling_code == $default ? 'selected' : '' }}> {{ $option->calling_code }}
                                                    </option>
                                                    @endforeach
                                                </select>
                                            </div>
                                            <div class="col-sm-11">
                                                <input class="form-control" placeholder="{{ __('static.accounts.enter_phone') }}" type="number" name="phone" value="{{ isset(Auth::user()->phone) ? Auth::user()->phone : old('phone') }}" required>
                                            </div>
                                            @error('phone')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-12">
                                        <button type="submit" class="btn btn-solid ms-auto spinner-btn"><i class="ri-save-line text-white lh-1"></i>{{ __('static.save') }}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="tab-pane fade {{ $errors->has('new_password') || $errors->has('confirm_password') || $errors->has('current_password') ? 'active show' : '' }}" id="password" role="tabpanel" aria-labelledby="password-tab">
                            <form id="passwordForm" action="{{ route('admin.account.password.update') }}" method="POST" class="mb-0">
                                @method('PUT')
                                @csrf
                                <div class="form-group row">
                                    <label class="col-md-2" for="current_password">{{ __('static.accounts.current_password') }}<span> *</span></label>
                                    <div class="col-md-10">
                                        <div class="position-relative">
                                            <input class="form-control" type="password" name="current_password" placeholder="{{ __('static.accounts.enter_current_password') }}">
                                            <i class="ri-eye-line toggle-password"></i>
                                            @error('current_password')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="new_password">{{ __('static.accounts.new_password') }}<span> *</span></label>
                                    <div class="col-md-10">
                                        <div class="position-relative">
                                            <input class="form-control" type="password" id="new_password" name="new_password" placeholder="{{ __('static.accounts.enter_new_password') }}">
                                            <i class="ri-eye-line toggle-password"></i>
                                            @error('new_password')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label class="col-md-2" for="confirm_password">{{ __('static.accounts.confirm_password') }}<span> *</span></label>
                                    <div class="col-md-10">
                                        <div class="position-relative">
                                            <input class="form-control" type="password" name="confirm_password" placeholder="{{ __('static.accounts.enter_confirm_password') }}">
                                            <i class="ri-eye-line toggle-password"></i>
                                            @error('confirm_password')
                                            <span class="invalid-feedback d-block" role="alert">
                                                <strong>{{ $message }}</strong>
                                            </span>
                                            @enderror
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <div class="col-12">
                                        <button type="submit" class="btn btn-solid ms-auto spinner-btn"><i class="ri-save-line text-white lh-1"></i>{{ __('static.save') }}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
@push('scripts')
<script>
    (function($) {
        "use strict";

        // Custom validation method for alphabetic characters
        $.validator.addMethod("alphabetic", function(value, element) {
            return this.optional(element) || /^[a-zA-Z\s]{2,}$/.test(value);
        }, "Full name must contain at least 2 alphabetic characters");

        // Profile Update Form
        $('#profileForm').validate({
            ignore: [],
            rules: {
                name: {
                    required: true,
                    alphabetic: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true,
                    minlength: 6,
                    maxlength: 15
                }
            },
            messages: {
                name: {
                    required: "Please enter your full name",
                    alphabetic: "Full name must contain at least 2 alphabetic characters"
                },
                email: {
                    required: "Please enter your email",
                    email: "Please enter a valid email address"
                },
                phone: {
                    required: "Please enter your phone number",
                    minlength: "Phone number must be at least 6 digits",
                    maxlength: "Phone number cannot exceed 15 digits"
                }
            },
            invalidHandler: function(event, validator) {
                let invalidTabs = [];
                $.each(validator.errorList, function(index, error) {
                    const tabId = $(error.element).closest('.tab-pane').attr('id');
                    $("#" + tabId + "-tab .errorIcon").show();
                    if (!invalidTabs.includes(tabId)) {
                        invalidTabs.push(tabId);
                    }
                });
                if (invalidTabs.length) {
                    $(".nav-link.active").removeClass("active");
                    $(".tab-pane.show").removeClass("show active");
                    $("#" + invalidTabs[0] + "-tab").addClass("active");
                    $("#" + invalidTabs[0]).addClass("show active");
                }
            },
            success: function(label, element) {
                $(element).closest('.tab-pane').find('.errorIcon').hide();
            }
        });

        // Change Password Form
        $('#passwordForm').validate({
            rules: {
                current_password: {
                    required: true
                },
                new_password: {
                    required: true,
                    minlength: 8
                },
                confirm_password: {
                    required: true,
                    minlength: 8,
                    equalTo: "#new_password"
                }
            },
            messages: {
                current_password: {
                    required: "Please enter your current password"
                },
                new_password: {
                    required: "Please enter a new password",
                    minlength: "New password must be at least 8 characters"
                },
                confirm_password: {
                    required: "Please confirm your new password",
                    minlength: "Confirm password must be at least 8 characters",
                    equalTo: "Passwords do not match"
                }
            }
        });
    })(jQuery);
</script>
@endpush
