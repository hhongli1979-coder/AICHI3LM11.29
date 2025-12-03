import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Alert, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import commanStyles from '../../../../style/commanStyles';
import { useDispatch, useSelector } from 'react-redux';
import { BackButton, Button, DriverProfile } from '../../../../commonComponents';
import appColors from '../../../../theme/appColors';
import styles from './styles';
import { useValues } from '../../../../utils/context';
import { useTheme, useRoute } from '@react-navigation/native';
import { ambulanceRideData, rideDataPut } from '../../../../api/store/action';
import { windowHeight } from '../../../../theme/appConstant';
import { AppDispatch } from '../../../../api/store';
import { useAppNavigation } from '../../../../utils/navigation';

export function AmbulanceTrack() {
  const route = useRoute();
  const { rideData }: any = route.params || {};
  const { Google_Map_Key, isDark } = useValues();
  const { colors } = useTheme();
  const navigation = useAppNavigation();
  const webViewRef = useRef<any>(null);
  const [completeLoading, setCompleteLoading] = useState<boolean>(false);
  const [rideStarted, setRideStarted] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const DEFAULT_LAT = 22.7196;
  const DEFAULT_LNG = 75.8577;
  const { taxidoSettingData, translateData } = useSelector((state: any) => state.setting);

  const mapType = taxidoSettingData?.taxido_values?.location?.map_provider || 'google';
  const destination = rideData?.location_coordinates?.length > 0
    ? rideData.location_coordinates[rideData.location_coordinates.length - 1]
    : null;

  const ambulanceIcon = taxidoSettingData?.taxido_values?.general?.ambulance_image;
  const destinationIcon = taxidoSettingData?.taxido_values?.general?.ambulance_map_icon;

  const requestPermission = async () => {
    if (Platform.OS == 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted == PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const createHtmlContent = () => {
    const darkMapStyleJson = JSON.stringify([
      { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }
    ]);

    const destinationData = destination
      ? `{ lat: ${parseFloat(destination.lat)}, lng: ${parseFloat(destination.lng)} }`
      : 'null';

    const useGoogleMaps = mapType == 'google' && Google_Map_Key;

    if (useGoogleMaps) {
    } else {
    }

    if (useGoogleMaps) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            html, body, #map { margin:0; padding:0; height:100%; width:100%; }
            #ambulance-icon { transition: transform 0.3s linear; width:50px; height:50px; }
          </style>
          <script src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const darkMode = ${isDark};
            const darkStyle = ${darkMapStyleJson};
            let map, ambulanceOverlay, destinationMarker, directionsService, directionsRenderer;
            let currentLatLng;
            let firstUpdate = true;
            let destination = ${destinationData};

            class AmbulanceMarker extends google.maps.OverlayView {
              constructor(position) {
                super();
                this.position = position;
                this.div = null;
              }
              onAdd() {
                this.div = document.createElement("div");
                this.div.style.position = "absolute";
                this.div.innerHTML = '<img id="ambulance-icon" src="${ambulanceIcon}" style="width: 24px; height: 24px; object-fit: contain;" />';
                this.getPanes().overlayMouseTarget.appendChild(this.div);
              }
              draw() {
                const projection = this.getProjection();
                const pos = projection.fromLatLngToDivPixel(this.position);
                if (pos && this.div) {
                  this.div.style.left = pos.x - 25 + "px";
                  this.div.style.top = pos.y - 25 + "px";
                }
              }
              onRemove() {
                if (this.div) { this.div.remove(); this.div = null; }
              }
              rotate(angle) {
                if (this.div) {
                  const img = this.div.querySelector("#ambulance-icon");
                  if (img) img.style.transform = 'rotate(' + angle + 'deg)';
                }
              }
              updatePositionSmoothly(newPosition, heading) {
                const start = this.position;
                const end = newPosition;
                const steps = 30;
                let step = 0;
                const deltaLat = (end.lat() - start.lat()) / steps;
                const deltaLng = (end.lng() - start.lng()) / steps;
                const animate = () => {
                  step++;
                  const lat = start.lat() + deltaLat * step;
                  const lng = start.lng() + deltaLng * step;
                  this.position = new google.maps.LatLng(lat, lng);
                  this.draw();
                  if (step < steps) requestAnimationFrame(animate);
                };
                animate();
                this.rotate(heading);
              }
            }

            function initMap() {
              const initialPosition = { lat: ${DEFAULT_LAT}, lng: ${DEFAULT_LNG} };
              currentLatLng = new google.maps.LatLng(initialPosition.lat, initialPosition.lng);

              map = new google.maps.Map(document.getElementById("map"), {
                center: initialPosition,
                zoom: 16,
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: darkMode ? darkStyle : null
              });

              directionsService = new google.maps.DirectionsService();
              directionsRenderer = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '${appColors.primary}',
                  strokeWeight: 5,
                  strokeOpacity: 0.9
                }
              });
              directionsRenderer.setMap(map);

              ambulanceOverlay = new AmbulanceMarker(currentLatLng);
              ambulanceOverlay.setMap(map);

              if (destination) {
                destinationMarker = new google.maps.Marker({
                  position: destination,
                  map: map,
                  icon: {
                    url: '${destinationIcon}',
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 40)
                  },
                  title: 'Patient Location'
                });
                calculateAndDisplayRoute();
              }
            }

            function calculateAndDisplayRoute() {
              if (!destination || !currentLatLng) return;
              directionsService.route({
                origin: currentLatLng,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING,
              }, (response, status) => {
                if (status === 'OK') {
                  directionsRenderer.setDirections(response);
                }
              });
            }

            window.updateLocation = function(lat, lng, heading) {
              const newLatLng = new google.maps.LatLng(lat, lng);
              if (map && ambulanceOverlay) {
                ambulanceOverlay.updatePositionSmoothly(newLatLng, heading || 0);
                currentLatLng = newLatLng;

                if (firstUpdate) {
                  map.panTo(newLatLng);
                  firstUpdate = false;
                }

                if (destination) {
                  calculateAndDisplayRoute();
                }
              }
            };

            window.focusOnAmbulance = function() {
              if (map && currentLatLng) map.panTo(currentLatLng);
            };

            window.onload = initMap;
          </script>
        </body>
        </html>
      `;
    } else {
      // OSM Implementation
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            html, body, #map { margin:0; padding:0; height:100%; width:100%; }
            #ambulance-icon { transition: transform 0.3s linear; width:50px; height:50px; }
          </style>
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        </head>
        <body>
          <div id="map"></div>
          <script>
            const darkMode = ${isDark};
            let map, ambulanceMarker, destinationMarker, routePolyline;
            let currentLatLng;
            let firstUpdate = true;
            let destination = ${destinationData};
            
            function initMap() {
              const initialPosition = [${DEFAULT_LAT}, ${DEFAULT_LNG}];
              currentLatLng = L.latLng(initialPosition[0], initialPosition[1]);
              
              map = L.map('map', {
                center: initialPosition,
                zoom: 16,
                zoomControl: false
              });
              
              // Add tile layer based on dark mode
              const tileUrl = darkMode 
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
              
              L.tileLayer(tileUrl, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);
              
              // Create ambulance marker
              const ambulanceIcon = L.icon({
                iconUrl: '${ambulanceIcon}',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
              });
              
              ambulanceMarker = L.marker(initialPosition, { icon: ambulanceIcon }).addTo(map);
              
              if (destination) {
                // Create destination marker
                const destIcon = L.icon({
                  iconUrl: '${destinationIcon}',
                  iconSize: [40, 40],
                  iconAnchor: [20, 40]
                });
                
                destinationMarker = L.marker([destination.lat, destination.lng], { icon: destIcon })
                  .addTo(map)
                  .bindPopup('Patient Location');
                  
                calculateAndDisplayRoute();
              }
            }
            
            function calculateAndDisplayRoute() {
              if (!destination || !currentLatLng) return;
              
              // Remove existing route if any
              if (routePolyline) {
                map.removeLayer(routePolyline);
              }
              
              // Use OSRM for road-wise routing
              const osrmUrl = 'https://router.project-osrm.org/route/v1/driving/' + currentLatLng.lng + ',' + currentLatLng.lat + ';' + destination.lng + ',' + destination.lat + '?overview=full&geometries=geojson';
              
              fetch(osrmUrl)
                .then(response => response.json())
                .then(data => {
                  if (data.routes && data.routes.length > 0) {
                    const coordinates = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    routePolyline = L.polyline(coordinates, {
                      color: '${appColors.primary}',
                      weight: 5,
                      opacity: 0.9
                    }).addTo(map);
                    
                    // Fit map to show both start and end points
                    const bounds = L.latLngBounds([
                      [currentLatLng.lat, currentLatLng.lng],
                      [destination.lat, destination.lng]
                    ]);
                    map.fitBounds(bounds, { padding: [50, 50] });
                  }
                })
                .catch(error => {
                  console.error('Error fetching route:', error);
                  // Fallback to straight line if routing fails
                  const latlngs = [
                    [currentLatLng.lat, currentLatLng.lng],
                    [destination.lat, destination.lng]
                  ];
                  routePolyline = L.polyline(latlngs, {
                    color: '${appColors.primary}',
                    weight: 5,
                    opacity: 0.9
                  }).addTo(map);
                });
            }
            
            window.updateLocation = function(lat, lng, heading) {
              const newLatLng = L.latLng(lat, lng);
              if (map && ambulanceMarker) {
                ambulanceMarker.setLatLng(newLatLng);
                currentLatLng = newLatLng;
                
                if (firstUpdate) {
                  map.panTo(newLatLng);
                  firstUpdate = false;
                }
                
                if (destination) {
                  calculateAndDisplayRoute();
                }
              }
            };
            
            window.focusOnAmbulance = function() {
              if (map && currentLatLng) map.panTo(currentLatLng);
            };
            
            window.onload = initMap;
          </script>
        </body>
        </html>
      `;
    }
  };

  const htmlSource = useMemo(() => {
    const source = { html: createHtmlContent() };
    return source;
  }, [mapType, Google_Map_Key, isDark, destination, ambulanceIcon, destinationIcon]);

  useEffect(() => {
    let watchId: any = null;
    const startWatching = async () => {
      const granted = await requestPermission();
      if (granted) {
        watchId = Geolocation.watchPosition(
          position => {
            const { latitude: lat, longitude: lng, heading } = position.coords;
            if (webViewRef.current) {
              const jsCode = `window.updateLocation && window.updateLocation(${lat}, ${lng}, ${heading || 0}); true;`;
              webViewRef.current.injectJavaScript(jsCode);
            }
          },
          error => {
            Alert.alert("Location Error", error.message);
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 2,
            interval: 4000,
            fastestInterval: 2000
          }
        );
      } else {
        Alert.alert(translateData.permissionDenied, translateData.locationPerReq);
      }
    };

    startWatching();
    return () => {
      if (watchId !== null) Geolocation.clearWatch(watchId);
    };
  }, []);

  const startRide = async () => {
    try {
      setRideStarted(true);
      const payload: any = { ride_id: rideData?.id };
      dispatch(ambulanceRideData(payload));
    } catch (error) {
    }
  };

  const gotoPickupPatient = async () => {
    try {
      setCompleteLoading(true);
      dispatch(rideDataPut({
        data: { status: 'completed' },
        ride_id: rideData?.id,
      })).then(async (res) => {
        if (res?.payload?.id) navigation.navigate('RideDetails', { ride_Id: res?.payload?.id });
      }).finally(() => setCompleteLoading(false));
    } catch (error) {
      setCompleteLoading(false);
    }
  };

  return (
    <View style={[commanStyles.main, { backgroundColor: colors.background }]}>
      <WebView
        key={mapType}
        ref={webViewRef}
        originWhitelist={['*']}
        source={htmlSource}
        javaScriptEnabled
        domStorageEnabled
        style={mapViewStyles.map}
        scalesPageToFit={true}
      />
      <View style={styles.backButton}><BackButton /></View>
      <View style={[styles.extraSection, { backgroundColor: colors.card }]}>
        <View style={[styles.greenSection]}>
          <View style={[styles.additionalSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <DriverProfile
              userDetails={rideData?.rider}
              borderRadius={windowHeight(25)}
              showInfoIcon
              iconColor={appColors.primary}
              backgroundColor={appColors.white}
              rideDetails={rideData}
            />
          </View>
          <Button
            onPress={rideStarted ? gotoPickupPatient : startRide}
            title={rideStarted ? translateData?.pickPatient : translateData?.startRide}
            backgroundColor={appColors.primary}
            color={appColors.white}
            loading={completeLoading}
          />
        </View>
      </View>
    </View>
  );
}

const mapViewStyles = StyleSheet.create({
  map: { ...StyleSheet.absoluteFillObject }
});
