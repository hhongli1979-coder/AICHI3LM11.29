import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import { useValues } from '../../../utils/context';
import useStoredLocation from '../../../commonComponents/helper/useStoredLocation';
import { useSelector } from 'react-redux';
import { fontSizes, windowHeight } from '../../../theme/appConstant';
import appColors from '../../../theme/appColors';
import appFonts from '../../../theme/appFonts';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { firebaseConfig } from '../../../../firebase';
import { initializeApp } from '@firebase/app';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const MapScreenFleet = forwardRef((props, ref) => {
  const { translateData, taxidoSettingData } = useSelector((state: any) => state.setting);
  const { markerIcon, mapType = taxidoSettingData?.taxido_values?.location?.map_provider, selfDriver, driverIds, status, selectedVehiclesId }: any = props;
  const webViewRef = useRef<null>(null);
  const { Google_Map_Key } = useValues();
  const { latitude, longitude } = useStoredLocation();
  const { isDark, rtl } = useValues();
  const [speed, setSpeed] = useState<number>(0);
  const speedTimeoutRef = useRef<null | any>(null);
  const [driversData, setDriversData] = useState<any[]>([]);

  const filteredDrivers = driversData.filter((driver) => {
    if (status === 'online' && driver.is_online !== "1") return false;
    if (status === 'offline' && driver.is_online !== "0") return false;
    if (status === 'onride' && driver.is_on_ride !== "1") return false;

    if (selectedVehiclesId.length > 0 && !selectedVehiclesId.includes(driver.vehicle_type_id)) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
      window.updateDrivers(${JSON.stringify(filteredDrivers)});
      true;
    `);
    }
  }, [filteredDrivers]);


  useEffect(() => {
    if (!driverIds || driverIds.length === 0) return;
    const unsubscribers = driverIds.map((driverId: number) => {
      const driverDocRef = doc(db, 'driverTrack', String(driverId));

      return onSnapshot(
        driverDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const newData = { id: driverId, ...docSnap.data() };

            setDriversData((prev) => {
              const filtered = prev.filter((d) => d.id !== driverId);
              return [...filtered, newData];
            });
          } else {
          }
        },
        (error) => {
          console.error(`Error listening to driver ${driverId}:`, error);
        }
      );
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub && unsub());
    };
  }, [driverIds]);



  const DEFAULT_LAT = latitude;
  const DEFAULT_LNG = longitude;


  const focusToCurrentLocation = () => {
    if (webViewRef.current) {
      const jsCode = `
                if (window.focusToCurrentLocation) {
                    window.focusToCurrentLocation();
                }
                true;
            `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  useImperativeHandle(ref, () => ({
    focusToCurrentLocation,
  }));

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location to show it on the map.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    let watchId: null | number = null;

    const startWatching = async () => {
      const granted = await requestPermission();
      if (granted) {
        watchId = Geolocation.watchPosition(
          position => {
            if (speedTimeoutRef.current) {
              clearTimeout(speedTimeoutRef.current);
            }

            const { latitude, longitude, heading, speed: speedInMetersPerSecond }: any = position.coords;
            const currentSpeed: any = speedInMetersPerSecond > 0 ? (speedInMetersPerSecond * 3.6).toFixed(0) : 0;
            setSpeed(currentSpeed);

            const jsCode = `
                            if (window.updateLocation) {
                                window.updateLocation(${latitude}, ${longitude}, ${heading || 0});
                            }
                            true;
                        `;
            webViewRef.current?.injectJavaScript(jsCode);
            speedTimeoutRef.current = setTimeout(() => {
              setSpeed(0);
            }, 5000);
          },
          error => {
            Alert.alert(translateData.locationError, error.message);
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
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
      if (speedTimeoutRef.current) {
        clearTimeout(speedTimeoutRef.current);
      }
    };
  }, []);


  const darkMapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ];



  const googleHtmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
      .driver-marker { width: 50px; height: 50px; position: absolute; transform: translate(-50%, -50%); }
      #car-icon { transition: transform 0.3s linear; }
    </style>
    <script src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}&libraries=geometry"></script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      const darkMode = ${isDark ? 'true' : 'false'};
      const darkStyle = ${JSON.stringify(darkMapStyle)};

      let map, currentLatLng, overlays = [];

      class CustomMarker extends google.maps.OverlayView {
        constructor(position, iconUrl, id) {
          super();
          this.position = position;
          this.iconUrl = iconUrl;
          this.id = id;
          this.div = null;
        }
        onAdd() {
          this.div = document.createElement("div");
          this.div.style.position = "absolute";
          this.div.innerHTML = \`<img id="car-icon" src="\${this.iconUrl}" style="width:40px;height:40px; transform:rotate(0deg);" />\`;
          this.getPanes().overlayMouseTarget.appendChild(this.div);
        }
        draw() {
          const projection = this.getProjection();
          const pos = projection.fromLatLngToDivPixel(this.position);
          if (pos && this.div) {
            this.div.style.left = pos.x + 'px';
            this.div.style.top = pos.y + 'px';
          }
        }
        onRemove() {
          if (this.div) {
            this.div.remove();
            this.div = null;
          }
        }
        rotate(angle) {
          if (this.div) {
            const img = this.div.querySelector("#car-icon");
            if (img) img.style.transform = \`rotate(\${angle}deg)\`;
          }
        }
        updatePositionSmoothly(newPosition, heading) {
          const start = this.position;
          const end = newPosition;
          const steps = 40;
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
          center: currentLatLng,
          zoom: 15,
          disableDefaultUI: true,
          styles: darkMode ? darkStyle : null
        });
      }

      // Add or Update Driver
      window.updateDrivers = function(drivers) {
        // Remove markers not in list
        overlays = overlays.filter(item => {
          const exists = drivers.find(d => d.id === item.id);
          if (!exists) {
            item.overlay.setMap(null);
            return false;
          }
          return true;
        });

        // Add or update markers
        drivers.forEach(driver => {
          const pos = new google.maps.LatLng(parseFloat(driver.lat), parseFloat(driver.lng));
          const existing = overlays.find(d => d.id === driver.id);
          if (existing) {
            existing.overlay.updatePositionSmoothly(pos, driver.heading || 0);
          } else {
            const overlay = new CustomMarker(pos, driver.vehicle_map_icon_url, driver.id);
            overlay.setMap(map);
            overlays.push({ id: driver.id, overlay });
          }
        });
      };

      window.focusToCurrentLocation = function() {
        if (map && currentLatLng) {
          map.panTo(currentLatLng);
          map.setZoom(17);
        }
      };

      window.onload = initMap;
    </script>
  </body>
</html>
`;






  const osmHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
        }
        #car-icon {
          transition: transform 0.3s linear;
          width: 50px;
          height: 50px;
        }
        ${isDark ? `
        .leaflet-tile-pane {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }` : ''}
      </style>
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        let map, marker, currentLatLng;
        let animationFrameId = null;

        function initMap() {
          const initialPosition = { lat: ${DEFAULT_LAT}, lng: ${DEFAULT_LNG} };
          currentLatLng = L.latLng(initialPosition.lat, initialPosition.lng);

          map = L.map('map', {
            center: currentLatLng,
            zoom: 17,
            zoomControl: false,
            attributionControl: false
          });

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          const customIcon = L.divIcon({
              html: \`<img id="car-icon" src="${markerIcon}">\`,
              iconSize: [50, 50],
              iconAnchor: [25, 25],
              className: ''
          });

          marker = L.marker(currentLatLng, { icon: customIcon }).addTo(map);
        }

        function updatePositionSmoothly(newLatLng, heading) {
          const startLatLng = marker.getLatLng();

          if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
          }

          const duration = 1000;
          const startTime = performance.now();

          const animate = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);

              const lat = startLatLng.lat + (newLatLng.lat - startLatLng.lat) * progress;
              const lng = startLatLng.lng + (newLatLng.lng - startLatLng.lng) * progress;

              marker.setLatLng([lat, lng]);

              if (progress < 1) {
                  animationFrameId = requestAnimationFrame(animate);
              } else {
                  animationFrameId = null;
              }
          };

          animationFrameId = requestAnimationFrame(animate);

          const iconElement = document.getElementById('car-icon');
          if (iconElement) {
              iconElement.style.transform = \`rotate(\${heading || 0}deg)\`;
          }

          map.flyTo(newLatLng, map.getZoom());
        }

        window.updateLocation = function(lat, lng, heading) {
          const newLatLng = L.latLng(lat, lng);
          if (map && marker) {
              updatePositionSmoothly(newLatLng, heading);
              currentLatLng = newLatLng;
          }
        };

        window.focusToCurrentLocation = function() {
          if (map && currentLatLng) {
            map.flyTo(currentLatLng);
          }
        };

        window.onload = initMap;
      </script>
    </body>
    </html>
  `;


  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapType === 'osm' ? osmHtmlContent : googleHtmlContent }}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1 }}
      />
      {selfDriver?.role != 'fleet_manager' && (
        <View style={[styles.speedContainer, {
          alignSelf: rtl ? 'flex-end' : 'flex-start',
          backgroundColor: isDark ? appColors.darkThemeSub : appColors.white,
          borderColor: isDark ? appColors.darkBorderBlack : appColors.border,
          position: rtl ? 'relative' : 'absolute',
          left: rtl ? windowHeight(-2) : windowHeight(2)
        }]}>
          <Text style={[styles.speedText, { color: isDark ? appColors.darkText : appColors.primaryFont }]}>{speed}</Text>
          <Text style={[styles.speedUnitText, { color: isDark ? appColors.darkText : appColors.primaryFont }]}>km/h</Text>
        </View>
      )}
    </View>
  );
});


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  speedContainer: {
    height: windowHeight(7),
    width: windowHeight(7),
    backgroundColor: appColors.white,
    position: 'absolute',
    borderRadius: windowHeight(4),
    bottom: windowHeight(18),
    left: windowHeight(2),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: appColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1
  },
  speedText: {
    fontSize: 24,
    fontFamily: appFonts.medium,
    color: appColors.primaryFont
  },
  speedUnitText: {
    fontSize: fontSizes.FONT2HALF,
    color: appColors.primaryFont
  }
});