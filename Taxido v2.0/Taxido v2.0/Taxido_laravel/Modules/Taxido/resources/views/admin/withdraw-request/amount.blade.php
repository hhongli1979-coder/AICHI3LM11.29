<div class="contentbox">
    <div class="inside">
        <div class="wallet-detail">
            <div class="wallet-detail-content">
                <div class="wallet-amount">
                    <div class="wallet-icon">
                        <i class="ri-wallet-line"></i>
                    </div>
                    <div>
                        <div class="form-group row">
                            @if (isset($label))
                                <label class="col-md-2" for="name">{{ __('taxido::static.withdraw_requests.balance') }}<span>*</span></label>
                            @endif
                            <div class="col-md-10">
                                <h4>{{ getDefaultCurrency()?->symbol }}<input class="form-control" type="text" name="name" min="1" id="balanceLabel" readonly value="{{ isset($balance) ? number_format($balance, 2) : '0.00' }}"></h4>
                                <h5 class="lh-1">{{__('taxido::static.withdraw_requests.pending_balance')}}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
