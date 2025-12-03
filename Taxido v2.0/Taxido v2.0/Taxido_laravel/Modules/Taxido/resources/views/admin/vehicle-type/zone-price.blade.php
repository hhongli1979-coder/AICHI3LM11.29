<!-- Price Modal -->
<div class="modal fade" id="priceModal" tabindex="-1" aria-labelledby="priceModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="priceModalLabel">Set Prices for <span id="zoneName"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form id="priceForm">
                @csrf
                <div class="modal-body">
                    <input type="hidden" name="zone_id" id="zoneId">
                    <input type="hidden" name="vehicle_type_id" id="vehicleTypeId">
                    <input type="hidden" name="id" id="priceId">



                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="base_fare_charge" class="form-label">Base Fare Charge</label>
                            <div class="input-group">
                                <span class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <input type="number" class="form-control" id="base_fare_charge"
                                    name="base_fare_charge" step="0.01" required
                                    placeholder="Enter base fare charge">
                                <span class="invalid-feedback d-none" id="base_fare_charge_error"></span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="base_distance" class="form-label">Base Distance (<span
                                    id="distanceUnit">Km</span>)</label>
                            <input type="number" class="form-control" id="base_distance" name="base_distance"
                                step="0.01" required placeholder="Enter base distance">
                            <span class="invalid-feedback d-none" id="base_distance_error"></span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="per_distance_charge" class="form-label">Per Distance Charge (<span
                                    id="distanceUnitPrice">Km</span>)</label>
                            <div class="input-group">
                                <span class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <input type="number" class="form-control" id="per_distance_charge"
                                    name="per_distance_charge" step="0.01" required
                                    placeholder="Enter per distance charge">
                                <span class="invalid-feedback d-none" id="per_distance_charge_error"></span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="per_minute_charge" class="form-label">Per Minute Charge</label>
                            <div class="input-group">
                                <span class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <input type="number" class="form-control" id="per_minute_charge"
                                    name="per_minute_charge" step="0.01" required
                                    placeholder="Enter per minute charge">
                                <span class="invalid-feedback d-none" id="per_minute_charge_error"></span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="per_weight_charge" class="form-label">Per Weight Charge</label>
                            <div class="input-group">
                                <span class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <input type="number" class="form-control" id="per_weight_charge"
                                    name="per_weight_charge" step="0.01" placeholder="Enter per weight charge">
                                <span class="invalid-feedback d-none" id="per_weight_charge_error"></span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="waiting_charge" class="form-label">Waiting Charge</label>
                            <div class="input-group">
                                <span class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <input type="number" class="form-control" id="waiting_charge" name="waiting_charge"
                                    step="0.01" placeholder="Enter waiting charge">
                                <span class="invalid-feedback d-none" id="waiting_charge_error"></span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="free_waiting_time_before_start_ride" class="form-label">Free Waiting Time
                                Before Start Ride (Minutes)</label>
                            <input type="number" class="form-control" id="free_waiting_time_before_start_ride"
                                name="free_waiting_time_before_start_ride" step="1"
                                placeholder="Enter free waiting time before start">
                            <span class="invalid-feedback d-none"
                                id="free_waiting_time_before_start_ride_error"></span>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="free_waiting_time_after_start_ride" class="form-label">Free Waiting Time
                                After Start Ride (Minutes)</label>
                            <input type="number" class="form-control" id="free_waiting_time_after_start_ride"
                                name="free_waiting_time_after_start_ride" step="1"
                                placeholder="Enter free waiting time after start">
                            <span class="invalid-feedback d-none"
                                id="free_waiting_time_after_start_ride_error"></span>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="cancellation_charge_for_rider" class="form-label">Cancellation Charge for
                                Rider</label>
                            <div class="input-group">
                                <span class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <input type="number" class="form-control" id="cancellation_charge_for_rider"
                                    name="cancellation_charge_for_rider" step="0.01"
                                    placeholder="Enter rider cancellation charge">
                                <span class="invalid-feedback d-none"
                                    id="cancellation_charge_for_rider_error"></span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="cancellation_charge_for_driver" class="form-label">Cancellation Charge for
                                Driver</label>
                            <div class="input-group">
                                <span class="input-group-text currency-symbol">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <input type="number" class="form-control" id="cancellation_charge_for_driver"
                                    name="cancellation_charge_for_driver" step="0.01"
                                    placeholder="Enter driver cancellation charge">
                                <span class="invalid-feedback d-none"
                                    id="cancellation_charge_for_driver_error"></span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="commission_type" class="form-label">Commission Type</label>
                            <select class="form-select" id="commission_type" name="commission_type" required>
                                <option value="fixed">Fixed</option>
                                <option value="percentage">Percentage</option>
                            </select>
                            <span class="invalid-feedback d-none" id="commission_type_error"></span>
                        </div>
                        <div class="col-md-6 mb-3" id="commission_rate_field">
                            <label for="commission_rate" class="form-label">Commission Rate</label>
                            <div class="input-group">
                                <span class="input-group-text"
                                    id="currencyIcon">{{ getDefaultCurrency()?->symbol ?? 'N/A' }}</span>
                                <span class="input-group-text d-none" id="percentageIcon">%</span>
                                <input type="number" class="form-control" id="commission_rate"
                                    name="commission_rate" step="0.01" required
                                    placeholder="Enter commission rate">
                                <span class="invalid-feedback d-none" id="commission_rate_error"></span>
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="is_allow_airport_charge" class="form-label">Allow Airport Charge</label>
                        <select class="form-select" id="is_allow_airport_charge" name="is_allow_airport_charge">
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                        <span class="invalid-feedback d-none" id="is_allow_airport_charge_error"></span>
                    </div>

                    <div class="mb-3">
                        <label for="charge_goes_to" class="form-label">Charge Goes To</label>
                        <select class="form-select" id="charge_goes_to" name="charge_goes_to" required>
                            <option value="rider">Rider</option>
                            <option value="driver">Driver</option>
                            <option value="operation">Company</option>
                        </select>
                        <span class="invalid-feedback d-error" id="charge_goes_to_error"></span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="savePriceBtn">Save Prices</button>
                </div>
            </form>
        </div>
    </div>
</div>

 @push('scripts')
     <script>
         $(document).ready(function() {

             const $priceModal = $('#priceModal');
             var $priceForm = $('#priceForm');
             const $successMessage = $('#success-message');
             const $errorMessage = $('#error-message');
             const $saveButton = $('#savePriceBtn');
             const $closeButton = $priceModal.find('.btn-close');

             console.log('Price form found:', $priceForm);
             console.log('Save button found:', $saveButton);

             // Handle Set Price button click
             $('.set-price-btn').on('click', function() {
                 const $button = $(this);
                 const $spinner = $button.find('.spinner-border');
                 const zoneId = $button.data('zone-id');
                 const zoneName = $button.data('zone-name');
                 const distanceType = $button.data('distance-type');
                 const vehicleTypeId = $button.data('vehicle-type-id');
                 const currencySymbol = $button.data('currency-symbol');

                 if (!vehicleTypeId) {
                    showMessage($errorMessage, 'Please save the vehicle type first to set zone prices.');
                    return;
                 }

                 // Show spinner
                 $spinner.removeClass('d-none');
                 $button.prop('disabled', true);
                 let url = "{{ url('/admin/vehicle-type-zones') }}"
                 $.ajax({
                     url: url + `/${vehicleTypeId}/${zoneId}`,
                     method: 'GET',
                     headers: {
                         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                         'Accept': 'application/json'
                     },
                     success: function(data) {
                         // Hide spinner
                         $spinner.addClass('d-none');
                         $button.prop('disabled', false);

                         // Set modal title and hidden inputs
                         $('#zoneName').text(zoneName);
                         $('#zoneId').val(zoneId);
                         $('#vehicleTypeId').val(vehicleTypeId);
                         $('#distanceUnit').text(distanceType === 'mile' ? 'Mile' : 'Km');
                         $('#distanceUnitPrice').text(distanceType === 'mile' ? 'Mile' : 'Km');
                         $('.currency-symbol').text(currencySymbol);

                         // Reset form
                         $priceForm = $('#priceForm');
                         if ($priceForm[0]) {
                            $priceForm[0].reset();
                         }

                         $('.invalid-feedback').addClass('d-none');
                         // Populate form if data exists
                         if (data?.vehicleTypeZone) {
                             $('#priceId').val(data.vehicleTypeZone.id);
                             $('#base_fare_charge').val(data.vehicleTypeZone.base_fare_charge);
                             $('#base_distance').val(data.vehicleTypeZone.base_distance);
                             $('#per_distance_charge').val(data.vehicleTypeZone.per_distance_charge);
                             $('#per_minute_charge').val(data.vehicleTypeZone.per_minute_charge);
                             $('#per_weight_charge').val(data.vehicleTypeZone.per_weight_charge || '');
                             $('#waiting_charge').val(data.vehicleTypeZone.waiting_charge || '');
                             $('#free_waiting_time_before_start_ride').val(data.vehicleTypeZone.free_waiting_time_before_start_ride || '');
                             $('#free_waiting_time_after_start_ride').val(data.vehicleTypeZone.free_waiting_time_after_start_ride || '');
                             $('#is_allow_airport_charge').val(data.vehicleTypeZone.is_allow_airport_charge);
                             $('#cancellation_charge_for_rider').val(data.vehicleTypeZone.cancellation_charge_for_rider || '');
                             $('#cancellation_charge_for_driver').val(data.vehicleTypeZone.cancellation_charge_for_driver || '');
                             $('#charge_goes_to').val(data.vehicleTypeZone.charge_goes_to);
                             $('#commission_type').val(data.vehicleTypeZone.commission_type);
                             $('#commission_rate').val(data.vehicleTypeZone.commission_rate);
                             window?.selectCommissionTypeField(data.vehicleTypeZone.commission_type);
                         } else {
                            $('#priceId').val('');
                            $('#commission_rate_field').hide();
                         }

                        // Show modal only after data is set
                        $priceModal.modal('show');
                     },
                     error: function() {
                        $spinner.addClass('d-none');
                        $button.prop('disabled', false);
                        showMessage($errorMessage, 'Error fetching price data.');
                     }
                 });
             });

             // Handle form submission
             $saveButton.on('click', function() {
                const $form = $('#priceForm');
                 // Clear previous errors
                 $('.invalid-feedback').addClass('d-none');
                 let isValid = true;
                 $form.find('[required]').each(function() {
                     if (!$(this).val()) {
                         const fieldId = $(this).attr('id');
                         $(`#${fieldId}_error`).text('This field is required.').removeClass('d-none');
                         isValid = false;
                     }
                 });

                 if (!isValid) {
                     console.log('Client-side validation failed');
                     return;
                 }

                 // Show spinner and disable buttons
                 $saveButton.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...');
                 $saveButton.prop('disabled', true);
                 $closeButton.prop('disabled', true);

                // Manual data collection fallback
                const manualData = {};
                $form.find(':input[name]').each(function() {
                    manualData[$(this).attr('name')] = $(this).val();
                });
                console.log('Manual form data:', manualData);
                 const priceId = $('#priceId').val();
                 const url = priceId ? "{{ url('/admin/vehicle-type-zones') }}/" + priceId : "{{ url('/admin/vehicle-type-zones') }}";
                 const method = priceId ? 'PUT' : 'POST';

                 // Make two requests: one for price update and one for preferences
                 $.ajax({
                     url: url,
                     method: method,
                     headers: {
                         'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                         'Accept': 'application/json'
                     },
                     data: manualData,
                     dataType: 'json',
                     success: function(data) {
                         // After successful price update, update preferences
                         if (data.success && priceId) {
                             const preferencesData = {
                                 allow_preference: $('#allow_preference').prop('checked'),
                                 preferences: []
                             };

                             if (preferencesData.allow_preference) {
                                 $form.find('.preference-item').each(function() {
                                     preferencesData.preferences.push({
                                         preference_id: $(this).find('[name$="[preference_id]"]').val(),
                                         price: $(this).find('[name$="[price]"]').val()
                                     });
                                 });
                             }

                             $.ajax({
                                 url: `{{ url('/admin/vehicle-type-zone') }}/${priceId}/preferences`,
                                 method: 'PUT',
                                 headers: {
                                     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                                     'Accept': 'application/json'
                                 },
                                 data: preferencesData,
                                 dataType: 'json',
                                 success: function(prefData) {
                                     showMessage($successMessage, 'Price and preferences saved successfully!');
                                     $priceModal.modal('hide');
                                 },
                                 error: function(xhr) {
                                     if (xhr.status === 422) {
                                         showErrors(xhr.responseJSON.errors);
                                     } else {
                                         showMessage($errorMessage, 'Error saving preferences data.');
                                     }
                                 }
                             });
                         } else {
                         $saveButton.html('Save Prices');
                         $saveButton.prop('disabled', false);
                         $closeButton.prop('disabled', false);
                         if (data.success) {
                             showMessage($successMessage, 'Price saved successfully!');
                             $priceModal.modal('hide');
                         } else {
                             showErrors(data.errors);
                         }
                     },
                     error: function(xhr) {
                         $saveButton.html('Save Prices');
                         $saveButton.prop('disabled', false);
                         $closeButton.prop('disabled', false);
                         console.error('Form submission error:', xhr.responseText);
                         if (xhr.status === 422) {
                             showErrors(xhr.responseJSON.errors);
                         } else {
                             showMessage($errorMessage, 'Error saving price data.');
                         }
                     }
                 });
             });

             function showMessage($element, message) {
                 $element.text(message).removeClass('d-none');
                 setTimeout(function() {
                     $element.addClass('d-none');
                 }, 5000);
             }

             function showErrors(errors) {
                 $.each(errors, function(field, messages) {
                     const $errorElement = $(`#${field}_error`);
                     if ($errorElement.length) {
                        $errorElement.text(messages[0]).removeClass('d-none');
                     }
                 });
             }


         });
     </script>
 @endpush
