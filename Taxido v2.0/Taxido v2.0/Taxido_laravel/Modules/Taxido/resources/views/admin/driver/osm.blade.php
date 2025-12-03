@use('Nwidart\Modules\Facades\Module')

@push('css')
  <link rel="stylesheet" type="text/css" href="{{ asset('modules/taxido/css/vendors/leaflet/leaflet.min.css') }}">
  <link rel="stylesheet" type="text/css" href="{{ asset('modules/taxido/css/vendors/leaflet/leaflet.draw.css') }}">
@endpush

@push('scripts')
  <script src="{{ asset('modules/taxido/js/leaflet.min.js') }}" defer></script>
  <script src="{{ asset('modules/taxido/js/leaflet.draw.js') }}" defer></script>

  <script>
    (function($) {
      "use strict";
      let map;
      let markers = [];
      const locations = @json($locations);
      const driverId = {{ $driver?->id ?? null }};
      const defaultImage = '{{ asset('images/user.png') }}';
      let vehicleTypesFilter = [];
      let zoneFilter = '';

      function initMap() {
        map = L.map('map_canvas').setView([21.20764938296402, 72.77381805168456], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        addMarkers(locations);

        const driver = locations.find(d => d.id === driverId);
        if (driver && driver.lat && driver.lng) {
          map.panTo([driver.lat, driver.lng]);
        }
      }

      function addMarkers(locations, filteredVehicleTypes = [], filterZone = '') {
        markers.forEach(marker => {
          map.removeLayer(marker);
        });
        markers = [];

        locations.forEach(location => {
          if (filteredVehicleTypes.length > 0 && !filteredVehicleTypes.includes(location.vehicle_type)) {
            return;
          }

          if (filterZone && location.zone_id !== filterZone) {
            return;
          }

          if (location.lat && location.lng) {
            let marker = L.marker([location.lat, location.lng], {
              icon: L.icon({
                iconUrl: location.vehicle_image || defaultImage,
                iconSize: [35, 60]
              })
            }).addTo(map);

            markers.push(marker);
          }
        });
      }

      $(document).ready(function() {
        initMap();
      });
    })(jQuery);
  </script>
@endpush
