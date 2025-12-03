/**
 * ETA Calculation Engine
 *
 * Provides real-time ETA calculations based on driver location, destination, and route data.
 * Integrates with both Google Maps and OpenStreetMap providers for accurate time estimation.
 *
 * Requirements: 7.1, 7.2, 7.3
 */
class ETACalculationEngine {
    constructor(mapProvider = null) {
        this.mapProvider = mapProvider;
        this.lastCalculation = null;
        this.calculationCache = new Map();
        this.cacheTimeout = 30000; // 30 seconds cache

        // Configuration
        this.config = {
            defaultSpeed: 30, // km/h - fallback speed when traffic data unavailable
            speedLimits: {
                highway: 80,
                arterial: 50,
                local: 30,
                residential: 25
            },
            trafficFactors: {
                light: 1.0,
                moderate: 0.8,
                heavy: 0.6,
                severe: 0.4
            },
            updateInterval: 15000, // 15 seconds between calculations
            maxCalculationAge: 60000 // 1 minute max age for calculations
        };

        // Bind methods
        this.calculateETA = this.calculateETA.bind(this);
        this.updateETA = this.updateETA.bind(this);
    }

    /**
     * Calculate ETA based on current driver position and destination
     * Requirements: 7.1, 7.2, 7.3
     *
     * @param {Object} driverLocation - Current driver position {lat, lng}
     * @param {Object} destination - Destination coordinates {lat, lng}
     * @param {Object} options - Additional options for calculation
     * @returns {Promise<Object>} ETA calculation result
     */
    async calculateETA(driverLocation, destination, options = {}) {
        try {
            // Validate input parameters
            if (!this.validateCoordinates(driverLocation) || !this.validateCoordinates(destination)) {
                throw new Error('Invalid coordinates provided');
            }

            // Check cache first
            const cacheKey = this.generateCacheKey(driverLocation, destination);
            const cachedResult = this.getCachedResult(cacheKey);
            if (cachedResult) {
                console.log('ETACalculationEngine: Using cached ETA result');
                return cachedResult;
            }

            console.log('ETACalculationEngine: Calculating ETA from', driverLocation, 'to', destination);

            let etaResult;

            // Try to use map provider's routing service first
            if (this.mapProvider && typeof this.mapProvider.calculateRoute === 'function') {
                etaResult = await this.calculateETAWithMapProvider(driverLocation, destination, options);
            } else {
                // Fallback to distance-based calculation
                etaResult = await this.calculateETAWithDistance(driverLocation, destination, options);
            }

            // Cache the result
            this.cacheResult(cacheKey, etaResult);

            // Store last calculation
            this.lastCalculation = {
                ...etaResult,
                timestamp: Date.now(),
                driverLocation: { ...driverLocation },
                destination: { ...destination }
            };

            return etaResult;

        } catch (error) {
            console.error('ETACalculationEngine: Error calculating ETA:', error);
            return this.getFallbackETA(driverLocation, destination);
        }
    }

    /**
     * Calculate ETA using map provider's routing service
     * Requirements: 7.1, 7.2
     *
     * @param {Object} driverLocation - Current driver position
     * @param {Object} destination - Destination coordinates
     * @param {Object} options - Calculation options
     * @returns {Promise<Object>} ETA result with route data
     */
    async calculateETAWithMapProvider(driverLocation, destination, options = {}) {
        try {
            // Get route data from map provider
            const routeData = await this.mapProvider.calculateRoute([
                driverLocation,
                destination
            ], {
                avoidTolls: options.avoidTolls || false,
                avoidHighways: options.avoidHighways || false,
                optimizeWaypoints: true
            });

            if (!routeData || !routeData.routes || routeData.routes.length === 0) {
                throw new Error('No route found');
            }

            const route = routeData.routes[0];
            const leg = route.legs[0];

            // Extract route information
            const distance = leg.distance ? leg.distance.value / 1000 : null; // Convert to km
            const duration = leg.duration ? leg.duration.value / 60 : null; // Convert to minutes
            const durationInTraffic = leg.duration_in_traffic ? leg.duration_in_traffic.value / 60 : duration;

            // Calculate ETA
            const now = new Date();
            const etaTime = new Date(now.getTime() + (durationInTraffic * 60 * 1000));

            return {
                estimatedArrival: etaTime.toISOString(),
                durationMinutes: Math.round(durationInTraffic),
                distanceKm: distance ? Math.round(distance * 100) / 100 : null,
                route: route,
                trafficCondition: this.assessTrafficCondition(duration, durationInTraffic),
                confidence: 'high',
                source: 'map_provider',
                calculatedAt: now.toISOString()
            };

        } catch (error) {
            console.error('ETACalculationEngine: Map provider calculation failed:', error);
            throw error;
        }
    }

    /**
     * Calculate ETA using distance-based estimation (fallback)
     * Requirements: 7.1, 7.2
     *
     * @param {Object} driverLocation - Current driver position
     * @param {Object} destination - Destination coordinates
     * @param {Object} options - Calculation options
     * @returns {Promise<Object>} ETA result based on distance
     */
    async calculateETAWithDistance(driverLocation, destination, options = {}) {
        try {
            // Calculate straight-line distance
            const straightDistance = this.calculateDistance(driverLocation, destination);

            // Apply route factor (roads are not straight lines)
            const routeFactor = options.routeFactor || 1.3; // 30% longer than straight line
            const estimatedDistance = straightDistance * routeFactor;

            // Determine average speed based on distance and area type
            const averageSpeed = this.estimateAverageSpeed(estimatedDistance, options);

            // Calculate duration
            const durationHours = estimatedDistance / averageSpeed;
            const durationMinutes = durationHours * 60;

            // Calculate ETA
            const now = new Date();
            const etaTime = new Date(now.getTime() + (durationMinutes * 60 * 1000));

            return {
                estimatedArrival: etaTime.toISOString(),
                durationMinutes: Math.round(durationMinutes),
                distanceKm: Math.round(estimatedDistance * 100) / 100,
                route: null,
                trafficCondition: 'unknown',
                confidence: 'medium',
                source: 'distance_based',
                calculatedAt: now.toISOString()
            };

        } catch (error) {
            console.error('ETACalculationEngine: Distance-based calculation failed:', error);
            throw error;
        }
    }

    /**
     * Update ETA calculation for moving driver
     * Requirements: 7.1, 7.3
     *
     * @param {Object} newDriverLocation - Updated driver position
     * @returns {Promise<Object>} Updated ETA result
     */
    async updateETA(newDriverLocation) {
        try {
            if (!this.lastCalculation) {
                console.warn('ETACalculationEngine: No previous calculation to update');
                return null;
            }

            // Check if enough time has passed for recalculation
            const timeSinceLastCalculation = Date.now() - this.lastCalculation.timestamp;
            if (timeSinceLastCalculation < this.config.updateInterval) {
                // Return adjusted ETA based on time elapsed
                return this.adjustETAForTimeElapsed(this.lastCalculation, timeSinceLastCalculation);
            }

            // Recalculate ETA with new position
            const updatedETA = await this.calculateETA(
                newDriverLocation,
                this.lastCalculation.destination
            );

            console.log('ETACalculationEngine: ETA updated for new driver position');
            return updatedETA;

        } catch (error) {
            console.error('ETACalculationEngine: Error updating ETA:', error);
            return this.lastCalculation;
        }
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * Requirements: 7.1, 7.2
     *
     * @param {Object} coord1 - First coordinate {lat, lng}
     * @param {Object} coord2 - Second coordinate {lat, lng}
     * @returns {number} Distance in kilometers
     */
    calculateDistance(coord1, coord2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(coord2.lat - coord1.lat);
        const dLng = this.toRadians(coord2.lng - coord1.lng);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(coord1.lat)) * Math.cos(this.toRadians(coord2.lat)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    /**
     * Estimate average speed based on distance and area characteristics
     * Requirements: 7.2
     *
     * @param {number} distance - Distance in kilometers
     * @param {Object} options - Speed estimation options
     * @returns {number} Estimated average speed in km/h
     */
    estimateAverageSpeed(distance, options = {}) {
        // Base speed on distance (longer distances typically use faster roads)
        let baseSpeed;

        if (distance < 2) {
            baseSpeed = this.config.speedLimits.local; // Local roads
        } else if (distance < 10) {
            baseSpeed = this.config.speedLimits.arterial; // Arterial roads
        } else {
            baseSpeed = this.config.speedLimits.highway; // Highway speeds
        }

        // Apply traffic factor if provided
        if (options.trafficCondition) {
            const trafficFactor = this.config.trafficFactors[options.trafficCondition] || 1.0;
            baseSpeed *= trafficFactor;
        }

        // Apply time of day factor
        const timeOfDayFactor = this.getTimeOfDayFactor();
        baseSpeed *= timeOfDayFactor;

        return Math.max(baseSpeed, 15); // Minimum 15 km/h
    }

    /**
     * Get time of day factor for speed estimation
     * Requirements: 7.2
     *
     * @returns {number} Speed factor based on current time
     */
    getTimeOfDayFactor() {
        const hour = new Date().getHours();

        // Rush hour periods (reduced speed)
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
            return 0.7; // 30% slower during rush hours
        }

        // Late night/early morning (slightly faster)
        if (hour >= 22 || hour <= 6) {
            return 1.1; // 10% faster during off-peak hours
        }

        return 1.0; // Normal speed
    }

    /**
     * Assess traffic condition based on duration comparison
     * Requirements: 7.2
     *
     * @param {number} normalDuration - Duration without traffic
     * @param {number} trafficDuration - Duration with traffic
     * @returns {string} Traffic condition assessment
     */
    assessTrafficCondition(normalDuration, trafficDuration) {
        if (!normalDuration || !trafficDuration) {
            return 'unknown';
        }

        const ratio = trafficDuration / normalDuration;

        if (ratio <= 1.1) return 'light';
        if (ratio <= 1.3) return 'moderate';
        if (ratio <= 1.6) return 'heavy';
        return 'severe';
    }

    /**
     * Adjust ETA based on elapsed time since last calculation
     * Requirements: 7.3
     *
     * @param {Object} lastCalculation - Previous ETA calculation
     * @param {number} elapsedTime - Time elapsed in milliseconds
     * @returns {Object} Adjusted ETA result
     */
    adjustETAForTimeElapsed(lastCalculation, elapsedTime) {
        try {
            const elapsedMinutes = elapsedTime / (1000 * 60);
            const adjustedDuration = Math.max(0, lastCalculation.durationMinutes - elapsedMinutes);

            const now = new Date();
            const adjustedETA = new Date(now.getTime() + (adjustedDuration * 60 * 1000));

            return {
                ...lastCalculation,
                estimatedArrival: adjustedETA.toISOString(),
                durationMinutes: Math.round(adjustedDuration),
                calculatedAt: now.toISOString(),
                adjusted: true
            };

        } catch (error) {
            console.error('ETACalculationEngine: Error adjusting ETA:', error);
            return lastCalculation;
        }
    }

    /**
     * Get fallback ETA when calculation fails
     * Requirements: 7.1
     *
     * @param {Object} driverLocation - Driver position
     * @param {Object} destination - Destination coordinates
     * @returns {Object} Fallback ETA result
     */
    getFallbackETA(driverLocation, destination) {
        try {
            const distance = this.calculateDistance(driverLocation, destination);
            const estimatedDistance = distance * 1.3; // Route factor
            const durationMinutes = (estimatedDistance / this.config.defaultSpeed) * 60;

            const now = new Date();
            const etaTime = new Date(now.getTime() + (durationMinutes * 60 * 1000));

            return {
                estimatedArrival: etaTime.toISOString(),
                durationMinutes: Math.round(durationMinutes),
                distanceKm: Math.round(estimatedDistance * 100) / 100,
                route: null,
                trafficCondition: 'unknown',
                confidence: 'low',
                source: 'fallback',
                calculatedAt: now.toISOString()
            };

        } catch (error) {
            console.error('ETACalculationEngine: Fallback calculation failed:', error);
            return {
                estimatedArrival: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min fallback
                durationMinutes: 15,
                distanceKm: null,
                route: null,
                trafficCondition: 'unknown',
                confidence: 'very_low',
                source: 'default',
                calculatedAt: new Date().toISOString()
            };
        }
    }

    /**
     * Validate coordinate object
     * Requirements: 7.1
     *
     * @param {Object} coord - Coordinate object to validate
     * @returns {boolean} True if valid coordinates
     */
    validateCoordinates(coord) {
        return coord &&
               typeof coord.lat === 'number' &&
               typeof coord.lng === 'number' &&
               coord.lat >= -90 && coord.lat <= 90 &&
               coord.lng >= -180 && coord.lng <= 180;
    }

    /**
     * Generate cache key for ETA calculation
     * Requirements: 7.1
     *
     * @param {Object} driverLocation - Driver position
     * @param {Object} destination - Destination coordinates
     * @returns {string} Cache key
     */
    generateCacheKey(driverLocation, destination) {
        const driverKey = `${Math.round(driverLocation.lat * 1000)},${Math.round(driverLocation.lng * 1000)}`;
        const destKey = `${Math.round(destination.lat * 1000)},${Math.round(destination.lng * 1000)}`;
        return `${driverKey}-${destKey}`;
    }

    /**
     * Get cached ETA result if still valid
     * Requirements: 7.1
     *
     * @param {string} cacheKey - Cache key
     * @returns {Object|null} Cached result or null
     */
    getCachedResult(cacheKey) {
        const cached = this.calculationCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
            return cached.result;
        }
        return null;
    }

    /**
     * Cache ETA calculation result
     * Requirements: 7.1
     *
     * @param {string} cacheKey - Cache key
     * @param {Object} result - ETA calculation result
     */
    cacheResult(cacheKey, result) {
        this.calculationCache.set(cacheKey, {
            result: result,
            timestamp: Date.now()
        });

        // Clean old cache entries
        this.cleanCache();
    }

    /**
     * Clean expired cache entries
     * Requirements: 7.1
     */
    cleanCache() {
        const now = Date.now();
        for (const [key, value] of this.calculationCache.entries()) {
            if ((now - value.timestamp) > this.cacheTimeout) {
                this.calculationCache.delete(key);
            }
        }
    }

    /**
     * Convert degrees to radians
     * Requirements: 7.1
     *
     * @param {number} degrees - Degrees to convert
     * @returns {number} Radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Get current ETA calculation status
     * Requirements: 7.1
     *
     * @returns {Object} Current status information
     */
    getStatus() {
        return {
            hasLastCalculation: !!this.lastCalculation,
            lastCalculationAge: this.lastCalculation ? Date.now() - this.lastCalculation.timestamp : null,
            cacheSize: this.calculationCache.size,
            mapProviderAvailable: !!this.mapProvider
        };
    }

    /**
     * Update configuration
     * Requirements: 7.1
     *
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('ETACalculationEngine: Configuration updated');
    }

    /**
     * Clear all cached calculations
     * Requirements: 7.1
     */
    clearCache() {
        this.calculationCache.clear();
        console.log('ETACalculationEngine: Cache cleared');
    }

    /**
     * Cleanup method
     * Requirements: 7.1
     */
    cleanup() {
        this.clearCache();
        this.lastCalculation = null;
        console.log('ETACalculationEngine: Cleanup completed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ETACalculationEngine;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.ETACalculationEngine = ETACalculationEngine;
}
