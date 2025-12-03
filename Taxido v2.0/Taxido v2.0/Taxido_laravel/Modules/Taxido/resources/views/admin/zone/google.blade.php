@push('scripts')
<script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=places,geometry,drawing&callback=initMap" defer></script>
<script>
  (function($) {
    "use strict";
    $(document).ready(function() {
      $("#zoneForm").validate({
        ignore: [],
        rules: {
          "name": "required",
          "currency_id": "required",
          "distance_type": "required",
          "place_points": "required",
        }
      });

      let mapInstance, shapeManager, currentShape = null;
      let existingPolygon = <?php echo json_encode(isset($zone->locations) ? $zone->locations : null); ?>;

      function initMap() {
        setupMap();
        setupDrawingManager();
        setupGeolocation();
        loadExistingPolygon();
        searchBox(); 
      }

      function setupMap() {
        const startLocation = {
          
        };
        const mapOptions = {
          zoom: 13,
          center: startLocation,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        mapInstance = new google.maps.Map($('#map-container')[0], mapOptions);
      }

      function setupDrawingManager() {
        shapeManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [google.maps.drawing.OverlayType.POLYGON]
          },
          polygonOptions: {
            editable: true
          }
        });
        shapeManager.setMap(mapInstance);
        google.maps.event.addListener(shapeManager, "overlaycomplete", handleOverlayComplete);
      }

      function setupGeolocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(centerMapOnUser);
        }
      }

      function centerMapOnUser(position) {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        mapInstance.setCenter(userLocation);
      }

      function handleOverlayComplete(event) {
        if (currentShape) {
            currentShape.setMap(null);
        }
        currentShape = event.overlay;
        currentShape.type = event.type;
        const vertices = currentShape.getPath().getArray();
        
        if (vertices.length < 3) {
            alert('Please draw a polygon with at least three distinct points.');
            currentShape.setMap(null);
            $('#place_points').val('');
            return; 
        }
        
        const coordinatesArray = vertices.map(vertex => {
            return {
                lat: vertex.lat(),
                lng: vertex.lng()
            };
        });

        if (coordinatesArray[0].lat !== coordinatesArray[coordinatesArray.length - 1].lat ||
            coordinatesArray[0].lng !== coordinatesArray[coordinatesArray.length - 1].lng) {
            coordinatesArray.push(coordinatesArray[0]);
        }

        $('#place_points').val(JSON.stringify(coordinatesArray));
    }

      function loadExistingPolygon() {
        if (existingPolygon) {
          const coordinates = existingPolygon.map(coord => new google.maps.LatLng(coord.lat, coord.lng));
          currentShape = new google.maps.Polygon({
            paths: coordinates,
            editable: true,
            map: mapInstance
          });
          mapInstance.fitBounds(getPolygonBounds(currentShape));
        }
      }

      function getPolygonBounds(polygon) {
        const bounds = new google.maps.LatLngBounds();
        polygon.getPath().forEach(function(vertex) {
          bounds.extend(vertex);
        });
        return bounds;
      }

      function searchBox() {
          var input = document.getElementById('search-box');
          var searchBox = new google.maps.places.SearchBox(input);

          mapInstance.addListener('bounds_changed', function() {
            searchBox.setBounds(mapInstance.getBounds());
          });

          searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
              return;
            }

            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              if (!place.geometry) {
                return;
              }

              if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });

            mapInstance.fitBounds(bounds);
          });
        }

        $('#zoneForm').on('submit', function(e) {
          const placePoints = $('#place_points').val();
          try {
            const coords = JSON.parse(placePoints);
            if (!Array.isArray(coords) || coords.length < 4) {
              alert("Please draw a valid zone on the map with at least 3 unique points.");
              e.preventDefault();
            }
          } catch (err) {
            alert("Invalid zone data. Please draw a valid polygon.");
            e.preventDefault();
          }
        });

      initMap();
    });
  })(jQuery);
</script>
@endpush
