/**
 * Simple Real-time Tracking
 *
 * Simple implementation for real-time ride tracking with Firebase.
 * Shows ride details and moves vehicle on map in real-time.
 */
class SimpleTracking {
    constructor(config) {
        this.config = config;
        this.db = null;
        this.mapProvider = null;
        this.driverMarker = null;
        this.unsubscribeRide = null;
        this.unsubscribeDriver = null;

        this.init();
    }

    init() {
        try {
            // Initialize Firebase
            if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
                this.db = firebase.firestore();
                console.log('SimpleTracking: Firebase initialized');
            } else {
                throw new Error('Firebase not available');
            }

            // Get map provider
            this.mapProvider = window.mapProvider || null;

            // Start tracking
            this.startTracking();

            console.log('SimpleTracking: Initialized successfully');
        } catch (error) {
            console.error('SimpleTracking: Initialization failed:', error);
        }
    }

    startTracking() {
        // Listen to ride updates
        if (this.config.rideId) {
            const rideRef = this.db.collection('rides').doc(this.config.rideId.toString());
            this.unsubscribeRide = rideRef.onSnapshot(
                (doc) => this.handleRideUpdate(doc),
                (error) => console.error('Ride tracking error:', error)
            );
        }

        // Listen to driver location updates
        if (this.config.driverId) {
            const driverRef = this.db.collection('driverTrack').doc(this.config.driverId.toString());
            this.unsubscribeDriver = driverRef.onSnapshot(
                (doc) => this.handleDriverUpdate(doc),
                (error) => console.error('Driver tracking error:', error)
            );
        }
    }

    handleRideUpdate(doc) {
        if (!doc.exists) return;

        const rideData = doc.data();
        console.log('Ride updated:', rideData);

        // Update ride status
        this.updateRideStatus(rideData.ride_status);

        // Update ride details
        this.updateRideDetails(rideData);
    }

    handleDriverUpdate(doc) {
        if (!doc.exists) return;

        const driverData = doc.data();
        console.log('Driver location updated:', driverData);

        // Update driver position on map
        if (driverData.lat && driverData.lng) {
            this.updateDriverPosition(driverData.lat, driverData.lng);
        }

        // Update driver info
        this.updateDriverInfo(driverData);
    }

    updateRideStatus(status) {
        if (!status) return;

        const statusElement = document.getElementById('ride-status');
        if (statusElement) {
            statusElement.textContent = status.name.replace('_', ' ').toUpperCase();
        }

        // Update current status in timeline
        const currentStatusTitle = document.getElementById('current-status-title');
        if (currentStatusTitle) {
            currentStatusTitle.textContent = status.name.replace('_', ' ');
        }

        const currentStatusTime = document.getElementById('current-status-time');
        if (currentStatusTime) {
            currentStatusTime.textContent = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Update progress based on status
        this.updateProgress(status.name);
    }

    updateProgress(statusName) {
        let progress = 0;

        switch (statusName) {
            case 'confirmed':
                progress = 10;
                break;
            case 'driver_assigned':
                progress = 25;
                break;
            case 'on_the_way':
                progress = 50;
                break;
            case 'arrived':
                progress = 75;
                break;
            case 'started':
                progress = 85;
                break;
            case 'completed':
                progress = 100;
                break;
            default:
                progress = 0;
        }

        const progressBar = document.getElementById('progress-bar');
        const progressPercentage = document.getElementById('progress-percentage');

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (progressPercentage) {
            progressPercentage.textContent = `${progress}%`;
        }
    }

    updateRideDetails(rideData) {
        // Update various ride details in the UI
        if (rideData.sub_total) {
            this.updateElement('subtotal', `${this.config.currencySymbol}${Number(rideData.sub_total).toFixed(2)}`);
        }

        if (rideData.total) {
            this.updateElement('total-bill', `${this.config.currencySymbol}${Number(rideData.total).toFixed(2)}`);
        }

        if (rideData.platform_fees) {
            this.updateElement('platform-fees', `${this.config.currencySymbol}${Number(rideData.platform_fees).toFixed(2)}`);
        }

        if (rideData.tax) {
            this.updateElement('tax', `${this.config.currencySymbol}${Number(rideData.tax).toFixed(2)}`);
        }
    }

    updateDriverPosition(lat, lng) {
        if (!this.mapProvider) {
            console.warn('SimpleTracking: No map provider available');
            return;
        }

        try {
            // Update driver marker position
            if (typeof this.mapProvider.updateDriverPosition === 'function') {
                this.mapProvider.updateDriverPosition(lat, lng, true);
            } else {
                console.warn('SimpleTracking: Map provider does not support updateDriverPosition');
            }
        } catch (error) {
            console.error('SimpleTracking: Error updating driver position:', error);
        }
    }

    updateDriverInfo(driverData) {
        // Update driver online status
        const statusDot = document.querySelector('.status-dot');
        if (statusDot && driverData.is_online) {
            statusDot.style.backgroundColor = driverData.is_online === '1' ? '#28a745' : '#6c757d';
        }

        // Update driver name if available
        if (driverData.driver_name) {
            this.updateElement('driver-name', driverData.driver_name);
        }

        // Update vehicle plate number if available
        if (driverData.plate_number) {
            this.updateElement('vehicle-plate-number', driverData.plate_number);
        }
    }

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    // Map control methods
    centerOnDriver() {
        if (this.mapProvider && typeof this.mapProvider.centerOnDriver === 'function') {
            this.mapProvider.centerOnDriver();
        }
    }

    toggleMapType() {
        if (this.mapProvider && typeof this.mapProvider.toggleMapType === 'function') {
            this.mapProvider.toggleMapType();
        }
    }

    zoomIn() {
        if (this.mapProvider && typeof this.mapProvider.zoomIn === 'function') {
            this.mapProvider.zoomIn();
        }
    }

    zoomOut() {
        if (this.mapProvider && typeof this.mapProvider.zoomOut === 'function') {
            this.mapProvider.zoomOut();
        }
    }

    // Cleanup
    cleanup() {
        if (this.unsubscribeRide) {
            this.unsubscribeRide();
        }
        if (this.unsubscribeDriver) {
            this.unsubscribeDriver();
        }
        console.log('SimpleTracking: Cleanup completed');
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.SimpleTracking = SimpleTracking;
}
