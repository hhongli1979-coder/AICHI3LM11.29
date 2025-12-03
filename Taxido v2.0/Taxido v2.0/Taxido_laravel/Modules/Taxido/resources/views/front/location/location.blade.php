@extends('taxido::front.account.master')
@section('title', __('taxido::front.location'))
@section('detailBox')
<div class="dashboard-details-box">
    <div class="dashboard-title">
        <h3>{{ __('taxido::front.save_address') }}</h3>
        <a href="{{ route('front.cab.location.create') }}" class="btn p-0">{{ __('taxido::front.add_address') }}</a>
    </div>

    <ul class="address-list">
        @forelse($locations as $location)
            <li class="address-box">
                <div class="address-top">
                    <span class="badge badge-primary">{{ $location->type }}</span>
                    <div class="edit-delete">
                        <a href="{{ route('front.cab.location.edit', $location->id) }}" class="btn edit">
                            <i class="ri-edit-line"></i>
                        </a>
                        <button type="button" class="btn delete" data-bs-toggle="modal" data-bs-target="#confirmationModal{{ $location->id }}">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </div>
                <div class="address-bottom">
                    <p>{{ __('taxido::front.address') }}: <span>{{ $location->location }}</span></p>
                </div>

                <!-- Delete Confirmation Modal -->
                <div class="modal theme-modal fade confirmation-modal" id="confirmationModal{{ $location->id }}" tabindex="-1" role="dialog" aria-labelledby="confirmationLabel{{ $location->id }}" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-body text-start confirmation-data">
                                <div class="main-img">
                                    <div class="delete-icon">
                                        <i class="ri-question-mark"></i>
                                    </div>
                                </div>
                                <h4 class="modal-title">{{ __('taxido::static.chats.confirmation') }}</h4>
                                <p>{{ __('taxido::front.modal') }}</p>
                            </div>

                            <div class="modal-footer">
                                <form action="{{ route('front.cab.location.destroy', $location->id) }}" method="POST">
                                    @csrf
                                    @method('DELETE')
                                    <button type="button" class="btn cancel-btn" data-bs-dismiss="modal">{{ __('taxido::front.no') }}</button>
                                    <button type="submit" class="btn gradient-bg-color spinner-btn">{{ __('taxido::front.yes') }}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        @empty
        <tr>
            <td colspan="8">
                <div class="dashboard-no-data">
                    <svg>
                        <use xlink:href="{{ asset('images/dashboard/front/location.svg#location') }}"></use>
                    </svg>
                    <h6>{{ __('taxido::front.no_locations') }}</h6>
                </div>
            </td>
        </tr>
        @endforelse
    </ul>
</div>
@endsection
