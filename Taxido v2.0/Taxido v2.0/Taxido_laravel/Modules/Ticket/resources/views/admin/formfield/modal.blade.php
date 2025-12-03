<div class="modal fade confirmation-modal" id="confirmation" tabindex="-1" role="dialog"
    aria-labelledby="confirmationLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">{{ __('ticket::static.formfield.form_field') }}</h5> <button type="button"
                    class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body edit-field text-start">
                <div class="loader-formfield">
                    <div class="spinner-border" role="status">
                        {{-- <span class="sr-only">Loading...</span> --}}
                    </div>
                </div>
                <form action="{{ route('admin.formfield.store') }}" method="POST" id="FormField">
                    @method('POST')
                    @csrf
                    @include('ticket::admin.formfield.fields')
                </form>
            </div>
        </div>
    </div>
</div>
