import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react'
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
  Text,
} from 'react-native'
import { WebView } from 'react-native-webview'
import Geolocation from '@react-native-community/geolocation'
import { useValues } from '../../../utils/context'
import useStoredLocation from '../../../commonComponents/helper/useStoredLocation'
import { useSelector } from 'react-redux'
import { fontSizes, windowHeight, windowWidth } from '../../../theme/appConstant'
import appColors from '../../../theme/appColors'
import appFonts from '../../../theme/appFonts'
import Icons from '../../../utils/icons/icons'
import { FAB } from 'react-native-paper'
import { getFirestore, collection, onSnapshot } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../../../../firebase'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export const MapScreen = forwardRef((props, ref) => {
  const { translateData, taxidoSettingData } = useSelector(
    (state: any) => state.setting,
  )
  const {
    markerIcon,
    mapType = taxidoSettingData?.taxido_values?.location?.map_provider,
    selfDriver,
    zoneValue,
    isBottomSheetCancelOpen,
    isBottomSheetOpen,
    isBottomSheetOfflineOpen,
    isBottomSheetSOSOpen
  }: any = props

  const webViewRef = useRef<null>(null)
  const { Google_Map_Key } = useValues()
  const { latitude, longitude } = useStoredLocation()
  const { isDark, rtl } = useValues()
  const [speed, setSpeed] = useState<number>(0)
  const speedTimeoutRef = useRef<null | any>(null)
  const [fabOpen, setFabOpen] = useState(false)
  const [pickZone, setPickZone] = useState<{
    pickzone: Array<Array<{ lat: number; lng: number }>>
  }>({ pickzone: [] })

  const DEFAULT_LAT = latitude
  const DEFAULT_LNG = longitude

  useEffect(() => {
    if (!zoneValue?.id) return

    const activeCollectionRef = collection(
      db,
      'peak_zones',
      String(zoneValue.id),
      'active',
    )

    const unsubscribe = onSnapshot(
      activeCollectionRef,
      snapshot => {
        if (!snapshot.empty) {
          snapshot.docs.forEach(docSnap => {
            const data = docSnap.data()
            if (
              Array.isArray(data.coordinates) &&
              data.coordinates.length > 0
            ) {
              const coordinatesArray = data.coordinates.map((c: any) => ({
                lat: parseFloat(c.lat),
                lng: parseFloat(c.lng),
              }))
              setPickZone({ pickzone: [coordinatesArray] })
            } else {
              setPickZone({ pickzone: [] })
            }
          })
        } else {
          setPickZone({ pickzone: [] })
        }
      },
      error => {
        console.error('Error fetching active peak zone:', error)
        setPickZone({ pickzone: [] })
      },
    )

    return () => unsubscribe()
  }, [zoneValue?.id])

  const focusToCurrentLocation = () => {
    if (webViewRef.current) {
      const jsCode = `
                if (window.focusToCurrentLocation) {
                    window.focusToCurrentLocation();
                }
                true;
            `
      webViewRef.current.injectJavaScript(jsCode)
    }
  }

  useImperativeHandle(ref, () => ({
    focusToCurrentLocation,
  }))

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to show it on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        )
        return granted === PermissionsAndroid.RESULTS.GRANTED
      } catch (err) {
        return false
      }
    }
    return true
  }

  useEffect(() => {
    let watchId: null | number = null

    const startWatching = async () => {
      const granted = await requestPermission()
      if (granted) {
        watchId = Geolocation.watchPosition(
          position => {
            if (speedTimeoutRef.current) {
              clearTimeout(speedTimeoutRef.current)
            }

            const {
              latitude,
              longitude,
              heading,
              speed: speedInMetersPerSecond,
            }: any = position.coords
            const currentSpeed: any =
              speedInMetersPerSecond > 0
                ? (speedInMetersPerSecond * 3.6).toFixed(0)
                : 0
            setSpeed(currentSpeed)

            const jsCode = `
                            if (window.updateLocation) {
                                window.updateLocation(${latitude}, ${longitude}, ${heading || 0
              });
                            }
                            true;
                        `
            webViewRef.current?.injectJavaScript(jsCode)
            speedTimeoutRef.current = setTimeout(() => {
              setSpeed(0)
            }, 5000)
          },
          error => {
            Alert.alert(translateData.locationError, error.message)
          },
          {
            enableHighAccuracy: true,
            distanceFilter: 2,
            interval: 4000,
            fastestInterval: 2000,
          },
        )
      } else {
        Alert.alert(
          translateData.permissionDenied,
          translateData.locationPerReq,
        )
      }
    }

    startWatching()

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId)
      }
      if (speedTimeoutRef.current) {
        clearTimeout(speedTimeoutRef.current)
      }
    }
  }, [])

  const showNearby = (placeType: string) => {
    if (webViewRef.current) {
      const jsCode = `
        if (window.showNearbyPlaces) {
          window.showNearbyPlaces("${placeType}");
        }
        true;
      `
      webViewRef.current.injectJavaScript(jsCode)
    }
  }

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
  ]

  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([])

  const handleFABPress = (type: string) => {
    if (selectedTypes.includes(type)) {
      // Deselect → remove markers
      setSelectedTypes(prev => prev.filter(t => t !== type))
      webViewRef.current?.injectJavaScript(`removeNearbyPlaces('${type}');`)
    } else {
      // Select → show markers
      setSelectedTypes(prev => [...prev, type])
      webViewRef.current?.injectJavaScript(`showNearbyPlaces('${type}');`)
    }
  }

  const googleHtmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        html, body, #map { margin:0; padding:0; height:100%; width:100%; }
        #car-icon { transition: transform 0.3s linear; }
        .google-map-icon { width:26px; height:26px; vertical-align:middle; cursor:pointer; }
        .info-content { display:flex; align-items:center; }
        .info-text { margin-left:5px; }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${Google_Map_Key}&libraries=geometry,places"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const darkMode = ${isDark ? 'true' : 'false'};
        const darkStyle = ${JSON.stringify(darkMapStyle)};
        let map, overlay, currentLatLng, geocoder;
        let activeCurve = null, activeInfoWindow = null;

        // --- Initialize marker storage per type ---
        window.placeMarkers = {}; // { type: [OverlayView, ...] }

          // --- SVG Icons ---
            const locationIcon = \`
    <svg width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#a)">
        <path fill="#1A73E8" d="M15.76.432a9.053 9.053 0 0 0-9.706 2.81l4.284 3.597L15.76.432Z"/>
        <path fill="#EA4335" d="M6.056 3.242A9.07 9.07 0 0 0 3.934 9.06c0 1.71.334 3.086.903 4.324l5.502-6.544-4.283-3.597Z"/>
        <path fill="#4285F4" d="M13.008 5.6a3.472 3.472 0 0 1 2.653 5.719s2.73-3.262 5.403-6.426A9.052 9.052 0 0 0 15.759.432l-5.423 6.406A3.524 3.524 0 0 1 13.008 5.6Z"/>
        <path fill="#FBBC04" d="M13.01 12.539a3.472 3.472 0 0 1-3.478-3.478c0-.845.294-1.632.805-2.221l-5.501 6.544c.943 2.083 2.515 3.773 4.126 5.876l6.7-7.96a3.449 3.449 0 0 1-2.653 1.239Z"/>
        <path fill="#34A853" d="M15.543 21.46c3.026-4.737 6.543-6.879 6.543-12.381a9.09 9.09 0 0 0-1.022-4.186L8.961 19.258c.51.669 1.041 1.435 1.552 2.221 1.847 2.85 1.336 4.54 2.515 4.54s.668-1.71 2.515-4.56Z"/>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h26v26H0z"/>
        </clipPath>
      </defs>
    </svg>
    \`;
          const petrolPumpIcon = \`<svg width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="#47A1E5" d="M17.779 20.02c-1.42 0-1.593-1.394-1.593-2.204v-6.299c0-.63.086-.72-.387-.72h-.345v9.313h1.292V22H2.5v-1.89h1.377V.9c0-.495.388-.9.861-.9h9.856c.473 0 .86.405.86.9V3.22c.353.252 2.79 2.016 3.228 2.358.474.36.818.54.818 1.934v10.483c0 .99-.301 2.024-1.721 2.024ZM14.034 2.474c0-.494-.387-.9-.86-.9H6.157c-.473 0-.86.406-.86.9v4.32c0 .494.387.9.86.9h7.015c.474 0 .861-.406.861-.9v-4.32Zm4.218 6.344c0-.72-.473-.63-.904-.63H16.23V5.264l-.775-.468v4.697h1.033c.689 0 .947.09.947 1.17v7.198c0 .72.086.81.387.81.302 0 .43-.225.43-.765V8.818Z"/></svg>\`;

          const evChargingIcon = \`     <Svg width={22} height={22} fill="none">
                  <G fill="#FF8367" clipPath="url(#a)">
                      <Path d="M3.586 4.755h4.123v2.172H3.586V4.755Z" />
                      <Path d="M11.284 1.576a.645.645 0 0 0-.378-.483 13.19 13.19 0 0 0-10.515 0 .645.645 0 0 0-.387.591v19.671c0 .356.289.645.645.645h10c.319 0 .583-.233.634-.538-.005-.035-.005-19.85 0-19.886ZM9 4.11v3.462a.645.645 0 0 1-.645.645H2.942a.645.645 0 0 1-.645-.645V4.11c0-.357.289-.645.645-.645h5.413c.356 0 .645.288.645.645ZM4.356 14.995a.644.644 0 0 1-.563-.958l1.432-2.578a.645.645 0 1 1 1.128.626l-.9 1.62H6.94a.646.646 0 0 1 .559.968l-1.573 2.718a.645.645 0 1 1-1.116-.646l1.012-1.75H4.356ZM21.35 3.217h-.159v-.983a.645.645 0 0 0-1.29 0v.983h-1.166v-.983a.645.645 0 1 0-1.29 0v.983h-.181a.645.645 0 0 0-.645.645v1.727c0 1.259.872 2.318 2.043 2.606v7.691a1.62 1.62 0 0 1-3.24 0v-3.7a2.91 2.91 0 0 0-2.859-2.904v1.29c.87.027 1.57.74 1.57 1.614v3.7a2.91 2.91 0 0 0 5.819 0V8.195a2.688 2.688 0 0 0 2.043-2.606V3.862a.645.645 0 0 0-.645-.645Z" />
                  </G>
                  <Defs>
                      <ClipPath id="a">
                          <Path fill="#fff" d="M0 0h22v22H0z" />
                      </ClipPath>
                  </Defs>
              </Svg>\`;

          const parkingIcon = \` <Svg width={22} height={22} fill="none">
                  <G fill="#FF8367" clipPath="url(#a)">
                      <Path d="M12.102 6.6h-2.2V11h2.2a2.2 2.2 0 0 0 2.2-2.2c0-1.215-.991-2.2-2.2-2.2Z" />
                      <Path d="M11 0C4.934 0 0 4.934 0 11s4.934 11 11 11 11-4.934 11-11S17.066 0 11 0Zm1.103 13.2h-2.2v4.08a.32.32 0 0 1-.32.32h-1.56a.32.32 0 0 1-.32-.32V4.72a.32.32 0 0 1 .32-.32h3.886c2.294 0 4.353 1.672 4.576 3.96.247 2.622-1.813 4.84-4.382 4.84Z" />
                  </G>
                  <Defs>
                      <ClipPath id="a">
                          <Path fill="#fff" d="M0 0h22v22H0z" />
                      </ClipPath>
                  </Defs>
              </Svg>\`;

              const carWashIcon = \` <Svg width={22} height={22} fill="none">
                          <Path
                              fill="#ECB238"
                              d="M21.222 7.706h-1.18c-.37 0-.728.128-1.01.364a1.54 1.54 0 0 0-.534.924l-.597-1.704a2.685 2.685 0 0 0-.597.664l.46 1.304H4.248l1.285-3.652s.012-.03.016-.046a.785.785 0 0 1 .755-.567h7.4l.228-.124c.306-.167.573-.392.794-.652H6.304c-.708 0-1.325.465-1.513 1.137L3.509 8.998a1.568 1.568 0 0 0-1.544-1.289H.786A.783.783 0 0 0 0 8.486V9.65c0 .427.354.776.786.776h1.607a1.538 1.538 0 0 0-.534 1.056l-.244 3.989h18.77l-.244-3.99a1.545 1.545 0 0 0-.534-1.055h1.607c.432 0 .786-.35.786-.776V8.486a.783.783 0 0 0-.786-.777l.008-.003ZM5.109 14.69a1.562 1.562 0 0 1-1.572-1.552c0-.858.703-1.553 1.572-1.553.868 0 1.572.695 1.572 1.553 0 .857-.704 1.552-1.572 1.552Zm8.253-.388H8.646a.392.392 0 0 1-.393-.388c0-.214.177-.388.393-.388h4.716c.216 0 .393.174.393.388a.392.392 0 0 1-.393.388Zm0-1.553H8.646a.392.392 0 0 1-.393-.387c0-.214.177-.389.393-.389h4.716c.216 0 .393.175.393.389a.392.392 0 0 1-.393.388Zm3.537 1.94a1.562 1.562 0 0 1-1.572-1.551c0-.858.703-1.553 1.572-1.553.868 0 1.572.695 1.572 1.553 0 .857-.704 1.552-1.572 1.552ZM.786 17.02v.776c0 .426.354.776.786.776h.393v1.552c0 .427.354.776.786.776h2.358c.432 0 .786-.35.786-.776v-1.552h.786v-2.329H1.572a.783.783 0 0 0-.786.776Zm19.65-.777h-5.11v2.329h.787v1.552c0 .427.354.776.786.776h2.358c.432 0 .786-.35.786-.776v-1.552h.393c.432 0 .786-.35.786-.776v-.777a.783.783 0 0 0-.786-.776Zm-12.969 0h7.074v2.329H7.467v-2.329Z"
                          />
                          <Path
                              fill="#ECB238"
                              d="m13.578 5.943.735.396c.593.318 1.08.799 1.403 1.385l.4.726.402-.726a3.473 3.473 0 0 1 1.403-1.385l.735-.396-.735-.396a3.473 3.473 0 0 1-1.403-1.385l-.401-.726-.401.726a3.471 3.471 0 0 1-1.403 1.385l-.735.396Zm5.616-1.875.28.501.278-.5c.224-.404.562-.738.97-.96l.508-.275-.507-.275a2.439 2.439 0 0 1-.97-.959l-.28-.5-.279.5a2.44 2.44 0 0 1-.97.959l-.508.275.507.276c.41.221.747.555.971.958Z"
                          />
                      </Svg>\`

              const garageIcon = \`    <Svg width={22} height={22} fill="none">
                      <Path
                          fill="#199675"
                          d="M15.4 11H3.497L5.14 7.497a.443.443 0 0 1 .402-.247h9.532A4.64 4.64 0 0 1 14.128 6H5.543c-.695 0-1.326.388-1.609.99L3.226 8.5H.44a.453.453 0 0 0-.311.122.406.406 0 0 0-.129.294v.567c0 .193.07.38.2.529a.89.89 0 0 0 .508.288l1.537.291L.88 13.5v6.667c0 .22.093.433.258.589A.906.906 0 0 0 1.76 21H4.4a.906.906 0 0 0 .622-.244.812.812 0 0 0 .258-.59v-2.5H15.4V11Zm-11 4.583c-.173 0-.345-.032-.505-.095a1.327 1.327 0 0 1-.429-.271 1.248 1.248 0 0 1-.286-.406 1.194 1.194 0 0 1 0-.957c.067-.152.164-.29.287-.406a1.384 1.384 0 0 1 1.867 0c.248.235.387.553.387.885 0 .332-.14.65-.387.884a1.359 1.359 0 0 1-.934.366Zm7.92-.417H8.8a.906.906 0 0 1-.622-.244.812.812 0 0 1-.258-.589c0-.22.093-.433.258-.59A.906.906 0 0 1 8.8 13.5h3.52c.233 0 .457.088.622.244a.812.812 0 0 1 .258.59.812.812 0 0 1-.258.588.906.906 0 0 1-.622.244Zm6.16-10.693 1.32-.625V1.129c0-.091.104-.157.192-.117.6.27 1.108.695 1.463 1.227A3.2 3.2 0 0 1 22 4.017c0 1.23-.712 2.293-1.76 2.87v12.377c0 .442-.185.866-.515 1.179-.33.312-.778.488-1.245.488-.467 0-.914-.176-1.245-.488a1.623 1.623 0 0 1-.515-1.179V6.89c-1.048-.578-1.76-1.64-1.76-2.871 0-1.328.822-2.471 2.008-3.006.088-.04.192.026.192.118V3.85l1.32.624Z"
                      />
                  </Svg>\`


        // --- Custom Car Marker ---
        class CustomMarker extends google.maps.OverlayView {
          constructor(position) { super(); this.position = position; this.div = null; }
          onAdd() {
            this.div = document.createElement("div");
            this.div.style.position = "absolute";
            this.div.innerHTML = '<img id="car-icon" src="${markerIcon}" style="width:50px;height:50px;transform:rotate(0deg);"/>';
            this.getPanes().overlayMouseTarget.appendChild(this.div);
          }
          draw() {
            const projection = this.getProjection();
            const pos = projection.fromLatLngToDivPixel(this.position);
            if(pos && this.div) {
              this.div.style.left = pos.x-25+'px';
              this.div.style.top = pos.y-25+'px';
            }
          }
          onRemove() { if(this.div){ this.div.remove(); this.div=null; } }
          rotate(angle){ if(this.div){ const img=this.div.querySelector("#car-icon"); if(img) img.style.transform=\`rotate(\${angle}deg)\`; } }
          updatePositionSmoothly(newPosition, heading){
            const start=this.position; const end=newPosition; const steps=50; let step=0;
            const deltaLat=(end.lat()-start.lat())/steps;
            const deltaLng=(end.lng()-start.lng())/steps;
            const animate=()=>{
              step++; const lat=start.lat()+deltaLat*step; const lng=start.lng()+deltaLng*step;
              this.position=new google.maps.LatLng(lat,lng); this.draw();
              if(step<steps) requestAnimationFrame(animate);
            };
            animate(); this.rotate(heading);
          }
        }

        // --- Draw curve ---
        function drawCurve(startLatLng, endLatLng){
          if(activeCurve) activeCurve.setMap(null);
          const midLat=(startLatLng.lat()+endLatLng.lat())/2+0.0005;
          const midLng=(startLatLng.lng()+endLatLng.lng())/2+0.0005;
          const curvedPath=[startLatLng,new google.maps.LatLng(midLat,midLng),endLatLng];
          activeCurve=new google.maps.Polyline({path:curvedPath, geodesic:true, strokeColor:"#199675", strokeOpacity:1.0, strokeWeight:2});
          activeCurve.setMap(map);
        }

        // --- Show nearby places per type ---
        window.showNearbyPlaces = function(type) {
          if (!map || !currentLatLng) return;

          // Remove previous markers of this type
          if (window.placeMarkers[type]) {
            window.placeMarkers[type].forEach(m => m.setMap(null));
          }
          window.placeMarkers[type] = [];

          let keyword = '', iconSvg = '';
          if (type === 'petrol') { keyword='petrol pump'; iconSvg=petrolPumpIcon; }
          else if (type === 'ev') { keyword='ev charging station'; iconSvg=evChargingIcon; }
          else if (type === 'parking') { keyword='parking'; iconSvg=parkingIcon; }
          else if (type === 'carwash') { keyword='car wash'; iconSvg=carWashIcon; }
          else if (type === 'garage') { keyword='car garage repair'; iconSvg=garageIcon; }

          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch({ location: currentLatLng, radius:2000, keyword }, (results,status)=>{
            if(status===google.maps.places.PlacesServiceStatus.OK && results.length>0){
              const bounds = new google.maps.LatLngBounds();
              results.forEach(place=>{
                const markerDiv = document.createElement('div');
                markerDiv.innerHTML = iconSvg;
                markerDiv.style.position='absolute';
                markerDiv.style.cursor='pointer';

                const overlay = new google.maps.OverlayView();
                overlay.onAdd = function(){
                  const panes=this.getPanes();
                  panes.overlayMouseTarget.appendChild(markerDiv);
                  markerDiv.addEventListener('click', ()=>{
                    const gMapUrl = \`https://www.google.com/maps/dir/?api=1&destination=\${place.geometry.location.lat()},\${place.geometry.location.lng()}\`;
                    window.open(gMapUrl,'_blank');
                  });
                };
                overlay.draw = function(){
                  const projection=this.getProjection();
                  if(!projection) return;
                  const pos=projection.fromLatLngToDivPixel(place.geometry.location);
                  if(pos){ markerDiv.style.left=pos.x-13+'px'; markerDiv.style.top=pos.y-13+'px'; }
                };
                overlay.onRemove = function(){ if(markerDiv && markerDiv.parentNode) markerDiv.parentNode.removeChild(markerDiv); };
                overlay.setMap(map);

                window.placeMarkers[type].push(overlay);
                bounds.extend(place.geometry.location);
              });
              map.fitBounds(bounds);
            }
          });
        };

        // --- Remove nearby markers per type ---
        window.removeNearbyPlaces = function(type) {
          if(window.placeMarkers[type]){
            window.placeMarkers[type].forEach(m=>m.setMap(null));
            window.placeMarkers[type]=[];
          }
        };

        // --- Initialize Map ---
        function initMap(){
          const initialPosition = { lat: ${DEFAULT_LAT}, lng: ${DEFAULT_LNG} };
          currentLatLng = new google.maps.LatLng(initialPosition.lat, initialPosition.lng);
          map = new google.maps.Map(document.getElementById("map"), {
            center: currentLatLng,
            zoom: 17,
            disableDefaultUI: true,
            styles: darkMode ? darkStyle : null
          });

          overlay = new CustomMarker(currentLatLng);
          overlay.setMap(map);
          geocoder = new google.maps.Geocoder();




          // Main Zone Polygon
          const zoneCoords = ${JSON.stringify(zoneValue?.locations || [])};
          const mainPolygonPath = zoneCoords.map(c => ({ lat: c.lat, lng: c.lng }));
          const zonePolygon = new google.maps.Polygon({
            paths: mainPolygonPath,
            strokeColor: "#000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillOpacity: 0
          });
          zonePolygon.setMap(map);

       
            // Pick Zones
          const pickZone = ${JSON.stringify(pickZone)};
          pickZone.pickzone.forEach(zone => {
            const polygonPath = zone.map(c => ({ lat: c.lat, lng: c.lng }));
            const pickPolygon = new google.maps.Polygon({
              paths: polygonPath,
              strokeColor: "#F33737",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#F33737",
              fillOpacity: 0.2
            });
            pickPolygon.setMap(map);

            pickPolygon.addListener('click', () => {
              if (activeInfoWindow) activeInfoWindow.close();
              if (activeCurve) activeCurve.setMap(null);

              let nearest = polygonPath[0];
              let minDist = google.maps.geometry.spherical.computeDistanceBetween(
                currentLatLng,
                new google.maps.LatLng(nearest.lat, nearest.lng)
              );
              polygonPath.forEach(v => {
                const dist = google.maps.geometry.spherical.computeDistanceBetween(
                  currentLatLng,
                  new google.maps.LatLng(v.lat, v.lng)
                );
                if (dist < minDist) {
                  minDist = dist;
                  nearest = v;
                }
              });

              drawCurve(currentLatLng, new google.maps.LatLng(nearest.lat, nearest.lng));

              geocoder.geocode({ location: new google.maps.LatLng(nearest.lat, nearest.lng) }, (results, status) => {
                if (status === "OK" && results[0]) {
                  const gMapUrl = \`https://www.google.com/maps/dir/?api=1&destination=\${nearest.lat},\${nearest.lng}\`;
                  activeInfoWindow = new google.maps.InfoWindow({
                    content: \`
                      <div class="info-content">
                        <div class="info-text">
                          Nearest pick zone address:<br>
                          <b>\${results[0].formatted_address}</b>
                        </div>
                      </div>
                                            <div onclick="window.open('\${gMapUrl}', '_blank')">\${locationIcon}</div>

                    \`,
                    position: new google.maps.LatLng(nearest.lat, nearest.lng)
                  });

                  google.maps.event.addListener(activeInfoWindow, 'closeclick', () => {
                    if (activeCurve) {
                      activeCurve.setMap(null);
                      activeCurve = null;
                    }
                    activeInfoWindow = null;
                  });

                  activeInfoWindow.open(map);
                }
              });
            });
          });

          
        }

        // --- Update location ---
        window.updateLocation = function(lat,lng,heading){
          const newLatLng=new google.maps.LatLng(lat,lng);
          if(map && overlay){
            overlay.updatePositionSmoothly(newLatLng, heading||0);
            map.panTo(newLatLng);
            currentLatLng=newLatLng;
          }
        };

        window.focusToCurrentLocation=function(){ if(map && currentLatLng){ map.panTo(currentLatLng); map.setZoom(17); } };


        window.onload = initMap;
      </script>
    </body>
  </html>
  `

  const osmHtmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { margin:0; padding:0; height:100%; width:100%; }
  #car-icon { width:50px; height:50px; transition: transform 0.3s linear; }
  .info-popup { font-size:14px; line-height:1.4; }
  ${isDark
      ? `.leaflet-tile-pane { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }`
      : ''
    }
</style>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
</head>
<body>
<div id="map"></div>
<script>
let map, carMarker, currentLatLng;
let pickZones = ${JSON.stringify(pickZone.pickzone || [])};
let activeCurve = null;
let nearbyMarkers = {};

// Initialize Map
function initMap() {
  const initialPosition = [${DEFAULT_LAT}, ${DEFAULT_LNG}];
  currentLatLng = L.latLng(initialPosition[0], initialPosition[1]);

  map = L.map('map', { center: currentLatLng, zoom: 17, zoomControl:false, attributionControl:false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // Car Marker
  const carIcon = L.divIcon({ html: '<img id="car-icon" src="${markerIcon}"/>', iconSize:[50,50], iconAnchor:[25,25], className:'' });
  carMarker = L.marker(currentLatLng, { icon: carIcon }).addTo(map);

  // Draw Pick Zones
  pickZones.forEach(zoneCoords => {
    const latlngs = zoneCoords.map(c => [c.lat, c.lng]);
    const polygon = L.polygon(latlngs, { color:'#F33737', fillColor:'#F33737', fillOpacity:0.2, weight:2 }).addTo(map);

    polygon.on('click', () => {
      if (activeCurve) { map.removeLayer(activeCurve); activeCurve = null; }

      // Find nearest point
      let nearest = latlngs[0];
      let minDist = currentLatLng.distanceTo(latlngs[0]);
      latlngs.forEach(p => { const d = currentLatLng.distanceTo(p); if(d < minDist){ minDist=d; nearest=p; } });

      // Draw curve
      activeCurve = L.polyline([currentLatLng, nearest], { color:'#199675', weight:2 }).addTo(map);

      // Show popup
      fetch(\`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=\${nearest[0]}&lon=\${nearest[1]}\`)
        .then(res => res.json())
        .then(data => {
          const popupContent = \`
            <div class="info-popup">
              Nearest pick zone address:<br><b>\${data.display_name || 'Unknown'}</b>
            </div>
            <div onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=\${nearest[0]},\${nearest[1]}','_blank')">
              <img src="${markerIcon}" width="26" height="26"/>
            </div>
          \`;
          L.popup({ closeOnClick:true, autoClose:true })
            .setLatLng(nearest)
            .setContent(popupContent)
            .openOn(map);
        });
    });
  });
}

// Animate Car Marker
function updatePositionSmoothly(newLat, newLng, heading) {
  const newLatLng = L.latLng(newLat, newLng);
  if (!carMarker) return;

  const startLatLng = carMarker.getLatLng();
  const steps = 50;
  let step = 0;
  const deltaLat = (newLatLng.lat - startLatLng.lat)/steps;
  const deltaLng = (newLatLng.lng - startLatLng.lng)/steps;

  function animate() {
    step++;
    const lat = startLatLng.lat + deltaLat*step;
    const lng = startLatLng.lng + deltaLng*step;
    carMarker.setLatLng([lat,lng]);
    const iconEl = document.getElementById('car-icon');
    if(iconEl) iconEl.style.transform = \`rotate(\${heading||0}deg)\`;
    if(step < steps) requestAnimationFrame(animate);
  }
  animate();
  currentLatLng = newLatLng;
  map.panTo(newLatLng);
}

// --- Fetch Nearby Places using Overpass API ---
function showNearbyPlaces(type) {
  if(!map || !currentLatLng) return;

  // Remove existing markers of this type
  if(nearbyMarkers[type]){
    nearbyMarkers[type].forEach(m => map.removeLayer(m));
    nearbyMarkers[type] = [];
  } else {
    nearbyMarkers[type] = [];
  }

  let queryTag = '';
  if(type==='petrol') queryTag='amenity=fuel';
  else if(type==='ev') queryTag='amenity=charging_station';
  else if(type==='parking') queryTag='amenity=parking';
  else if(type==='carwash') queryTag='shop=car_wash';
  else if(type==='garage') queryTag='shop=car_repair';

  // Overpass API query around 2km radius
  const lat = currentLatLng.lat;
  const lng = currentLatLng.lng;
  const overpassQuery = \`https://overpass-api.de/api/interpreter?data=[out:json];node[\${queryTag}](around:2000,\${lat},\${lng});out;\`;

  fetch(overpassQuery)
    .then(res => res.json())
    .then(data => {
      if(!data.elements) return;
      data.elements.forEach(el => {
        const marker = L.marker([el.lat, el.lon], {
          icon: L.divIcon({
            html: '<div style="width:26px;height:26px;background:#47A1E5;border-radius:50%;"></div>',
            iconSize:[26,26],
            iconAnchor:[13,13]
          })
        }).addTo(map);

        marker.on('click', () => {
          const gMapUrl = \`https://www.google.com/maps/dir/?api=1&destination=\${el.lat},\${el.lon}\`;
          window.open(gMapUrl,'_blank');
        });

        nearbyMarkers[type].push(marker);
      });
    });
}

// --- Remove Nearby Places ---
function removeNearbyPlaces(type){
  if(nearbyMarkers[type]){
    nearbyMarkers[type].forEach(m => map.removeLayer(m));
    nearbyMarkers[type] = [];
  }
}

// Expose functions
window.updateLocation = updatePositionSmoothly;
window.focusToCurrentLocation = () => { if(map && currentLatLng) map.panTo(currentLatLng); }
window.showNearbyPlaces = showNearbyPlaces;
window.removeNearbyPlaces = removeNearbyPlaces;

window.onload = initMap;
</script>
</body>
</html>
`

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{
          html: mapType === 'osm' ? osmHtmlContent : googleHtmlContent,
        }}
        javaScriptEnabled
        domStorageEnabled
        style={{ flex: 1 }}
      />
      {!isBottomSheetOpen &&
        !isBottomSheetOfflineOpen &&
        !isBottomSheetSOSOpen &&
        !isBottomSheetCancelOpen && (
          <View>
            <FAB
              icon={fabOpen ? Icons.CloseAssist : Icons.OpenAssist}
              style={{
                position: 'absolute',
                left: windowHeight(2),
                bottom: windowHeight(26.5),
                height: windowHeight(7),
                width: windowHeight(7),
                borderRadius: windowHeight(7),
                backgroundColor: isDark
                  ? appColors.darkThemeSub
                  : appColors.white,
                borderColor: isDark ? appColors.darkborder : appColors.loader,
                justifyContent: 'center',
                borderWidth: windowWidth(0.45),
                paddingTop: windowHeight(0.2),
                elevation: 1,
                zIndex: 9999,
              }}
              onPress={() => setFabOpen(!fabOpen)}
            />
          </View>)}

      {fabOpen && (
        <>
          <FAB
            icon={Icons.PetrolPump}
            size="small"
            style={{
              position: 'absolute',
              left: windowHeight(3),
              bottom: windowHeight(34),
              backgroundColor: selectedTypes.includes('petrol')
                ? '#D6E7FB'
                : isDark
                  ? appColors.bgDark
                  : appColors.white,
              borderRadius: windowHeight(20),
            }}
            onPress={() => handleFABPress('petrol')}
          />
          <FAB
            icon={Icons.CarCharging}
            size="small"
            style={{
              position: 'absolute',
              left: windowHeight(3),
              bottom: windowHeight(40),
              backgroundColor: selectedTypes.includes('ev')
                ? '#FFE6E0'
                : isDark
                  ? appColors.bgDark
                  : appColors.white,
              borderRadius: windowHeight(20),
            }}
            onPress={() => handleFABPress('ev')}
          />
          <FAB
            icon={Icons.CarParking}
            size="small"
            style={{
              position: 'absolute',
              left: windowHeight(3),
              bottom: windowHeight(46),
              backgroundColor: selectedTypes.includes('parking')
                ? '#FFE6E0'
                : isDark
                  ? appColors.bgDark
                  : appColors.white,
              borderRadius: windowHeight(20),
            }}
            onPress={() => handleFABPress('parking')}
          />
          <FAB
            icon={Icons.CarWash}
            size="small"
            style={{
              position: 'absolute',
              left: windowHeight(3),
              bottom: windowHeight(52),
              backgroundColor: selectedTypes.includes('carwash')
                ? '#FFF8E0'
                : isDark
                  ? appColors.bgDark
                  : appColors.white,
              borderRadius: windowHeight(20),
            }}
            onPress={() => handleFABPress('carwash')}
          />
          <FAB
            icon={Icons.CarGarage}
            size="small"
            style={{
              position: 'absolute',
              left: windowHeight(3),
              bottom: windowHeight(58),
              backgroundColor: selectedTypes.includes('garage')
                ? '#CCF5EB'
                : isDark
                  ? appColors.bgDark
                  : appColors.white,
              borderRadius: windowHeight(20),
            }}
            onPress={() => handleFABPress('garage')}
          />
        </>
      )}

      {selfDriver?.role != 'fleet_manager' && (
        <View
          style={[
            styles.speedContainer,
            {
              alignSelf: rtl ? 'flex-end' : 'flex-start',
              backgroundColor: isDark
                ? appColors.darkThemeSub
                : appColors.white,
              borderColor: isDark
                ? appColors.darkBorderBlack
                : appColors.border,
              position: rtl ? 'relative' : 'absolute',
              left: rtl ? windowHeight(-2) : windowHeight(2),
            },
          ]}
        >
          <Text
            style={[
              styles.speedText,
              { color: isDark ? appColors.darkText : appColors.primaryFont },
            ]}
          >
            {speed}
          </Text>
          <Text
            style={[
              styles.speedUnitText,
              { color: isDark ? appColors.darkText : appColors.primaryFont },
            ]}
          >
            km/h
          </Text>
        </View>
      )}
    </View>
  )
})

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
    borderWidth: 1,
  },
  speedText: {
    fontSize: 24,
    fontFamily: appFonts.medium,
    color: appColors.primaryFont,
  },
  speedUnitText: {
    fontSize: fontSizes.FONT2HALF,
    color: appColors.primaryFont,
  },
})
