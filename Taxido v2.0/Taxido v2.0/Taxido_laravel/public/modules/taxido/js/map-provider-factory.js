/**
 * Map Provider Factory
 * Handles automatic provider selection, asset loading, and fallback logic
 */
class MapProviderFactory {
    constructor() {
        this.currentProvider = null;
        this.loadedAssets = new Set();
        this.config = {
            defaultProvider: 'osm', // Default to OSM
            googleMapsApiKey: null,
            fallbackProvider: 'osm',
            assetLoadTimeout: 10000 // 10 seconds
        };
    }

    /**
     * Initialize the factory with configuration
     * @param {Object} config - Configuration options
     * @param {string} config.defaultProvider - Default map provider ('google' or 'osm')
     * @param {string} config.googleMapsApiKey - Google Maps API key
     * @param {string} config.fallbackProvider - Fallback provider if primary fails
     */
    initialize(config = {}) {
        this.config = { ...this.config, ...config };

        // Auto-detect provider based on available configuration
        if (!this.config.defaultProvider) {
            this.config.defaultProvider = this.config.googleMapsApiKey ? 'google' : 'osm';
        }
    }

    /**
     * Create and initialize a map provider instance
     * @param {string} containerId - Map container element ID
     * @param {Object} options - Map initialization options
     * @returns {Promise<MapProvider>} Initialized map provider instance
     */
    async createProvider(containerId, options = {}) {
        const providerType = this.config.defaultProvider;

        try {
            // Load required assets for the provider
            await this.loadProviderAssets(providerType);

            // Create provider instance
            const provider = await this.instantiateProvider(providerType);

            // Initialize the map
            await provider.initializeMap(containerId, options);

is.currentProvider = provider;
            return provider;

        } catch (error) {
            console.warn(`Failed to initialize ${providerType} provider:`, error);

            // Try fallback provider if different from primary
            if (this.config.fallbackProvider !== providerType) {
                return this.createFallbackProvider(containerId, options);
            }

            throw new Error(`Failed to initialize map provider: ${error.message}`);
        }
    }

    /**
     * Create fallback provider when primary fails
     * @param {string} containerId - Map container element ID
     * @param {Object} options - Map initialization options
     * @returns {Promise<MapProvider>} Fallback provider instance
     */
    async createFallbackProvider(containerId, options = {}) {
        const fallbackType = this.config.fallbackProvider;

        try {
            console.log(`Attempting fallback to ${fallbackType} provider`);

            await this.loadProviderAssets(fallbackType);
            const provider = await this.instantiateProvider(fallbackType);
            await provider.initializeMap(containerId, options);

            this.currentProvider = provider;

            // Show user notification about fallback
            this.showFallbackNotification(fallbackType);

            return provider;

        } catch (fallbackError) {
            throw new Error(`Both primary and fallback providers failed: ${fallbackError.message}`);
        }
    }

    /**
     * Load required assets for the specified provider
     * @param {string} providerType - Provider type ('google' or 'osm')
     * @returns {Promise} Promise that resolves when assets are loaded
     */
    async loadProviderAssets(providerType) {
        const assetKey = `${providerType}-assets`;

        if (this.loadedAssets.has(assetKey)) {
            return Promise.resolve();
        }

        switch (providerType) {
            case 'google':
                await this.loadGoogleMapsAssets();
                break;
            case 'osm':
                await this.loadLeafletAssets();
                break;
            default:
                throw new Error(`Unknown provider type: ${providerType}`);
        }

        this.loadedAssets.add(assetKey);
    }

    /**
     * Load Google Maps API assets
     * @returns {Promise} Promise that resolves when Google Maps is loaded
     */
    async loadGoogleMapsAssets() {
        return new Promise((resolve, reject) => {
            // Check if Google Maps is already loaded
            if (typeof google !== 'undefined' && google.maps) {
                resolve();
                return;
            }

            if (!this.config.googleMapsApiKey) {
                reject(new Error('Google Maps API key not provided'));
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.googleMapsApiKey}&libraries=geometry,places`;
            script.async = true;
            script.defer = true;

            // Set up timeout
            const timeout = setTimeout(() => {
                reject(new Error('Google Maps API loading timeout'));
            }, this.config.assetLoadTimeout);

            script.onload = () => {
                clearTimeout(timeout);
                // Wait a bit for Google Maps to fully initialize
                setTimeout(resolve, 100);
            };

            script.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load Google Maps API'));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Load Leaflet assets (CSS and JS)
     * @returns {Promise} Promise that resolves when Leaflet is loaded
     */
    async loadLeafletAssets() {
        return new Promise((resolve, reject) => {
            // Check if Leaflet is already loaded
            if (typeof L !== 'undefined') {
                resolve();
                return;
            }

            let assetsLoaded = 0;
            const totalAssets = 3; // CSS, JS, and optional routing machine
            const timeout = setTimeout(() => {
                reject(new Error('Leaflet assets loading timeout'));
            }, this.config.assetLoadTimeout);

            const checkComplete = () => {
                assetsLoaded++;
                if (assetsLoaded >= totalAssets) {
                    clearTimeout(timeout);
                    resolve();
                }
            };

            // Load Leaflet CSS
            if (!document.querySelector('link[href*="leaflet"]')) {
                const css = document.createElement('link');
                css.rel = 'stylesheet';
                css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                css.onload = checkComplete;
                css.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error('Failed to load Leaflet CSS'));
                };
                document.head.appendChild(css);
            } else {
                checkComplete();
            }

            // Load Leaflet JS
            if (!document.querySelector('script[src*="leaflet"]')) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = checkComplete;
                script.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error('Failed to load Leaflet JS'));
                };
                document.head.appendChild(script);
            } else {
                checkComplete();
            }

            // Load Leaflet Routing Machine (optional)
            const routingScript = document.createElement('script');
            routingScript.src = 'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js';
            routingScript.onload = checkComplete;
            routingScript.onerror = checkComplete; // Don't fail if routing machine fails
            document.head.appendChild(routingScript);
        });
    }

    /**
     * Instantiate the appropriate provider class
     * @param {string} providerType - Provider type ('google' or 'osm')
     * @returns {Promise<MapProvider>} Provider instance
     */
    async instantiateProvider(providerType) {
        switch (providerType) {
            case 'google':
                if (typeof GoogleMapsProvider === 'undefined') {
                    throw new Error('GoogleMapsProvider class not available');
                }
                return new GoogleMapsProvider();

            case 'osm':
                if (typeof OSMProvider === 'undefined') {
                    throw new Error('OSMProvider class not available');
                }
                return new OSMProvider();

            default:
                throw new Error(`Unknown provider type: ${providerType}`);
        }
    }

    /**
     * Get the current active provider
     * @returns {MapProvider|null} Current provider instance
     */
    getCurrentProvider() {
        return this.currentProvider;
    }

    /**
     * Switch to a different provider
     * @param {string} newProviderType - New provider type
     * @param {string} containerId - Map container ID
     * @param {Object} options - Map options
     * @returns {Promise<MapProvider>} New provider instance
     */
    async switchProvider(newProviderType, containerId, options = {}) {
        // Destroy current provider
        if (this.currentProvider) {
            await this.currentProvider.destroy();
            this.currentProvider = null;
        }

        // Update configuration
        this.config.defaultProvider = newProviderType;

        // Create new provider
        return this.createProvider(containerId, options);
    }

    /**
     * Show notification about fallback provider usage
     * @param {string} fallbackType - Fallback provider type
     */
    showFallbackNotification(fallbackType) {
        const providerNames = {
            google: 'Google Maps',
            osm: 'OpenStreetMap'
        };

        const notification = document.createElement('div');
        notification.className = 'map-fallback-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">⚠️</span>
                <span class="notification-text">
                    Using ${providerNames[fallbackType]} as fallback map provider
                </span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Detect the best provider based on system capabilities
     * @returns {string} Recommended provider type
     */
    detectBestProvider() {
        // Check for Google Maps API key
        if (this.config.googleMapsApiKey) {
            return 'google';
        }

        // Default to OSM as it doesn't require API keys
        return 'osm';
    }

    /**
     * Preload assets for faster initialization
     * @param {string} providerType - Provider to preload
     * @returns {Promise} Promise that resolves when assets are preloaded
     */
    async preloadAssets(providerType) {
        try {
            await this.loadProviderAssets(providerType);
            console.log(`${providerType} assets preloaded successfully`);
        } catch (error) {
            console.warn(`Failed to preload ${providerType} assets:`, error);
        }
    }

    /**
     * Clean up resources
     */
    async destroy() {
        if (this.currentProvider) {
            await this.currentProvider.destroy();
            this.currentProvider = null;
        }

        this.loadedAssets.clear();
    }
}

/**
 * Global map provider factory instance
 */
const mapProviderFactory = new MapProviderFactory();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MapProviderFactory, mapProviderFactory };
} else if (typeof window !== 'undefined') {
    window.MapProviderFactory = MapProviderFactory;
    window.mapProviderFactory = mapProviderFactory;
}
