import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { useValues } from '../../../utils/context'
import appColors from '../../../theme/appColors'

export function RideTrackMap({
  DestinationLocation,
  driverLocation,
  driverIcon,
}: {
  DestinationLocation?: any
  driverLocation?: any
  driverIcon?: string
}) {
  const { Google_Map_Key } = useValues()
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting)

  const pickupPoint = driverLocation
    ? { lat: driverLocation.latitude, lng: driverLocation.longitude }
    : null
  const destinationPoint = DestinationLocation
    ? { lat: parseFloat(DestinationLocation.lat), lng: parseFloat(DestinationLocation.lng) }
    : null
  const mapType = taxidoSettingData?.taxido_values?.location?.map_provider;

  // Google Maps HTML
  const googleHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style> html, body, #map { height:100%; width:100%; margin:0; padding:0; } </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function initMap() {
          const pickup = ${pickupPoint ? JSON.stringify(pickupPoint) : 'null'};
          const destination = ${destinationPoint ? JSON.stringify(destinationPoint) : 'null'};
          const map = new google.maps.Map(document.getElementById('map'), {
            center: pickup || { lat: 0, lng: 0 },
            zoom: pickup ? 14 : 2,
            disableDefaultUI: true
          });

          function createMarkerIcon(url) {
            return {
              url: url,
              scaledSize: new google.maps.Size(40,40),
              anchor: new google.maps.Point(20,20)
            };
          }

          if (pickup) {
            new google.maps.Marker({
              position: pickup,
              map: map,
              icon: ${driverIcon ? `createMarkerIcon('${driverIcon}')` : 'null'},
              title: "${translateData?.markerOne || 'Driver'}"
            });
          }

          if (destination) {
            new google.maps.Marker({
              position: destination,
              map: map,
              title: "${translateData?.markerTwo || 'Destination'}"
            });

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
              suppressMarkers: true,
              polylineOptions: { strokeColor: '${appColors.primary}', strokeWeight: 4 }
            });
            directionsRenderer.setMap(map);

            directionsService.route({
              origin: pickup,
              destination: destination,
              travelMode: 'DRIVING'
            }, function(response, status) {
              if (status === 'OK') {
                directionsRenderer.setDirections(response);
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(pickup);
                bounds.extend(destination);
                map.fitBounds(bounds);
              }
            });
          }
        }
      </script>
      <script async defer src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}&callback=initMap"></script>
    </body>
  </html>
  `

  // OSM (Leaflet) HTML
  const osmHtml = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
      <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css"/>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.min.js"></script>
      <style> html, body, #map { height: 100%; width: 100%; margin:0; padding:0; } </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const pickup = ${pickupPoint ? `[${pickupPoint.lat}, ${pickupPoint.lng}]` : 'null'};
        const destination = ${destinationPoint ? `[${destinationPoint.lat}, ${destinationPoint.lng}]` : 'null'};
        const mapCenter = pickup ? pickup : [0,0];
        const map = L.map('map').setView(mapCenter, pickup ? 14 : 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        if (pickup) {
          L.marker(pickup).addTo(map).bindPopup("${translateData?.markerOne || 'Driver'}").openPopup();
        }
        if (destination) {
          L.marker(destination).addTo(map).bindPopup("${translateData?.markerTwo || 'Destination'}");
        }

        if (pickup && destination) {
          setTimeout(() => {
            L.Routing.control({
              waypoints: [L.latLng(pickup[0], pickup[1]), L.latLng(destination[0], destination[1])],
              lineOptions: { styles: [{ color: '${appColors.primary}', weight: 4 }] },
              createMarker: () => null,
              addWaypoints: false
            }).addTo(map);
          }, 100);
        }
      </script>
    </body>
  </html>
  `

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapType === 'google_map' ? googleHtml : osmHtml }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
      />
    </View>
  )
}
