/**
 * Google Maps implementation of the MapProvider interface
 * Provides real-time driver tracking with smooth animations
 */
class GoogleMapsProvider extends MapProvider {
    constructor() {
        super();
        this.directionsService = null;
        this.directionsRenderer = null;
        this.infoWindow = null;
        this.trafficLayer = null;
        this.animationFrameId = null;
    }

    /**
     * Initialize Google Maps
     */
    async initializeMap(containerId, options = {}) {
        return new Promise((resolve, reject) => {
            // Check if Google Maps API is loaded
            if (typeof google === 'undefined' || !google.maps) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const defaultOptions = {
                lat: 23.8103,
                lng: 90.4125,
                zoom: 13
            };

            const mapOptions = { ...defaultOptions, ...options };

            try {
                // Initialize map
                this.map = new google.maps.Map(document.getElementById(containerId), {
                    center: { lat: mapOptions.lat, lng: mapOptions.lng },
                    zoom: mapOptions.zoom,
                    mapTypeControl: true,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER,
    },
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_CENTER
                    },
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.RIGHT_CENTER
                    },
                    fullscreenControl: false,
                    styles: [
                        {
                            featureType: 'poi',
                            elementType: 'labels',
                            stylers: [{ visibility: 'off' }]
                        }
                    ]
                });

                // Initialize services
                this.directionsService = new google.maps.DirectionsService();
                this.directionsRenderer = new google.maps.DirectionsRenderer({
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: '#4285F4',
                        strokeWeight: 4,
                        strokeOpacity: 0.8
                    }
                });
                this.directionsRenderer.setMap(this.map);

                this.infoWindow = new google.maps.InfoWindow();
                this.trafficLayer = new google.maps.TrafficLayer();

                this.isInitialized = true;
                resolve(this.map);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Add or update driver marker with custom styling
     */
    async addDriverMarker(lat, lng, driverData = {}) {
        const position = new google.maps.LatLng(lat, lng);

        if (this.driverMarker) {
            // Update existing marker
            this.driverMarker.setPosition(position);
            if (driverData.heading !== undefined) {
                this.driverMarker.setIcon(this.createDriverIcon(driverData));
            }
        } else {
            // Create new marker
            this.driverMarker = new google.maps.Marker({
                position: position,
                map: this.map,
                icon: this.createDriverIcon(driverData),
                title: driverData.name || 'Driver',
                zIndex: 1000
            });

            // Add click listener for driver info
            this.driverMarker.addListener('click', () => {
                const content = this.createDriverInfoContent(driverData);
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, this.driverMarker);
            });
        }

        return this.driverMarker;
    }

    /**
     * Update driver position with smooth animation
     */
    async updateDriverPosition(lat, lng, animate = true, heading = null) {
        if (!this.driverMarker) {
            return this.addDriverMarker(lat, lng, { heading });
        }

        const newPosition = new google.maps.LatLng(lat, lng);

        if (animate) {
            return this.animateMarkerToPosition(this.driverMarker, newPosition, heading);
        } else {
            this.driverMarker.setPosition(newPosition);
            if (heading !== null) {
                const currentIcon = this.driverMarker.getIcon();
                if (typeof currentIcon === 'object') {
                    currentIcon.rotation = heading;
                    this.driverMarker.setIcon(currentIcon);
                }
            }
        }
    }

    /**
     * Add route markers for pickup and drop-off locations
     */
    async addRouteMarkers(locations) {
        // Clear existing route markers
        this.routeMarkers.forEach(marker => marker.setMap(null));
        this.routeMarkers = [];

        for (const location of locations) {
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: this.map,
                icon: this.createLocationIcon(location.type),
                title: location.address || location.type,
                zIndex: 500
            });

            // Add info window
            marker.addListener('click', () => {
                this.infoWindow.setContent(`
                    <div class="location-info">
                        <h4>${location.type === 'pickup' ? 'Pickup Location' : 'Drop-off Location'}</h4>
                        <p>${location.address || 'Location'}</p>
                    </div>
                `);
                this.infoWindow.open(this.map, marker);
            });

            this.routeMarkers.push(marker);
        }

        return this.routeMarkers;
    }

    /**
     * Draw route between waypoints using Directions API
     */
    async drawRoute(waypoints, options = {}) {
        if (waypoints.length < 2) {
            throw new Error('At least 2 waypoints required for route');
        }

        const defaultOptions = {
            color: '#4285F4',
            weight: 4,
            opacity: 0.8
        };

        const routeOptions = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            const origin = waypoints[0];
            const destination = waypoints[waypoints.length - 1];
            const waypointsForDirections = waypoints.slice(1, -1).map(point => ({
                location: new google.maps.LatLng(point.lat, point.lng),
                stopover: true
            }));

            const request = {
                origin: new google.maps.LatLng(origin.lat, origin.lng),
                destination: new google.maps.LatLng(destination.lat, destination.lng),
                waypoints: waypointsForDirections,
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
                avoidHighways: false,
                avoidTolls: false
            };

            this.directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                    // Update renderer styling
                    this.directionsRenderer.setOptions({
                        polylineOptions: {
                            strokeColor: routeOptions.color,
                            strokeWeight: routeOptions.weight,
                            strokeOpacity: routeOptions.opacity
                        }
                    });

                    this.directionsRenderer.setDirections(result);
                    this.routePolyline = result;
                    resolve(result);
                } else {
                    reject(new Error(`Directions request failed: ${status}`));
                }
            });
        });
    }

    /**
     * Center map to show complete route optimally
     */
    async centerMapOnRoute(bounds = null) {
        if (bounds) {
            const googleBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(bounds.south, bounds.west),
                new google.maps.LatLng(bounds.north, bounds.east)
            );
            this.map.fitBounds(googleBounds);
        } else if (this.routePolyline) {
            // Use route bounds
            const routeBounds = new google.maps.LatLngBounds();
            this.routePolyline.routes[0].overview_path.forEach(point => {
                routeBounds.extend(point);
            });
            this.map.fitBounds(routeBounds);
        } else if (this.routeMarkers.length > 0) {
            // Use marker bounds
            const markerBounds = new google.maps.LatLngBounds();
            this.routeMarkers.forEach(marker => {
                markerBounds.extend(marker.getPosition());
            });
            if (this.driverMarker) {
                markerBounds.extend(this.driverMarker.getPosition());
            }
            this.map.fitBounds(markerBounds);
        }
    }

    /**
     * Set specific map bounds
     */
    async setMapBounds(bounds, options = {}) {
        const googleBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(bounds.south, bounds.west),
            new google.maps.LatLng(bounds.north, bounds.east)
        );

        const fitBoundsOptions = {
            padding: options.padding || 50
        };

        this.map.fitBounds(googleBounds, fitBoundsOptions);
    }

    /**
     * Center map on driver's current position
     */
    async centerOnDriver(zoom = null) {
        if (!this.driverMarker) {
            throw new Error('Driver marker not found');
        }

        this.map.setCenter(this.driverMarker.getPosition());
        if (zoom !== null) {
            this.map.setZoom(zoom);
        }
    }

    /**
     * Toggle map type
     */
    async setMapType(mapType) {
        const mapTypes = {
            roadmap: google.maps.MapTypeId.ROADMAP,
            satellite: google.maps.MapTypeId.SATELLITE,
            hybrid: google.maps.MapTypeId.HYBRID,
            terrain: google.maps.MapTypeId.TERRAIN
        };

        if (mapTypes[mapType]) {
            this.map.setMapTypeId(mapTypes[mapType]);
        }
    }

    /**
     * Add custom control to map
     */
    async addControl(controlElement, position) {
        const positions = {
            'TOP_CENTER': google.maps.ControlPosition.TOP_CENTER,
            'TOP_LEFT': google.maps.ControlPosition.TOP_LEFT,
            'TOP_RIGHT': google.maps.ControlPosition.TOP_RIGHT,
            'RIGHT_CENTER': google.maps.ControlPosition.RIGHT_CENTER,
            'BOTTOM_CENTER': google.maps.ControlPosition.BOTTOM_CENTER,
            'BOTTOM_LEFT': google.maps.ControlPosition.BOTTOM_LEFT,
            'BOTTOM_RIGHT': google.maps.ControlPosition.BOTTOM_RIGHT,
            'LEFT_CENTER': google.maps.ControlPosition.LEFT_CENTER
        };

        const controlPosition = positions[position] || google.maps.ControlPosition.TOP_CENTER;
        this.map.controls[controlPosition].push(controlElement);
    }

    /**
     * Clear all markers and routes
     */
    async clearMap() {
        // Clear driver marker
        if (this.driverMarker) {
            this.driverMarker.setMap(null);
            this.driverMarker = null;
        }

        // Clear route markers
        this.routeMarkers.forEach(marker => marker.setMap(null));
        this.routeMarkers = [];

        // Clear route
        if (this.directionsRenderer) {
            this.directionsRenderer.setDirections({ routes: [] });
        }
        this.routePolyline = null;

        // Close info window
        if (this.infoWindow) {
            this.infoWindow.close();
        }
    }

    /**
     * Destroy map and clean up resources
     */
    async destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        await this.clearMap();

        this.directionsService = null;
        this.directionsRenderer = null;
        this.infoWindow = null;
        this.trafficLayer = null;
        this.map = null;
        this.isInitialized = false;
    }

    /**
     * Get current map bounds
     */
    getBounds() {
        if (!this.map) return null;

        const bounds = this.map.getBounds();
        if (!bounds) return null;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        return {
            north: ne.lat(),
            south: sw.lat(),
            east: ne.lng(),
            west: sw.lng()
        };
    }

    /**
     * Get current map center
     */
    getCenter() {
        if (!this.map) return null;

        const center = this.map.getCenter();
        return {
            lat: center.lat(),
            lng: center.lng()
        };
    }

    /**
     * Get current zoom level
     */
    getZoom() {
        return this.map ? this.map.getZoom() : null;
    }

    /**
     * Toggle traffic layer
     */
    toggleTraffic() {
        if (this.trafficLayer.getMap()) {
            this.trafficLayer.setMap(null);
        } else {
            this.trafficLayer.setMap(this.map);
        }
    }

    // Private helper methods

    /**
     * Create custom driver icon with rotation
     */
    createDriverIcon(driverData) {
        const iconUrl = driverData.vehicle_icon || '/images/default-car-icon.png';

        return {
            url: iconUrl,
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 20),
            rotation: driverData.heading || 0
        };
    }

    /**
     * Create location marker icon
     */
    createLocationIcon(type) {
        const icons = {
            pickup: {
                url: '/images/pickup-marker.png',
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
            },
            dropoff: {
                url: '/images/dropoff-marker.png',
                scaledSize: new google.maps.Size(32, 32),
                anchor: new google.maps.Point(16, 32)
            }
        };

        return icons[type] || icons.pickup;
    }

    /**
     * Create driver info window content
     */
    createDriverInfoContent(driverData) {
        return `
            <div class="driver-info-popup">
                <h4>${driverData.name || 'Driver'}</h4>
                ${driverData.plate_number ? `<p><strong>Vehicle:</strong> ${driverData.plate_number}</p>` : ''}
                ${driverData.phone ? `<p><strong>Phone:</strong> ${driverData.phone}</p>` : ''}
                <p><small>Last updated: ${new Date().toLocaleTimeString()}</small></p>
            </div>
        `;
    }

    /**
     * Animate marker to new position smoothly
     */
    animateMarkerToPosition(marker, newPosition, heading = null) {
        return new Promise((resolve) => {
            const startPosition = marker.getPosition();
            const startTime = Date.now();
            const duration = 1000; // 1 second animation

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeProgress = progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress;

                const lat = startPosition.lat() + (newPosition.lat() - startPosition.lat()) * easeProgress;
                const lng = startPosition.lng() + (newPosition.lng() - startPosition.lng()) * easeProgress;

                marker.setPosition(new google.maps.LatLng(lat, lng));

                // Update heading if provided
                if (heading !== null && progress === 1) {
                    const currentIcon = marker.getIcon();
                    if (typeof currentIcon === 'object') {
                        currentIcon.rotation = heading;
                        marker.setIcon(currentIcon);
                    }
                }

                if (progress < 1) {
                    this.animationFrameId = requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            animate();
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleMapsProvider;
} else if (typeof window !== 'undefined') {
    window.GoogleMapsProvider = GoogleMapsProvider;
}
