<!-- confirmation modal modal -->
<div class="modal fade confirmation-modal" id="confirmation" tabindex="-1" role="dialog"
    aria-labelledby="confirmationLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-start">
                <div class="main-img">
                    <i class="ri-delete-bin-line "></i>
                </div>
                <div class="text-center">
                    <div class="modal-title">{{__('static.delete_message')}}</div>
                    <p class="mb-0">{{__('static.delete_note')}}</p>
                </div>
            </div>
            <div class="modal-footer">
                <form method="POST" action="{{ route('admin.category.destroy', 1) }}" id="deleteForm">
                    @csrf
                    @method('DELETE')
                    <button type="button" class="btn btn-primary m-0"
                        data-bs-dismiss="modal">{{ __('static.cancel') }}</button>
                    <button type="submit" class="btn btn-secondary delete-btn m-0">{{ __('static.delete') }}</button>
                </form>
            </div>
        </div>
    </div>
</div>
