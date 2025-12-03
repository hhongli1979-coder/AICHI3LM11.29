@push('css')
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
<style>
    .custom-marker {
        position: relative;
        width: 30px;
        height: 30px;
        background: #199675;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        color: white;
        font-weight: bold;
        font-size: 16px;
    }
</style>
@endpush

@push('scripts')
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
@endpush

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const locations = @json($locationCoordinates); 

        const map = L.map('map-view').setView([locations[0].lat, locations[0].lng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const waypoints = locations.map(location => L.latLng(location.lat, location.lng));

        function reverseGeocode(lat, lng, callback) {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
            fetch(url)
                .then(response => response.json())
                .then(data => callback(data.display_name))
                .catch(error => console.error('Geocoding error:', error));
        }

        waypoints.forEach((loc, index) => {
            reverseGeocode(loc.lat, loc.lng, (address) => {
                const label = String.fromCharCode(65 + index);
                const customMarker = L.divIcon({
                    className: 'custom-marker',
                    html: label, 
                    iconSize: [30, 30],
                    iconAnchor: [15, 15],
                });

                const marker = L.marker(loc, { icon: customMarker })
                    .addTo(map)
                    .bindPopup(`${label} - ${address}`);

                map.on('zoomend', function() {
                    const zoomLevel = map.getZoom();
                    const offset = zoomLevel > 15 ? 0.0001 : 0; 
                    marker.setLatLng([loc.lat + offset, loc.lng]);
                });
            });
        });

        L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            createMarker: function() { return null; }, 
            lineOptions: {
                styles: [{ color: '#199675', weight: 5, opacity: 0.7 }]
            },
        }).addTo(map);
    });
</script>
@endpush
