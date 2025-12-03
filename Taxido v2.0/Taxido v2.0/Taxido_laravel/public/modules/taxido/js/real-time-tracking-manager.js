/**
 * RealTimeTrackingManager - Handles Firebase real-time listeners for ride tracking
 *
 * This class manages Firebase Firestore listeners for real-time updates of driver location
 * and ride status, providing smooth UI updates for the enhanced tracking interface.
 * Integrates with ETA calculation engine and progress tracking manager.
 *
 * Requirements: 1.2, 2.3, 7.4
 */
class RealTimeTrackingManager {
    constructor(rideId, driverId, mapProvider = null, rideData = null) {
        this.rideId = rideId;
        this.driverId = driverId;
        this.mapProvider = mapProvider;
        this.rideData = rideData;
        this.db = null;
        this.isTracking = false;

        // Firebase listeners
        this.driverLocationListener = null;
        this.rideStatusListener = null;

        // Integrated components
        this.etaEngine = null;
        this.progressTracker = null;
        this.statusTimeline = null;

        // Debouncing for performance
        this.updateDebounceTimeout = null;
        this.debounceDelay = 500; // 500ms debounce

        // Connection status
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;

        // Bind methods to preserve context
        this.handleDriverLocationUpdate = this.handleDriverLocationUpdate.bind(this);
        this.handleRideStatusUpdate = this.handleRideStatusUpdate.bind(this);
        this.handleConnectionError = this.handleConnectionError.bind(this);

        // Initialize components
        this.initializeComponents();

        // Initialize Firebase if not already done
        this.initializeFirebase();
    }

    /**
     * Initialize integrated components
     * Requirements: 7.1, 7.3, 2.3
     */
    initializeComponents() {
        try {
            // Initialize ETA calculation engine
            if (typeof ETACalculationEngine !== 'undefined') {
                this.etaEngine = new ETACalculationEngine(this.mapProvider);
                console.log('RealTimeTrackingManager: ETA engine initialized');
            }

            // Initialize progress tracking manager
            if (typeof ProgressTrackingManager !== 'undefined') {
                this.progressTracker = new ProgressTrackingManager(this.mapProvider, this.etaEngine);
                if (this.rideData) {
                    this.progressTracker.initialize(this.rideData);
                }
                console.log('RealTimeTrackingManager: Progress tracker initialized');
            }

            // Initialize status timeline component
            if (typeof StatusTimelineComponent !== 'undefined') {
                this.statusTimeline = new StatusTimelineComponent('status-timeline');
                if (this.rideData && this.rideData.status_history) {
                    this.statusTimeline.updateTimeline(this.rideData.status_history, this.rideData.ride_status?.name);
                }
                console.log('RealTimeTrackingManager: Status timeline initialized');
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Component initialization failed:', error);
        }
    }

    /**
     * Initialize Firebase connection
     * Requirements: 1.2
     */
    initializeFirebase() {
        try {
            // Check if Firebase is already initialized
            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                this.db = firebase.firestore();
                console.log('RealTimeTrackingManager: Firebase connection established');
            } else {
                throw new Error('Firebase not initialized');
            }
        } catch (error) {
            console.error('RealTimeTrackingManager: Firebase initialization failed:', error);
            this.handleConnectionError(error);
        }
    }

    /**
     * Start real-time tracking by setting up Firebase listeners
     * Requirements: 1.2, 2.3
     */
    startTracking() {
        if (!this.db) {
            console.error('RealTimeTrackingManager: Firebase not initialized');
            return false;
        }

        if (this.isTracking) {
            console.warn('RealTimeTrackingManager: Tracking already started');
            return true;
        }

        try {
            this.isTracking = true;
            this.setupDriverLocationListener();
            this.setupRideStatusListener();

            console.log('RealTimeTrackingManager: Started tracking for ride:', this.rideId);
            return true;
        } catch (error) {
            console.error('RealTimeTrackingManager: Failed to start tracking:', error);
            this.handleConnectionError(error);
            return false;
        }
    }

    /**
     * Stop real-time tracking and cleanup listeners
     * Requirements: 1.2
     */
    stopTracking() {
        if (!this.isTracking) {
            return;
        }

        try {
            // Cleanup driver location listener
            if (this.driverLocationListener) {
                this.driverLocationListener();
                this.driverLocationListener = null;
            }

            // Cleanup ride status listener
            if (this.rideStatusListener) {
                this.rideStatusListener();
                this.rideStatusListener = null;
            }

            // Clear any pending debounced updates
            if (this.updateDebounceTimeout) {
                clearTimeout(this.updateDebounceTimeout);
                this.updateDebounceTimeout = null;
            }

            this.isTracking = false;
            console.log('RealTimeTrackingManager: Stopped tracking for ride:', this.rideId);
        } catch (error) {
            console.error('RealTimeTrackingManager: Error stopping tracking:', error);
        }
    }

    /**
     * Set up Firebase listener for driver location updates
     * Requirements: 1.2, 2.3
     */
    setupDriverLocationListener() {
        if (!this.driverId) {
            console.warn('RealTimeTrackingManager: No driver ID provided for location tracking');
            return;
        }

        try {
            const driverTrackRef = this.db.collection('driverTrack').doc(this.driverId);

            this.driverLocationListener = driverTrackRef.onSnapshot(
                (doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.handleDriverLocationUpdate(data);
                    } else {
                        console.warn('RealTimeTrackingManager: Driver location document not found');
                    }
                },
                (error) => {
                    console.error('RealTimeTrackingManager: Driver location listener error:', error);
                    this.handleConnectionError(error);
                }
            );

            console.log('RealTimeTrackingManager: Driver location listener setup for driver:', this.driverId);
        } catch (error) {
            console.error('RealTimeTrackingManager: Failed to setup driver location listener:', error);
            this.handleConnectionError(error);
        }
    }

    /**
     * Set up Firebase listener for ride status updates
     * Requirements: 1.2, 2.3
     */
    setupRideStatusListener() {
        if (!this.rideId) {
            console.warn('RealTimeTrackingManager: No ride ID provided for status tracking');
            return;
        }

        try {
            const rideRef = this.db.collection('rides').doc(this.rideId);

            this.rideStatusListener = rideRef.onSnapshot(
                (doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        this.handleRideStatusUpdate(data);
                    } else {
                        console.warn('RealTimeTrackingManager: Ride document not found');
                    }
                },
                (error) => {
                    console.error('RealTimeTrackingManager: Ride status listener error:', error);
                    this.handleConnectionError(error);
                }
            );

            console.log('RealTimeTrackingManager: Ride status listener setup for ride:', this.rideId);
        } catch (error) {
            console.error('RealTimeTrackingManager: Failed to setup ride status listener:', error);
            this.handleConnectionError(error);
        }
    }

    /**
     * Handle driver location updates from Firebase
     * Requirements: 1.2, 2.3, 7.4
     */
    handleDriverLocationUpdate(data) {
        try {
            // Validate location data
            if (!data || typeof data.lat !== 'number' || typeof data.lng !== 'number') {
                console.warn('RealTimeTrackingManager: Invalid driver location data:', data);
                return;
            }

            // Debounce rapid updates for performance
            if (this.updateDebounceTimeout) {
                clearTimeout(this.updateDebounceTimeout);
            }

            this.updateDebounceTimeout = setTimeout(() => {
                this.processDriverLocationUpdate(data);
            }, this.debounceDelay);

        } catch (error) {
            console.error('RealTimeTrackingManager: Error handling driver location update:', error);
        }
    }

    /**
     * Process debounced driver location update
     * Requirements: 1.2, 2.3, 7.1, 7.3
     */
    processDriverLocationUpdate(data) {
        try {
            console.log('RealTimeTrackingManager: Processing driver location update:', data);

            // Update map if map provider is available
            if (this.mapProvider && typeof this.mapProvider.updateDriverPosition === 'function') {
                this.mapProvider.updateDriverPosition(data.lat, data.lng, true);
            }

            // Update driver information in UI
            this.updateDriverInfo(data);

            // Calculate and update ETA using ETA engine
            this.updateETAWithEngine(data);

            // Update progress tracking
            this.updateProgressTracking(data);

            // Update last seen timestamp
            this.updateLastSeen(data.last_updated || new Date().toISOString());

        } catch (error) {
            console.error('RealTimeTrackingManager: Error processing driver location update:', error);
        }
    }

    /**
     * Handle ride status updates from Firebase
     * Requirements: 2.3, 7.4
     */
    handleRideStatusUpdate(data) {
        try {
            console.log('RealTimeTrackingManager: Processing ride status update:', data);

            // Update ride status display
            if (data.ride_status) {
                this.updateRideStatus(data.ride_status);

                // Update status timeline with new status
                if (this.statusTimeline) {
                    this.statusTimeline.updateCurrentStatus(data.ride_status.name);
                }
            }

            // Update status timeline with full history
            if (data.status_history && this.statusTimeline) {
                this.statusTimeline.updateTimeline(data.status_history, data.ride_status?.name);
            }

            // Update ETA if available
            if (data.estimated_arrival) {
                this.updateETADisplay(data.estimated_arrival);
            }

            // Update progress if available
            if (data.distance_remaining !== undefined) {
                this.updateRideProgress(data);
            }

            // Store updated ride data
            if (data) {
                this.rideData = { ...this.rideData, ...data };
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error handling ride status update:', error);
        }
    }

    /**
     * Update driver information in the UI
     * Requirements: 2.3
     */
    updateDriverInfo(data) {
        try {
            // Update driver online status
            const statusDot = document.querySelector('.status-dot');
            if (statusDot && data.is_online) {
                statusDot.style.backgroundColor = data.is_online === '1' ? '#28a745' : '#6c757d';
            }

            // Update driver name if available
            if (data.driver_name) {
                const driverNameElement = document.getElementById('driver-name');
                if (driverNameElement) {
                    driverNameElement.textContent = data.driver_name;
                }
            }

            // Update vehicle information if available
            if (data.plate_number) {
                const plateElement = document.getElementById('vehicle-plate-number');
                if (plateElement) {
                    plateElement.textContent = data.plate_number;
                }
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating driver info:', error);
        }
    }

    /**
     * Update ride status display
     * Requirements: 2.3
     */
    updateRideStatus(statusData) {
        try {
            const statusElement = document.getElementById('ride-status');
            if (statusElement && statusData.name) {
                statusElement.textContent = statusData.name.replace('_', ' ').toUpperCase();

                // Update status color based on status
                const statusClasses = {
                    'confirmed': 'badge-info',
                    'driver_assigned': 'badge-primary',
                    'on_the_way': 'badge-warning',
                    'arrived': 'badge-warning',
                    'started': 'badge-success',
                    'completed': 'badge-success',
                    'cancelled': 'badge-danger'
                };

                // Remove existing badge classes
                statusElement.className = statusElement.className.replace(/badge-\w+/g, '');

                // Add new status class
                const statusClass = statusClasses[statusData.name] || 'badge-info';
                statusElement.classList.add(statusClass);
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating ride status:', error);
        }
    }

    /**
     * Update status timeline
     * Requirements: 2.3
     */
    updateStatusTimeline(statusHistory) {
        try {
            if (!Array.isArray(statusHistory)) {
                return;
            }

            // Update current status in timeline
            const currentStatusItem = document.getElementById('current-status-item');
            const currentStatusTitle = document.getElementById('current-status-title');
            const currentStatusTime = document.getElementById('current-status-time');

            if (currentStatusItem && statusHistory.length > 0) {
                const latestStatus = statusHistory[statusHistory.length - 1];

                if (currentStatusTitle) {
                    currentStatusTitle.textContent = latestStatus.status.replace('_', ' ').toUpperCase();
                }

                if (currentStatusTime && latestStatus.timestamp) {
                    const time = new Date(latestStatus.timestamp);
                    currentStatusTime.textContent = time.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating status timeline:', error);
        }
    }

    /**
     * Update ETA using the ETA calculation engine
     * Requirements: 7.1, 7.3
     */
    updateETAWithEngine(driverData) {
        try {
            if (!this.etaEngine || !this.rideData) {
                this.updateETA(driverData); // Fallback to simple ETA
                return;
            }

            // Get destination from ride data
            const destination = this.getDestination();
            if (!destination) {
                console.warn('RealTimeTrackingManager: No destination available for ETA calculation');
                return;
            }

            // Calculate ETA using the engine
            this.etaEngine.updateETA({
                lat: driverData.lat,
                lng: driverData.lng
            }).then(etaResult => {
                if (etaResult) {
                    this.displayETAResult(etaResult);
                }
            }).catch(error => {
                console.error('RealTimeTrackingManager: ETA calculation failed:', error);
                this.updateETA(driverData); // Fallback
            });

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating ETA with engine:', error);
            this.updateETA(driverData); // Fallback
        }
    }

    /**
     * Update progress tracking with new driver location
     * Requirements: 7.3, 7.5
     */
    updateProgressTracking(driverData) {
        try {
            if (!this.progressTracker) {
                console.warn('RealTimeTrackingManager: Progress tracker not available');
                return;
            }

            // Update progress with new driver location
            this.progressTracker.updateProgress({
                lat: driverData.lat,
                lng: driverData.lng
            }, {
                speed: driverData.speed,
                heading: driverData.heading,
                timestamp: driverData.last_updated
            });

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating progress tracking:', error);
        }
    }

    /**
     * Display ETA calculation result
     * Requirements: 7.1, 7.3
     */
    displayETAResult(etaResult) {
        try {
            const etaElement = document.getElementById('eta-time');
            if (etaElement && etaResult.durationMinutes !== undefined) {
                if (etaResult.durationMinutes > 0) {
                    etaElement.textContent = `${etaResult.durationMinutes} min`;
                } else {
                    etaElement.textContent = 'Arriving now';
                }

                // Add confidence indicator
                etaElement.setAttribute('data-confidence', etaResult.confidence || 'medium');
                etaElement.setAttribute('title', `ETA calculated using ${etaResult.source || 'unknown'} method`);
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error displaying ETA result:', error);
        }
    }

    /**
     * Get destination coordinates from ride data
     * Requirements: 7.1
     */
    getDestination() {
        try {
            if (this.rideData && this.rideData.location_coordinates && this.rideData.location_coordinates.length > 0) {
                // Return the last coordinate as destination
                return this.rideData.location_coordinates[this.rideData.location_coordinates.length - 1];
            }
            return null;

        } catch (error) {
            console.error('RealTimeTrackingManager: Error getting destination:', error);
            return null;
        }
    }

    /**
     * Update ETA display (fallback method)
     * Requirements: 7.1, 7.3
     */
    updateETA(driverData) {
        try {
            // This is a simplified ETA calculation
            // In a real implementation, you would use routing services
            const etaElement = document.getElementById('eta-time');
            if (etaElement) {
                // For now, show "Calculating..." as we need route data for accurate ETA
                etaElement.textContent = 'Calculating...';
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating ETA:', error);
        }
    }

    /**
     * Update ETA display with specific time
     * Requirements: 7.1, 7.3
     */
    updateETADisplay(estimatedArrival) {
        try {
            const etaElement = document.getElementById('eta-time');
            if (etaElement && estimatedArrival) {
                const eta = new Date(estimatedArrival);
                const now = new Date();
                const diffMinutes = Math.round((eta - now) / (1000 * 60));

                if (diffMinutes > 0) {
                    etaElement.textContent = `${diffMinutes} min`;
                } else {
                    etaElement.textContent = 'Arriving now';
                }
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating ETA display:', error);
        }
    }

    /**
     * Update ride progress
     * Requirements: 7.3
     */
    updateRideProgress(rideData) {
        try {
            const progressBar = document.getElementById('progress-bar');
            const progressPercentage = document.getElementById('progress-percentage');

            if (progressBar && rideData.distance_remaining !== undefined) {
                // Calculate progress based on distance remaining
                // This is a simplified calculation - in reality you'd need total distance
                const totalDistance = rideData.total_distance || 10; // Default fallback
                const remaining = rideData.distance_remaining || 0;
                const progress = Math.max(0, Math.min(100, ((totalDistance - remaining) / totalDistance) * 100));

                progressBar.style.width = `${progress}%`;

                if (progressPercentage) {
                    progressPercentage.textContent = `${Math.round(progress)}%`;
                }
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating ride progress:', error);
        }
    }

    /**
     * Update last seen timestamp
     * Requirements: 2.3
     */
    updateLastSeen(timestamp) {
        try {
            // You could add a "last updated" indicator in the UI
            console.log('RealTimeTrackingManager: Driver location last updated:', timestamp);

        } catch (error) {
            console.error('RealTimeTrackingManager: Error updating last seen:', error);
        }
    }

    /**
     * Handle connection errors and implement reconnection logic
     * Requirements: 1.2
     */
    handleConnectionError(error) {
        try {
            console.error('RealTimeTrackingManager: Connection error:', error);
            this.isConnected = false;

            // Show connection status to user
            this.showConnectionStatus('Connection lost. Attempting to reconnect...');

            // Attempt reconnection with exponential backoff
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
                this.reconnectAttempts++;

                setTimeout(() => {
                    this.attemptReconnection();
                }, delay);
            } else {
                this.showConnectionStatus('Connection failed. Please refresh the page.');
            }

        } catch (err) {
            console.error('RealTimeTrackingManager: Error handling connection error:', err);
        }
    }

    /**
     * Attempt to reconnect to Firebase
     * Requirements: 1.2
     */
    attemptReconnection() {
        try {
            console.log('RealTimeTrackingManager: Attempting reconnection...');

            // Stop current tracking
            this.stopTracking();

            // Reinitialize Firebase
            this.initializeFirebase();

            // Restart tracking
            if (this.startTracking()) {
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.showConnectionStatus('Connected');

                // Hide connection status after a delay
                setTimeout(() => {
                    this.hideConnectionStatus();
                }, 3000);
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Reconnection failed:', error);
            this.handleConnectionError(error);
        }
    }

    /**
     * Show connection status to user
     * Requirements: 1.2
     */
    showConnectionStatus(message) {
        try {
            // Create or update connection status indicator
            let statusElement = document.getElementById('connection-status');
            if (!statusElement) {
                statusElement = document.createElement('div');
                statusElement.id = 'connection-status';
                statusElement.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffc107;
                    color: #000;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 14px;
                    font-weight: 500;
                    z-index: 9999;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                `;
                document.body.appendChild(statusElement);
            }

            statusElement.textContent = message;
            statusElement.style.display = 'block';

        } catch (error) {
            console.error('RealTimeTrackingManager: Error showing connection status:', error);
        }
    }

    /**
     * Hide connection status indicator
     * Requirements: 1.2
     */
    hideConnectionStatus() {
        try {
            const statusElement = document.getElementById('connection-status');
            if (statusElement) {
                statusElement.style.display = 'none';
            }

        } catch (error) {
            console.error('RealTimeTrackingManager: Error hiding connection status:', error);
        }
    }

    /**
     * Get current connection status
     * Requirements: 1.2
     */
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            isTracking: this.isTracking,
            reconnectAttempts: this.reconnectAttempts
        };
    }

    /**
     * Set ride data for components
     * Requirements: 7.1, 7.3, 2.3
     */
    setRideData(rideData) {
        try {
            this.rideData = rideData;

            // Update progress tracker with ride data
            if (this.progressTracker && rideData) {
                this.progressTracker.initialize(rideData);
            }

            // Update status timeline with ride data
            if (this.statusTimeline && rideData) {
                if (rideData.status_history) {
                    this.statusTimeline.updateTimeline(rideData.status_history, rideData.ride_status?.name);
                }
            }

            console.log('RealTimeTrackingManager: Ride data updated');

        } catch (error) {
            console.error('RealTimeTrackingManager: Error setting ride data:', error);
        }
    }

    /**
     * Get integrated component status
     * Requirements: 7.1, 7.3, 2.3
     */
    getComponentStatus() {
        return {
            etaEngine: this.etaEngine ? this.etaEngine.getStatus() : null,
            progressTracker: this.progressTracker ? this.progressTracker.getProgressStatus() : null,
            statusTimeline: this.statusTimeline ? this.statusTimeline.getStatus() : null,
            hasRideData: !!this.rideData
        };
    }

    /**
     * Cleanup method to be called on page unload
     * Requirements: 1.2, 7.1, 7.3, 2.3
     */
    cleanup() {
        this.stopTracking();
        this.hideConnectionStatus();

        // Cleanup integrated components
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

        console.log('RealTimeTrackingManager: Cleanup completed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealTimeTrackingManager;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.RealTimeTrackingManager = RealTimeTrackingManager;
}
