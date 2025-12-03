@push('scripts')
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>
    let map, polygons = [];
    const zoneData = {!! json_encode($formattedZones) !!};

    document.addEventListener('DOMContentLoaded', function() {
        initMap();
    });

    function initMap() {
        // Initialize the map
        map = L.map('map').setView([37.0902, -95.7129], 12);

        // Add OSM tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Draw all peak zones
        drawPeakZones();

        // Initialize zone filter
        document.getElementById('zone-filter').addEventListener('change', function() {
            filterZones(this.value);
        });

        // Auto-center map to fit all zones
        if (zoneData.length > 0) {
            const bounds = L.latLngBounds([]);
            zoneData.forEach(zone => {
                if (zone.coordinates) {
                    zone.coordinates.forEach(coord => {
                        bounds.extend([coord.lat, coord.lng]);
                    });
                }
            });
            map.fitBounds(bounds);
        }
    }

    function drawPeakZones() {
        // Clear existing polygons
        polygons.forEach(polygon => map.removeLayer(polygon));
        polygons = [];

        zoneData.forEach(zone => {
            if (!zone.coordinates || !Array.isArray(zone.coordinates)) return;

            const path = zone.coordinates.map(coord => [
                parseFloat(coord.lat),
                parseFloat(coord.lng)
            ]);

            const polygon = L.polygon(path, {
                color: zone.color || '#FF0000',
                weight: 2,
                opacity: 0.8,
                fillColor: zone.color || '#FF0000',
                fillOpacity: zone.active ? 0.35 : 0.15
            }).addTo(map);

            // Add popup with zone name
            polygon.bindPopup(`
                <div style="padding: 10px;">
                    <strong>${zone.name}</strong><br>
                    Status: ${zone.active ? 'Active' : 'Inactive'}
                </div>
            `);

            polygon.zoneId = zone.id;
            polygon.active = zone.active;
            polygons.push(polygon);
        });
    }

    function filterZones(filterValue) {
        polygons.forEach(polygon => {
            const shouldShow = filterValue === 'all' ||
                (filterValue === 'active' && polygon.active) ||
                (filterValue === 'inactive' && !polygon.active);
            if (shouldShow) {
                if (!map.hasLayer(polygon)) {
                    polygon.addTo(map);
                }
            } else {
                if (map.hasLayer(polygon)) {
                    map.removeLayer(polygon);
                }
            }
        });
    }
</script>
@endpush
