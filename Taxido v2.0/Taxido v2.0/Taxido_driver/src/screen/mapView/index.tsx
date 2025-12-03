import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import WebView from 'react-native-webview'
import appColors from '../../theme/appColors'
import darkMapStyle from './darkMap'
import { useValues } from '../../utils/context'
import { useSelector } from 'react-redux'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, updateDoc, arrayUnion, onSnapshot, getDoc } from 'firebase/firestore'
import { firebaseConfig } from '../../../firebase'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export function Map({ Destinationlocation, driverId, rideDetails, stoplocation }: any) {
  const [driverLocation, setDriverLocation] = useState<any>(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [rotation, setRotation] = useState<number>(0)
  const webViewRef = useRef<any>(null)
  const lastPosition = useRef<any>(null)
  const lastStoredPosition = useRef<any>(null)
  const isRouteFetched = useRef<boolean>(false)
  const lastRouteParams = useRef<string>('')
  const lastStopMarkersKey = useRef<string>('')
  const { isDark, Google_Map_Key } = useValues()
  const { selfDriver } = useSelector((state: any) => state.account)
  const { taxidoSettingData } = useSelector((state: any) => state.setting)
  const [initialRegion, setInitialRegion] = useState({
    latitude: rideDetails?.pickup_latitude || 37.78825,
    longitude: rideDetails?.pickup_longitude || -122.4324,
  });
  const [mapType, setMapType] = useState(taxidoSettingData?.taxido_values?.location?.map_provider);
  const parseCoordinate = (coordinate: any) => ({
    latitude: parseFloat(coordinate.lat),
    longitude: parseFloat(coordinate.lng),
  })

  const storeRidePathIfNeeded = async (newLocation: any) => {
    if (
      rideDetails?.service_category?.service_category_type?.toLowerCase() !==
      'package'
    )
      return
    const shouldStore =
      !lastStoredPosition.current ||
      getDistance(lastStoredPosition.current, newLocation) >= 250

    if (shouldStore) {
      try {
        const rideRef = doc(db, 'rides', rideDetails?.id.toString())
        await updateDoc(rideRef, {
          ride_path: arrayUnion({
            latitude: newLocation.latitude.toString(),
            longitude: newLocation.longitude.toString(),
          }),
        })
        lastStoredPosition.current = newLocation
      } catch (err) {
        console.error("Error storing ride path:", err)
      }
    }
  }

  useEffect(() => {
    if (!driverId) return

    const driverRef = doc(db, 'driverTrack', driverId.toString())

    const unsubscribe = onSnapshot(driverRef, docSnap => {
      if (docSnap.exists()) {
        const { lat, lng } = docSnap.data()
        const newLocation = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
        }

        if (!driverLocation) {
          setDriverLocation(newLocation)
        }

        storeRidePathIfNeeded(newLocation)

        let newRotation = rotation
        if (lastPosition.current) {
          const distance = getDistance(lastPosition.current, newLocation)
          if (distance < 3) return

          const angle = getBearing(lastPosition.current, newLocation)
          if (!isNaN(angle)) {
            setRotation(angle)
            newRotation = angle
          }
        }
        lastPosition.current = newLocation

        if (webViewRef.current) {
          const jsCode = `
          window.updateDriverMarker(${newLocation.latitude}, ${newLocation.longitude}, ${newRotation});
          true;
        `
          webViewRef.current.injectJavaScript(jsCode)
        }
      }
    })

    return () => unsubscribe()
  }, [driverId, rideDetails])

  useEffect(() => {
    if (!driverLocation || !Destinationlocation) {
      if (routeCoordinates.length > 0) setRouteCoordinates([]);
      return;
    }

    // Create a unique key for current route params to avoid duplicate API calls
    const destination = parseCoordinate(Destinationlocation);
    const stopLocationsKey = stoplocation && stoplocation.length > 0
      ? stoplocation.map((stop: any) => {
        const lat = stop.lat !== undefined ? parseFloat(stop.lat) : parseFloat(stop.latitude);
        const lng = stop.lng !== undefined ? parseFloat(stop.lng) : parseFloat(stop.longitude);
        return `${lat},${lng}`;
      }).join('|')
      : '';

    const routeKey = `${driverLocation.latitude},${driverLocation.longitude}-${stopLocationsKey}-${destination.latitude},${destination.longitude}`;

    // Skip if this exact route has already been fetched
    if (lastRouteParams.current === routeKey) return;

    lastRouteParams.current = routeKey;

    const origin = driverLocation;

    // Build waypoints from stop locations
    let waypointsParam = '';
    if (stoplocation && stoplocation.length > 0) {
      const waypoints = stoplocation.map((stop: any) => {
        const lat = stop.lat !== undefined ? parseFloat(stop.lat) : parseFloat(stop.latitude);
        const lng = stop.lng !== undefined ? parseFloat(stop.lng) : parseFloat(stop.longitude);
        return `${lat},${lng}`;
      }).join('|');
      waypointsParam = `&waypoints=${waypoints}`;
    }

    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin?.latitude},${origin?.longitude}&destination=${destination?.latitude},${destination?.longitude}${waypointsParam}&key=${Google_Map_Key}`

    fetch(directionsUrl)
      .then(res => res.json())
      .then(json => {
        if (json.routes?.[0]) {
          const points: any = decodePolyline(json.routes[0].overview_polyline.points)
          setRouteCoordinates(points)
        } else {
          setRouteCoordinates([]);
        }
      })
      .catch(err => {
        console.error("Error fetching directions:", err);
        setRouteCoordinates([]);
      })
  }, [Destinationlocation, stoplocation])

  useEffect(() => {
    if (webViewRef.current && routeCoordinates.length > 0) {
      const formattedPoints = routeCoordinates.map((p: any) => ({
        lat: p.latitude,
        lng: p.longitude,
      }));

      const jsCode = `
        window.updatePolyline(${JSON.stringify(formattedPoints)});
        true;
      `;
      webViewRef.current.injectJavaScript(jsCode);

      // Fit bounds only once when route is first loaded
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.injectJavaScript('window.fitMapToPolyline(); true;');
        }
      }, 500);
    }
  }, [routeCoordinates]);

  // useEffect to update the destination marker when the prop changes
  useEffect(() => {
    if (webViewRef.current) {
      const destinationCoords = Destinationlocation ? parseCoordinate(Destinationlocation) : null;
      const destinationForWebView = destinationCoords ? { lat: destinationCoords.latitude, lng: destinationCoords.longitude } : null;

      const jsCode = `
        window.updateDestinationMarker(${JSON.stringify(destinationForWebView)});
        true;
      `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  }, [Destinationlocation]);

  //  [NEW] useEffect to update stop markers when the prop changes
  useEffect(() => {
    if (webViewRef.current && stoplocation && stoplocation.length > 0) {
      const stopMarkers = stoplocation.map((stop: any) => {
        // Handle both {lat, lng} and {latitude, longitude} formats
        const lat = stop.lat !== undefined ? parseFloat(stop.lat) : parseFloat(stop.latitude);
        const lng = stop.lng !== undefined ? parseFloat(stop.lng) : parseFloat(stop.longitude);
        return { lat, lng };
      });

      // Create unique key to prevent unnecessary updates
      const stopMarkersKey = JSON.stringify(stopMarkers);

      // Only update if stop markers actually changed
      if (lastStopMarkersKey.current === stopMarkersKey) return;
      lastStopMarkersKey.current = stopMarkersKey;

      const jsCode = `
        window.updateStopMarkers(${JSON.stringify(stopMarkers)});
        true;
      `;
      webViewRef.current.injectJavaScript(jsCode);
    } else if (webViewRef.current && (!stoplocation || stoplocation.length === 0)) {
      // Clear stop markers if none exist
      if (lastStopMarkersKey.current !== '') {
        lastStopMarkersKey.current = '';
        webViewRef.current.injectJavaScript('window.updateStopMarkers([]); true;');
      }
    }
  }, [stoplocation]);


  useEffect(() => {
    const fetchDriverLocation = async () => {
      if (!rideDetails?.driver?.id) return;

      try {
        const driverTrackRef = doc(db, "driverTrack", rideDetails.driver.id.toString());
        const driverSnap = await getDoc(driverTrackRef);

        if (driverSnap.exists()) {
          const driverData = driverSnap.data();
          const driverLat = parseFloat(driverData?.lat);
          const driverLng = parseFloat(driverData?.lng);

          if (!isNaN(driverLat) && !isNaN(driverLng)) {
            setInitialRegion({
              latitude: driverLat,
              longitude: driverLng,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching driver location:", error);
      }
    };

    fetchDriverLocation();
  }, [rideDetails?.driver?.id]);

  const decodePolyline = (t: any) => {
    let points = [], index = 0, lat = 0, lng = 0;
    while (index < t.length) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const getBearing = (start: any, end: any) => {
    const toRad = (deg: any) => (deg * Math.PI) / 180, toDeg = (rad: any) => (rad * 180) / Math.PI;
    const lat1 = toRad(start.latitude), lon1 = toRad(start.longitude);
    const lat2 = toRad(end.latitude), lon2 = toRad(end.longitude);
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  };

  const getDistance = (from: any, to: any) => {
    const R = 6371000;
    const dLat = ((to.latitude - from.latitude) * Math.PI) / 180;
    const dLon = ((to.longitude - from.longitude) * Math.PI) / 180;
    const lat1 = (from.latitude * Math.PI) / 180;
    const lat2 = (to.latitude * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const driverIconUrl = selfDriver?.vehicle_info?.vehicle_type_map_icon_url || '';
  const mapStyleString = isDark ? JSON.stringify(darkMapStyle) : '[]';
  const initialDestinationCoords = Destinationlocation ? parseCoordinate(Destinationlocation) : null;
  const initialDestinationForWebView = initialDestinationCoords ? { lat: initialDestinationCoords.latitude, lng: initialDestinationCoords.longitude } : null;
  const initialStopMarkers = stoplocation && stoplocation.length > 0 ? stoplocation.map((stop: any) => {
    // Handle both {lat, lng} and {latitude, longitude} formats
    const lat = stop.lat !== undefined ? parseFloat(stop.lat) : parseFloat(stop.latitude);
    const lng = stop.lng !== undefined ? parseFloat(stop.lng) : parseFloat(stop.longitude);
    return { lat, lng };
  }) : [];


  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; background: #000; }
  .leaflet-control-zoom { display: none !important; }
</style>
</head>
<body>
<div id="map"></div>

${mapType === "google_map"
      ? `
  <!--  GOOGLE MAP VERSION -->
  <script src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}"></script>
  <script>
    let map, driverMarker, destinationMarker, routePolyline, stopMarkers = [];
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: ${initialRegion?.latitude}, lng: ${initialRegion?.longitude} },
        zoom: 16,
        disableDefaultUI: true,
        styles: ${mapStyleString},
      });

      // Set initial destination
      updateDestinationMarker(${JSON.stringify(initialDestinationForWebView)});

      // Set initial stop markers
      updateStopMarkers(${JSON.stringify(initialStopMarkers)});

      routePolyline = new google.maps.Polyline({
        path: [], geodesic: true, strokeColor: '${appColors.primary}', strokeOpacity: 1.0, strokeWeight: 4
      });
      routePolyline.setMap(map);

      window.ReactNativeWebView?.postMessage("WebViewReady");
    }

    //  [NEW] Function to handle destination marker updates
    window.updateDestinationMarker = function(destPos) {
      if (!destPos) {
        if (destinationMarker) {
          destinationMarker.setMap(null);
          destinationMarker = null;
        }
        return;
      }
      if (destinationMarker) {
        destinationMarker.setPosition(destPos);
      } else {
        destinationMarker = new google.maps.Marker({ position: destPos, map: map, title: "Destination" });
      }
    };

    //  [NEW] Function to handle stop markers updates
    window.updateStopMarkers = function(stops) {
      // Clear existing stop markers
      stopMarkers.forEach(marker => marker.setMap(null));
      stopMarkers = [];

      // Add new stop markers with numbered labels
      if (stops && stops.length > 0) {
        stops.forEach((stop, index) => {
          const marker = new google.maps.Marker({
            position: stop,
            map: map,
            label: {
              text: (index + 1).toString(),
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            },
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '${appColors.primary}',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2
            },
            title: "Stop " + (index + 1)
          });
          stopMarkers.push(marker);
        });
      }
    };

    window.updateDriverMarker = function(lat, lng, rotation) {
      const newPosition = new google.maps.LatLng(lat, lng);
      if (!driverMarker) {
        driverMarker = new google.maps.Marker({
          position: newPosition,
          map: map,
          icon: { url: '${driverIconUrl}', scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }
        });
      } else {
        driverMarker.setPosition(newPosition);
      }
      const currentIcon = driverMarker.getIcon();
      currentIcon.rotation = rotation;
      driverMarker.setIcon(currentIcon);
    };

    window.updatePolyline = function(points) {
      routePolyline?.setPath(points);
    };

    window.fitMapToPolyline = function() {
      const path = routePolyline.getPath();
      if (path.getLength() > 1) {
        const bounds = new google.maps.LatLngBounds();
        path.forEach(latLng => bounds.extend(latLng));
        if(driverMarker) bounds.extend(driverMarker.getPosition());
        if(destinationMarker) bounds.extend(destinationMarker.getPosition());
        stopMarkers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds, { top: 80, bottom: 80, left: 80, right: 80 });
      }
    };

    window.animateCameraTo = function(center) { 
      // Camera animation removed to prevent constant refocusing
    };
    window.addEventListener('load', initMap);
  </script>
  `
      : `
  <!--  OSM MAP VERSION -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    let map, driverMarker, destinationMarker, routeLine, stopMarkers = [];
    const driverIconUrl = '${driverIconUrl}';

    function initMap() {
      map = L.map('map', {
        center: [${initialRegion?.latitude}, ${initialRegion?.longitude}],
        zoom: 16, zoomControl: false, attributionControl: false
      });
      const tileLayer = ${isDark ? `L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 })` : `L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 })`};
      tileLayer.addTo(map);

      // Set initial destination
      updateDestinationMarker(${JSON.stringify(initialDestinationForWebView)});

      // Set initial stop markers
      updateStopMarkers(${JSON.stringify(initialStopMarkers)});

      routeLine = L.polyline([], { color: '${appColors.primary}', weight: 4, opacity: 1 }).addTo(map);
      window.ReactNativeWebView?.postMessage("WebViewReady");
    }

    // [NEW] Function to handle destination marker updates
    window.updateDestinationMarker = function(destPos) {
      if (!destPos) {
        if (destinationMarker) {
          map.removeLayer(destinationMarker);
          destinationMarker = null;
        }
        return;
      }
      const latLng = [destPos.lat, destPos.lng];
      if (destinationMarker) {
        destinationMarker.setLatLng(latLng);
      } else {
        destinationMarker = L.marker(latLng, { title: "Destination" }).addTo(map);
      }
    };

    //  [NEW] Function to handle stop markers updates
    window.updateStopMarkers = function(stops) {
      // Clear existing stop markers
      stopMarkers.forEach(marker => map.removeLayer(marker));
      stopMarkers = [];

      // Add new stop markers with numbered labels
      if (stops && stops.length > 0) {
        stops.forEach((stop, index) => {
          const icon = L.divIcon({
            className: 'custom-stop-marker',
            html: '<div style="background-color: ${appColors.primary}; color: white; border: 3px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">' + (index + 1) + '</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          const marker = L.marker([stop.lat, stop.lng], { icon: icon, title: "Stop " + (index + 1) }).addTo(map);
          stopMarkers.push(marker);
        });
      }
    };

    window.updateDriverMarker = function(lat, lng) {
      const pos = L.latLng(lat, lng);
      if (!driverMarker) {
        const icon = L.icon({ iconUrl: driverIconUrl, iconSize: [40, 40], iconAnchor: [20, 20] });
        driverMarker = L.marker(pos, { icon }).addTo(map);
      } else {
        driverMarker.setLatLng(pos);
      }
    };

    window.updatePolyline = function(points) {
      const latLngs = points.map(p => [p.lat, p.lng]);
      routeLine?.setLatLngs(latLngs);
    };

    window.fitMapToPolyline = function() {
      const latLngs = routeLine.getLatLngs();
      if (latLngs.length > 1) {
        const bounds = L.latLngBounds(latLngs);
        if(driverMarker) bounds.extend(driverMarker.getLatLng());
        if(destinationMarker) bounds.extend(destinationMarker.getLatLng());
        stopMarkers.forEach(marker => bounds.extend(marker.getLatLng()));
        map.fitBounds(bounds, { padding: [80, 80] });
      }
    };

    window.animateCameraTo = function(center) { map.panTo([center.lat, center.lng]); };
    window.addEventListener('load', initMap);
  </script>
  `
    }
</body>
</html>
`;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </View>
  )
}



