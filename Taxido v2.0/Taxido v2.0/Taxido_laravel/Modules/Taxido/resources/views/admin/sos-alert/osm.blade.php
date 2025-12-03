@push('scripts')
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        var rideLocationCoordinates = <?php echo json_encode($rideLocationCoordinates); ?> || [];
        var sosLocationCoordinates = <?php echo json_encode($sosLocationCoordinates); ?> || {};

        function initMap() {
            if (!rideLocationCoordinates || rideLocationCoordinates.length === 0) {
                document.getElementById('map-view').innerHTML = '<p>No ride location data available.</p>';
                return;
            }

            // Extract start and end coordinates
            var start = [
                parseFloat(rideLocationCoordinates[0]?.lat) || 0,
                parseFloat(rideLocationCoordinates[0]?.lng) || 0
            ];

            var end = [
                parseFloat(rideLocationCoordinates[rideLocationCoordinates.length - 1]?.lat) || 0,
                parseFloat(rideLocationCoordinates[rideLocationCoordinates.length - 1]?.lng) || 0
            ];

            // Initialize Leaflet map
            var map = L.map('map-view').setView(start, 15);

            // Add OSM tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Prepare waypoints for routing
            var waypoints = rideLocationCoordinates.map(function(coordinate) {
                return L.latLng(
                    parseFloat(coordinate.lat) || 0,
                    parseFloat(coordinate.lng) || 0
                );
            });

            // Use Leaflet Routing Machine with OSRM
            L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: false,
                show: false, // Hide the default itinerary
                lineOptions: {
                    styles: [{ color: '#199675', weight: 5, opacity: 0.8 }]
                },
                createMarker: function(i, waypoint, n) {
                    // Only add markers for start and end points
                    if (i === 0 || i === n - 1) {
                        return L.marker(waypoint.latLng, {
                            title: i === 0 ? 'Start' : 'End'
                        });
                    }
                    return null; // No markers for intermediate waypoints
                }
            }).on('routingerror', function(e) {
                console.error('Routing request failed: ' + e.error.message);
                document.getElementById('map-view').innerHTML = '<p>Failed to load ride path.</p>';
            }).addTo(map);

            // Add SOS marker if coordinates are provided
            if (sosLocationCoordinates && sosLocationCoordinates.lat && sosLocationCoordinates.lng) {
                var sosPosition = [
                    parseFloat(sosLocationCoordinates.lat),
                    parseFloat(sosLocationCoordinates.lng)
                ];

                L.marker(sosPosition, {
                    title: 'SOS Alert Location'
                }).addTo(map).bindPopup('SOS').openPopup();
            }
        }

        // Initialize map on window load
        window.onload = initMap;
    });
</script>
@endpush