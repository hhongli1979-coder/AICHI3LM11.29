<div class="row">
    <div class="col-xl-10 col-xxl-8 mx-auto">
      <div class="contentbox">
        <div class="inside">
          <div class="contentbox-title">
            <h3>{{ isset($executive) ?  __('ticket::static.executive.edit') :  __('ticket::static.executive.add') }}</h3>
          </div>
          <div class="form-group row">
            <label class="col-md-2" for="name">{{ __('ticket::static.executive.full_name') }}<span> *</span></label>
            <div class="col-md-10">
              <input class="form-control" value="{{ isset($executive->name) ? $executive->name : old('name') }}" type="text" name="name" placeholder="{{ __('ticket::static.executive.enter_full_name') }}" required>
              @error('name')
              <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
              </span>
              @enderror
            </div>
          </div>
          <div class="form-group row">
                <label class="col-md-2" for="email">{{ __('ticket::static.executive.email') }}<span> *</span></label>
                <div class="col-md-10">
                    @if(isset($executive) && isDemoModeEnabled()) 
                        <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                    @else
                        <input class="form-control" 
                            value="{{ isset($executive->email) ? $executive->email : old('email') }}" 
                            type="email" name="email" 
                            placeholder="{{ __('ticket::static.executive.enter_email') }}" required>
                    @endif
                    @error('email')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>
            </div>

            <div class="form-group row">
                <label class="col-md-2" for="phone">{{ __('ticket::static.executive.phone') }}<span> *</span></label>
                <div class="col-md-10">
                    @if(isset($executive) && isDemoModeEnabled()) 
                        <input class="form-control" value="{{ __('static.demo_mode') }}" type="text" readonly>
                    @else
                        <div class="input-group mb-3 phone-detail">
                            <div class="col-sm-1">
                                <select class="select-2 form-control" id="select-country-code" name="country_code">
                                    @foreach (getCountryCodes() as $option)
                                        <option class="option" value="{{ $option->calling_code }}"
                                            data-image="{{ asset('images/flags/' . $option->flag) }}"
                                            @selected($option->calling_code == old('country_code', $executive->country_code ?? '1'))>
                                            {{ $option->calling_code }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-sm-11">
                                <input class="form-control" type="number" name="phone"
                                    value="{{ old('phone', $executive->phone ?? '') }}"
                                    placeholder="{{ __('ticket::static.executive.enter_phone') }}" required>
                            </div>
                        </div>
                    @endif
                    @error('phone')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                    @enderror
                </div>
            </div>
          @if(request()->routeIs('admin.executive.create'))
          <div class="form-group row">
            <label class="col-md-2" for="password">{{ __('ticket::static.executive.new_password') }}<span> *</span></label>
            <div class="col-md-10">
              <div class="position-relative">
                <input class="form-control" type="password" id="password" name="password" placeholder="{{ __('ticket::static.executive.enter_password') }}" required>
                <i class="ri-eye-line toggle-password"></i>
              </div>
              @error('password')
              <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
              </span>
              @enderror
            </div>
          </div>
          <div class="form-group row">
            <label class="col-md-2" for="confirm_password">{{ __('ticket::static.executive.confirm_password') }}<span> *</span></label>
            <div class="col-md-10">
              <div class="position-relative">
                <input class="form-control" type="password" name="confirm_password" placeholder="{{ __('ticket::static.executive.enter_confirm_password') }}" required>
                <i class="ri-eye-line toggle-password"></i>
              </div>
              @error('confirm_password')
              <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
              </span>
              @enderror
            </div>
          </div>
          <div class="form-group row">
            <label class="col-md-2 mb-0" for="notify">{{ __('ticket::static.executive.notification') }}</label>
            <div class="col-md-10">
              <div class="form-check p-0 w-auto">
                <input type="checkbox" name="notify" id="notify" value="1" class="form-check-input me-2">
                <label for="notify">{{ __('ticket::static.executive.sentence') }}</label>
              </div>
            </div>
          </div>
          @endif
          <div class="form-group row">
            <label class="col-md-2" for="role">{{ __('ticket::static.executive.status') }}</label>
            <div class="col-md-10">
              <div class="editor-space">
                <label class="switch">
                  <input class="form-control" type="hidden" name="status" value="0">
                  <input class="form-check-input" type="checkbox" name="status" value="1" @checked(@$executive?->status ?? true)>
                  <span class="switch-state"></span>
                </label>
              </div>
              @error('status')
              <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
              </span>
              @enderror
            </div>
          </div>
            <div class="form-group row">
              <div class="col-12">
                  <div class="submit-btn">
                      <button type="submit" name="save" class="btn btn-primary spinner-btn">
                          <i class="ri-save-line text-white lh-1"></i> {{ __('ticket::static.save') }}
                      </button>
                      <button type="submit" name="save_and_exit" class="btn btn-primary spinner-btn">
                          <i class="ri-expand-left-line text-white lh-1"></i>{{ __('ticket::static.save_and_exit') }}
                      </button>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  @push('scripts')
  <script>
    (function($) {
      "use strict";
      $('#executiveForm').validate({
        rules: {
          "name": "required",
          "email": {
            "required": true,
            "email": true
          },
          "phone": {
            "required": true,
            "minlength": 6,
            "maxlength": 15
          },
          "password": {
              "required": true,
              "minlength": 6
          },
          "confirm_password": {
              "required": true,
              "equalTo": "#password"
          }
        },
      });
    })(jQuery);
  </script>
  @endpush
  