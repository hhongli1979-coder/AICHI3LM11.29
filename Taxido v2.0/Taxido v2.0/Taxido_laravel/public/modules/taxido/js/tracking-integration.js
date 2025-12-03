/**
 * TrackingIntegration - Integration script for real-time ride tracking
 *
 * This script demonstrates how to integrate the RealTimeTraer,
 * FirebaseListenerManager, and UIUpdateManager for complete real-time tracking.
 *
 * Requirements: 1.2, 1.3, 2.3
 */

// Global tracking instance
let trackingInstance = null;

/**
 * Initialize real-time tracking for a ride
 * Requirements: 1.2, 1.3, 2.3
 */
function initializeRealTimeTracking(config) {
    try {
        console.log('TrackingIntegration: Initializing real-time tracking with config:', config);

        // Validate required configuration
        if (!config.rideId) {
            throw new Error('Ride ID is required');
        }

        if (!config.driverId) {
            console.warn('TrackingIntegration: No driver ID provided, driver tracking will be disabled');
        }

        // Initialize Firebase listener manager
        if (!window.firebaseListenerManager.initialize()) {
            throw new Error('Failed to initialize Firebase listener manager');
        }

        // Initialize UI update manager
        const uiUpdateManager = new UIUpdateManager(config.mapProvider);

        // Initialize real-time tracking manager
        const trackingManager = new RealTimeTrackingManager(
            config.rideId,
            config.driverId,
            config.mapProvider
        );

        // Set up integrated callbacks
        setupIntegratedCallbacks(trackingManager, uiUpdateManager, config);

        // Start tracking
        if (trackingManager.startTracking()) {
            trackingInstance = {
                trackingManager,
                uiUpdateManager,
                config
            };

            console.log('TrackingIntegration: Real-time tracking started successfully');
            return trackingInstance;
        } else {
            throw new Error('Failed to start tracking');
        }

    } catch (error) {
        console.error('TrackingIntegration: Failed to initialize real-time tracking:', error);
        showErrorMessage('Failed to initialize real-time tracking. Please refresh the page.');
        return null;
    }
}

/**
 * Set up integrated callbacks between components
 * Requirements: 1.2, 1.3, 2.3
 */
function setupIntegratedCallbacks(trackingManager, uiUpdateManager, config) {
    try {
        // Override the tracking manager's update methods to use UI manager
        const originalHandleDriverLocationUpdate = trackingManager.handleDriverLocationUpdate;
        trackingManager.handleDriverLocationUpdate = function(data) {
            // Call original handler
            originalHandleDriverLocationUpdate.call(this, data);

            // Update UI through UI manager
            uiUpdateManager.updateDriverPosition(data.lat, data.lng, true, data);
        };

        const originalHandleRideStatusUpdate = trackingManager.handleRideStatusUpdate;
        trackingManager.handleRideStatusUpdate = function(data) {
            // Call original handler
            originalHandleRideStatusUpdate.call(this, data);

            // Update UI through UI manager
            uiUpdateManager.updateRideDetails(data);
        };

        console.log('TrackingIntegration: Integrated callbacks set up successfully');

    } catch (error) {
        console.error('TrackingIntegration: Error setting up integrated callbacks:', error);
    }
}

/**
 * Stop real-time tracking and cleanup
 * Requirements: 1.2
 */
function stopRealTimeTracking() {
    try {
        if (trackingInstance) {
            // Stop tracking manager
            if (trackingInstance.trackingManager) {
                trackingInstance.trackingManager.stopTracking();
            }

            // Cleanup UI manager
            if (trackingInstance.uiUpdateManager) {
                trackingInstance.uiUpdateManager.cleanup();
            }

            // Cleanup Firebase listeners
            window.firebaseListenerManager.cleanup();

            trackingInstance = null;
            console.log('TrackingIntegration: Real-time tracking stopped and cleaned up');
        }

    } catch (error) {
        console.error('TrackingIntegration: Error stopping real-time tracking:', error);
    }
}

/**
 * Get current tracking status
 * Requirements: 1.2
 */
function getTrackingStatus() {
    if (!trackingInstance) {
        return { active: false, error: 'Tracking not initialized' };
    }

    try {
        const trackingStatus = trackingInstance.trackingManager.getConnectionStatus();
        const uiState = trackingInstance.uiUpdateManager.getState();
        const listenerInfo = window.firebaseListenerManager.getListenerInfo();

        return {
            active: true,
            tracking: trackingStatus,
            ui: uiState,
            listeners: listenerInfo,
            config: trackingInstance.config
        };

    } catch (error) {
        console.error('TrackingIntegration: Error getting tracking status:', error);
        return { active: false, error: error.message };
    }
}

/**
 * Show error message to user
 * Requirements: 1.2
 */
function showErrorMessage(message) {
    try {
        // Create or update error message element
        let errorElement = document.getElementById('tracking-error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'tracking-error-message';
            errorElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #dc3545;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
                max-width: 90%;
                text-align: center;
            `;
            document.body.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }, 10000);

    } catch (error) {
        console.error('TrackingIntegration: Error showing error message:', error);
    }
}

/**
 * Show success message to user
 * Requirements: 1.2
 */
function showSuccessMessage(message) {
    try {
        // Create or update success message element
        let successElement = document.getElementById('tracking-success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.id = 'tracking-success-message';
            successElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #28a745;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
                max-width: 90%;
                text-align: center;
            `;
            document.body.appendChild(successElement);
        }

        successElement.textContent = message;
        successElement.style.display = 'block';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (successElement) {
                successElement.style.display = 'none';
            }
        }, 3000);

    } catch (error) {
        console.error('TrackingIntegration: Error showing success message:', error);
    }
}

/**
 * Handle page visibility changes for mobile optimization
 * Requirements: 1.2
 */
function handleVisibilityChange() {
    try {
        if (!trackingInstance) return;

        if (document.visibilityState === 'hidden') {
            console.log('TrackingIntegration: Page hidden, maintaining tracking');
            // Keep tracking active but could reduce update frequency
        } else if (document.visibilityState === 'visible') {
            console.log('TrackingIntegration: Page visible, resuming full tracking');
            // Resume full tracking if it was paused
        }

    } catch (error) {
        console.error('TrackingIntegration: Error handling visibility change:', error);
    }
}

/**
 * Set up page event handlers
 * Requirements: 1.2
 */
function setupPageEventHandlers() {
    try {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            stopRealTimeTracking();
        });

        // Handle browser back/forward
        window.addEventListener('pagehide', () => {
            stopRealTimeTracking();
        });

        console.log('TrackingIntegration: Page event handlers set up');

    } catch (error) {
        console.error('TrackingIntegration: Error setting up page event handlers:', error);
    }
}

/**
 * Initialize tracking from page data
 * Requirements: 1.2, 1.3, 2.3
 */
function initializeFromPageData() {
    try {
        // Get configuration from page data attributes or global variables
        const trackingContainer = document.querySelector('.tracking-container');
        if (!trackingContainer) {
            console.warn('TrackingIntegration: Tracking container not found');
            return null;
        }

        // Extract configuration from data attributes or global CONFIG object
        const config = {
            rideId: trackingContainer.dataset.rideId || (window.CONFIG && window.CONFIG.rideId),
            driverId: trackingContainer.dataset.driverId || (window.CONFIG && window.CONFIG.driverId),
            mapProvider: window.mapProvider || null // Assume map provider is set globally
        };

        if (!config.rideId) {
            console.error('TrackingIntegration: No ride ID found in page data');
            showErrorMessage('Unable to initialize tracking: Missing ride information');
            return null;
        }

        return initializeRealTimeTracking(config);

    } catch (error) {
        console.error('TrackingIntegration: Error initializing from page data:', error);
        showErrorMessage('Failed to initialize tracking from page data');
        return null;
    }
}

// Set up page event handlers when script loads
setupPageEventHandlers();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure all other scripts are loaded
        setTimeout(initializeFromPageData, 1000);
    });
} else {
    // DOM is already ready
    setTimeout(initializeFromPageData, 1000);
}

// Export functions for global use
if (typeof window !== 'undefined') {
    window.TrackingIntegration = {
        initialize: initializeRealTimeTracking,
        stop: stopRealTimeTracking,
        getStatus: getTrackingStatus,
        showError: showErrorMessage,
        showSuccess: showSuccessMessage
    };
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeRealTimeTracking,
        stopRealTimeTracking,
        getTrackingStatus,
        showErrorMessage,
        showSuccessMessage
    };
}
