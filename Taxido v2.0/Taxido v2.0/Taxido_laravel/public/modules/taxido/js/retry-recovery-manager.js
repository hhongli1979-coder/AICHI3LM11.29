/**
 * RetryRecoveryManager - Handles automatic retry and recovery mechanisms
 *
 * This class provides automatic retry functionality for failed Firebase connecti,
 * manual refresh capabilities, and graceful degradation when real-time features are unavailable.
 *
 * Requirements: 5.1, 5.5
 */
class RetryRecoveryManager {
    constructor(options = {}) {
        this.options = {
            maxAutoRetries: options.maxAutoRetries || 3,
            retryDelay: options.retryDelay || 2000,
            exponentialBackoff: options.exponentialBackoff !== false,
            maxRetryDelay: options.maxRetryDelay || 30000,
            gracefulDegradationEnabled: options.gracefulDegradationEnabled !== false,
            ...options
        };

        // Retry state tracking
        this.retryAttempts = new Map(); // Track retry attempts per operation type
        this.activeRetries = new Set(); // Track currently active retries
        this.retryTimers = new Map(); // Track retry timers

        // Recovery state
        this.degradedMode = false;
        this.availableFeatures = new Set(['basic_info', 'static_map', 'manual_refresh']);
        this.unavailableFeatures = new Set();

        // Event listeners
        this.retryListeners = new Map();

        // Bind methods
        this.retryFirebaseConnection = this.retryFirebaseConnection.bind(this);
        this.retryDriverLocation = this.retryDriverLocation.bind(this);
        this.retryMapLoading = this.retryMapLoading.bind(this);
        this.handleRetryEvent = this.handleRetryEvent.bind(this);
        this.enableGracefulDegradation = this.enableGracefulDegradation.bind(this);

        // Initialize retry system
        this.initializeRetrySystem();
    }

    /**
     * Initialize retry and recovery system
     * Requirements: 5.1, 5.5
     */
    initializeRetrySystem() {
        try {
            // Set up event listeners for retry events
            this.setupRetryEventListeners();

            // Create manual refresh button
            this.createManualRefreshButton();

            // Set up graceful degradation monitoring
            this.setupGracefulDegradationMonitoring();

            console.log('RetryRecoveryManager: Retry and recovery system initialized');
        } catch (error) {
            console.error('RetryRecoveryManager: Failed to initialize retry system:', error);
        }
    }

    /**
     * Set up event listeners for retry events
     * Requirements: 5.1, 5.5
     */
    setupRetryEventListeners() {
        try {
            // Listen for retry events from error handler
            window.addEventListener('retry-ride-loading', this.handleRetryEvent);
            window.addEventListener('retry-driver-location', this.handleRetryEvent);
            window.addEventListener('retry-map-loading', this.handleRetryEvent);
            window.addEventListener('retry-firebase-connection', this.handleRetryEvent);
            window.addEventListener('retry-generic', this.handleRetryEvent);

            console.log('RetryRecoveryManager: Retry event listeners setup');
        } catch (error) {
            console.error('RetryRecoveryManager: Error setting up retry event listeners:', error);
        }
    }

    /**
     * Handle retry events
     * Requirements: 5.1, 5.5
     */
    handleRetryEvent(event) {
        try {
            const eventType = event.type;
            const eventDetail = event.detail || {};

            console.log('RetryRecoveryManager: Handling retry event:', eventType);

            switch (eventType) {
                case 'retry-ride-loading':
                    this.retryRideLoading(eventDetail);
                    break;
                case 'retry-driver-location':
                    this.retryDriverLocation(eventDetail);
                    break;
                case 'retry-map-loading':
                    this.retryMapLoading(eventDetail);
                    break;
                case 'retry-firebase-connection':
                    this.retryFirebaseConnection(eventDetail);
                    break;
                case 'retry-generic':
                    this.retryGenericOperation(eventDetail);
                    break;
                default:
                    console.warn('RetryRecoveryManager: Unknown retry event type:', eventType);
            }

        } catch (error) {
            console.error('RetryRecoveryManager: Error handling retry event:', error);
        }
    }

    /**
     * Retry ride loading
     * Requirements: 5.1, 5.5
     */
    retryRideLoading(eventDetail = {}) {
        return this.executeRetry('ride_loading', async () => {
            console.log('RetryRecoveryManager: Retrying ride loading');

            // Reload the page to fetch fresh ride data
            window.location.reload();

        }, eventDetail);
    }

    /**
     * Retry driver location fetching
     * Requirements: 5.1, 5.5
     */
    retryDriverLocation(eventDetail = {}) {
        return this.executeRetry('driver_location', async () => {
            console.log('RetryRecoveryManager: Retrying driver location');

            // Try to restart the real-time tracking manager
            if (window.realTimeTrackingManager) {
                // Stop current tracking
                window.realTimeTrackingManager.stopTracking();

                // Wait a moment
                await this.delay(1000);

                // Restart tracking
                const success = window.realTimeTrackingManager.startTracking();

                if (!success) {
                    throw new Error('Failed to restart driver location tracking');
                }

                // Remove any fallback overlays
                const fallbackOverlay = document.getElementById('driver-location-fallback');
                if (fallbackOverlay) {
                    fallbackOverlay.remove();
                }

                console.log('RetryRecoveryManager: Driver location retry successful');
                return true;
            } else {
                throw new Error('Real-time tracking manager not available');
            }

        }, eventDetail);
    }

    /**
     * Retry map loading
     * Requirements: 5.1, 5.5
     */
    retryMapLoading(eventDetail = {}) {
        return this.executeRetry('map_loading', async () => {
            console.log('RetryRecoveryManager: Retrying map loading');

            // Try to reinitialize the map
            if (window.mapProvider) {
                // Clear existing map
                const mapContainer = document.getElementById('tracking-map');
                if (mapContainer) {
                    mapContainer.innerHTML = '';
                }

                // Wait a moment
                await this.delay(1000);

                // Reinitialize map
                await window.mapProvider.initializeMap('tracking-map', {
                    center: { lat: 0, lng: 0 },
                    zoom: 10
                });

                console.log('RetryRecoveryManager: Map loading retry successful');
                return true;
            } else {
                // Try to reload the page if map provider is not available
                console.log('RetryRecoveryManager: Map provider not available, reloading page');
                window.location.reload();
            }

        }, eventDetail);
    }

    /**
     * Retry Firebase connection
     * Requirements: 5.1, 5.5
     */
    retryFirebaseConnection(eventDetail = {}) {
        return this.executeRetry('firebase_connection', async () => {
            console.log('RetryRecoveryManager: Retrying Firebase connection');

            // Try to reconnect using connection manager
            if (window.connectionManager) {
                window.connectionManager.forceReconnect();

                // Wait for connection attempt
                await this.delay(3000);

                const connectionInfo = window.connectionManager.getConnectionInfo();
                if (!connectionInfo.isConnected) {
                    throw new Error('Firebase connection retry failed');
                }

                console.log('RetryRecoveryManager: Firebase connection retry successful');
                return true;
            } else {
                throw new Error('Connection manager not available');
            }

        }, eventDetail);
    }

    /**
     * Retry generic operation
     * Requirements: 5.1, 5.5
     */
    retryGenericOperation(eventDetail = {}) {
        return this.executeRetry('generic_operation', async () => {
            console.log('RetryRecoveryManager: Retrying generic operation');

            // For generic operations, try to reload the page
            window.location.reload();

        }, eventDetail);
    }

    /**
     * Execute retry with exponential backoff
     * Requirements: 5.1, 5.5
     */
    async executeRetry(operationType, retryFunction, eventDetail = {}) {
        try {
            // Check if we're already retrying this operation
            if (this.activeRetries.has(operationType)) {
                console.log('RetryRecoveryManager: Retry already in progress for:', operationType);
                return false;
            }

            // Get current retry count
            const currentRetries = this.retryAttempts.get(operationType) || 0;

            // Check if we've exceeded max retries
            if (currentRetries >= this.options.maxAutoRetries) {
                console.warn('RetryRecoveryManager: Max retries exceeded for:', operationType);
                this.enableGracefulDegradation(operationType);
                return false;
            }

            // Mark as active retry
            this.activeRetries.add(operationType);

            // Calculate delay with exponential backoff
            let delay = this.options.retryDelay;
            if (this.options.exponentialBackoff && currentRetries > 0) {
                delay = Math.min(
                    this.options.retryDelay * Math.pow(2, currentRetries),
                    this.options.maxRetryDelay
                );
            }

            // Add jitter to prevent thundering herd
            const jitter = Math.random() * 0.1 * delay;
            const finalDelay = delay + jitter;

            console.log(`RetryRecoveryManager: Retrying ${operationType} in ${Math.round(finalDelay)}ms (attempt ${currentRetries + 1}/${this.options.maxAutoRetries})`);

            // Show retry status to user
            this.showRetryStatus(operationType, currentRetries + 1);

            // Wait for delay
            await this.delay(finalDelay);

            // Execute retry function
            const result = await retryFunction();

            // Success - reset retry count
            this.retryAttempts.set(operationType, 0);
            this.activeRetries.delete(operationType);
            this.hideRetryStatus();

            // Dispatch success event
            this.dispatchRetryEvent('retry-success', {
                operationType,
                attempt: currentRetries + 1,
                result
            });

            return true;

        } catch (error) {
            console.error(`RetryRecoveryManager: Retry failed for ${operationType}:`, error);

            // Increment retry count
            const newRetryCount = (this.retryAttempts.get(operationType) || 0) + 1;
            this.retryAttempts.set(operationType, newRetryCount);
            this.activeRetries.delete(operationType);

            // Check if we should try again
            if (newRetryCount < this.options.maxAutoRetries) {
                // Schedule next retry
                const nextRetryDelay = this.options.exponentialBackoff
                    ? Math.min(this.options.retryDelay * Math.pow(2, newRetryCount), this.options.maxRetryDelay)
                    : this.options.retryDelay;

                const retryTimer = setTimeout(() => {
                    this.executeRetry(operationType, retryFunction, eventDetail);
                }, nextRetryDelay);

                this.retryTimers.set(operationType, retryTimer);
            } else {
                // Max retries exceeded
                this.hideRetryStatus();
                this.enableGracefulDegradation(operationType);

                // Dispatch failure event
                this.dispatchRetryEvent('retry-failed', {
                    operationType,
                    attempts: newRetryCount,
                    error
                });
            }

            return false;
        }
    }

    /**
     * Show retry status to user
     * Requirements: 5.1, 5.5
     */
    showRetryStatus(operationType, attempt) {
        try {
            // Create or update retry status indicator
            let statusElement = document.getElementById('retry-status-indicator');
            if (!statusElement) {
                statusElement = document.createElement('div');
                statusElement.id = 'retry-status-indicator';
                statusElement.style.cssText = `
                    position: fixed;
                    top: 70px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #17a2b8;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    z-index: 9998;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    animation: retryPulse 1.5s infinite;
                `;
                document.body.appendChild(statusElement);
            }

            const operationName = operationType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            statusElement.textContent = `Retrying ${operationName}... (${attempt}/${this.options.maxAutoRetries})`;
            statusElement.style.display = 'block';

        } catch (error) {
            console.error('RetryRecoveryManager: Error showing retry status:', error);
        }
    }

    /**
     * Hide retry status indicator
     * Requirements: 5.1, 5.5
     */
    hideRetryStatus() {
        try {
            const statusElement = document.getElementById('retry-status-indicator');
            if (statusElement) {
                statusElement.style.display = 'none';
            }
        } catch (error) {
            console.error('RetryRecoveryManager: Error hiding retry status:', error);
        }
    }

    /**
     * Create manual refresh button
     * Requirements: 5.1, 5.5
     */
    createManualRefreshButton() {
        try {
            // Add manual refresh button to map controls
            const mapControls = document.querySelector('.map-controls');
            if (mapControls) {
                const refreshButton = document.createElement('button');
                refreshButton.id = 'manual-refresh-btn';
                refreshButton.className = 'map-control-btn';
                refreshButton.setAttribute('aria-label', 'Manually refresh tracking data');
                refreshButton.setAttribute('title', 'Refresh');
                refreshButton.innerHTML = '<i class="ri-refresh-line" aria-hidden="true"></i>';

                refreshButton.addEventListener('click', () => {
                    this.performManualRefresh();
                });

                mapControls.appendChild(refreshButton);
            }

            console.log('RetryRecoveryManager: Manual refresh button created');
        } catch (error) {
            console.error('RetryRecoveryManager: Error creating manual refresh button:', error);
        }
    }

    /**
     * Perform manual refresh
     * Requirements: 5.1, 5.5
     */
    performManualRefresh() {
        try {
            console.log('RetryRecoveryManager: Performing manual refresh');

            // Show loading state
            const refreshButton = document.getElementById('manual-refresh-btn');
            if (refreshButton) {
                refreshButton.disabled = true;
                refreshButton.innerHTML = '<i class="ri-loader-4-line" aria-hidden="true" style="animation: spin 1s linear infinite;"></i>';
            }

            // Try to refresh all components
            this.refreshAllComponents()
                .then(() => {
                    console.log('RetryRecoveryManager: Manual refresh successful');

                    // Show success feedback
                    this.showRefreshFeedback('Refreshed successfully', 'success');
                })
                .catch((error) => {
                    console.error('RetryRecoveryManager: Manual refresh failed:', error);

                    // Show error feedback
                    this.showRefreshFeedback('Refresh failed', 'error');
                })
                .finally(() => {
                    // Reset button state
                    if (refreshButton) {
                        refreshButton.disabled = false;
                        refreshButton.innerHTML = '<i class="ri-refresh-line" aria-hidden="true"></i>';
                    }
                });

        } catch (error) {
            console.error('RetryRecoveryManager: Error performing manual refresh:', error);
        }
    }

    /**
     * Refresh all components
     * Requirements: 5.1, 5.5
     */
    async refreshAllComponents() {
        try {
            const refreshPromises = [];

            // Refresh Firebase connection
            if (window.connectionManager) {
                refreshPromises.push(
                    new Promise((resolve, reject) => {
                        try {
                            window.connectionManager.forceReconnect();
                            setTimeout(() => {
                                const connectionInfo = window.connectionManager.getConnectionInfo();
                                if (connectionInfo.isConnected) {
                                    resolve('Firebase connection refreshed');
                                } else {
                                    reject(new Error('Firebase connection refresh failed'));
                                }
                            }, 3000);
                        } catch (error) {
                            reject(error);
                        }
                    })
                );
            }

            // Refresh real-time tracking
            if (window.realTimeTrackingManager) {
                refreshPromises.push(
                    new Promise((resolve, reject) => {
                        try {
                            window.realTimeTrackingManager.stopTracking();
                            setTimeout(() => {
                                const success = window.realTimeTrackingManager.startTracking();
                                if (success) {
                                    resolve('Real-time tracking refreshed');
                                } else {
                                    reject(new Error('Real-time tracking refresh failed'));
                                }
                            }, 1000);
                        } catch (error) {
                            reject(error);
                        }
                    })
                );
            }

            // Wait for all refresh operations
            const results = await Promise.allSettled(refreshPromises);

            // Check if any critical operations failed
            const failures = results.filter(result => result.status === 'rejected');
            if (failures.length > 0) {
                console.warn('RetryRecoveryManager: Some refresh operations failed:', failures);
            }

            return results;

        } catch (error) {
            console.error('RetryRecoveryManager: Error refreshing components:', error);
            throw error;
        }
    }

    /**
     * Show refresh feedback to user
     * Requirements: 5.1, 5.5
     */
    showRefreshFeedback(message, type = 'info') {
        try {
            // Create feedback element
            const feedback = document.createElement('div');
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease-out;
            `;

            // Set styling based on type
            const styles = {
                success: { background: '#28a745', color: 'white' },
                error: { background: '#dc3545', color: 'white' },
                info: { background: '#17a2b8', color: 'white' }
            };

            const style = styles[type] || styles.info;
            feedback.style.backgroundColor = style.background;
            feedback.style.color = style.color;
            feedback.textContent = message;

            document.body.appendChild(feedback);

            // Remove after delay
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 3000);

        } catch (error) {
            console.error('RetryRecoveryManager: Error showing refresh feedback:', error);
        }
    }

    /**
     * Enable graceful degradation
     * Requirements: 5.1, 5.5
     */
    enableGracefulDegradation(failedOperation) {
        try {
            console.log('RetryRecoveryManager: Enabling graceful degradation for:', failedOperation);

            this.degradedMode = true;

            // Remove failed features from available features
            switch (failedOperation) {
                case 'firebase_connection':
                case 'driver_location':
                    this.unavailableFeatures.add('real_time_tracking');
                    this.unavailableFeatures.add('live_updates');
                    break;
                case 'map_loading':
                    this.unavailableFeatures.add('interactive_map');
                    break;
            }

            // Update UI to reflect degraded mode
            this.updateUIForDegradedMode();

            // Show degradation notice
            this.showDegradationNotice();

        } catch (error) {
            console.error('RetryRecoveryManager: Error enabling graceful degradation:', error);
        }
    }

    /**
     * Update UI for degraded mode
     * Requirements: 5.1, 5.5
     */
    updateUIForDegradedMode() {
        try {
            // Add degraded mode indicator
            const degradedIndicator = document.createElement('div');
            degradedIndicator.id = 'degraded-mode-indicator';
            degradedIndicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #856404;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                z-index: 9997;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            `;
            degradedIndicator.textContent = 'Limited functionality mode - Some features may be unavailable';
            document.body.appendChild(degradedIndicator);

            // Disable unavailable features in UI
            if (this.unavailableFeatures.has('real_time_tracking')) {
                // Update status indicators
                const statusDot = document.querySelector('.status-dot');
                if (statusDot) {
                    statusDot.style.animation = 'none';
                    statusDot.style.backgroundColor = '#6c757d';
                }
            }

        } catch (error) {
            console.error('RetryRecoveryManager: Error updating UI for degraded mode:', error);
        }
    }

    /**
     * Show degradation notice
     * Requirements: 5.1, 5.5
     */
    showDegradationNotice() {
        try {
            // Create notice element
            const notice = document.createElement('div');
            notice.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 8px;
                padding: 24px;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                z-index: 10001;
            `;

            notice.innerHTML = `
                <div style="color: #856404; font-size: 48px; margin-bottom: 16px;">
                    <i class="ri-information-line"></i>
                </div>
                <h3 style="margin: 0 0 12px 0; color: #495057;">Limited Functionality</h3>
                <p style="margin: 0 0 20px 0; color: #6c757d; font-size: 14px;">
                    Some real-time features are currently unavailable. Basic ride information is still accessible.
                </p>
                <button onclick="this.parentNode.remove()" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">OK</button>
            `;

            document.body.appendChild(notice);

            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notice.parentNode) {
                    notice.parentNode.removeChild(notice);
                }
            }, 10000);

        } catch (error) {
            console.error('RetryRecoveryManager: Error showing degradation notice:', error);
        }
    }

    /**
     * Dispatch retry event
     * Requirements: 5.1, 5.5
     */
    dispatchRetryEvent(eventType, detail) {
        try {
            const event = new CustomEvent(eventType, { detail });
            window.dispatchEvent(event);
        } catch (error) {
            console.error('RetryRecoveryManager: Error dispatching retry event:', error);
        }
    }

    /**
     * Setup graceful degradation monitoring
     * Requirements: 5.1, 5.5
     */
    setupGracefulDegradationMonitoring() {
        try {
            // Monitor for recovery opportunities
            setInterval(() => {
                if (this.degradedMode) {
                    this.checkForRecoveryOpportunities();
                }
            }, 30000); // Check every 30 seconds

        } catch (error) {
            console.error('RetryRecoveryManager: Error setting up degradation monitoring:', error);
        }
    }

    /**
     * Check for recovery opportunities
     * Requirements: 5.1, 5.5
     */
    checkForRecoveryOpportunities() {
        try {
            // Check if Firebase connection is restored
            if (this.unavailableFeatures.has('real_time_tracking') && window.connectionManager) {
                const connectionInfo = window.connectionManager.getConnectionInfo();
                if (connectionInfo.isConnected) {
                    console.log('RetryRecoveryManager: Firebase connection restored, attempting recovery');
                    this.attemptFeatureRecovery('real_time_tracking');
                }
            }

        } catch (error) {
            console.error('RetryRecoveryManager: Error checking for recovery opportunities:', error);
        }
    }

    /**
     * Attempt to recover a specific feature
     * Requirements: 5.1, 5.5
     */
    attemptFeatureRecovery(feature) {
        try {
            console.log('RetryRecoveryManager: Attempting to recover feature:', feature);

            switch (feature) {
                case 'real_time_tracking':
                    if (window.realTimeTrackingManager) {
                        const success = window.realTimeTrackingManager.startTracking();
                        if (success) {
                            this.unavailableFeatures.delete('real_time_tracking');
                            this.unavailableFeatures.delete('live_updates');
                            console.log('RetryRecoveryManager: Real-time tracking recovered');
                        }
                    }
                    break;
            }

            // Check if we can exit degraded mode
            if (this.unavailableFeatures.size === 0) {
                this.exitDegradedMode();
            }

        } catch (error) {
            console.error('RetryRecoveryManager: Error attempting feature recovery:', error);
        }
    }

    /**
     * Exit degraded mode
     * Requirements: 5.1, 5.5
     */
    exitDegradedMode() {
        try {
            console.log('RetryRecoveryManager: Exiting degraded mode');

            this.degradedMode = false;

            // Remove degraded mode indicator
            const degradedIndicator = document.getElementById('degraded-mode-indicator');
            if (degradedIndicator) {
                degradedIndicator.remove();
            }

            // Restore UI elements
            const statusDot = document.querySelector('.status-dot');
            if (statusDot) {
                statusDot.style.animation = 'pulse 2s infinite';
                statusDot.style.backgroundColor = '#28a745';
            }

            // Show recovery notice
            this.showRefreshFeedback('Full functionality restored', 'success');

        } catch (error) {
            console.error('RetryRecoveryManager: Error exiting degraded mode:', error);
        }
    }

    /**
     * Utility method to create delay
     * Requirements: 5.1, 5.5
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Get retry statistics
     * Requirements: 5.1, 5.5
     */
    getRetryStats() {
        return {
            retryAttempts: Object.fromEntries(this.retryAttempts),
            activeRetries: Array.from(this.activeRetries),
            degradedMode: this.degradedMode,
            unavailableFeatures: Array.from(this.unavailableFeatures),
            availableFeatures: Array.from(this.availableFeatures)
        };
    }

    /**
     * Reset retry attempts for a specific operation
     * Requirements: 5.1, 5.5
     */
    resetRetryAttempts(operationType) {
        this.retryAttempts.set(operationType, 0);
        this.activeRetries.delete(operationType);

        // Clear any pending retry timer
        const timer = this.retryTimers.get(operationType);
        if (timer) {
            clearTimeout(timer);
            this.retryTimers.delete(operationType);
        }
    }

    /**
     * Cleanup method
     * Requirements: 5.1, 5.5
     */
    cleanup() {
        try {
            // Clear all retry timers
            this.retryTimers.forEach(timer => clearTimeout(timer));
            this.retryTimers.clear();

            // Remove event listeners
            window.removeEventListener('retry-ride-loading', this.handleRetryEvent);
            window.removeEventListener('retry-driver-location', this.handleRetryEvent);
            window.removeEventListener('retry-map-loading', this.handleRetryEvent);
            window.removeEventListener('retry-firebase-connection', this.handleRetryEvent);
            window.removeEventListener('retry-generic', this.handleRetryEvent);

            // Remove UI elements
            const retryStatus = document.getElementById('retry-status-indicator');
            if (retryStatus) retryStatus.remove();

            const degradedIndicator = document.getElementById('degraded-mode-indicator');
            if (degradedIndicator) degradedIndicator.remove();

            const refreshButton = document.getElementById('manual-refresh-btn');
            if (refreshButton) refreshButton.remove();

            // Clear state
            this.retryAttempts.clear();
            this.activeRetries.clear();
            this.retryTimers.clear();
            this.unavailableFeatures.clear();

            console.log('RetryRecoveryManager: Cleanup completed');

        } catch (error) {
            console.error('RetryRecoveryManager: Error during cleanup:', error);
        }
    }
}

// Add CSS for animations
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes retryPulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RetryRecoveryManager;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.RetryRecoveryManager = RetryRecoveryManager;
}
