/**
 * OpenStreetMap implementation of the MapPder interface using Leaflet
 * Provides real-time driver tracking with smooth animations
 */
class OSMProvider extends MapProvider {
    constructor() {
        super();
        this.routingControl = null;
        this.layerGroup = null;
        this.animationFrameId = null;
        this.currentPopup = null;
    }

    /**
     * Initialize Leaflet map with OpenStreetMap tiles
     */
    async initializeMap(containerId, options = {}) {
        return new Promise((resolve, reject) => {
            // Check if Leaflet is loaded
            if (typeof L === 'undefined') {
                reject(new Error('Leaflet library not loaded'));
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
                this.map = L.map(containerId, {
                    center: [mapOptions.lat, mapOptions.lng],
                    zoom: mapOptions.zoom,
                    zoomControl: true,
                    attributionControl: true,
                    scrollWheelZoom: true,
                    doubleClickZoom: true,
                    touchZoom: true,
                    dragging: true
                });

                // Add OpenStreetMap tile layer
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 19,
                    subdomains: ['a', 'b', 'c']
                }).addTo(this.map);

                // Initialize layer group for markers
                this.layerGroup = L.layerGroup().addTo(this.map);

                // Add custom controls
                this.addCustomControls();

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
        const position = [lat, lng];

        if (this.driverMarker) {
            // Update existing marker
            this.driverMarker.setLatLng(position);
            if (driverData.heading !== undefined) {
                this.updateDriverIcon(driverData);
            }
        } else {
            // Create new marker
            const icon = this.createDriverIcon(driverData);
            this.driverMarker = L.marker(position, {
                icon: icon,
                zIndexOffset: 1000
            });

            // Add to layer group
            this.layerGroup.addLayer(this.driverMarker);

            // Add popup for driver info
            const popupContent = this.createDriverInfoContent(driverData);
            this.driverMarker.bindPopup(popupContent);
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

        const newPosition = [lat, lng];

        if (animate) {
            return this.animateMarkerToPosition(this.driverMarker, newPosition, heading);
        } else {
            this.driverMarker.setLatLng(newPosition);
            if (heading !== null) {
                this.updateDriverIcon({ heading });
            }
        }
    }

    /**
     * Add route markers for pickup and drop-off locations
     */
    async addRouteMarkers(locations) {
        // Clear existing route markers
        this.routeMarkers.forEach(marker => {
            this.layerGroup.removeLayer(marker);
        });
        this.routeMarkers = [];

        for (const location of locations) {
            const icon = this.createLocationIcon(location.type);
            const marker = L.marker([location.lat, location.lng], {
                icon: icon,
                zIndexOffset: 500
            });

            // Add popup
            const popupContent = `
                <div class="location-info">
                    <h4>${location.type === 'pickup' ? 'Pickup Location' : 'Drop-off Location'}</h4>
                    <p>${location.address || 'Location'}</p>
                </div>
            `;
            marker.bindPopup(popupContent);

            this.layerGroup.addLayer(marker);
            this.routeMarkers.push(marker);
        }

        return this.routeMarkers;
    }

    /**
     * Draw route between waypoints using Leaflet Routing Machine
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
            try {
                // Remove existing routing control
                if (this.routingControl) {
                    this.map.removeControl(this.routingControl);
                }

                // Convert waypoints to Leaflet format
                const leafletWaypoints = waypoints.map(point =>
                    L.latLng(point.lat, point.lng)
                );

                // Check if Leaflet Routing Machine is available
                if (typeof L.Routing !== 'undefined') {
                    // Use Leaflet Routing Machine if available
                    this.routingControl = L.Routing.control({
                        waypoints: leafletWaypoints,
                        routeWhileDragging: false,
                        addWaypoints: false,
                        createMarker: () => null, // Don't create default markers
                        lineOptions: {
                            styles: [{
                                color: routeOptions.color,
                                weight: routeOptions.weight,
                                opacity: routeOptions.opacity
                            }]
                        },
                        show: false, // Hide the instruction panel
                        router: L.Routing.osrmv1({
                            serviceUrl: 'https://router.project-osrm.org/route/v1'
                        })
                    });

                    this.routingControl.on('routesfound', (e) => {
                        this.routePolyline = e.routes[0];
                        resolve(e.routes[0]);
                    });

                    this.routingControl.on('routingerror', (e) => {
                        reject(new Error(`Routing failed: ${e.error.message}`));
                    });

                    this.routingControl.addTo(this.map);
                } else {
                    // Fallback: Draw simple polyline
                    if (this.routePolyline) {
                        this.layerGroup.removeLayer(this.routePolyline);
                    }

                    this.routePolyline = L.polyline(leafletWaypoints, {
                        color: routeOptions.color,
                        weight: routeOptions.weight,
                        opacity: routeOptions.opacity
                    });

                    this.layerGroup.addLayer(this.routePolyline);
                    resolve(this.routePolyline);
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Center map to show complete route optimally
     */
    async centerMapOnRoute(bounds = null) {
        if (bounds) {
            const leafletBounds = L.latLngBounds(
                [bounds.south, bounds.west],
                [bounds.north, bounds.east]
            );
            this.map.fitBounds(leafletBounds);
        } else if (this.routePolyline) {
            // Use route bounds
            if (this.routePolyline.getBounds) {
                this.map.fitBounds(this.routePolyline.getBounds());
            } else if (this.routingControl) {
                // For routing control, get bounds from waypoints
                const group = new L.featureGroup(this.routeMarkers);
                if (this.driverMarker) {
                    group.addLayer(this.driverMarker);
                }
                this.map.fitBounds(group.getBounds());
            }
        } else if (this.routeMarkers.length > 0) {
            // Use marker bounds
            const markers = [...this.routeMarkers];
            if (this.driverMarker) {
                markers.push(this.driverMarker);
            }
            const group = new L.featureGroup(markers);
            this.map.fitBounds(group.getBounds());
        }
    }

    /**
     * Set specific map bounds
     */
    async setMapBounds(bounds, options = {}) {
        const leafletBounds = L.latLngBounds(
            [bounds.south, bounds.west],
            [bounds.north, bounds.east]
        );

        const fitBoundsOptions = {
            padding: [options.padding || 50, options.padding || 50]
        };

        this.map.fitBounds(leafletBounds, fitBoundsOptions);
    }

    /**
     * Center map on driver's current position
     */
    async centerOnDriver(zoom = null) {
        if (!this.driverMarker) {
            throw new Error('Driver marker not found');
        }

        this.map.setView(this.driverMarker.getLatLng(), zoom || this.map.getZoom());
    }

    /**
     * Toggle map type (limited options for OSM)
     */
    async setMapType(mapType) {
        // Remove existing tile layers
        this.map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                this.map.removeLayer(layer);
            }
        });

        let tileLayer;
        switch (mapType) {
            case 'satellite':
                // Use satellite imagery from alternative provider
                tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles © Esri'
                });
                break;
            case 'terrain':
                tileLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap'
                });
                break;
            case 'roadmap':
            default:
                tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                });
                break;
        }

        tileLayer.addTo(this.map);
    }

    /**
     * Add custom control to map
     */
    async addControl(controlElement, position) {
        const positions = {
            'TOP_CENTER': 'topcenter',
            'TOP_LEFT': 'topleft',
            'TOP_RIGHT': 'topright',
            'RIGHT_CENTER': 'topright',
            'BOTTOM_CENTER': 'bottomcenter',
            'BOTTOM_LEFT': 'bottomleft',
            'BOTTOM_RIGHT': 'bottomright',
            'LEFT_CENTER': 'topleft'
        };

        const leafletPosition = positions[position] || 'topleft';

        const CustomControl = L.Control.extend({
            onAdd: function(map) {
                return controlElement;
            }
        });

        const customControl = new CustomControl({ position: leafletPosition });
        customControl.addTo(this.map);
    }

    /**
     * Clear all markers and routes
     */
    async clearMap() {
        // Clear layer group (includes all markers)
        if (this.layerGroup) {
            this.layerGroup.clearLayers();
        }

        // Clear routing control
        if (this.routingControl) {
            this.map.removeControl(this.routingControl);
            this.routingControl = null;
        }

        // Reset references
        this.driverMarker = null;
        this.routeMarkers = [];
        this.routePolyline = null;

        // Close any open popups
        this.map.closePopup();
    }

    /**
     * Destroy map and clean up resources
     */
    async destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        await this.clearMap();

        if (this.map) {
            this.map.remove();
        }

        this.routingControl = null;
        this.layerGroup = null;
        this.map = null;
        this.isInitialized = false;
    }

    /**
     * Get current map bounds
     */
    getBounds() {
        if (!this.map) return null;

        const bounds = this.map.getBounds();
        return {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
        };
    }

    /**
     * Get current map center
     */
    getCenter() {
        if (!this.map) return null;

        const center = this.map.getCenter();
        return {
            lat: center.lat,
            lng: center.lng
        };
    }

    /**
     * Get current zoom level
     */
    getZoom() {
        return this.map ? this.map.getZoom() : null;
    }

    // Private helper methods

    /**
     * Create custom driver icon with rotation
     */
    createDriverIcon(driverData) {
        const iconUrl = driverData.vehicle_icon || '/images/default-car-icon.png';
        const heading = driverData.heading || 0;

        return L.divIcon({
            html: `
                <div class="driver-marker" style="transform: rotate(${heading}deg);">
                    <img src="${iconUrl}" alt="Driver" style="width: 40px; height: 40px;" />
                </div>
            `,
            className: 'custom-driver-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
    }

    /**
     * Update driver icon with new heading
     */
    updateDriverIcon(driverData) {
        if (this.driverMarker && driverData.heading !== undefined) {
            const newIcon = this.createDriverIcon(driverData);
            this.driverMarker.setIcon(newIcon);
        }
    }

    /**
     * Create location marker icon
     */
    createLocationIcon(type) {
        const icons = {
            pickup: {
                iconUrl: '/images/pickup-marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            },
            dropoff: {
                iconUrl: '/images/dropoff-marker.png',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            }
        };

        const iconConfig = icons[type] || icons.pickup;
        return L.icon(iconConfig);
    }

    /**
     * Create driver info popup content
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
     * Add custom controls to the map
     */
    addCustomControls() {
        // Add map type control
        const MapTypeControl = L.Control.extend({
            onAdd: function(map) {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.innerHTML = `
                    <select class="map-type-selector" style="padding: 5px;">
                        <option value="roadmap">Road</option>
                        <option value="satellite">Satellite</option>
                        <option value="terrain">Terrain</option>
                    </select>
                `;

                container.querySelector('.map-type-selector').addEventListener('change', (e) => {
                    this.setMapType(e.target.value);
                }.bind(this));

                return container;
            }.bind(this)
        });

        const mapTypeControl = new MapTypeControl({ position: 'topright' });
        mapTypeControl.addTo(this.map);
    }

    /**
     * Animate marker to new position smoothly
     */
    animateMarkerToPosition(marker, newPosition, heading = null) {
        return new Promise((resolve) => {
            const startPosition = marker.getLatLng();
            const startTime = Date.now();
            const duration = 1000; // 1 second animation

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function for smooth animation
                const easeProgress = progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress;

                const lat = startPosition.lat + (newPosition[0] - startPosition.lat) * easeProgress;
                const lng = startPosition.lng + (newPosition[1] - startPosition.lng) * easeProgress;

                marker.setLatLng([lat, lng]);

                // Update heading if provided
                if (heading !== null && progress === 1) {
                    this.updateDriverIcon({ heading });
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
    module.exports = OSMProvider;
} else if (typeof window !== 'undefined') {
    window.OSMProvider = OSMProvider;
}
