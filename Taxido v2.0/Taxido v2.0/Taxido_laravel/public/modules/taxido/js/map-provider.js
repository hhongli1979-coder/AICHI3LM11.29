/**
 * Abstract MapProvider class that defines the interface for map providers
 * Supports both Google Maps and OpenStreetMap implementations
 */
class MapProvider {
    constructor() {
        if (this.constructor === MapProvider) {
            throw new Error("MapProvider is an abstract class and cannot be instantiated directly");
        }

        this.map = null;
        this.driverMarker = null;
        this.routePolyline = null;
        this.routeMarkers = [];
        this.isInitialized = false;
    }

    /**
     * Initialize the map in the specified container
     * @param {string} containerId - The ID of the container element
     * @param {Object} options - Map initialization options
     * @param {number} options.lat - Initial latitude
     * @param {number} options.lng - Initial longitude
     * @param {number} options.zoom - Initial zoom level
     * @returns {Promise} Promise that resolves when map is initialized
     */
    async initializeMap(containerId, options = {}) {
        throw new Error("initializeMap method must be implemented by subclass");
    }

    /**
     * Add or update the driver marker on the map
     * @param {number} lat - Driver latitude
     * @param {number} lng - Driver longitude
     * @param {Object} driverData - Additional driver information
     * @param {string} driverData.name - Driver name
     * @param {string} driverData.vehicle_icon - Vehicle icon URL
     * @param {string} driverData.plate_number - Vehicle plate number
     * @param {number} driverData.heading - Vehicle heading/direction
     * @returns {Promise} Promise that resolves when marker is added/updated
     */
    async addDriverMarker(lat, lng, driverData = {}) {
        throw new Error("addDriverMarker method must be implemented by subclass");
    }

    /**
     * Update the driver's position with smooth animation
     * @param {number} lat - New latitude
     * @param {number} lng - New longitude
     * @param {boolean} animate - Whether to animate the transition
     * @param {number} heading - Vehicle heading/direction
     * @returns {Promise} Promise that resolves when position is updated
     */
    async updateDriverPosition(lat, lng, animate = true, heading = null) {
        throw new Error("updateDriverPosition method must be implemented by subclass");
    }

    /**
     * Add route markers for pickup and drop-off locations
     * @param {Array} locations - Array of location objects
     * @param {number} locations[].lat - Location latitude
     * @param {number} locations[].lng - Location longitude
     * @param {string} locations[].type - Location type ('pickup' or 'dropoff')
     * @param {string} locations[].address - Location address
     * @returns {Promise} Promise that resolves when markers are added
     */
    async addRouteMarkers(locations) {
        throw new Error("addRouteMarkers method must be implemented by subclass");
    }

    /**
     * Draw route between waypoints
     * @param {Array} waypoints - Array of waypoint objects
     * @param {number} waypoints[].lat - Waypoint latitude
     * @param {number} waypoints[].lng - Waypoint longitude
     * @param {Object} options - Route styling options
     * @param {string} options.color - Route line color
     * @param {number} options.weight - Route line weight
     * @param {number} options.opacity - Route line opacity
     * @returns {Promise} Promise that resolves when route is drawn
     */
    async drawRoute(waypoints, options = {}) {
        throw new Error("drawRoute method must be implemented by subclass");
    }

    /**
     * Center the map to show the complete route optimally
     * @param {Array} bounds - Optional custom bounds
     * @returns {Promise} Promise that resolves when map is centered
     */
    async centerMapOnRoute(bounds = null) {
        throw new Error("centerMapOnRoute method must be implemented by subclass");
    }

    /**
     * Set map bounds to show specific area
     * @param {Object} bounds - Bounds object
     * @param {number} bounds.north - North boundary
     * @param {number} bounds.south - South boundary
     * @param {number} bounds.east - East boundary
     * @param {number} bounds.west - West boundary
     * @param {Object} options - Bounds options
     * @param {number} options.padding - Padding around bounds
     * @returns {Promise} Promise that resolves when bounds are set
     */
    async setMapBounds(bounds, options = {}) {
        throw new Error("setMapBounds method must be implemented by subclass");
    }

    /**
     * Center map on driver's current position
     * @param {number} zoom - Optional zoom level
     * @returns {Promise} Promise that resolves when map is centered
     */
    async centerOnDriver(zoom = null) {
        throw new Error("centerOnDriver method must be implemented by subclass");
    }

    /**
     * Toggle map type (satellite, terrain, etc.)
     * @param {string} mapType - Map type identifier
     * @returns {Promise} Promise that resolves when map type is changed
     */
    async setMapType(mapType) {
        throw new Error("setMapType method must be implemented by subclass");
    }

    /**
     * Add custom controls to the map
     * @param {HTMLElement} controlElement - Control element to add
     * @param {string} position - Control position
     * @returns {Promise} Promise that resolves when control is added
     */
    async addControl(controlElement, position) {
        throw new Error("addControl method must be implemented by subclass");
    }

    /**
     * Remove all markers and routes from the map
     * @returns {Promise} Promise that resolves when map is cleared
     */
    async clearMap() {
        throw new Error("clearMap method must be implemented by subclass");
    }

    /**
     * Destroy the map instance and clean up resources
     * @returns {Promise} Promise that resolves when cleanup is complete
     */
    async destroy() {
        throw new Error("destroy method must be implemented by subclass");
    }

    /**
     * Get the current map bounds
     * @returns {Object} Current map bounds
     */
    getBounds() {
        throw new Error("getBounds method must be implemented by subclass");
    }

    /**
     * Get the current map center
     * @returns {Object} Current map center {lat, lng}
     */
    getCenter() {
        throw new Error("getCenter method must be implemented by subclass");
    }

    /**
     * Get the current zoom level
     * @returns {number} Current zoom level
     */
    getZoom() {
        throw new Error("getZoom method must be implemented by subclass");
    }

    /**
     * Check if the map is initialized
     * @returns {boolean} True if map is initialized
     */
    isMapInitialized() {
        return this.isInitialized;
    }

    /**
     * Utility method to calculate distance between two points
     * @param {number} lat1 - First point latitude
     * @param {number} lng1 - First point longitude
     * @param {number} lat2 - Second point latitude
     * @param {number} lng2 - Second point longitude
     * @returns {number} Distance in kilometers
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Convert degrees to radians
     * @param {number} degrees - Degrees to convert
     * @returns {number} Radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Generate a unique ID for map elements
     * @returns {string} Unique ID
     */
    generateId() {
        return 'map_element_' + Math.random().toString(36).substr(2, 9);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapProvider;
} else if (typeof window !== 'undefined') {
    window.MapProvider = MapProvider;
}
