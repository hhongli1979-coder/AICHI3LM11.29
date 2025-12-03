import React, { useState } from 'react'
import { View } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { WebView } from 'react-native-webview'
import { useSelector } from 'react-redux'
import { useValues } from '../../../utils/context'
import styles from '../../../style/commanStyles'
import { BackButton } from '../../../commonComponents'
import { windowHeight } from '../../../theme/appConstant'
import appColors from '../../../theme/appColors'

export function MapDetails() {
  const route = useRoute<any>()
  const { location } = route.params
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting)
  const { Google_Map_Key } = useValues()
  const mapType = taxidoSettingData?.taxido_values?.location?.map_provider;

  const pickupPoint =
    location?.[0]?.lat && location?.[0]?.lng
      ? { latitude: parseFloat(location[0].lat), longitude: parseFloat(location[0].lng) }
      : null

  const destinationPoint =
    location?.[1]?.lat && location?.[1]?.lng
      ? { latitude: parseFloat(location[1].lat), longitude: parseFloat(location[1].lng) }
      : null

  // Google Maps HTML
  const googleHtml = `
  <!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style> html, body, #map { height:100%; width:100%; margin:0; padding:0; } </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        function initMap() {
          const pickup = ${pickupPoint ? `{lat: ${pickupPoint?.latitude}, lng: ${pickupPoint?.longitude}}` : 'null'};
          const destination = ${destinationPoint ? `{lat: ${destinationPoint?.latitude}, lng: ${destinationPoint?.longitude}}` : 'null'};
          const primaryColor = '${appColors.primary}';
          const map = new google.maps.Map(document.getElementById('map'), {
            center: pickup || { lat: 0, lng: 0 },
            zoom: pickup ? 14 : 2,
            disableDefaultUI: true
          });

          function createMarkerIcon(letter, color) {
            const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'>" +
                        "<circle cx='24' cy='24' r='20' fill='" + color + "'/>" +
                        "<text x='24' y='32' font-size='18' text-anchor='middle' fill='white' font-family='Arial' font-weight='700'>" + letter + "</text>" +
                        "</svg>";
            return {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
              scaledSize: new google.maps.Size(36,36),
              anchor: new google.maps.Point(18,18)
            };
          }

          if (pickup) {
            new google.maps.Marker({
              position: pickup,
              map: map,
              icon: createMarkerIcon('P', primaryColor),
              title: "${translateData?.pickupPoint || 'Pickup'}"
            });
          }

          if (destination) {
            new google.maps.Marker({
              position: destination,
              map: map,
              icon: createMarkerIcon('D', primaryColor),
              title: "${translateData?.destinationPoint || 'Destination'}"
            });

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
              suppressMarkers: true,
              polylineOptions: { strokeColor: primaryColor, strokeWeight: 4 }
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
              } else {
                // fallback: simple polyline
                const path = [pickup, destination];
                new google.maps.Polyline({ path, strokeColor: primaryColor, strokeWeight: 4, map });
                const bounds = new google.maps.LatLngBounds();
                bounds.extend(pickup);
                bounds.extend(destination);
                map.fitBounds(bounds);
              }
            });
          } else if (pickup) {
            map.setCenter(pickup);
            map.setZoom(15);
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
      function initMap() {
        const pickupLat = ${pickupPoint ? pickupPoint?.latitude : 'null'};
        const pickupLng = ${pickupPoint ? pickupPoint?.longitude : 'null'};
        const destLat = ${destinationPoint ? destinationPoint?.latitude : 'null'};
        const destLng = ${destinationPoint ? destinationPoint?.longitude : 'null'};

        if (pickupLat === null) return;

        const pickup = L.latLng(pickupLat, pickupLng);
        const destination = destLat !== null ? L.latLng(destLat, destLng) : null;

        // Disable zoom control (+/-)
        const map = L.map('map', { zoomControl: false }).setView(pickup, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

        L.marker(pickup).addTo(map).bindPopup('P').openPopup();

        if (destination) {
          L.marker(destination).addTo(map).bindPopup('D');

          // Routing
          setTimeout(() => {
            L.Routing.control({
              waypoints: [pickup, destination],
              lineOptions: { styles: [{ color: '${appColors.primary}', weight: 4 }] },
              createMarker: () => null,
              addWaypoints: false
            }).addTo(map);
          }, 100);
        }
      }

      window.onload = initMap;
    </script>
  </body>
</html>



  `

  return (
    <View style={styles.main}>
      <View style={{ position: 'absolute', left: windowHeight(1), zIndex: 1 }}>
        <BackButton />
      </View>

      <WebView
        originWhitelist={['*']}
        source={{ html: mapType === 'google' ? osmHtml : googleHtml }}
        style={styles.main}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mixedContentMode="always"
      />
    </View>
  )
}
