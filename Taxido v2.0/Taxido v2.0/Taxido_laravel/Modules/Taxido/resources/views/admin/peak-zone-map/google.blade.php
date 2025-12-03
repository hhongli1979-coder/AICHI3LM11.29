<script async
    src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&loading=async&libraries=drawing&callback=initMap">
</script>

<script>
    let map, polygons = [];
    const zoneData = {!! json_encode($formattedZones) !!};

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: {
                lat: 37.0902,
                lng: -95.7129
            },
            mapTypeId: 'roadmap'
        });

        // Draw all peak zones
        drawPeakZones();

        // Initialize zone filter
        document.getElementById('zone-filter').addEventListener('change', function() {
            filterZones(this.value);
        });

        // Auto-center map to fit all zones
        if (zoneData.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            zoneData.forEach(zone => {
                if (zone.coordinates) {
                    zone.coordinates.forEach(coord => {
                        bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
                    });
                }
            });
            map.fitBounds(bounds);
        }
    }

    function drawPeakZones() {
        // Clear existing polygons
        polygons.forEach(polygon => polygon.setMap(null));
        polygons = [];

        zoneData.forEach(zone => {
            if (!zone.coordinates || !Array.isArray(zone.coordinates)) return;

            const path = zone.coordinates.map(coord => ({
                lat: parseFloat(coord.lat),
                lng: parseFloat(coord.lng)
            }));

            const polygon = new google.maps.Polygon({
                paths: path,
                strokeColor: zone.color || '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: zone.color || '#FF0000',
                fillOpacity: zone.active ? 0.35 : 0.15,
                map: map,
                zoneId: zone.id,
                active: zone.active
            });

            // Add info window with zone name
            const infoWindow = new google.maps.InfoWindow({
                content: `<div style="padding: 10px;">
                            <strong>${zone.name}</strong><br>
                            Status: ${zone.active ? 'Active' : 'Inactive'}
                         </div>`
            });

            polygon.addListener('click', function(e) {
                infoWindow.setPosition(e.latLng);
                infoWindow.open(map);
            });

            polygons.push(polygon);
        });
    }

    function filterZones(filterValue) {
        polygons.forEach(polygon => {
            const shouldShow = filterValue === 'all' ||
                (filterValue === 'active' && polygon.active) ||
                (filterValue === 'inactive' && !polygon.active);
            polygon.setMap(shouldShow ? map : null);
        });
    }
</script>
