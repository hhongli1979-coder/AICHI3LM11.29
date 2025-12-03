@isset($fleetWithdrawRequest)
<div class="modal-icon-box">
    <a href="javascript:void(0)" data-bs-toggle="modal" class="dark-icon-box" data-bs-target="#fleetWithdrawRequestModal{{ $fleetWithdrawRequest->id }}">
        <i class="ri-eye-line"></i>
    </a>
    <div class="modal fade" id="fleetWithdrawRequestModal{{ $fleetWithdrawRequest->id }}" tabindex="-1" aria-labelledby="fleetWithdrawRequestModalLabel{{ $fleetWithdrawRequest->id }}" aria-hidden="true">   
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ __('taxido::static.fleet_withdraw_requests.withdraw_request') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="withdraw-detail">
                        <div class="form-group row">
                            <label class="col-md-2" for="message">{{ __('taxido::static.fleet_withdraw_requests.message') }}</label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" name="message" value="{{ $fleetWithdrawRequest->message ?? old('message') }}" disabled>
                                @error('message')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="amount">{{ __('taxido::static.fleet_withdraw_requests.amount') }}</label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" name="amount" value="{{ $fleetWithdrawRequest->amount ?? old('amount') }}" disabled>
                                @error('amount')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="payment_type">{{ __('taxido::static.fleet_withdraw_requests.payment_type') }}</label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" name="payment_type" value="{{ $fleetWithdrawRequest->payment_type ?? old('payment_type') }}" disabled>
                                @error('payment_type')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>
                        <div class="form-group row">
                            <label class="col-md-2" for="status">{{ __('taxido::static.fleet_withdraw_requests.status') }}</label>
                            <div class="col-md-10">
                                <input class="form-control" type="text" name="status" value="{{ $fleetWithdrawRequest->status ?? old('status') }}" disabled>
                                @error('status')
                                    <span class="invalid-feedback d-block" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror
                            </div>
                        </div>

                        @if (Auth::user()->hasRole('admin') && strtolower($fleetWithdrawRequest->status) === strtolower(\Modules\Taxido\Enums\RequestEnum::PENDING))
                            <form action="{{ route('admin.fleet-withdraw-request.update', $fleetWithdrawRequest->id) }}" method="POST">
                                @csrf
                                @method('PUT')
                                <div class="form-group row">
                                    <div class="col-12">
                                        <div class="submit-btn">
                                            <button type="submit" name="status" value="approved" class="btn btn-solid">
                                                {{ __('Approve') }}
                                            </button>
                                            <button type="submit" name="status" value="rejected" class="btn btn-danger">
                                                {{ __('Reject') }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endisset