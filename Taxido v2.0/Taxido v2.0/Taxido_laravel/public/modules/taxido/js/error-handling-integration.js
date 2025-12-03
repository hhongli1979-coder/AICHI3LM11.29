/**
 * Error Handling Integration - Integrates all error handling components
 *
 * This file integrates ConnectionManager, ErrorStateHandler, and RetrveryManager
 * to provide comprehensive error handling for the ride tracking page.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */

// Global error handling instances
let connectionManager = null;
let errorStateHandler = null;
let retryRecoveryManager = null;

/**
 * Initialize comprehensive error handling system
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
function initializeErrorHandling(options = {}) {
    try {
        console.log('ErrorHandlingIntegration: Initializing comprehensive error handling system');

        // Initialize ConnectionManager
        connectionManager = new ConnectionManager({
            maxReconnectAttempts: options.maxReconnectAttempts || 5,
            baseReconnectDelay: options.baseReconnectDelay || 1000,
            maxReconnectDelay: options.maxReconnectDelay || 30000,
            connectionTimeout: options.connectionTimeout || 10000
        });

        // Initialize ErrorStateHandler
        errorStateHandler = new ErrorStateHandler({
            showErrorDetails: options.showErrorDetails || false,
            autoRetryDelay: options.autoRetryDelay || 5000,
            maxAutoRetries: options.maxAutoRetries || 3
        });

        // Initialize RetryRecoveryManager
        retryRecoveryManager = new RetryRecoveryManager({
            maxAutoRetries: options.maxAutoRetries || 3,
            retryDelay: options.retryDelay || 2000,
            exponentialBackoff: options.exponentialBackoff !== false,
            maxRetryDelay: options.maxRetryDelay || 30000,
            gracefulDegradationEnabled: options.gracefulDegradationEnabled !== false
        });

        // Set up integration between components
        setupErrorHandlingIntegration();

        // Make instances globally available
        window.connectionManager = connectionManager;
        window.errorStateHandler = errorStateHandler;
        window.retryRecoveryManager = retryRecoveryManager;

        console.log('ErrorHandlingIntegration: Error handling system initialized successfully');
        return true;

    } catch (error) {
        console.error('ErrorHandlingIntegration: Failed to initialize error handling system:', error);
        return false;
    }
}

/**
 * Set up integration between error handling components
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
function setupErrorHandlingIntegration() {
    try {
        // Set up connection manager listeners
        if (connectionManager) {
            connectionManager.addConnectionListener((isConnected, connectionInfo) => {
                if (!isConnected) {
                    // Connection lost - trigger error handling
                    console.log('ErrorHandlingIntegration: Connection lost, triggering error handling');

                    // Show connection error through error state handler
                    if (errorStateHandler) {
                        // Don't show full error overlay for connection issues, let connection manager handle it
                        console.log('ErrorHandlingIntegration: Connection manager will handle reconnection');
                    }
                } else {
                    // Connection restored
                    console.log('ErrorHandlingIntegration: Connection restored');

                    // Clear any connection-related errors
                    if (errorStateHandler && errorStateHandler.getCurrentError()?.type === 'connection_error') {
                        errorStateHandler.clearError();
                    }
                }
            });
        }

        // Set up retry event listeners
        setupRetryEventIntegration();

        // Set up error boundary integration
        setupErrorBoundaryIntegration();

        console.log('ErrorHandlingIntegration: Component integration setup completed');

    } catch (error) {
        console.error('ErrorHandlingIntegration: Error setting up component integration:', error);
    }
}

/**
 * Set up retry event integration
 * Requirements: 5.1, 5.3, 5.5
 */
function setupRetryEventIntegration() {
    try {
        // Listen for retry success events
        window.addEventListener('retry-success', (event) => {
            const { operationType, attempt, result } = event.detail;
            console.log(`ErrorHandlingIntegration: Retry successful for ${operationType} after ${attempt} attempts`);

            // Clear related errors
            if (errorStateHandler) {
                const currentError = errorStateHandler.getCurrentError();
                if (currentError && isRelatedError(currentError.type, operationType)) {
                    errorStateHandler.clearError();
                }
            }
        });

        // Listen for retry failure events
        window.addEventListener('retry-failed', (event) => {
            const { operationType, attempts, error } = event.detail;
            console.error(`ErrorHandlingIntegration: Retry failed for ${operationType} after ${attempts} attempts:`, error);

            // Show appropriate error based on operation type
            if (errorStateHandler) {
                switch (operationType) {
                    case 'ride_loading':
                        errorStateHandler.handleRideNotFound();
                        break;
                    case 'driver_location':
                        errorStateHandler.handleDriverLocationUnavailable();
                        break;
                    case 'map_loading':
                        errorStateHandler.handleMapLoadingFailure(null, error);
                        break;
                    default:
                        errorStateHandler.handleGenericError(error, 'Operation failed after multiple attempts');
                        break;
                }
            }
        });

    } catch (error) {
        console.error('ErrorHandlingIntegration: Error setting up retry event integration:', error);
    }
}

/**
 * Set up error boundary integration
 * Requirements: 5.2, 5.4
 */
function setupErrorBoundaryIntegration() {
    try {
        // Wrap critical functions with error boundaries
        const originalRealTimeTrackingStart = window.RealTimeTrackingManager?.prototype?.startTracking;
        if (originalRealTimeTrackingStart) {
            window.RealTimeTrackingManager.prototype.startTracking = function() {
                try {
                    return originalRealTimeTrackingStart.call(this);
                } catch (error) {
                    console.error('ErrorHandlingIntegration: Error in RealTimeTrackingManager.startTracking:', error);
                    if (errorStateHandler) {
                        errorStateHandler.handleGenericError(error, 'Failed to start real-time tracking');
                    }
                    return false;
                }
            };
        }

        // Wrap map provider initialization
        const originalMapProviderInit = window.MapProvider?.prototype?.initializeMap;
        if (originalMapProviderInit) {
            window.MapProvider.prototype.initializeMap = function(...args) {
                try {
                    return originalMapProviderInit.apply(this, args);
                } catch (error) {
                    console.error('ErrorHandlingIntegration: Error in MapProvider.initializeMap:', error);
                    if (errorStateHandler) {
                        errorStateHandler.handleMapLoadingFailure(this.constructor.name, error);
                    }
                    throw error;
                }
            };
        }

    } catch (error) {
        console.error('ErrorHandlingIntegration: Error setting up error boundary integration:', error);
    }
}

/**
 * Check if error type is related to operation type
 * Requirements: 5.1, 5.2, 5.3
 */
function isRelatedError(errorType, operationType) {
    const errorOperationMap = {
        'ride_not_found': 'ride_loading',
        'driver_location_unavailable': 'driver_location',
        'map_loading_failure': 'map_loading',
        'connection_error': 'firebase_connection'
    };

    return errorOperationMap[errorType] === operationType;
}

/**
 * Handle ride not found error
 * Requirements: 5.2
 */
function handleRideNotFound(rideId = null) {
    if (errorStateHandler) {
        errorStateHandler.handleRideNotFound(rideId);
    } else {
        console.error('ErrorHandlingIntegration: ErrorStateHandler not initialized');
    }
}

/**
 * Handle driver location unavailable error
 * Requirements: 5.2, 5.3
 */
function handleDriverLocationUnavailable(driverId = null, lastKnownLocation = null) {
    if (errorStateHandler) {
        errorStateHandler.handleDriverLocationUnavailable(driverId, lastKnownLocation);
    } else {
        console.error('ErrorHandlingIntegration: ErrorStateHandler not initialized');
    }
}

/**
 * Handle map loading failure
 * Requirements: 5.2, 5.3, 5.4
 */
function handleMapLoadingFailure(mapProvider = null, error = null) {
    if (errorStateHandler) {
        errorStateHandler.handleMapLoadingFailure(mapProvider, error);
    } else {
        console.error('ErrorHandlingIntegration: ErrorStateHandler not initialized');
    }
}

/**
 * Handle generic error
 * Requirements: 5.2, 5.4
 */
function handleGenericError(error, userMessage = null) {
    if (errorStateHandler) {
        errorStateHandler.handleGenericError(error, userMessage);
    } else {
        console.error('ErrorHandlingIntegration: ErrorStateHandler not initialized');
    }
}

/**
 * Force retry of specific operation
 * Requirements: 5.1, 5.3, 5.5
 */
function forceRetry(operationType) {
    if (retryRecoveryManager) {
        // Reset retry attempts and trigger retry
        retryRecoveryManager.resetRetryAttempts(operationType);

        // Dispatch retry event
        const event = new CustomEvent(`retry-${operationType.replace('_', '-')}`, {
            detail: { forced: true, timestamp: new Date() }
        });
        window.dispatchEvent(event);
    } else {
        console.error('ErrorHandlingIntegration: RetryRecoveryManager not initialized');
    }
}

/**
 * Get comprehensive error handling status
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
function getErrorHandlingStatus() {
    const status = {
        initialized: false,
        connectionManager: null,
        errorStateHandler: null,
        retryRecoveryManager: null
    };

    if (connectionManager) {
        status.connectionManager = connectionManager.getConnectionInfo();
    }

    if (errorStateHandler) {
        status.errorStateHandler = {
            currentError: errorStateHandler.getCurrentError()
        };
    }

    if (retryRecoveryManager) {
        status.retryRecoveryManager = retryRecoveryManager.getRetryStats();
    }

    status.initialized = !!(connectionManager && errorStateHandler && retryRecoveryManager);

    return status;
}

/**
 * Cleanup all error handling components
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
 */
function cleanupErrorHandling() {
    try {
        console.log('ErrorHandlingIntegration: Cleaning up error handling system');

        if (connectionManager) {
            connectionManager.cleanup();
            connectionManager = null;
        }

        if (errorStateHandler) {
            errorStateHandler.cleanup();
            errorStateHandler = null;
        }

        if (retryRecoveryManager) {
            retryRecoveryManager.cleanup();
            retryRecoveryManager = null;
        }

        // Clear global references
        if (window.connectionManager) delete window.connectionManager;
        if (window.errorStateHandler) delete window.errorStateHandler;
        if (window.retryRecoveryManager) delete window.retryRecoveryManager;

        console.log('ErrorHandlingIntegration: Error handling system cleanup completed');

    } catch (error) {
        console.error('ErrorHandlingIntegration: Error during cleanup:', error);
    }
}

// Auto-initialize on page load if in browser environment
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Initialize with default options
            initializeErrorHandling();
        });
    } else {
        // DOM is already ready
        initializeErrorHandling();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanupErrorHandling);

    // Make functions globally available
    window.initializeErrorHandling = initializeErrorHandling;
    window.handleRideNotFound = handleRideNotFound;
    window.handleDriverLocationUnavailable = handleDriverLocationUnavailable;
    window.handleMapLoadingFailure = handleMapLoadingFailure;
    window.handleGenericError = handleGenericError;
    window.forceRetry = forceRetry;
    window.getErrorHandlingStatus = getErrorHandlingStatus;
    window.cleanupErrorHandling = cleanupErrorHandling;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeErrorHandling,
        handleRideNotFound,
        handleDriverLocationUnavailable,
        handleMapLoadingFailure,
        handleGenericError,
        forceRetry,
        getErrorHandlingStatus,
        cleanupErrorHandling
    };
}
