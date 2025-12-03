@push('scripts')
    <!-- Firebase SDK -->
    <script src="{{ asset('js/firebase/firebase-app-compat.js') }}"></script>
    <script src="{{ asset('js/firebase/firebase-firestore-compat.js') }}"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key={{ env('GOOGLE_MAP_API_KEY') }}&libraries=geometry"></script>
    <script>
        const firebaseConfig = {
            apiKey: "{{ env('FIREBASE_API_KEY') }}",
            authDomain: "{{ env('FIREBASE_AUTH_DOMAIN') }}",
            projectId: "{{ env('FIREBASE_PROJECT_ID') }}",
            storageBucket: "{{ env('FIREBASE_STORAGE_BUCKET') }}",
            messagingSenderId: "{{ env('FIREBASE_MESSAGING_SENDER_ID') }}",
            appId: "{{ env('FIREBASE_APP_ID') }}",
            measurementId: "{{ env('FIREBASE_MEASUREMENT_ID') }}"
        };

        firebase.initializeApp(firebaseConfig);
        const db = firebase.firestore();
    </script>

    <script>
        (function($) {
            "use strict";
            let map;
            let overlays = [];
            let infoWindow = new google.maps.InfoWindow();
            const defaultImage = '{{ asset('images/user.png') }}';
            const defaultVehicleImage = '{{ asset('images/Frame.png') }}';
            let vehicleTypesFilter = [];
            let zoneFilter = '';
            let previousPositions = {};
            let movingOverlays = {};
            let allDrivers = {};
            let activeRideListeners = {};
            let vehicleTypes = @json($vehicleTypes ?? []);

            function debounce(func, wait) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            }

            function initialize() {
                const mapOptions = {
                    zoom: 13,
                    center: new google.maps.LatLng(21.20764938296402, 72.77381805168456),
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    overviewMapControl: true
                };

                map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                listenToDriverLocations();
                updateFilters();
            }

            function VehicleOverlay(position, image, heading, map, driverId, vehicleType, zoneId, contentString) {
                this.position = position;
                this.image = image || defaultVehicleImage;
                this.heading = heading || 0;
                this.map = map;
                this.driverId = driverId;
                this.vehicleType = vehicleType ? String(vehicleType) : '';
                this.zoneId = zoneId ? String(zoneId) : '';
                this.contentString = contentString;
                this.div = null;
                this.setMap(map);
            }

            VehicleOverlay.prototype = new google.maps.OverlayView();

            VehicleOverlay.prototype.onAdd = function() {
                const div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.width = '25px';
                div.style.height = '50px';
                div.style.cursor = 'pointer';

                const img = document.createElement('img');
                img.src = this.image;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.transform = `rotate(${this.heading}deg)`;

                div.appendChild(img);
                this.div = div;
                const panes = this.getPanes();
                panes.overlayMouseTarget.appendChild(div);
                const overlay = this;
                google.maps.event.addDomListener(div, 'click', function() {
                    infoWindow.setContent(overlay.contentString);
                    infoWindow.setPosition(overlay.position);
                    infoWindow.open(overlay.map);
                });
            };

            VehicleOverlay.prototype.draw = function() {
                const overlayProjection = this.getProjection();
                const position = overlayProjection.fromLatLngToDivPixel(this.position);

                const div = this.div;
                div.style.left = (position.x - 20) + 'px';
                div.style.top = (position.y - 40) + 'px';
                div.firstChild.style.transform = `rotate(${this.heading}deg)`;
            };

            VehicleOverlay.prototype.onRemove = function() {
                if (this.div) {
                    this.div.parentNode.removeChild(this.div);
                    this.div = null;
                }
            };

            VehicleOverlay.prototype.updatePosition = function(position, heading) {
                this.position = position;
                this.heading = heading || this.heading;
                if (this.div) {
                    this.draw();
                }
            };

            function smoothMoveOverlay(overlay, driverId, fromLatLng, toLatLng, duration = 2000) {
                if (movingOverlays[driverId]) return;
                movingOverlays[driverId] = true;

                const startTime = performance.now();
                const startLat = fromLatLng.lat();
                const startLng = fromLatLng.lng();
                const deltaLat = toLatLng.lat() - startLat;
                const deltaLng = toLatLng.lng() - startLng;
                const heading = google.maps.geometry.spherical.computeHeading(fromLatLng, toLatLng);

                function animate(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const newLat = startLat + deltaLat * progress;
                    const newLng = startLng + deltaLng * progress;
                    const newLatLng = new google.maps.LatLng(newLat, newLng);
                    overlay.updatePosition(newLatLng, heading);
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        movingOverlays[driverId] = false;
                    }
                }

                requestAnimationFrame(animate);
            }

            function createDriverElement(driver) {
                const driverId = driver.id;
                const isOnline = driver.is_online === true || driver.is_online === '1';
                const isOnRide = driver.is_on_ride === true || driver.is_on_ride === '1';

                let statusClass = 'driver-deactive';
                let statusTitle = 'Offline';
                let driverStatus = 'offline';

                if (isOnline) {
                    if (isOnRide) {
                        statusClass = 'driver-not-assign';
                        statusTitle = 'On Ride';
                        driverStatus = 'on_ride';
                    } else {
                        statusClass = 'driver-active';
                        statusTitle = 'Online';
                        driverStatus = 'online';
                    }
                }

                const rating = driver.rating_count > 0 ? (driver.rating / driver.rating_count).toFixed(1) : 'Unrated';
                const vehicleImage = driver.vehicle_map_icon_url || defaultVehicleImage;
                const profileImage = driver.profile_image_url || defaultImage;

                return `
                <div class="accordion-item driver-item" id="driver-accordion-item-${driverId}"
                    data-driver-id="${driverId}"
                    data-vehicle-type="${driver.vehicle_type_id || ''}"
                    data-zone-id="${driver.zone_id || ''}"
                    data-status="${driverStatus}">
                    <h4 class="accordion-header">
                        <div class="position-relative">
                            <img src="${profileImage}" alt="" class="img">
                            <span class="driver_status_${driverId} ${statusClass}" title="${statusTitle}"></span>
                        </div>
                        <div>
                            <span class="name">${driver.driver_name || 'Unknown Driver'}</span>
                            <div class="rate-box">
                                <i class="ri-star-fill"></i>
                                ${rating}
                            </div>
                        </div>
                        <button type="button"
                            class="btn btn-solid btn-sm ms-auto view-location-btn"
                            data-driver-id="${driverId}"><i class="ri-focus-3-line d-md-none"></i> <span class="d-md-inline d-none">View Location</span></button>
                        <button class="accordion-button" data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapse${driverId}">
                            <i class="ri-arrow-down-s-line"></i>
                        </button>
                    </h4>
                    <div id="panelsStayOpen-collapse${driverId}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            ${isOnRide ? createRideDetails(driver) : createNoRideDetails()}
                        </div>
                    </div>
                </div>
            `;
            }

            function createRideDetails(driver) {
                const riderName = driver.rider_name || 'N/A';
                console.log(riderName);
                
                const riderEmail = driver.rider_email || 'N/A';
                const serviceName = driver.service_name || 'N/A';
                const serviceCategoryName = driver.service_category_name || 'N/A';
                const vehicleName = driver.vehicle_name || 'N/A';
                const zoneName = driver.zone_name || 'N/A';
                const paymentStatus = driver.payment_status || 'Pending';
                const paymentMethod = driver.payment_method || 'COD';
                const paymentLogo = driver.payment_logo || '{{ asset('images/payment/cod.png') }}';
                const distance = driver.distance || '0';
                const distanceUnit = driver.distance_unit || 'km';
                const rideDateTime = driver.ride_date_time ? new Date(driver.ride_date_time).toLocaleString() :
                    new Date().toLocaleString();
                
                return `
                <ul class="details-list">
                    <li><span class="bg-light-primary">#${driver.ride_number || 'N/A'}</span></li>
                    <li><span class="vehicle-number">${driver.plate_number || 'N/A'}</span></li>
                    <li><span class="badge badge-progress">${driver.ride_status || 'In Progress'}</span></li>
                </ul>
                <ul class="location-driver-details">
                    <li>
                        <div class="driver-main-box">
                            <h5>Rider Details:</h5>
                            <div class="name-box">
                                <img src="${driver.rider_image || defaultImage}" alt="" class="img">
                                <div>
                                    <h5 class="name">${riderName}</h5>
                                    <h6>${riderEmail}</h6>
                                </div>
                            </div>
                        </div>
                    </li>
                    <li>Service <span>${serviceName}</span></li>
                    <li>Service Category <span>${serviceCategoryName}</span></li>
                    <li class="detail-item">
                        <h5>Vehicle Type</h5>
                        <div class="vehicle-box">
                            <img src="${driver.vehicle_image || defaultVehicleImage}" alt="">
                            <span>${vehicleName}</span>
                        </div>
                    </li>
                    <li class="ride-main">
                        <h5>Payment Status:</h5>
                        <span class="badge badge-pending text-white">${paymentStatus}</span>
                    </li>
                    <li class="detail-item">
                        <h5>Payment Method</h5>
                        <span>
                            <img src="${paymentLogo}"
                                class="img-fluid cash-img" alt="${paymentMethod}">
                        </span>
                    </li>
                    <li>Distance <span>${distance} ${distanceUnit}</span></li>
                    <li class="detail-item">
                        <h5>Date Time</h5>
                        <span>${rideDateTime}</span>
                    </li>
                </ul>
                <div class="button-details-box">
                    <a href="{{ route('admin.ride.details', $ride->id) }}"  class="btn">
                        View More
                    </a>
                </div>
            `;
            }

            function createNoRideDetails() {
                return `<div class="no-ride-data"><p>No rides yet</p></div>`;
            }

            function updateDriverList(drivers, activeTab = 'all') {
                const tabPanes = {
                    'all': document.querySelector('#all-pane .accordion'),
                    'onride': document.querySelector('#onride-pane .accordion'),
                    'online': document.querySelector('#online-pane .accordion'),
                    'offline': document.querySelector('#offline-pane .accordion')
                };

                Object.values(tabPanes).forEach(pane => {
                    if (pane) {
                        while (pane.firstChild) {
                            pane.removeChild(pane.firstChild);
                        }
                    }
                });

                let driverCounts = {
                    'all': 0,
                    'onride': 0,
                    'online': 0,
                    'offline': 0
                };

                const addedDriverIds = new Set();

                Object.entries(drivers).forEach(([driverId, driver]) => {
                    if (!driver.is_verified || driver.is_verified === '0') return;

                    if (addedDriverIds.has(driverId)) {
                        console.warn(
                            `Duplicate driver ID found in render: ${driverId}. Skipping duplicate entry.`);
                        return;
                    }

                    addedDriverIds.add(driverId);

                    const isOnline = driver.is_online === true || driver.is_online === '1';
                    const isOnRide = driver.is_on_ride === true || driver.is_on_ride === '1';

                    let driverStatus = 'offline';
                    let showInTab = 'offline';

                    if (isOnline) {
                        if (isOnRide) {
                            driverStatus = 'on_ride';
                            showInTab = 'onride';
                        } else {
                            driverStatus = 'online';
                            showInTab = 'online';
                        }
                    }

                    const driverElement = createDriverElement(driver);

                    if (tabPanes.all) {
                        const existingDriver = tabPanes.all.querySelector(`#driver-accordion-item-${driverId}`);
                        if (!existingDriver) {
                            tabPanes.all.insertAdjacentHTML('beforeend', driverElement);
                            driverCounts.all++;
                        }
                    }

                    if (tabPanes[showInTab]) {
                        const existingDriver = tabPanes[showInTab].querySelector(
                            `#driver-accordion-item-${driverId}`);
                        if (!existingDriver) {
                            tabPanes[showInTab].insertAdjacentHTML('beforeend', driverElement);
                            driverCounts[showInTab]++;
                        }
                    }
                });

                document.getElementById('all-count').textContent = `(${driverCounts.all})`;
                document.getElementById('onride-count').textContent = `(${driverCounts.onride})`;
                document.getElementById('online-count').textContent = `(${driverCounts.online})`;
                document.getElementById('offline-count').textContent = `(${driverCounts.offline})`;

                const hasDrivers = driverCounts.all > 0;
                document.getElementById('no-data-message').style.display = hasDrivers ? 'none' : 'block';
            }

            const debouncedUpdateDriverList = debounce(updateDriverList, 300);

            function addOverlays(drivers, filteredVehicleTypes = [], filterZone = '', activeTab = 'all') {
                overlays.forEach(overlay => overlay.setMap(null));
                overlays = [];

                Object.values(drivers).forEach(driver => {
                    if (!driver.is_verified || driver.is_verified === '0') return;

                    const driverId = driver.id;
                    const vehicleType = driver.vehicle_type_id ? String(driver.vehicle_type_id) : '';
                    const zoneId = driver.zone_id ? String(driver.zone_id) : '';
                    const lat = parseFloat(driver.lat);
                    const lng = parseFloat(driver.lng);
                    if (isNaN(lat) || isNaN(lng)) return;
                    if (filteredVehicleTypes.length > 0 && !filteredVehicleTypes.includes(vehicleType)) {
                        return;
                    }

                    if (filterZone && zoneId !== filterZone) {
                        return;
                    }

                    const isOnline = driver.is_online === true || driver.is_online === '1';
                    const isOnRide = driver.is_on_ride === true || driver.is_on_ride === '1';

                    let driverStatus = 'offline';
                    if (isOnline) {
                        driverStatus = isOnRide ? 'on_ride' : 'online';
                    }

                    let statusMatch = true;
                    if (activeTab === 'onride') {
                        statusMatch = driverStatus === 'on_ride';
                    } else if (activeTab === 'online') {
                        statusMatch = driverStatus === 'online';
                    } else if (activeTab === 'offline') {
                        statusMatch = driverStatus === 'offline';
                    }

                    if (!statusMatch) return;

                    const contentString = `
                    <div class="driver-location-box">
                        <div class="vehicle-image">
                            <img src="${driver.profile_image_url || defaultImage}" class="img-fluid" />
                        </div>
                        <h5><span>${driver.driver_name || 'Unknown Driver'}</span></h5>
                        <ul class="location-list">
                            <li class="rate-box">Rating: <span><i class="ri-star-fill"></i> ${driver.rating_count > 0 ? (driver.rating / driver.rating_count).toFixed(1) : 'Unrated'}</span></li>
                            <li>Vehicle: <span>${driver.vehicle_name || 'N/A'}</span></li>
                            <li>Phone: <span>${driver.phone || 'N/A'}</span></li>
                            <li>Model: <span>${driver.model || 'N/A'}</span></li>
                            <li>Plate Number: <span>${driver.plate_number || 'N/A'}</span></li>
                        </ul>
                    </div>
                `;

                    const newLatLng = new google.maps.LatLng(lat, lng);
                    let heading = 0;

                    if (previousPositions[driverId]) {
                        const oldLatLng = previousPositions[driverId];
                        heading = google.maps.geometry.spherical.computeHeading(oldLatLng, newLatLng);
                    }

                    let overlay = new VehicleOverlay(
                        newLatLng,
                        driver.vehicle_map_icon_url || defaultVehicleImage,
                        heading,
                        map,
                        driverId,
                        vehicleType,
                        zoneId,
                        contentString
                    );

                    if (previousPositions[driverId]) {
                        const oldLatLng = previousPositions[driverId];
                        smoothMoveOverlay(overlay, driverId, oldLatLng, newLatLng);
                    }

                    previousPositions[driverId] = newLatLng;
                    overlays.push(overlay);
                });
            }

            function mergeRideData(driverData, rideData) {
                return {
                    ...driverData,
                    ride_status: rideData.ride_status || 'In Progress',
                    rider_name: rideData.rider?.name || 'N/A',
                    rider_email: rideData.rider?.email || 'N/A',
                    rider_image: rideData.rider?.profile_image_url || defaultImage,
                    service_name: rideData.service?.name || 'N/A',
                    service_category_name: rideData.service_category?.name || 'N/A',
                    vehicle_image: rideData.vehicle_type?.vehicle_image_url || defaultVehicleImage,
                    vehicle_name: rideData.vehicle_type?.name,
                    payment_status: rideData.payment_status || 'Pending',
                    plate_number: rideData.plate_number,
                    ride_status: rideData.ride_status?.name,
                    payment_method: rideData.payment_method || 'COD',
                    payment_logo: rideData.payment_logo || '{{ asset('images/payment/cod.png') }}',
                    distance: rideData.distance || '0',
                    distance_unit: rideData.distance_unit || 'km',
                    ride_date_time: rideData.start_time || null
                };
            }

            function updateDriverWithRideData(driverId, rideData) {
                if (allDrivers[driverId]) {
                    allDrivers[driverId] = mergeRideData(allDrivers[driverId], rideData);
                    debouncedUpdateDriverList(allDrivers);
                    updateFilters();
                }
            }

            function listenToDriverLocations() {
                db.collection("driverTrack")
                    .onSnapshot(async (snapshot) => {
                        const updates = [];
                        for (const change of snapshot.docChanges()) {
                            const driverId = change.doc.id;
                            const data = change.doc.data();

                            if (!data.is_verified || data.is_verified === '0') {
                                if (allDrivers[driverId]) {
                                    delete allDrivers[driverId];
                                }
                                // Clean up ride listener if exists
                                if (activeRideListeners[driverId]) {
                                    activeRideListeners[driverId]();
                                    delete activeRideListeners[driverId];
                                }
                                continue;
                            }

                            let driverData = {
                                id: driverId,
                                driver_name: data.driver_name,
                                lat: data.lat,
                                lng: data.lng,
                                is_online: data.is_online,
                                is_on_ride: data.is_on_ride,
                                is_verified: data.is_verified,
                                model: data.model,
                                plate_number: data.plate_number,
                                rating: data.rating || 0,
                                rating_count: data.rating_count || 0,
                                review_count: data.review_count || 0,
                                vehicle_map_icon_url: data.vehicle_map_icon_url,
                                vehicle_model: data.vehicle_model,
                                vehicle_type_id: data.vehicle_type_id,
                                profile_image_url: data.profile_image_url || defaultImage,
                                phone: data.phone || 'N/A',
                                vehicle_name: data.vehicle_name || 'N/A',
                                ride_number: data.ride_number || null
                            };

                            // Handle ride data
                            if (data.is_on_ride && data.ride_number) {
                                const rideId = data.ride_number.startsWith('1000') ? data.ride_number.substring(
                                    4) : data.ride_number;

                                // Clean up previous listener if exists
                                if (activeRideListeners[driverId]) {
                                    activeRideListeners[driverId]();
                                }

                                // Set up new listener for this ride
                                activeRideListeners[driverId] = db.collection("rides").doc(rideId)
                                    .onSnapshot(async (rideDoc) => {
                                        if (rideDoc.exists) {
                                            const rideData = rideDoc.data();
                                            updateDriverWithRideData(driverId, rideData);
                                        }
                                    });

                                // Also get initial ride data
                                const rideDoc = await db.collection("rides").doc(rideId).get();
                                if (rideDoc.exists) {
                                    const rideData = rideDoc.data();
                                    driverData = mergeRideData(driverData, rideData);
                                }
                            } else {
                                // Clean up ride listener if driver is no longer on ride
                                if (activeRideListeners[driverId]) {
                                    activeRideListeners[driverId]();
                                    delete activeRideListeners[driverId];
                                }
                            }

                            if (change.type === "added" || change.type === "modified") {
                                allDrivers[driverId] = driverData;
                                updates.push(driverData);
                            } else if (change.type === "removed") {
                                delete allDrivers[driverId];
                                if (activeRideListeners[driverId]) {
                                    activeRideListeners[driverId]();
                                    delete activeRideListeners[driverId];
                                }
                            }
                        }

                        debouncedUpdateDriverList(allDrivers);
                        updateFilters();
                    }, (error) => {
                        console.error("Error listening to Firestore:", error);
                    });
            }

            function updateFilters() {
                vehicleTypesFilter = [];
                document.querySelectorAll('.vehicle-filter:checked').forEach((input) => {
                    vehicleTypesFilter.push(input.value.trim());
                });

                zoneFilter = document.querySelector('#zone_id')?.value?.trim() || '';
                const activeTab = document.querySelector('.nav-link.active')?.id?.replace('-tab', '') || 'all';

                const drivers = document.querySelectorAll('.driver-item');
                let foundDriver = false;

                drivers.forEach(driverItem => {
                    const driverVehicleType = driverItem.getAttribute('data-vehicle-type')?.trim() || '';
                    const driverZoneId = driverItem.getAttribute('data-zone-id')?.trim() || '';
                    const driverStatus = driverItem.getAttribute('data-status')?.trim();

                    let statusMatch = true;
                    if (activeTab === 'onride') {
                        statusMatch = driverStatus === 'on_ride';
                    } else if (activeTab === 'online') {
                        statusMatch = driverStatus === 'online';
                    } else if (activeTab === 'offline') {
                        statusMatch = driverStatus === 'offline';
                    }

                    const vehicleTypeMatch = vehicleTypesFilter.length === 0 || vehicleTypesFilter.includes(
                        driverVehicleType);
                    const zoneMatch = !zoneFilter || driverZoneId === zoneFilter;

                    if (statusMatch && vehicleTypeMatch && zoneMatch) {
                        driverItem.style.display = 'block';
                        foundDriver = true;
                    } else {
                        driverItem.style.display = 'none';
                    }
                });

                document.getElementById('no-data-message').style.display = foundDriver ? 'none' : '';
                addOverlays(allDrivers, vehicleTypesFilter, zoneFilter, activeTab);
            }

            window.addEventListener('beforeunload', function() {
                Object.values(activeRideListeners).forEach(unsubscribe => unsubscribe());
            });

            document.addEventListener('DOMContentLoaded', () => {
                initialize();

            document.querySelector('#zone_id')?.addEventListener('change', updateFilters);

            document.querySelectorAll('.nav-link').forEach(tab => {
                tab.addEventListener('shown.bs.tab', updateFilters);
            });

            document.querySelectorAll('.vehicle-filter').forEach(checkbox => {
                checkbox.addEventListener('change', updateFilters);
            });

            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('view-location-btn') || e.target.closest('.view-location-btn')) {
                    const driverId = e.target.dataset.driverId || e.target.closest('.view-location-btn').dataset.driverId;
                    const driver = allDrivers[driverId];
                    if (driver && driver.lat && driver.lng) {
                        const position = new google.maps.LatLng(driver.lat, driver.lng);
                        map.panTo(position);
                        map.setZoom(15);
                        $('.left-location-box.custom-scrollbar').removeClass('show');
                    }
                }
            });

            updateFilters();
        });

        $('.location-box.custom-scrollbar').on('click', function() {
            $('.left-location-box.custom-scrollbar').addClass('show');
        });

        })(jQuery);
    </script>
@endpush
