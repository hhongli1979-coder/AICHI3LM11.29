/**
 * Progress Tracking Manager
 *
 * Manages ride progress calculation and visual indicators based on route completion.
 * Provides real-time progress updates as the driver advances along the route.
 *
 * Requirements: 7.3, 7.5
 */
class ProgressTrackingManager {
    constructor(mapProvider = null, etaEngine = null) {
        this.mapProvider = mapProvider;
        this.etaEngine = etaEngine;

        // Progress tracking state
        this.rideData = null;
        this.routeData = null;
        this.currentProgress = 0;
        this.lastDriverPosition = null;

        // Configuration
        this.config = {
            updateInterval: 5000, // 5 seconds between progress updates
            progressSmoothingFactor: 0.3, // Smoothing for progress animations
            minProgressIncrement: 0.5, // Minimum progress increment (%)
            maxProgressJump: 10, // Maximum single progress jump (%)
            distanceThreshold: 50 // Minimum distance change to trigger update (meters)
        }

        // Progress calculation cache
        this.progressCache = {
            totalDistance: null,
            completedDistance: 0,
            remainingDistance: null,
            routeSegments: [],
            lastUpdate: null
        };

        // UI elements cache
        this.uiElements = {
            progressBar: null,
            progressPercentage: null,
            distanceRemaining: null,
            timeRemaining: null,
            statusIndicators: []
        };

        // Bind methods
        this.updateProgress = this.updateProgress.bind(this);
        this.calculateProgress = this.calculateProgress.bind(this);
        this.animateProgressBar = this.animateProgressBar.bind(this);

        // Initialize UI elements
        this.initializeUIElements();
    }

    /**
     * Initialize the progress tracking system
     * Requirements: 7.3, 7.5
     *
     * @param {Object} rideData - Complete ride information
     * @param {Object} routeData - Route information with waypoints
     */
    initialize(rideData, routeData = null) {
        try {
            console.log('ProgressTrackingManager: Initializing with ride data');

            this.rideData = rideData;
            this.routeData = routeData;

            // Extract route information
            if (routeData && routeData.routes && routeData.routes.length > 0) {
                this.extractRouteData(routeData.routes[0]);
            } else if (rideData.location_coordinates && rideData.location_coordinates.length >= 2) {
                // Fallback to coordinate-based calculation
                this.calculateRouteFromCoordinates(rideData.location_coordinates);
            }

            // Initialize progress display
            this.initializeProgressDisplay();

            console.log('ProgressTrackingManager: Initialization completed');
            return true;

        } catch (error) {
            console.error('ProgressTrackingManager: Initialization failed:', error);
            return false;
        }
    }

    /**
     * Update progress based on current driver position
     * Requirements: 7.3, 7.5
     *
     * @param {Object} driverLocation - Current driver position {lat, lng}
     * @param {Object} additionalData - Additional ride data (optional)
     */
    updateProgress(driverLocation, additionalData = {}) {
        try {
            if (!this.validateDriverLocation(driverLocation)) {
                console.warn('ProgressTrackingManager: Invalid driver location provided');
                return;
            }

            // Check if significant movement occurred
            if (!this.hasSignificantMovement(driverLocation)) {
                return;
            }

            console.log('ProgressTrackingManager: Updating progress for position:', driverLocation);

            // Calculate new progress
            const progressData = this.calculateProgress(driverLocation, additionalData);

            if (progressData) {
                // Update progress cache
                this.updateProgressCache(progressData);

                // Update UI elements
                this.updateProgressDisplay(progressData);

                // Update distance and time remaining
                this.updateRemainingInfo(progressData);

                // Store current position
                this.lastDriverPosition = { ...driverLocation };

                console.log('ProgressTrackingManager: Progress updated to', progressData.percentage + '%');
            }

        } catch (error) {
            console.error('ProgressTrackingManager: Error updating progress:', error);
        }
    }

    /**
     * Calculate ride progress based on driver position
     * Requirements: 7.3, 7.5
     *
     * @param {Object} driverLocation - Current driver position
     * @param {Object} additionalData - Additional calculation data
     * @returns {Object} Progress calculation result
     */
    calculateProgress(driverLocation, additionalData = {}) {
        try {
            if (!this.progressCache.totalDistance) {
                console.warn('ProgressTrackingManager: No route data available for progress calculation');
                return this.calculateFallbackProgress(driverLocation);
            }

            // Calculate distance from start point
            const startPoint = this.getStartPoint();
            const endPoint = this.getEndPoint();

            if (!startPoint || !endPoint) {
                return this.calculateFallbackProgress(driverLocation);
            }

            // Calculate distances
            const distanceFromStart = this.calculateDistance(startPoint, driverLocation);
            const distanceToEnd = this.calculateDistance(driverLocation, endPoint);
            const totalRouteDistance = this.progressCache.totalDistance;

            // Calculate progress percentage
            let progressPercentage;

            if (this.routeData && this.routeData.overview_path) {
                // Use route-based calculation for more accuracy
                progressPercentage = this.calculateRouteBasedProgress(driverLocation);
            } else {
                // Use distance-based calculation
                progressPercentage = Math.min(100, Math.max(0,
                    (distanceFromStart / totalRouteDistance) * 100
                ));
            }

            // Apply smoothing to prevent erratic progress updates
            progressPercentage = this.smoothProgress(progressPercentage);

            // Calculate remaining distance and time
            const remainingDistance = Math.max(0, totalRouteDistance - (distanceFromStart));
            const remainingTime = this.calculateRemainingTime(remainingDistance, additionalData);

            return {
                percentage: Math.round(progressPercentage * 100) / 100,
                completedDistance: Math.round(distanceFromStart * 100) / 100,
                remainingDistance: Math.round(remainingDistance * 100) / 100,
                totalDistance: Math.round(totalRouteDistance * 100) / 100,
                remainingTime: remainingTime,
                driverLocation: { ...driverLocation },
                calculatedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('ProgressTrackingManager: Error calculating progress:', error);
            return this.calculateFallbackProgress(driverLocation);
        }
    }

    /**
     * Calculate route-based progress using route path
     * Requirements: 7.3
     *
     * @param {Object} driverLocation - Current driver position
     * @returns {number} Progress percentage
     */
    calculateRouteBasedProgress(driverLocation) {
        try {
            if (!this.routeData || !this.routeData.overview_path) {
                throw new Error('No route path available');
            }

            const routePath = this.routeData.overview_path;
            let closestPointIndex = 0;
            let minDistance = Infinity;

            // Find closest point on route to driver location
            for (let i = 0; i < routePath.length; i++) {
                const pathPoint = routePath[i];
                const distance = this.calculateDistance(driverLocation, {
                    lat: pathPoint.lat(),
                    lng: pathPoint.lng()
                });

                if (distance < minDistance) {
                    minDistance = distance;
                    closestPointIndex = i;
                }
            }

            // Calculate progress based on position along route
            const progressPercentage = (closestPointIndex / (routePath.length - 1)) * 100;
            return Math.min(100, Math.max(0, progressPercentage));

        } catch (error) {
            console.error('ProgressTrackingManager: Route-based calculation failed:', error);
            throw error;
        }
    }

    /**
     * Calculate fallback progress when route data is unavailable
     * Requirements: 7.3
     *
     * @param {Object} driverLocation - Current driver position
     * @returns {Object} Fallback progress data
     */
    calculateFallbackProgress(driverLocation) {
        try {
            if (!this.rideData || !this.rideData.location_coordinates) {
                return this.getDefaultProgress();
            }

            const coordinates = this.rideData.location_coordinates;
            if (coordinates.length < 2) {
                return this.getDefaultProgress();
            }

            const startPoint = coordinates[0];
            const endPoint = coordinates[coordinates.length - 1];

            const totalDistance = this.calculateDistance(startPoint, endPoint);
            const distanceFromStart = this.calculateDistance(startPoint, driverLocation);
            const distanceToEnd = this.calculateDistance(driverLocation, endPoint);

            const progressPercentage = Math.min(100, Math.max(0,
                (distanceFromStart / totalDistance) * 100
            ));

            return {
                percentage: Math.round(progressPercentage * 100) / 100,
                completedDistance: Math.round(distanceFromStart * 100) / 100,
                remainingDistance: Math.round(distanceToEnd * 100) / 100,
                totalDistance: Math.round(totalDistance * 100) / 100,
                remainingTime: Math.round((distanceToEnd / 30) * 60), // Assume 30 km/h
                driverLocation: { ...driverLocation },
                calculatedAt: new Date().toISOString(),
                fallback: true
            };

        } catch (error) {
            console.error('ProgressTrackingManager: Fallback calculation failed:', error);
            return this.getDefaultProgress();
        }
    }

    /**
     * Smooth progress updates to prevent erratic changes
     * Requirements: 7.3
     *
     * @param {number} newProgress - New progress percentage
     * @returns {number} Smoothed progress percentage
     */
    smoothProgress(newProgress) {
        if (this.currentProgress === 0) {
            return newProgress;
        }

        const difference = Math.abs(newProgress - this.currentProgress);

        // Prevent large jumps in progress
        if (difference > this.config.maxProgressJump) {
            const direction = newProgress > this.currentProgress ? 1 : -1;
            return this.currentProgress + (this.config.maxProgressJump * direction);
        }

        // Apply smoothing factor
        return this.currentProgress +
               ((newProgress - this.currentProgress) * this.config.progressSmoothingFactor);
    }

    /**
     * Calculate remaining time based on distance and speed
     * Requirements: 7.3, 7.5
     *
     * @param {number} remainingDistance - Distance remaining in km
     * @param {Object} additionalData - Additional data for calculation
     * @returns {number} Remaining time in minutes
     */
    calculateRemainingTime(remainingDistance, additionalData = {}) {
        try {
            // Use ETA engine if available
            if (this.etaEngine && this.etaEngine.lastCalculation) {
                const etaData = this.etaEngine.lastCalculation;
                return etaData.durationMinutes || 0;
            }

            // Fallback calculation
            const averageSpeed = additionalData.averageSpeed || 30; // km/h
            const timeHours = remainingDistance / averageSpeed;
            return Math.round(timeHours * 60); // Convert to minutes

        } catch (error) {
            console.error('ProgressTrackingManager: Error calculating remaining time:', error);
            return 0;
        }
    }

    /**
     * Update progress display in the UI
     * Requirements: 7.3, 7.5
     *
     * @param {Object} progressData - Progress calculation result
     */
    updateProgressDisplay(progressData) {
        try {
            // Update progress bar
            this.animateProgressBar(progressData.percentage);

            // Update progress percentage text
            if (this.uiElements.progressPercentage) {
                this.uiElements.progressPercentage.textContent = `${Math.round(progressData.percentage)}%`;
                this.uiElements.progressPercentage.setAttribute('aria-valuenow', progressData.percentage);
            }

            // Update progress bar aria attributes
            if (this.uiElements.progressBar && this.uiElements.progressBar.parentElement) {
                const container = this.uiElements.progressBar.parentElement;
                container.setAttribute('aria-valuenow', progressData.percentage);
                container.setAttribute('aria-valuetext', `${Math.round(progressData.percentage)}% complete`);
            }

            // Store current progress
            this.currentProgress = progressData.percentage;

        } catch (error) {
            console.error('ProgressTrackingManager: Error updating progress display:', error);
        }
    }

    /**
     * Animate progress bar to new value
     * Requirements: 7.3, 7.5
     *
     * @param {number} targetPercentage - Target progress percentage
     */
    animateProgressBar(targetPercentage) {
        try {
            if (!this.uiElements.progressBar) {
                return;
            }

            const currentWidth = parseFloat(this.uiElements.progressBar.style.width) || 0;
            const targetWidth = Math.min(100, Math.max(0, targetPercentage));

            // Only animate if there's a significant change
            if (Math.abs(targetWidth - currentWidth) < this.config.minProgressIncrement) {
                return;
            }

            // Apply smooth transition
            this.uiElements.progressBar.style.transition = 'width 0.5s ease-in-out';
            this.uiElements.progressBar.style.width = `${targetWidth}%`;

            // Update progress bar color based on completion
            this.updateProgressBarColor(targetWidth);

        } catch (error) {
            console.error('ProgressTrackingManager: Error animating progress bar:', error);
        }
    }

    /**
     * Update progress bar color based on completion percentage
     * Requirements: 7.5
     *
     * @param {number} percentage - Current progress percentage
     */
    updateProgressBarColor(percentage) {
        try {
            if (!this.uiElements.progressBar) {
                return;
            }

            let colorClass = 'progress-bar-primary';

            if (percentage >= 90) {
                colorClass = 'progress-bar-success';
            } else if (percentage >= 50) {
                colorClass = 'progress-bar-info';
            } else if (percentage >= 25) {
                colorClass = 'progress-bar-warning';
            }

            // Remove existing color classes
            this.uiElements.progressBar.className = this.uiElements.progressBar.className
                .replace(/progress-bar-\w+/g, '');

            // Add new color class
            this.uiElements.progressBar.classList.add(colorClass);

        } catch (error) {
            console.error('ProgressTrackingManager: Error updating progress bar color:', error);
        }
    }

    /**
     * Update remaining distance and time information
     * Requirements: 7.3, 7.5
     *
     * @param {Object} progressData - Progress calculation result
     */
    updateRemainingInfo(progressData) {
        try {
            // Update distance remaining
            if (this.uiElements.distanceRemaining) {
                const distanceText = progressData.remainingDistance > 0
                    ? `${progressData.remainingDistance} km remaining`
                    : 'Arriving now';
                this.uiElements.distanceRemaining.textContent = distanceText;
            }

            // Update time remaining
            if (this.uiElements.timeRemaining) {
                const timeText = progressData.remainingTime > 0
                    ? `${progressData.remainingTime} min remaining`
                    : 'Arriving now';
                this.uiElements.timeRemaining.textContent = timeText;
            }

            // Update ETA display if available
            this.updateETADisplay(progressData);

        } catch (error) {
            console.error('ProgressTrackingManager: Error updating remaining info:', error);
        }
    }

    /**
     * Update ETA display based on progress data
     * Requirements: 7.3
     *
     * @param {Object} progressData - Progress calculation result
     */
    updateETADisplay(progressData) {
        try {
            const etaElement = document.getElementById('eta-time');
            if (!etaElement) {
                return;
            }

            if (progressData.remainingTime > 0) {
                const eta = new Date(Date.now() + (progressData.remainingTime * 60 * 1000));
                const timeString = eta.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                etaElement.textContent = timeString;
            } else {
                etaElement.textContent = 'Arriving now';
            }

        } catch (error) {
            console.error('ProgressTrackingManager: Error updating ETA display:', error);
        }
    }

    /**
     * Initialize UI elements cache
     * Requirements: 7.5
     */
    initializeUIElements() {
        try {
            this.uiElements = {
                progressBar: document.getElementById('progress-bar'),
                progressPercentage: document.getElementById('progress-percentage'),
                distanceRemaining: document.getElementById('distance-remaining'),
                timeRemaining: document.getElementById('time-remaining'),
                statusIndicators: document.querySelectorAll('.status-indicator')
            };

            console.log('ProgressTrackingManager: UI elements initialized');

        } catch (error) {
            console.error('ProgressTrackingManager: Error initializing UI elements:', error);
        }
    }

    /**
     * Initialize progress display with default values
     * Requirements: 7.5
     */
    initializeProgressDisplay() {
        try {
            // Set initial progress to 0
            if (this.uiElements.progressBar) {
                this.uiElements.progressBar.style.width = '0%';
            }

            if (this.uiElements.progressPercentage) {
                this.uiElements.progressPercentage.textContent = '0%';
            }

            // Set initial remaining info
            if (this.progressCache.totalDistance) {
                if (this.uiElements.distanceRemaining) {
                    this.uiElements.distanceRemaining.textContent =
                        `${this.progressCache.totalDistance} km remaining`;
                }
            }

            console.log('ProgressTrackingManager: Progress display initialized');

        } catch (error) {
            console.error('ProgressTrackingManager: Error initializing progress display:', error);
        }
    }

    /**
     * Extract route data from routing service response
     * Requirements: 7.3
     *
     * @param {Object} route - Route object from routing service
     */
    extractRouteData(route) {
        try {
            if (route.legs && route.legs.length > 0) {
                let totalDistance = 0;
                const segments = [];

                route.legs.forEach(leg => {
                    if (leg.distance && leg.distance.value) {
                        totalDistance += leg.distance.value / 1000; // Convert to km
                    }

                    if (leg.steps) {
                        leg.steps.forEach(step => {
                            segments.push({
                                start: step.start_location,
                                end: step.end_location,
                                distance: step.distance ? step.distance.value / 1000 : 0
                            });
                        });
                    }
                });

                this.progressCache.totalDistance = totalDistance;
                this.progressCache.routeSegments = segments;
            }

            console.log('ProgressTrackingManager: Route data extracted, total distance:',
                       this.progressCache.totalDistance, 'km');

        } catch (error) {
            console.error('ProgressTrackingManager: Error extracting route data:', error);
        }
    }

    /**
     * Calculate route from coordinate array (fallback)
     * Requirements: 7.3
     *
     * @param {Array} coordinates - Array of coordinate objects
     */
    calculateRouteFromCoordinates(coordinates) {
        try {
            if (!Array.isArray(coordinates) || coordinates.length < 2) {
                throw new Error('Invalid coordinates array');
            }

            let totalDistance = 0;
            const segments = [];

            for (let i = 0; i < coordinates.length - 1; i++) {
                const start = coordinates[i];
                const end = coordinates[i + 1];
                const segmentDistance = this.calculateDistance(start, end);

                totalDistance += segmentDistance;
                segments.push({
                    start: start,
                    end: end,
                    distance: segmentDistance
                });
            }

            this.progressCache.totalDistance = totalDistance;
            this.progressCache.routeSegments = segments;

            console.log('ProgressTrackingManager: Route calculated from coordinates, total distance:',
                       totalDistance, 'km');

        } catch (error) {
            console.error('ProgressTrackingManager: Error calculating route from coordinates:', error);
        }
    }

    /**
     * Check if driver has moved significantly
     * Requirements: 7.3
     *
     * @param {Object} newLocation - New driver location
     * @returns {boolean} True if significant movement detected
     */
    hasSignificantMovement(newLocation) {
        if (!this.lastDriverPosition) {
            return true;
        }

        const distance = this.calculateDistance(this.lastDriverPosition, newLocation);
        const distanceMeters = distance * 1000;

        return distanceMeters >= this.config.distanceThreshold;
    }

    /**
     * Validate driver location object
     * Requirements: 7.3
     *
     * @param {Object} location - Location object to validate
     * @returns {boolean} True if valid location
     */
    validateDriverLocation(location) {
        return location &&
               typeof location.lat === 'number' &&
               typeof location.lng === 'number' &&
               location.lat >= -90 && location.lat <= 90 &&
               location.lng >= -180 && location.lng <= 180;
    }

    /**
     * Calculate distance between two coordinates
     * Requirements: 7.3
     *
     * @param {Object} coord1 - First coordinate
     * @param {Object} coord2 - Second coordinate
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
     * Convert degrees to radians
     * Requirements: 7.3
     *
     * @param {number} degrees - Degrees to convert
     * @returns {number} Radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Get start point of the route
     * Requirements: 7.3
     *
     * @returns {Object|null} Start point coordinates
     */
    getStartPoint() {
        if (this.rideData && this.rideData.location_coordinates && this.rideData.location_coordinates.length > 0) {
            return this.rideData.location_coordinates[0];
        }
        return null;
    }

    /**
     * Get end point of the route
     * Requirements: 7.3
     *
     * @returns {Object|null} End point coordinates
     */
    getEndPoint() {
        if (this.rideData && this.rideData.location_coordinates && this.rideData.location_coordinates.length > 0) {
            return this.rideData.location_coordinates[this.rideData.location_coordinates.length - 1];
        }
        return null;
    }

    /**
     * Get default progress data
     * Requirements: 7.3
     *
     * @returns {Object} Default progress object
     */
    getDefaultProgress() {
        return {
            percentage: 0,
            completedDistance: 0,
            remainingDistance: 0,
            totalDistance: 0,
            remainingTime: 0,
            driverLocation: null,
            calculatedAt: new Date().toISOString(),
            default: true
        };
    }

    /**
     * Update progress cache
     * Requirements: 7.3
     *
     * @param {Object} progressData - New progress data
     */
    updateProgressCache(progressData) {
        this.progressCache.completedDistance = progressData.completedDistance;
        this.progressCache.remainingDistance = progressData.remainingDistance;
        this.progressCache.lastUpdate = progressData.calculatedAt;
    }

    /**
     * Get current progress status
     * Requirements: 7.3
     *
     * @returns {Object} Current progress information
     */
    getProgressStatus() {
        return {
            currentProgress: this.currentProgress,
            totalDistance: this.progressCache.totalDistance,
            completedDistance: this.progressCache.completedDistance,
            remainingDistance: this.progressCache.remainingDistance,
            lastUpdate: this.progressCache.lastUpdate,
            hasRouteData: !!this.routeData,
            segmentCount: this.progressCache.routeSegments.length
        };
    }

    /**
     * Reset progress tracking
     * Requirements: 7.3
     */
    reset() {
        this.currentProgress = 0;
        this.lastDriverPosition = null;
        this.progressCache = {
            totalDistance: null,
            completedDistance: 0,
            remainingDistance: null,
            routeSegments: [],
            lastUpdate: null
        };

        // Reset UI
        if (this.uiElements.progressBar) {
            this.uiElements.progressBar.style.width = '0%';
        }
        if (this.uiElements.progressPercentage) {
            this.uiElements.progressPercentage.textContent = '0%';
        }

        console.log('ProgressTrackingManager: Progress tracking reset');
    }

    /**
     * Cleanup method
     * Requirements: 7.3
     */
    cleanup() {
        this.reset();
        this.rideData = null;
        this.routeData = null;
        this.uiElements = {};
        console.log('ProgressTrackingManager: Cleanup completed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgressTrackingManager;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.ProgressTrackingManager = ProgressTrackingManager;
}
