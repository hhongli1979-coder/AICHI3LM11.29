@push('scripts')
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places,geometry,drawing&callback=initMap" defer></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        var rideLocationCoordinates = <?php echo json_encode($rideLocationCoordinates); ?> || [];
        var sosLocationCoordinates = <?php echo json_encode($sosLocationCoordinates); ?> || {};

        function initMap() {
            var defaultCenter = { lat: 0, lng: 0 };
            var hasValidCoordinates = false;

            if (sosLocationCoordinates && sosLocationCoordinates.lat && sosLocationCoordinates.lng) {
                defaultCenter = {
                    lat: parseFloat(sosLocationCoordinates.lat),
                    lng: parseFloat(sosLocationCoordinates.lng)
                };
                hasValidCoordinates = true;
            } else if (rideLocationCoordinates && rideLocationCoordinates.length > 0) {
                defaultCenter = {
                    lat: parseFloat(rideLocationCoordinates[0]?.lat) || 0,
                    lng: parseFloat(rideLocationCoordinates[0]?.lng) || 0
                };
                hasValidCoordinates = true;
            }

            if (!hasValidCoordinates) {
                document.getElementById('map-view').innerHTML = '<p>No location data available.</p>';
                return;
            }

            var map = new google.maps.Map(document.getElementById('map-view'), {
                zoom: 15,
                center: defaultCenter
            });

            if (rideLocationCoordinates && rideLocationCoordinates.length > 0) {
                var start = {
                    lat: parseFloat(rideLocationCoordinates[0]?.lat) || 0,
                    lng: parseFloat(rideLocationCoordinates[0]?.lng) || 0
                };

                var end = {
                    lat: parseFloat(rideLocationCoordinates[rideLocationCoordinates.length - 1]?.lat) || 0,
                    lng: parseFloat(rideLocationCoordinates[rideLocationCoordinates.length - 1]?.lng) || 0
                };

                var directionsService = new google.maps.DirectionsService();
                var directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                    polylineOptions: {
                        strokeColor: '#199675',
                        strokeWeight: 5,
                        strokeOpacity: 0.8
                    }
                });

                var waypoints = rideLocationCoordinates.slice(1, -1).map(function(coordinate) {
                    return {
                        location: {
                            lat: parseFloat(coordinate.lat) || 0,
                            lng: parseFloat(coordinate.lng) || 0
                        },
                        stopover: true
                    };
                });

                directionsService.route({
                    origin: start,
                    destination: end,
                    waypoints: waypoints,
                    travelMode: google.maps.TravelMode.DRIVING
                }, function(response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(response);
                    } else {
                        console.error('Directions request failed due to ' + status);
                        document.getElementById('map-view').innerHTML = '<p>Failed to load ride path.</p>';
                    }
                });
            }

            if (sosLocationCoordinates && sosLocationCoordinates.lat && sosLocationCoordinates.lng) {
                var sosPosition = {
                    lat: parseFloat(sosLocationCoordinates.lat),
                    lng: parseFloat(sosLocationCoordinates.lng)
                };

                new google.maps.Marker({
                    position: sosPosition,
                    map: map,
                    title: 'SOS Alert Location',
                    label: {
                        text: 'SOS',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px'
                    }
                });
            }
        }

        google?.maps?.event?.addDomListener(window, 'load', initMap);
    });
</script>
@endpush