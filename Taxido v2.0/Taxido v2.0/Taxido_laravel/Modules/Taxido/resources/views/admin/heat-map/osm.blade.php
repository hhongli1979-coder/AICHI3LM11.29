<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Heatmap with OSM</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <style>
        .leaflet-control {
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 3px 4px 8px rgba(119, 119, 119, 0.37);
            text-align: center;
            font-size: 14px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }
        .leaflet-control button {
            margin: 0;
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
        }
    </style>
</head>
<
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.heat/dist/leaflet-heat.js"></script>
    <script>
        let map, heatmap;

        function initMap() {
            console.log('Initializing map...');
            console.log('Heatmap Data:', {!! json_encode($heatmapPoints) !!});

            // Initialize the map
            map = L.map('map').setView([37.0902, -95.7129], 5);

            // Add OSM tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Get heatmap data from Blade
            var heatmapData = {!! json_encode($heatmapPoints) !!};
            var heatmapPoints = heatmapData.map(point => [point.latitude, point.longitude, 1]);

            const gradient = {
                0.1: 'rgba(255, 0, 0, 0)',    
                0.2: 'rgba(255, 69, 0, 0.5)',  
                0.5: 'rgba(255, 69, 0, 0.8)', 
                1.0: 'rgba(255, 0, 0, 1)'     
            };

            // Initialize heatmap layer
            heatmap = L.heatLayer(heatmapPoints, {
                radius: 30,
                blur: 25,
                maxZoom: 60,
            }).addTo(map);

            // Add custom controls
            addMapControls();

            // Fix map rendering issues
            map.invalidateSize();
        }

        function addMapControls() {
            const controlDiv = document.createElement("div");
            controlDiv.className = "leaflet-control";

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
                button.onclick = btnData.action;
                controlDiv.appendChild(button);
            });

            // Attach the custom control to the map
            controlDiv.style.position = 'absolute';
            controlDiv.style.top = '10px';
            controlDiv.style.left = '50%';
            controlDiv.style.transform = 'translateX(-50%)';
            map.getContainer().appendChild(controlDiv);
        }

        // Toggle heatmap visibility
        function toggleHeatmap() {
            if (map.hasLayer(heatmap)) {
                map.removeLayer(heatmap);
            } else {
                map.addLayer(heatmap);
            }
        }

        // Change gradient of the heatmap
        function changeGradient() {
            const gradient = {
                0.1: 'rgba(255, 0, 0, 0)',   
                0.2: 'rgba(255, 69, 0, 0.5)',  
                0.5: 'rgba(255, 69, 0, 0.8)',  
                1.0: 'rgba(255, 0, 0, 1)'    
            };
            heatmap.setOptions({ gradient: heatmap.options.gradient ? null : gradient });
        }

        // Change radius of the heatmap
        function changeRadius() {
            const currentRadius = heatmap.options.radius || 30;
            heatmap.setOptions({ radius: currentRadius === 30 ? 50 : 30 });
        }

        // Change opacity of the heatmap
        function changeOpacity() {
            const currentOpacity = heatmap.options.opacity || 1;
            heatmap.setOptions({ opacity: currentOpacity === 1 ? 0.5 : 1 });
        }

        // Initialize map after DOM is fully loaded
        document.addEventListener('DOMContentLoaded', function () {
            initMap();
        });
    </script>
</body>
</html>