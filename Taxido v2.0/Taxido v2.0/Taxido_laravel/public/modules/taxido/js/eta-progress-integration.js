/**
 * ETA and Progress Integration Script
 *
 * Integrates ETA calculation engine, progress tracking manager, and status timeline component
with the existing real-time tracking system for comprehensive ride tracking functionality.
 *
 * Requirements: 7.1, 7.2, 7.3, 7.5, 2.3, 7.4
 */

/**
 * Initialize ETA and Progress Tracking Integration
 *
 * @param {Object} config - Configuration object
 * @param {string} config.rideId - Ride ID
 * @param {string} config.driverId - Driver ID
 * @param {Object} config.rideData - Complete ride data
 * @param {Object} config.mapProvider - Map provider instance
 * @returns {Object} Integration manager instance
 */
function initializeETAProgressIntegration(config) {
    try {
        console.log('ETAProgressIntegration: Initializing with config:', config);

        // Validate required configuration
        if (!config.rideId || !config.driverId) {
            throw new Error('Ride ID and Driver ID are required');
        }

        // Create integration manager
        const integrationManager = new ETAProgressIntegrationManager(config);

        // Initialize the integration
        const success = integrationManager.initialize();

        if (success) {
            console.log('ETAProgressIntegration: Integration initialized successfully');

            // Set up page unload cleanup
            window.addEventListener('beforeunload', () => {
                integrationManager.cleanup();
            });

            // Set up visibility change handling for performance
            document.addEventListener('visibilitychange', () => {
                integrationManager.handleVisibilityChange();
            });

            return integrationManager;
        } else {
            throw new Error('Integration initialization failed');
        }

    } catch (error) {
        console.error('ETAProgressIntegration: Initialization failed:', error);
        return null;
    }
}

/**
 * ETA and Progress Integration Manager
 *
 * Manages the integration between all tracking components
 */
class ETAProgressIntegrationManager {
    constructor(config) {
        this.config = {
            rideId: config.rideId,
            driverId: config.driverId,
            rideData: config.rideData || null,
            mapProvider: config.mapProvider || null,
            autoStart: config.autoStart !== false, // Default to true
            updateInterval: config.updateInterval || 15000, // 15 seconds
            enableProgressTracking: config.enableProgressTracking !== false,
            enableETACalculation: config.enableETACalculation !== false,
            enableStatusTimeline: config.enableStatusTimeline !== false
        };

        // Component instances
        this.realTimeManager = null;
        this.etaEngine = null;
        this.progressTracker = null;
        this.statusTimeline = null;

        // State management
        this.isInitialized = false;
        this.isActive = true;
        this.lastUpdate = null;

        // Performance monitoring
        this.performanceMetrics = {
            updateCount: 0,
            errorCount: 0,
            lastUpdateDuration: 0,
            averageUpdateDuration: 0
        };

        // Bind methods
        this.handleDriverLocationUpdate = this.handleDriverLocationUpdate.bind(this);
        this.handleRideStatusUpdate = this.handleRideStatusUpdate.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    }

    /**
     * Initialize the integration manager
     * Requirements: 7.1, 7.3, 2.3
     *
     * @returns {boolean} Success status
     */
    initialize() {
        try {
            console.log('ETAProgressIntegrationManager: Starting initialization');

            // Initialize ETA calculation engine
            if (this.config.enableETACalculation) {
                this.initializeETAEngine();
            }

            // Initialize progress tracking manager
            if (this.config.enableProgressTracking) {
                this.initializeProgressTracker();
            }

            // Initialize status timeline component
            if (this.config.enableStatusTimeline) {
                this.initializeStatusTimeline();
            }

            // Initialize real-time tracking manager with integrated components
            this.initializeRealTimeManager();

            // Set up periodic updates
            this.setupPeriodicUpdates();

            // Mark as initialized
            this.isInitialized = true;
            this.lastUpdate = Date.now();

            console.log('ETAProgressIntegrationManager: Initialization completed successfully');
            return true;

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Initialization failed:', error);
            this.cleanup();
            return false;
        }
    }

    /**
     * Initialize ETA calculation engine
     * Requirements: 7.1, 7.2
     */
    initializeETAEngine() {
        try {
            if (typeof ETACalculationEngine === 'undefined') {
                console.warn('ETAProgressIntegrationManager: ETACalculationEngine not available');
                return;
            }

            this.etaEngine = new ETACalculationEngine(this.config.mapProvider);

            // Configure ETA engine
            this.etaEngine.updateConfig({
                updateInterval: this.config.updateInterval,
                cacheTimeout: 30000 // 30 seconds
            });

            console.log('ETAProgressIntegrationManager: ETA engine initialized');

        } catch (error) {
            console.error('ETAProgressIntegrationManager: ETA engine initialization failed:', error);
        }
    }

    /**
     * Initialize progress tracking manager
     * Requirements: 7.3, 7.5
     */
    initializeProgressTracker() {
        try {
            if (typeof ProgressTrackingManager === 'undefined') {
                console.warn('ETAProgressIntegrationManager: ProgressTrackingManager not available');
                return;
            }

            this.progressTracker = new ProgressTrackingManager(this.config.mapProvider, this.etaEngine);

            // Initialize with ride data if available
            if (this.config.rideData) {
                this.progressTracker.initialize(this.config.rideData);
            }

            console.log('ETAProgressIntegrationManager: Progress tracker initialized');

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Progress tracker initialization failed:', error);
        }
    }

    /**
     * Initialize status timeline component
     * Requirements: 2.3, 7.4
     */
    initializeStatusTimeline() {
        try {
            if (typeof StatusTimelineComponent === 'undefined') {
                console.warn('ETAProgressIntegrationManager: StatusTimelineComponent not available');
                return;
            }

            this.statusTimeline = new StatusTimelineComponent('status-timeline');

            // Initialize with ride data if available
            if (this.config.rideData && this.config.rideData.status_history) {
                this.statusTimeline.updateTimeline(
                    this.config.rideData.status_history,
                    this.config.rideData.ride_status?.name
                );
            }

            console.log('ETAProgressIntegrationManager: Status timeline initialized');

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Status timeline initialization failed:', error);
        }
    }

    /**
     * Initialize real-time tracking manager
     * Requirements: 1.2, 2.3, 7.4
     */
    initializeRealTimeManager() {
        try {
            if (typeof RealTimeTrackingManager === 'undefined') {
                throw new Error('RealTimeTrackingManager not available');
            }

            // Create real-time manager with integrated components
            this.realTimeManager = new RealTimeTrackingManager(
                this.config.rideId,
                this.config.driverId,
                this.config.mapProvider,
                this.config.rideData
            );

            // Override component instances with our initialized ones
            if (this.etaEngine) {
                this.realTimeManager.etaEngine = this.etaEngine;
            }
            if (this.progressTracker) {
                this.realTimeManager.progressTracker = this.progressTracker;
            }
            if (this.statusTimeline) {
                this.realTimeManager.statusTimeline = this.statusTimeline;
            }

            // Start tracking if auto-start is enabled
            if (this.config.autoStart) {
                this.realTimeManager.startTracking();
            }

            console.log('ETAProgressIntegrationManager: Real-time manager initialized');

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Real-time manager initialization failed:', error);
            throw error;
        }
    }

    /**
     * Set up periodic updates for performance optimization
     * Requirements: 7.1, 7.3
     */
    setupPeriodicUpdates() {
        try {
            // Set up periodic ETA recalculation
            if (this.etaEngine) {
                setInterval(() => {
                    if (this.isActive && this.realTimeManager && this.realTimeManager.isTracking) {
                        this.performPeriodicETAUpdate();
                    }
                }, this.config.updateInterval);
            }

            // Set up performance monitoring
            setInterval(() => {
                this.updatePerformanceMetrics();
            }, 60000); // Every minute

            console.log('ETAProgressIntegrationManager: Periodic updates configured');

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Periodic updates setup failed:', error);
        }
    }

    /**
     * Perform periodic ETA update
     * Requirements: 7.1, 7.2
     */
    performPeriodicETAUpdate() {
        try {
            const startTime = Date.now();

            // Get current driver location from real-time manager
            const driverLocation = this.getCurrentDriverLocation();
            if (!driverLocation) {
                return;
            }

            // Update ETA
            if (this.etaEngine) {
                this.etaEngine.updateETA(driverLocation).then(etaResult => {
                    if (etaResult) {
                        this.handleETAUpdate(etaResult);
                    }
                }).catch(error => {
                    console.error('ETAProgressIntegrationManager: Periodic ETA update failed:', error);
                    this.performanceMetrics.errorCount++;
                });
            }

            // Update performance metrics
            this.performanceMetrics.lastUpdateDuration = Date.now() - startTime;
            this.performanceMetrics.updateCount++;

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Periodic ETA update error:', error);
            this.performanceMetrics.errorCount++;
        }
    }

    /**
     * Handle ETA update results
     * Requirements: 7.1, 7.3
     *
     * @param {Object} etaResult - ETA calculation result
     */
    handleETAUpdate(etaResult) {
        try {
            // Update ETA display
            const etaElement = document.getElementById('eta-time');
            if (etaElement && etaResult.durationMinutes !== undefined) {
                if (etaResult.durationMinutes > 0) {
                    etaElement.textContent = `${etaResult.durationMinutes} min`;
                } else {
                    etaElement.textContent = 'Arriving now';
                }
            }

            // Update progress tracker with ETA data
            if (this.progressTracker && etaResult.distanceKm) {
                // Progress tracker can use this data for more accurate calculations
                console.log('ETAProgressIntegrationManager: ETA updated:', etaResult);
            }

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error handling ETA update:', error);
        }
    }

    /**
     * Get current driver location
     * Requirements: 7.1
     *
     * @returns {Object|null} Current driver location
     */
    getCurrentDriverLocation() {
        try {
            // This would typically come from the real-time manager's last known position
            // For now, return null as we don't have access to the current position
            return null;

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error getting current driver location:', error);
            return null;
        }
    }

    /**
     * Handle visibility change for performance optimization
     * Requirements: 7.1, 7.3
     */
    handleVisibilityChange() {
        try {
            if (document.hidden) {
                // Page is hidden, reduce update frequency
                this.isActive = false;
                console.log('ETAProgressIntegrationManager: Page hidden, reducing activity');
            } else {
                // Page is visible, resume normal operation
                this.isActive = true;
                console.log('ETAProgressIntegrationManager: Page visible, resuming activity');

                // Trigger immediate update when page becomes visible
                if (this.realTimeManager && this.realTimeManager.isTracking) {
                    this.performPeriodicETAUpdate();
                }
            }

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error handling visibility change:', error);
        }
    }

    /**
     * Update performance metrics
     * Requirements: 7.1
     */
    updatePerformanceMetrics() {
        try {
            if (this.performanceMetrics.updateCount > 0) {
                // Calculate average update duration
                this.performanceMetrics.averageUpdateDuration =
                    this.performanceMetrics.lastUpdateDuration; // Simplified for now

                // Log performance metrics periodically
                console.log('ETAProgressIntegrationManager Performance:', {
                    updates: this.performanceMetrics.updateCount,
                    errors: this.performanceMetrics.errorCount,
                    avgDuration: this.performanceMetrics.averageUpdateDuration,
                    errorRate: (this.performanceMetrics.errorCount / this.performanceMetrics.updateCount * 100).toFixed(2) + '%'
                });
            }

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error updating performance metrics:', error);
        }
    }

    /**
     * Update ride data
     * Requirements: 7.1, 7.3, 2.3
     *
     * @param {Object} newRideData - Updated ride data
     */
    updateRideData(newRideData) {
        try {
            this.config.rideData = { ...this.config.rideData, ...newRideData };

            // Update all components with new ride data
            if (this.realTimeManager) {
                this.realTimeManager.setRideData(this.config.rideData);
            }

            if (this.progressTracker) {
                this.progressTracker.initialize(this.config.rideData);
            }

            if (this.statusTimeline && newRideData.status_history) {
                this.statusTimeline.updateTimeline(
                    newRideData.status_history,
                    newRideData.ride_status?.name
                );
            }

            console.log('ETAProgressIntegrationManager: Ride data updated');

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error updating ride data:', error);
        }
    }

    /**
     * Get integration status
     * Requirements: 7.1, 7.3, 2.3
     *
     * @returns {Object} Current integration status
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            isActive: this.isActive,
            lastUpdate: this.lastUpdate,
            components: {
                realTimeManager: !!this.realTimeManager,
                etaEngine: !!this.etaEngine,
                progressTracker: !!this.progressTracker,
                statusTimeline: !!this.statusTimeline
            },
            performance: { ...this.performanceMetrics },
            config: {
                enableProgressTracking: this.config.enableProgressTracking,
                enableETACalculation: this.config.enableETACalculation,
                enableStatusTimeline: this.config.enableStatusTimeline
            }
        };
    }

    /**
     * Start tracking
     * Requirements: 1.2, 7.1, 7.3
     */
    startTracking() {
        try {
            if (this.realTimeManager) {
                return this.realTimeManager.startTracking();
            }
            return false;

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error starting tracking:', error);
            return false;
        }
    }

    /**
     * Stop tracking
     * Requirements: 1.2, 7.1, 7.3
     */
    stopTracking() {
        try {
            if (this.realTimeManager) {
                this.realTimeManager.stopTracking();
            }

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error stopping tracking:', error);
        }
    }

    /**
     * Cleanup all components
     * Requirements: 1.2, 7.1, 7.3, 2.3
     */
    cleanup() {
        try {
            console.log('ETAProgressIntegrationManager: Starting cleanup');

            // Stop tracking
            this.stopTracking();

            // Cleanup all components
            if (this.realTimeManager) {
                this.realTimeManager.cleanup();
                this.realTimeManager = null;
            }

            if (this.etaEngine) {
                this.etaEngine.cleanup();
                this.etaEngine = null;
            }

            if (this.progressTracker) {
                this.progressTracker.cleanup();
                this.progressTracker = null;
            }

            if (this.statusTimeline) {
                this.statusTimeline.cleanup();
                this.statusTimeline = null;
            }

            // Reset state
            this.isInitialized = false;
            this.isActive = false;

            console.log('ETAProgressIntegrationManager: Cleanup completed');

        } catch (error) {
            console.error('ETAProgressIntegrationManager: Error during cleanup:', error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeETAProgressIntegration,
        ETAProgressIntegrationManager
    };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.initializeETAProgressIntegration = initializeETAProgressIntegration;
    window.ETAProgressIntegrationManager = ETAProgressIntegrationManager;
}
