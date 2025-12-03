/**
 * ErrorStateHandler - Handles various error states for the ride tracking page
 *
 * This class provides centralized error handling for missing ride data, driver location
 * unavailability, map loading failures, and other error scenarios with user-friendly messaging.
 *
 * Requirements: 5.2, 5.3, 5.4
 */
class ErrorStateHandler {
    constructor(options = {}) {
        this.options = {
            showErrorDetails: options.showErrorDetails || false,
            autoRetryDelay: options.autoRetryDelay || 500
       maxAutoRetries: options.maxAutoRetries || 3,
            ...options
        };

        // Error state tracking
        this.currentError = null;
        this.autoRetryCount = 0;
        this.autoRetryTimer = null;

        // Error containers
        this.errorOverlay = null;
        this.errorContainer = null;

        // Bind methods
        this.handleRideNotFound = this.handleRideNotFound.bind(this);
        this.handleDriverLocationUnavailable = this.handleDriverLocationUnavailable.bind(this);
        this.handleMapLoadingFailure = this.handleMapLoadingFailure.bind(this);
        this.handleGenericError = this.handleGenericError.bind(this);
        this.retryOperation = this.retryOperation.bind(this);

        // Initialize error handling
        this.initializeErrorHandling();
    }

    /**
     * Initialize error handling system
     * Requirements: 5.2
     */
    initializeErrorHandling() {
        try {
            // Create error overlay container
            this.createErrorOverlay();

            // Set up global error handlers
            this.setupGlobalErrorHandlers();

            // Set up error boundary for preventing crashes
            this.setupErrorBoundary();

            console.log('ErrorStateHandler: Error handling system initialized');
        } catch (error) {
            console.error('ErrorStateHandler: Failed to initialize error handling:', error);
        }
    }

    /**
     * Create error overlay container
     * Requirements: 5.2
     */
    createErrorOverlay() {
        try {
            // Remove existing overlay if present
            const existingOverlay = document.getElementById('error-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }

            // Create error overlay
            this.errorOverlay = document.createElement('div');
            this.errorOverlay.id = 'error-overlay';
            this.errorOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9999;
                display: none;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(4px);
            `;

            // Create error container
            this.errorContainer = document.createElement('div');
            this.errorContainer.className = 'error-container';
            this.errorContainer.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                animation: errorSlideIn 0.3s ease-out;
            `;

            this.errorOverlay.appendChild(this.errorContainer);
            document.body.appendChild(this.errorOverlay);

            // Add CSS animations
            this.addErrorStyles();

        } catch (error) {
            console.error('ErrorStateHandler: Error creating error overlay:', error);
        }
    }

    /**
     * Add CSS styles for error handling
     * Requirements: 5.2
     */
    addErrorStyles() {
        try {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes errorSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes errorPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                .error-icon {
                    width: 64px;
                    height: 64px;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                }

                .error-icon.error { background: #fee; color: #dc3545; }
                .error-icon.warning { background: #fff3cd; color: #856404; }
                .error-icon.info { background: #d1ecf1; color: #0c5460; }

                .error-title {
                    font-size: 24px;
                    font-weight: 600;
                    color: #212529;
                    margin-bottom: 12px;
                }

                .error-message {
                    font-size: 16px;
                    color: #6c757d;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }

                .error-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .error-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 120px;
                }

                .error-btn-primary {
                    background: #007bff;
                    color: white;
                }

                .error-btn-primary:hover {
                    background: #0056b3;
                    transform: translateY(-1px);
                }

                .error-btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .error-btn-secondary:hover {
                    background: #545b62;
                    transform: translateY(-1px);
                }

                .error-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .error-details {
                    margin-top: 16px;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #6c757d;
                    text-align: left;
                    font-family: monospace;
                    max-height: 100px;
                    overflow-y: auto;
                }

                .fallback-info {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px;
                    text-align: left;
                }

                .fallback-info h3 {
                    margin-top: 0;
                    color: #495057;
                }

                .fallback-info ul {
                    margin: 0;
                    padding-left: 20px;
                }

                .fallback-info li {
                    margin-bottom: 8px;
                    color: #6c757d;
                }

                @media (max-width: 480px) {
                    .error-container {
                        padding: 24px 20px;
                    }

                    .error-title {
                        font-size: 20px;
                    }

                    .error-message {
                        font-size: 14px;
                    }

                    .error-actions {
                        flex-direction: column;
                    }

                    .error-btn {
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(style);

        } catch (error) {
            console.error('ErrorStateHandler: Error adding error styles:', error);
        }
    }

    /**
     * Set up global error handlers
     * Requirements: 5.2, 5.4
     */
    setupGlobalErrorHandlers() {
        try {
            // Handle unhandled JavaScript errors
            window.addEventListener('error', (event) => {
                console.error('ErrorStateHandler: Unhandled error:', event.error);
                this.handleGenericError(event.error, 'An unexpected error occurred');
            });

            // Handle unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                console.error('ErrorStateHandler: Unhandled promise rejection:', event.reason);
                this.handleGenericError(event.reason, 'A network or processing error occurred');
            });

        } catch (error) {
            console.error('ErrorStateHandler: Error setting up global error handlers:', error);
        }
    }

    /**
     * Set up error boundary to prevent complete page crashes
     * Requirements: 5.2, 5.4
     */
    setupErrorBoundary() {
        try {
            // Wrap critical functions with try-catch
            const originalConsoleError = console.error;
            console.error = (...args) => {
                originalConsoleError.apply(console, args);

                // Check if this is a critical error that should show UI feedback
                const errorMessage = args.join(' ');
                if (errorMessage.includes('Firebase') ||
                    errorMessage.includes('Map') ||
                    errorMessage.includes('Connection')) {
                    // Don't show UI for every console error, but log for debugging
                }
            };

        } catch (error) {
            console.error('ErrorStateHandler: Error setting up error boundary:', error);
        }
    }

    /**
     * Handle "Ride Not Found" error
     * Requirements: 5.2
     */
    handleRideNotFound(rideId = null) {
        try {
            console.error('ErrorStateHandler: Ride not found:', rideId);

            this.currentError = {
                type: 'ride_not_found',
                rideId: rideId,
                timestamp: new Date()
            };

            const errorContent = `
                <div class="error-icon error">
                    <i class="ri-search-line"></i>
                </div>
                <div class="error-title">Ride Not Found</div>
                <div class="error-message">
                    We couldn't find the ride you're looking for. This might happen if:
                    <ul style="text-align: left; margin-top: 12px;">
                        <li>The ride has been cancelled or completed</li>
                        <li>The tracking link has expired</li>
                        <li>There was a temporary system issue</li>
                    </ul>
                </div>
                <div class="error-actions">
                    <button class="error-btn error-btn-primary" onclick="errorStateHandler.retryOperation()">
                        Try Again
                    </button>
                    <button class="error-btn error-btn-secondary" onclick="errorStateHandler.goToHomePage()">
                        Go to Home
                    </button>
                </div>
            `;

            this.showError(errorContent);

        } catch (error) {
            console.error('ErrorStateHandler: Error handling ride not found:', error);
        }
    }

    /**
     * Handle driver location unavailable error
     * Requirements: 5.2, 5.3
     */
    handleDriverLocationUnavailable(driverId = null, lastKnownLocation = null) {
        try {
            console.warn('ErrorStateHandler: Driver location unavailable:', driverId);

            this.currentError = {
                type: 'driver_location_unavailable',
                driverId: driverId,
                lastKnownLocation: lastKnownLocation,
                timestamp: new Date()
            };

            // Show fallback display instead of full error overlay
            this.showDriverLocationFallback(lastKnownLocation);

        } catch (error) {
            console.error('ErrorStateHandler: Error handling driver location unavailable:', error);
        }
    }

    /**
     * Show fallback display for driver location unavailable
     * Requirements: 5.2, 5.3
     */
    showDriverLocationFallback(lastKnownLocation) {
        try {
            // Update map area with fallback information
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                // Create fallback overlay on map
                let fallbackOverlay = document.getElementById('driver-location-fallback');
                if (!fallbackOverlay) {
                    fallbackOverlay = document.createElement('div');
                    fallbackOverlay.id = 'driver-location-fallback';
                    fallbackOverlay.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        border-radius: 12px;
                        padding: 24px;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                        text-align: center;
                        max-width: 300px;
                        z-index: 100;
                    `;
                    mapSection.appendChild(fallbackOverlay);
                }

                const lastLocationText = lastKnownLocation
                    ? `Last known location: ${lastKnownLocation.timestamp || 'Unknown time'}`
                    : 'No location data available';

                fallbackOverlay.innerHTML = `
                    <div class="error-icon warning">
                        <i class="ri-map-pin-line"></i>
                    </div>
                    <div class="error-title" style="font-size: 18px;">Driver Location Unavailable</div>
                    <div class="error-message" style="font-size: 14px; margin-bottom: 16px;">
                        We're having trouble getting the driver's current location.
                        <br><small>${lastLocationText}</small>
                    </div>
                    <button class="error-btn error-btn-primary" onclick="errorStateHandler.retryDriverLocation()">
                        Retry
                    </button>
                `;
            }

            // Update status in sidebar
            this.updateSidebarStatus('Driver location temporarily unavailable', 'warning');

        } catch (error) {
            console.error('ErrorStateHandler: Error showing driver location fallback:', error);
        }
    }

    /**
     * Handle map loading failure
     * Requirements: 5.2, 5.3, 5.4
     */
    handleMapLoadingFailure(mapProvider = null, error = null) {
        try {
            console.error('ErrorStateHandler: Map loading failed:', mapProvider, error);

            this.currentError = {
                type: 'map_loading_failure',
                mapProvider: mapProvider,
                error: error,
                timestamp: new Date()
            };

            // Show text-based route information as fallback
            this.showTextBasedRouteFallback();

        } catch (err) {
            console.error('ErrorStateHandler: Error handling map loading failure:', err);
        }
    }

    /**
     * Show text-based route information fallback
     * Requirements: 5.2, 5.3, 5.4
     */
    showTextBasedRouteFallback() {
        try {
            const mapSection = document.querySelector('.map-section');
            if (mapSection) {
                mapSection.innerHTML = `
                    <div class="fallback-info">
                        <div class="error-icon warning" style="margin-bottom: 16px;">
                            <i class="ri-map-line"></i>
                        </div>
                        <h3>Map Unavailable</h3>
                        <p>We're having trouble loading the map. Here's your ride information:</p>

                        <div id="route-fallback-info">
                            <h4>Route Information</h4>
                            <ul id="route-locations">
                                <li>Loading route details...</li>
                            </ul>
                        </div>

                        <div style="margin-top: 20px;">
                            <button class="error-btn error-btn-primary" onclick="errorStateHandler.retryMapLoading()">
                                Retry Map Loading
                            </button>
                        </div>
                    </div>
                `;

                // Populate route information if available
                this.populateRouteFallbackInfo();
            }

        } catch (error) {
            console.error('ErrorStateHandler: Error showing text-based route fallback:', error);
        }
    }

    /**
     * Populate route fallback information
     * Requirements: 5.3, 5.4
     */
    populateRouteFallbackInfo() {
        try {
            // Get route information from page data
            const routeLocations = document.getElementById('route-locations');
            if (routeLocations) {
                // Try to get location data from the page
                const pickupLocation = document.querySelector('[data-pickup-address]')?.dataset.pickupAddress;
                const dropoffLocation = document.querySelector('[data-dropoff-address]')?.dataset.dropoffAddress;

                let locationsList = '';
                if (pickupLocation) {
                    locationsList += `<li><strong>Pickup:</strong> ${pickupLocation}</li>`;
                }
                if (dropoffLocation) {
                    locationsList += `<li><strong>Destination:</strong> ${dropoffLocation}</li>`;
                }

                if (locationsList) {
                    routeLocations.innerHTML = locationsList;
                } else {
                    routeLocations.innerHTML = '<li>Route information not available</li>';
                }
            }

        } catch (error) {
            console.error('ErrorStateHandler: Error populating route fallback info:', error);
        }
    }

    /**
     * Handle generic errors
     * Requirements: 5.2, 5.4
     */
    handleGenericError(error, userMessage = null) {
        try {
            console.error('ErrorStateHandler: Generic error:', error);

            this.currentError = {
                type: 'generic_error',
                error: error,
                userMessage: userMessage,
                timestamp: new Date()
            };

            const message = userMessage || 'An unexpected error occurred. Please try refreshing the page.';
            const errorDetails = this.options.showErrorDetails && error ? error.toString() : null;

            const errorContent = `
                <div class="error-icon error">
                    <i class="ri-error-warning-line"></i>
                </div>
                <div class="error-title">Something Went Wrong</div>
                <div class="error-message">${message}</div>
                ${errorDetails ? `<div class="error-details">${errorDetails}</div>` : ''}
                <div class="error-actions">
                    <button class="error-btn error-btn-primary" onclick="errorStateHandler.retryOperation()">
                        Try Again
                    </button>
                    <button class="error-btn error-btn-secondary" onclick="location.reload()">
                        Refresh Page
                    </button>
                </div>
            `;

            this.showError(errorContent);

        } catch (err) {
            console.error('ErrorStateHandler: Error handling generic error:', err);
        }
    }

    /**
     * Show error overlay with content
     * Requirements: 5.2
     */
    showError(content) {
        try {
            if (!this.errorContainer) {
                this.createErrorOverlay();
            }

            this.errorContainer.innerHTML = content;
            this.errorOverlay.style.display = 'flex';

            // Add accessibility attributes
            this.errorOverlay.setAttribute('role', 'dialog');
            this.errorOverlay.setAttribute('aria-modal', 'true');
            this.errorOverlay.setAttribute('aria-labelledby', 'error-title');

            // Focus management for accessibility
            const firstButton = this.errorContainer.querySelector('.error-btn');
            if (firstButton) {
                firstButton.focus();
            }

        } catch (error) {
            console.error('ErrorStateHandler: Error showing error overlay:', error);
        }
    }

    /**
     * Hide error overlay
     * Requirements: 5.2
     */
    hideError() {
        try {
            if (this.errorOverlay) {
                this.errorOverlay.style.display = 'none';
            }

            // Remove fallback overlays
            const fallbackOverlay = document.getElementById('driver-location-fallback');
            if (fallbackOverlay) {
                fallbackOverlay.remove();
            }

            // Clear current error
            this.currentError = null;

        } catch (error) {
            console.error('ErrorStateHandler: Error hiding error overlay:', error);
        }
    }

    /**
     * Update sidebar status
     * Requirements: 5.2
     */
    updateSidebarStatus(message, type = 'info') {
        try {
            // Update connection status in sidebar if element exists
            let statusElement = document.getElementById('sidebar-status');
            if (!statusElement) {
                const sidebar = document.querySelector('.details-sidebar');
                if (sidebar) {
                    statusElement = document.createElement('div');
                    statusElement.id = 'sidebar-status';
                    statusElement.style.cssText = `
                        padding: 12px 20px;
                        margin: 0 -20px 20px -20px;
                        font-size: 14px;
                        font-weight: 500;
                    `;

                    const sidebarHeader = sidebar.querySelector('.sidebar-header');
                    if (sidebarHeader) {
                        sidebarHeader.appendChild(statusElement);
                    }
                }
            }

            if (statusElement) {
                statusElement.textContent = message;

                // Set styling based on type
                const styles = {
                    success: { background: '#d4edda', color: '#155724' },
                    warning: { background: '#fff3cd', color: '#856404' },
                    error: { background: '#f8d7da', color: '#721c24' },
                    info: { background: '#d1ecf1', color: '#0c5460' }
                };

                const style = styles[type] || styles.info;
                statusElement.style.backgroundColor = style.background;
                statusElement.style.color = style.color;
            }

        } catch (error) {
            console.error('ErrorStateHandler: Error updating sidebar status:', error);
        }
    }

    /**
     * Retry current operation
     * Requirements: 5.3
     */
    retryOperation() {
        try {
            if (!this.currentError) {
                console.warn('ErrorStateHandler: No current error to retry');
                return;
            }

            console.log('ErrorStateHandler: Retrying operation:', this.currentError.type);

            // Hide current error
            this.hideError();

            // Dispatch retry event based on error type
            switch (this.currentError.type) {
                case 'ride_not_found':
                    this.dispatchRetryEvent('retry-ride-loading');
                    break;
                case 'driver_location_unavailable':
                    this.dispatchRetryEvent('retry-driver-location');
                    break;
                case 'map_loading_failure':
                    this.dispatchRetryEvent('retry-map-loading');
                    break;
                default:
                    this.dispatchRetryEvent('retry-generic');
                    break;
            }

        } catch (error) {
            console.error('ErrorStateHandler: Error during retry operation:', error);
        }
    }

    /**
     * Retry driver location specifically
     * Requirements: 5.3
     */
    retryDriverLocation() {
        try {
            console.log('ErrorStateHandler: Retrying driver location');
            this.hideError();
            this.dispatchRetryEvent('retry-driver-location');
        } catch (error) {
            console.error('ErrorStateHandler: Error retrying driver location:', error);
        }
    }

    /**
     * Retry map loading specifically
     * Requirements: 5.3
     */
    retryMapLoading() {
        try {
            console.log('ErrorStateHandler: Retrying map loading');
            this.hideError();
            this.dispatchRetryEvent('retry-map-loading');
        } catch (error) {
            console.error('ErrorStateHandler: Error retrying map loading:', error);
        }
    }

    /**
     * Dispatch retry event
     * Requirements: 5.3
     */
    dispatchRetryEvent(eventType) {
        try {
            const event = new CustomEvent(eventType, {
                detail: {
                    error: this.currentError,
                    timestamp: new Date()
                }
            });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('ErrorStateHandler: Error dispatching retry event:', error);
        }
    }

    /**
     * Go to home page
     * Requirements: 5.2
     */
    goToHomePage() {
        try {
            // Try to navigate to home page
            if (window.location.origin) {
                window.location.href = window.location.origin;
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('ErrorStateHandler: Error navigating to home page:', error);
        }
    }

    /**
     * Get current error information
     * Requirements: 5.2
     */
    getCurrentError() {
        return this.currentError;
    }

    /**
     * Clear current error
     * Requirements: 5.2
     */
    clearError() {
        this.currentError = null;
        this.hideError();
    }

    /**
     * Cleanup method
     * Requirements: 5.2
     */
    cleanup() {
        try {
            // Clear timers
            if (this.autoRetryTimer) {
                clearTimeout(this.autoRetryTimer);
                this.autoRetryTimer = null;
            }

            // Remove error overlay
            if (this.errorOverlay && this.errorOverlay.parentNode) {
                this.errorOverlay.parentNode.removeChild(this.errorOverlay);
            }

            // Remove fallback overlays
            const fallbackOverlay = document.getElementById('driver-location-fallback');
            if (fallbackOverlay) {
                fallbackOverlay.remove();
            }

            // Clear error state
            this.currentError = null;

            console.log('ErrorStateHandler: Cleanup completed');

        } catch (error) {
            console.error('ErrorStateHandler: Error during cleanup:', error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorStateHandler;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.ErrorStateHandler = ErrorStateHandler;
}
