
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

    $(document).ready(function() {

      let mapInstance, editableLayers, currentShape = null;
      let existingPolygon = <?php echo json_encode(isset($zone->locations) ? $zone->locations : []); ?>

      function initMap() {
        setupMap();
        setupDrawingManager();
        loadExistingPolygon();
      }

      function setupMap() {
        const startLocation = [21.20764938296402, 72.77381805168456];
        mapInstance = L.map('map-container').setView(startLocation, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
          maxZoom: 18
        }).addTo(mapInstance);

        editableLayers = new L.FeatureGroup();
        mapInstance.addLayer(editableLayers);
      }

      function removeExistingPolygons() {
        editableLayers.eachLayer(function(layer) {
          if (layer instanceof L.Polygon) {
            editableLayers.removeLayer(layer);
          }
        });
      }

      function setupDrawingManager() {
        const drawControl = new L.Control.Draw({
          position: 'topright',
          draw: {
            polygon: {
              allowIntersection: false,
              drawError: {
                color: '#000000',
                message: '<strong>Oh snap!</strong> You can\'t draw that!'
              },
              shapeOptions: {
                color: '#000000'
              }
            },
            polyline: false,
            circle: false,
            rectangle: false,
            marker: false
          },
          edit: {
            featureGroup: editableLayers,
            remove: true,
            edit: {
              selectedPathOptions: {
                maintainColor: false, // Keeps the original color during edit
                color: '#000000' // Change the color when editing
              }
            }
          }
        });

        mapInstance.addControl(drawControl);
        mapInstance.on(L.Draw.Event.CREATED, function(event) {
          const layer = event.layer;
          removeExistingPolygons();
          editableLayers.addLayer(layer);
          currentShape = layer;

          updateCoordinates();
        });

        mapInstance.on(L.Draw.Event.EDITED, function(event) {
          const layers = event.layers;
          layers.eachLayer(function(layer) {
            console.log('Layer edited:', layer);
            currentShape = layer;
            updateCoordinates();
          });
        });

        mapInstance.on(L.Draw.Event.DELETED, function(event) {
          const layers = event.layers;
          layers.eachLayer(function(layer) {
            console.log('Layer deleted:', layer);
            if (layer === currentShape) {
              currentShape = null;
            }
            editableLayers.removeLayer(layer);
            updateCoordinates();
          });
        });
      }

      function loadExistingPolygon() {
        if (existingPolygon.length) {
          const latlngs = existingPolygon.map(coord => [coord.lat, coord.lng]);
          currentShape = L.polygon(latlngs, {
            editable: true
          }).addTo(mapInstance);
          editableLayers.addLayer(currentShape);
          mapInstance.fitBounds(currentShape.getBounds());
        }
      }

      function updateCoordinates() {
        if (currentShape) {
          const latlngs = currentShape.getLatLngs()[0].map(latlng => ({
            lat: latlng.lat,
            lng: latlng.lng
          }));
          $('#place_points').val(JSON.stringify(latlngs));
        } else {
          $('#place_points').val('');
        }
      }


      const searchBox = document.getElementById("search-box");
      const suggestionsList = document.getElementById("suggestions-list");

      searchBox.addEventListener("input", function() {
        const query = searchBox.value;
        if (query.length > 2) { 
          fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
            .then(response => response.json())
            .then(data => {
              suggestionsList.innerHTML = '';
              data.forEach(location => {
                const li = document.createElement("li");
                li.textContent = location.display_name;
                li.addEventListener("click", function() {
                  const lat = location.lat;
                  const lon = location.lon;
                  mapInstance.setView([lat, lon], 16);
                  editableLayers.clearLayers();
                  searchBox.value = location.display_name;
                  suggestionsList.style.display = "none"; 
                  updateCoordinates();
                });
                suggestionsList.appendChild(li);
              });
              suggestionsList.style.display = "block"; 
            });
        } else {
          suggestionsList.style.display = "none";
        }
      });
      initMap();
    });
  })(jQuery);
</script>
@endpush