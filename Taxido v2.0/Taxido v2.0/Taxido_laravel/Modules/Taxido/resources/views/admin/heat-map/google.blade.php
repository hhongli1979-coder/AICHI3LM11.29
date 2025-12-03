<script async
    src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&loading=async&libraries=visualization&callback=initMap">
</script>

<script>
    let map, heatmap;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: {
                lat: 37.0902,
                lng: -95.7129
            },
            mapTypeId: 'roadmap'
        });

        var heatmapData = {!! json_encode($heatmapPoints) !!};
        if (heatmapData.length > 0) {
            var heatmapLatLng = heatmapData.map(point => new google.maps.LatLng(point.latitude, point.longitude));

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmapLatLng,
                radius: 30
            });

            heatmap.setMap(map);

            // Auto center and zoom to fit all heatmap points
            const bounds = new google.maps.LatLngBounds();
            heatmapLatLng.forEach(latlng => bounds.extend(latlng));
            map.fitBounds(bounds);
        }
        // Add custom controls inside the map
        addMapControls();
    }

    function addMapControls() {
        const controlDiv = document.createElement("div");
        controlDiv.style.margin = "10px";
        controlDiv.style.padding = "10px";
        controlDiv.style.backgroundColor = "white";
        controlDiv.style.border = "1px solid #eee";
        controlDiv.style.borderRadius = "5px";
        controlDiv.style.boxShadow = "rgb(119 119 119 / 37%) 3px 4px 8px";
        controlDiv.style.textAlign = "center";
        controlDiv.style.fontSize = "14px";
        controlDiv.style.display = "flex";
        controlDiv.style.flexDirection = "row";
        controlDiv.style.justifyContent = "center";
        controlDiv.style.alignItems = "center";
        controlDiv.style.gap = "8px"; // Better spacing

        // Add buttons inside the control panel
        const buttons = [{
                text: "{{ __('taxido::static.heatmaps.heatmap') }}",
                action: toggleHeatmap
            },
            {
                text: "{{ __('taxido::static.heatmaps.gradient') }}",
                action: changeGradient
            },
            {
                text: "{{ __('taxido::static.heatmaps.radius') }}",
                action: changeRadius
            },
            {
                text: "{{ __('taxido::static.heatmaps.opacity') }}",
                action: changeOpacity
            }
        ];

        buttons.forEach(btnData => {
            const button = document.createElement("button");
            button.innerHTML = btnData.text;
            button.classList.add("map-toggle-btn");
            button.onclick = btnData.action;
            controlDiv.appendChild(button);
        });

        // Attach the custom control to the map
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
    }

    // Toggle heatmap visibility
    function toggleHeatmap() {
        heatmap.setMap(heatmap.getMap() ? null : map);
    }

    // Change gradient of the heatmap
    function changeGradient() {
        const gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
        ];
        heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    }

    function changeRadius() {
        let currentRadius = heatmap.get('radius') || 30;
        heatmap.set('radius', currentRadius === 30 ? 50 : 30);
    }

    function changeOpacity() {
        let currentOpacity = heatmap.get('opacity') || 1;
        heatmap.set('opacity', currentOpacity === 1 ? 0.5 : 1);
    }

    window.onload = initMap;
</script>
