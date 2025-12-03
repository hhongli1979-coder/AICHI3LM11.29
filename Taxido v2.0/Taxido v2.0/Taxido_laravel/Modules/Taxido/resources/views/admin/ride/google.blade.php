@push('scripts')
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places,geometry,drawing&callback=initMap" defer></script>
<script>
    var locationCoordinates = <?php echo json_encode($locationCoordinates); ?>

    function initMap() {
         var start = {
            lat: parseFloat(locationCoordinates[0].lat),
            lng: parseFloat(locationCoordinates[0].lng)
        };

        var end = {
            lat: parseFloat(locationCoordinates[locationCoordinates.length - 1].lat),
            lng: parseFloat(locationCoordinates[locationCoordinates.length - 1].lng)
        };


        // Initialize Google Maps
        var map = new google.maps.Map(document.getElementById('map-view'), {
            zoom: 12,
            center: start
        });

        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            polylineOptions: {
                strokeColor: '#199675',
                strokeWeight: 5,
                strokeOpacity: 0.8
            }
        });

        // Define waypoints by excluding the first and last points
        var waypoints = locationCoordinates.slice(1, -1).map(function(coordinate) {
            return {
                location: {
                    lat: parseFloat(coordinate.lat),
                    lng: parseFloat(coordinate.lng)
                },
                stopover: true
            };
        });

        // Request directions with waypoints
        directionsService.route({
            origin: start,
            destination: end,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
</script>

<script>
    (function($) {
        "use strict";
        $('#rideForm').validate();
    })(jQuery);
</script>

@endpush
