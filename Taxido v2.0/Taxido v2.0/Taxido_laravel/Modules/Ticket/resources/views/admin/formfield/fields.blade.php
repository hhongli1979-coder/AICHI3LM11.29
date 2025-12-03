
<div class="form-group row">
    <label class="col-md-2" for="name">{{ __('ticket::static.formfield.name') }}<span>*</span></label>
    <div class="col-md-10">
        <input class="form-control" type="text" name="name" placeholder=" {{ __('ticket::static.formfield.enter_name') }}" value="" required>
        @error('name')
            <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>
</div>
<div class="form-group row">
    <label class="col-md-2" for="label">{{ __('ticket::static.formfield.label') }}<span>*</span></label>
    <div class="col-md-10">
        <input class="form-control" type="text" name="label" id="label" placeholder=" {{ __('ticket::static.formfield.enter_label') }}" value="" required>
        @error('label')
            <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>
</div>
<div class="form-group row">
    <label class="col-md-2" for="type">{{ __('ticket::static.formfield.type') }}<span> *</span></label>
    <div class="col-md-10 select-label-error">
        <select class="select-2 form-control" placeholder="" name="type" id="type">
            <option class="option" value="">{{ __('ticket::static.formfield.select_type') }}</option>
            @forelse (['date' => 'Date', 'text' => 'Text', 'email' => 'Email', 'radio' => 'Radio', 'number' => 'Number', 'select' => 'Select', 'textarea' => 'Textarea', 'checkbox' => 'Checkbox'] as $key => $option)
            <option class="option" value={{ $key }}>{{ $option }}</option>
            @empty
                <option value="" disabled></option>
            @endforelse
        </select>
            @error('type')
            <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>
</div>
<div class="form-group row placeholder-input">
    <label class="col-md-2" for="placeholder">{{ __('ticket::static.formfield.placeholder') }}<span>*</span></label>
    <div class="col-md-10">
        <input class="form-control" type="text" name="placeholder" placeholder="{{ __('ticket::static.formfield.enter_placeholder') }}" value="" required>
        @error('placeholder')
            <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>
</div>
<div class="form-group row select_type">
    <label class="col-md-2" for="select_type">{{ __('ticket::static.formfield.select_type') }}<span>*</span></label>
    <div class="col-md-10">
        <input type="radio" name="select_type" value="multiple_select"> {{ __('ticket::static.formfield.multiple_select') }}
        <input type="radio" name="select_type" value="single_select">{{ __('ticket::static.formfield.single_select') }}
        @error('select_type')
            <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>
</div>
<div class="type-options">
    <div class="options">
        <div class="form-group row option_value">
            <label class="col-md-2" for="option_value">{{ __('ticket::static.formfield.option_value') }}<span>*</span></label>
            <div class="col-md-10">
                <input class="form-control option-value-input" type="text" name="option_value[]" placeholder="{{ __('ticket::static.formfield.enter_option_value') }}" value="" required>
                @error('option_value')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>
        <div class="form-group row option_name">
            <label class="col-md-2" for="option_name">{{ __('ticket::static.formfield.option_name') }}<span>*</span></label>
            <div class="col-md-10">
                <input class="form-control option-name-input" type="text" name="option_name[]" placeholder="{{ __('ticket::static.formfield.enter_option_name') }}" value="" required>
                @error('option_name')
                    <span class="invalid-feedback d-block" role="alert">
                        <strong>{{ $message }}</strong>
                    </span>
                @enderror
            </div>
        </div>
        <div class="form-group row delete-row">
            <label class="col-md-2" for="delete"></label>
            <div class="col-md-10">
                <button type="button" id="delete-row" class="btn btn-danger delete-button">
                    <i class="ri-delete-bin-line"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="option-clone mt-4 mb-3"></div>
    <div class="form-group row icon-position">
        <div class="col-md-2"></div>
        <div class="col-md-10">
          <button type="button" id="add_value" class="btn btn-primary ratio-button mb-4">
            <i class="ri-add-circle-line text-white lh-1"></i> {{ __('ticket::static.formfield.add_value') }}
          </button>
        </div>
    </div> 
</div>
<div class="form-group row">
    <label class="col-md-2" for="is_required">{{ __('ticket::static.formfield.is_required') }}</label>
    <div class="col-md-10">
        <div class="editor-space">
            <label class="switch">
                <input class="form-control" type="hidden" name="is_required" value="0">
                <input class="form-check-input" type="checkbox" name="is_required" value="1">
                <span class="switch-state"></span>
            </label>
        </div>
        @error('is_required')
            <span class="invalid-feedback d-block" role="alert">
                <strong>{{ $message }}</strong>
            </span>
        @enderror
    </div>
</div>
<div class="form-group row">
    <label class="col-md-2" for="role">{{ __('ticket::static.formfield.status') }}</label>
    <div class="col-md-10">
        <div class="editor-space">
            <label class="switch">
                <input class="form-control" type="hidden" name="status" value="0">
                <input class="form-check-input" type="checkbox" name="status" value="1">
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
            <button type="button" class="btn btn-danger"
                        data-bs-dismiss="modal">{{ __('ticket::static.cancel') }}</button>
            <button type="submit" name="save" class="btn btn-solid spinner-btn">
                <i class="ri-save-line text-white lh-1"></i>{{ __('ticket::static.save') }}
            </button>
        </div>
    </div>
</div>
@push('scripts')
<script>
    (function($) {
        "use strict";
        $('#FormField').validate({
            rules:{
                type:{
                    required:true
                },
            }
        });
    })(jQuery); 
</script>
@endpush