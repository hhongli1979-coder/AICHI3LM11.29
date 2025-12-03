@use('App\Enums\RoleEnum')
<div class="contentbox h-100">
    <div class="inside">
        <div class="contentbox-title">
            <h3>{{ __('taxido::static.wallets.wallet_balance') }}</h3>
        </div>
        <div class="wallet-detail">
            <div class="wallet-detail-content">
                <div class="wallet-amount">
                    <div class="wallet-icon">
                        <i class="ri-wallet-line"></i>
                    </div>
                    <div>
                        <div class="form-group">
                            <h4 id="balanceLabel">
                                {{ isset($driver->address->country->currency_symbol) ? $driver->address->country->currency_symbol : '$' }}{{ number_format((float) ($balance ?? 0), 2, '.', ',') }}
                            </h4>
                        </div>
                    </div>
                </div>
                @if (Auth::user()->hasRole(RoleEnum::ADMIN) || Auth::user()?->can('driver_wallet.credit') || Auth::user()?->can('driver_wallet.debit'))
                    <form action="{{ route('admin.driver-wallet.update.balance') }}" method="POST" id="driver-wallet"
                        class="wallet-form">
                        @csrf
                        <input class="form-control" type="hidden" name="driver_id"
                            value="{{ request()->query('driver_id') }}" placeholder="+ ">
                        <div class="form-group row">
                            <label class="col-md-2 d-none"
                                for="price">{{ __('taxido::static.wallets.amount') }}</label>
                            <input class="form-control" name="type" type="hidden" value="" placeholder="type">
                            <div class="col-md-10">
                                <input class='form-control' id="balanceInput" type="number" name="balance"
                                    class="balance" min="1" value=""
                                    placeholder="{{ __('taxido::static.wallets.credit_debit') }}">
                            </div>
                        </div>
                        <div class="position-relative w-100">
                        <textarea class="form-control" id="noteInput" name="note" rows="1"
                            placeholder="{{ __('taxido::static.wallets.enter_note') }}"></textarea>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            @can('driver_wallet.credit')
                            <button type="button" class="credit btn btn-primary" name="type" value="credit"
                                id="creditBtn" data-bs-toggle="modal" disabled>
                                {{ __('taxido::static.wallets.credit') }}
                                <i class="ri-inbox-archive-line"></i>
                            </button>
                            @endcan
                            @can('driver_wallet.debit')
                            <button type="button" class="debit btn btn-secondary" value="debit" name="type"
                                id="debitBtn" data-bs-toggle="modal" disabled>
                                {{ __('taxido::static.wallets.debit') }}
                                <i class="ri-inbox-unarchive-line"></i>
                            </button>
                            @endcan
                        </div>

                        <!-- confirmation modal -->
                        <div class="modal fade confirmation-modal" id="confirmation" tabindex="-1" role="dialog"
                            aria-labelledby="confirmationLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                    <div class="modal-body text-start confirmation-data">
                                        <div class="main-img">
                                            <div class="delete-icon">
                                                <i class="ri-question-mark"></i>
                                            </div>
                                        </div>
                                        <h4 class="modal-title">{{ __('taxido::static.wallets.confirmation') }}</h4>
                                        <p>
                                            {{ __('taxido::static.wallets.modal') }}
                                        </p>
                                        <div class="d-flex">
                                            <input type="hidden" id="inputType" name="type" value="">
                                            <button type="button" class="btn cancel btn-light me-2" data-bs-dismiss="modal">{{ __('taxido::static.wallets.no') }}</button>
                                            <button type="submit" class="btn btn-primary delete delete-btn spinner-btn">{{ __('taxido::static.wallets.yes') }}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                @endif
            </div>
        </div>
    </div>
</div>

@push('scripts')
    <script>
        (function($) {
            "use strict";
            const validator = $("#driver-wallet").validate({
                rules: {
                    'note': "required"
                }
            });

            $('#creditBtn, #debitBtn').on('click', function(e) {
                e.preventDefault();

                const type = $(this).val();
                $('#inputType').val(type);

                if ($("#driver-wallet").valid()) {
                    $('#confirmation').modal('show');
                }
            });

            const balanceInput = () => {
                let creditBtn = $("#creditBtn");
                let debitBtn = $("#debitBtn");
                let inputValue = parseFloat($("#balanceInput").val());
                let balanceLabelText = $("#balanceLabel").text().replace(/[,]/g, '').replace(/[^\d.]/g, '');
                let balanceValue = parseFloat(balanceLabelText);
                let isConsumerSelected = $("#select-driver").val();

                let disableButtons = (
                    inputValue <= 0 ||
                    Number.isNaN(inputValue) ||
                    Number.isNaN(balanceValue) ||
                    !isConsumerSelected
                );

                creditBtn.prop('disabled', disableButtons || inputValue <= 0);
                debitBtn.prop('disabled', disableButtons || inputValue > balanceValue || balanceValue <= 0);
            };

            $("#balanceInput").on("input", balanceInput);
            $("#select-driver").on("change", balanceInput);

            $('#addNoteCheck').change(function() {
                $('#noteInput').toggleClass('d-none', !this.checked);
            });
        })(jQuery);
    </script>
@endpush
