@push('css')
  <link rel="stylesheet" type="text/css" href="{{ asset('modules/taxido/css/vendors/leaflet/leaflet.min.css') }}">
@endpush

@push('scripts')
  <script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places,geometry,drawing&callback=initMap" defer></script>    

  <script>
    (function ($) {
      "use strict";
      let map;
      let markers = [];
      const locations = @json($locations);
      const driverId = {{ $driver?->id ?? null }};
      const defaultImage = '{{ asset('images/user.png') }}';
      let vehicleTypesFilter = [];
      let zoneFilter = '';

      function initialize() {
        const mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          overviewMapControl: true
        };

        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        addMarkers(locations);
      }

      function getVehicleIcon(vehicleImage) {
        return {
          url: vehicleImage || defaultImage,
          scaledSize: new google.maps.Size(35, 60)
        };
      }

      function addMarkers(locations, filteredVehicleTypes = [], filterZone = '') {
        markers.forEach(marker => marker.setMap(null));
        markers = [];

        locations.forEach(location => {
          if (filteredVehicleTypes.length > 0 && !filteredVehicleTypes.includes(location.vehicle_type)) {
            return;
          }

          if (filterZone && location.zone_id !== filterZone) {
            return;
          }

          if (location.lat && location.lng) {
            let marker = new google.maps.Marker({
              position: new google.maps.LatLng(location.lat, location.lng),
              map: map,
              icon: getVehicleIcon(location.vehicle_image),
              vehicleType: location.vehicle_type,
              zoneId: location.zone_id
            });

            markers.push(marker);
          }
        });
      }

      $(document).ready(function () {
        initialize();

        addMarkers(locations);

        const driver = locations.find(d => d.id === driverId);
        if (driver && driver.lat && driver.lng) {
          const position = new google.maps.LatLng(driver.lat, driver.lng);
          map.panTo(position);
        }
      });
    })(jQuery);
  </script>
@endpush
