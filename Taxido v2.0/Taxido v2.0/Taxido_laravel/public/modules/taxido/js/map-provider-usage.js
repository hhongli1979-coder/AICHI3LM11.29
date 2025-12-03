/**
 * Map Provider Usage Example
 * Demonstrates how to use the map provider abstraction layer
 */

/**
 * Initialize map with automatic provider selection
 * @param {string} containerId - Map container element ID
 * @param {Object} config - Configuration options
 * @returns {Promise<MapProvider>} Initialized map provider
 */
async function initializeMap(containerId, config = {}) {
    try {
        // Initialize the factory with configuration
        mapProviderFactory.initialize({
            defaultProvider: config.mapProvider || 'osm', // 'google' or 'osm'
            googleMapsApiKey: config.googleMapsApiKey || null,
            fallbackProvider: 'osm'
        });

        // Create and initialize the provider
        const provider = await mapProviderFactory.createProvider(containerId, {
            lat: config.lat || 23.8103,
            lng: config.lng || 90.4125,
            zoom: config.zoom || 13
        });

        console.log('Map provider initialized successfully:', provider.constructor.name);
        return provider;
atch (error) {
        console.error('Failed to initialize map provider:', error);
        throw error;
    }
}

/**
 * Example usage for ride tracking
 * @param {string} containerId - Map container element ID
 * @param {Object} rideData - Ride data including locations and driver info
 * @param {Object} config - Map configuration
 */
async function initializeRideTracking(containerId, rideData, config = {}) {
    try {
        // Initialize map provider
        const mapProvider = await initializeMap(containerId, config);

        // Add route markers if locations are provided
        if (rideData.locations && rideData.locations.length > 0) {
            await mapProvider.addRouteMarkers(rideData.locations);

            // Draw route between locations
            if (rideData.locations.length >= 2) {
                await mapProvider.drawRoute(rideData.locations);
            }

            // Center map on route
            await mapProvider.centerMapOnRoute();
        }

        // Add driver marker if driver location is available
        if (rideData.driverLocation) {
            await mapProvider.addDriverMarker(
                rideData.driverLocation.lat,
                rideData.driverLocation.lng,
                rideData.driverData || {}
            );
        }

        // Add custom controls
        await addMapControls(mapProvider);

        return mapProvider;

    } catch (error) {
        console.error('Failed to initialize ride tracking:', error);

        // Show error message to user
        showMapError(containerId, error.message);
        throw error;
    }
}

/**
 * Add custom controls to the map
 * @param {MapProvider} mapProvider - Map provider instance
 */
async function addMapControls(mapProvider) {
    // Center on driver button
    const centerDriverBtn = document.createElement('button');
    centerDriverBtn.innerHTML = '📍 Center on Driver';
    centerDriverBtn.className = 'map-control-btn center-driver-btn';
    centerDriverBtn.onclick = async () => {
        try {
            await mapProvider.centerOnDriver(15);
        } catch (error) {
            console.warn('Could not center on driver:', error);
        }
    };

    // Map type toggle button
    const mapTypeBtn = document.createElement('button');
    mapTypeBtn.innerHTML = '🗺️ Toggle View';
    mapTypeBtn.className = 'map-control-btn map-type-btn';
    let currentMapType = 'roadmap';
    mapTypeBtn.onclick = async () => {
        const mapTypes = ['roadmap', 'satellite', 'terrain'];
        const currentIndex = mapTypes.indexOf(currentMapType);
        currentMapType = mapTypes[(currentIndex + 1) % mapTypes.length];

        try {
            await mapProvider.setMapType(currentMapType);
        } catch (error) {
            console.warn('Could not change map type:', error);
        }
    };

    // Add controls to map
    try {
        await mapProvider.addControl(centerDriverBtn, 'TOP_RIGHT');
        await mapProvider.addControl(mapTypeBtn, 'TOP_RIGHT');
    } catch (error) {
        console.warn('Could not add custom controls:', error);
    }
}

/**
 * Update driver position in real-time
 * @param {MapProvider} mapProvider - Map provider instance
 * @param {Object} locationData - New location data
 */
async function updateDriverLocation(mapProvider, locationData) {
    try {
        await mapProvider.updateDriverPosition(
            locationData.lat,
            locationData.lng,
            true, // animate
            locationData.heading
        );
    } catch (error) {
        console.error('Failed to update driver location:', error);
    }
}

/**
 * Show error message when map fails to load
 * @param {string} containerId - Map container element ID
 * @param {string} errorMessage - Error message to display
 */
function showMapError(containerId, errorMessage) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="map-error-container">
                <div class="map-error-content">
                    <h3>Map Loading Error</h3>
                    <p>${errorMessage}</p>
                    <button onclick="location.reload()" class="retry-btn">
                        Retry Loading
                    </button>
                </div>
            </div>
        `;

        // Add error styles
        container.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            min-height: 400px;
        `;
    }
}

/**
 * Preload map assets for faster initialization
 * @param {string} providerType - Provider type to preload
 */
async function preloadMapAssets(providerType = 'osm') {
    try {
        await mapProviderFactory.preloadAssets(providerType);
        console.log(`${providerType} assets preloaded`);
    } catch (error) {
        console.warn(`Failed to preload ${providerType} assets:`, error);
    }
}

/**
 * Switch between map providers dynamically
 * @param {string} containerId - Map container element ID
 * @param {string} newProvider - New provider type ('google' or 'osm')
 * @param {Object} config - Map configuration
 */
async function switchMapProvider(containerId, newProvider, config = {}) {
    try {
        const mapProvider = await mapProviderFactory.switchProvider(
            newProvider,
            containerId,
            config
        );

        console.log(`Switched to ${newProvider} provider`);
        return mapProvider;

    } catch (error) {
        console.error(`Failed to switch to ${newProvider} provider:`, error);
        throw error;
    }
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.MapProviderUtils = {
        initializeMap,
        initializeRideTracking,
        updateDriverLocation,
        preloadMapAssets,
        switchMapProvider,
        addMapControls,
        showMapError
    };
}

// CSS styles for map controls and error display
const mapStyles = `
    .map-control-btn {
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px 12px;
        margin: 5px;
        cursor: pointer;
        font-size: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.2s ease;
    }

    .map-control-btn:hover {
        background: #f5f5f5;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .map-error-container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #6c757d;
    }

    .map-error-content h3 {
        margin-bottom: 10px;
        color: #dc3545;
    }

    .retry-btn {
        background: #007bff;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }

    .retry-btn:hover {
        background: #0056b3;
    }

    .custom-driver-marker {
        background: transparent;
        border: none;
    }

    .driver-marker {
        transition: transform 0.3s ease;
    }

    .map-fallback-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
    }
`;

// Inject styles into document
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = mapStyles;
    document.head.appendChild(styleSheet);
}
