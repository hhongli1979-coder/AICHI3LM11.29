<div class="contentbox h-100">
    <div class="inside h-100 d-flex align-items-center">
        <div class="wallet-detail">
            <div class="wallet-detail-content">
                <div class="wallet-amount withdraw-box">
                    <div class="wallet-icon">
                        @can('fleet_withdraw_request.create')
                        <button type="button" id="fleet-withdraw-request" class="btn">
                            <i class="ri-add-line"></i>
                            <span>{{ __('taxido::static.fleet_withdraw_requests.send_withdrawRequest') }}</span>
                        </button>
                        @endcan
                    </div>
                    <div>
                        <div class="form-group row">
                            <div class="col-md-10">
                                <h5 class="lh-1"></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade confirmation-modal" id="confirmation">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header text-center">
                <h5 class="modal-title">{{ __('taxido::static.fleet_withdraw_requests.withdraw_request') }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-start">
                <form action="{{ route('admin.fleet-withdraw-request.store') }}" method="POST">
                    @csrf
                    @method('POST')
                    <div class="form-group row">
                        <label class="col-md-2" for="amount">{{ __('taxido::static.fleet_withdraw_requests.amount') }}<span>*</span></label>
                        <div class="col-md-10">
                            <input class="form-control" type="number" name="amount" placeholder="Enter Request Amount" value="{{ old('amount') }}" required>
                            @error('amount')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="payment_type">{{ __('taxido::static.fleet_withdraw_requests.payment_type') }}<span>*</span></label>
                        <div class="col-md-10">
                            <select class="form-select select-2" name="payment_type" data-placeholder="{{ __('Select Payment Type') }}">
                                <option class="option" value="" selected></option>
                                <option class="option" value="bank">{{ __('taxido::static.fleet_withdraw_requests.bank') }}</option>
                                <option class="option" value="paypal">{{ __('taxido::static.fleet_withdraw_requests.paypal') }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-md-2" for="message">{{ __('taxido::static.fleet_withdraw_requests.message') }}</label>
                        <div class="col-md-10">
                            <textarea class="form-control" rows="3" name="message" placeholder="{{ __('taxido::static.fleet_withdraw_requests.enter_message') }}" cols="80"></textarea>
                            @error('message')
                                <span class="invalid-feedback d-block" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                            @enderror
                        </div>
                    </div>
                    <div class="modal-footer px-0 pb-0">
                        <div class="submit-btn">
                            <button type="submit" name="save" class="btn btn-solid spinner-btn">
                                {{ __('taxido::static.submit') }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        $(document).ready(function() {
            $('#fleet-withdraw-request').on('click', function() {
                var myModal = new bootstrap.Modal(document.getElementById("confirmation"), {});
                myModal.show();
            });
        });
    </script>
@endpush