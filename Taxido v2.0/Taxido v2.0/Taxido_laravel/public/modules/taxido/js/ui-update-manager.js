/**
 * UIUpdateManager - Handles real-time UI updates for ride tracking
 *
 * This class manages smooth UI updates when Firebase data changes, including
 * driver position animation, ride details refresh, status timeline updates,
 * and ETA calculations.
 *
 * Requirements: 1.3, 2.3, 7.1, 7.3
 */
class UIUpdateManager {
    constructor(mapProvider = null) {
        this.mapProvider = mapProvider;
        this.animationQueue = [];
        this.isAnimating = false;
        this.lastDriverPosition = null;
        this.lastUpdateTime = null;

        // Animation settings
        this.animationDuration = 1000; // 1 second for smooth trans
       this.debounceDelay = 300; // 300ms debounce for rapid updates
        this.debounceTimeouts = new Map();

        // Status color mappings
        this.statusColorClasses = {
            'confirmed': 'badge-info',
            'driver_assigned': 'badge-primary',
            'on_the_way': 'badge-warning',
            'arrived': 'badge-warning',
            'started': 'badge-success',
            'in_progress': 'badge-success',
            'completed': 'badge-success',
            'cancelled': 'badge-danger'
        };

        // Timeline status mappings
        this.timelineStatuses = [
            'confirmed',
            'driver_assigned',
            'on_the_way',
            'arrived',
            'started',
            'completed'
        ];

        console.log('UIUpdateManager: Initialized');
    }

    /**
     * Update driver position with smooth animation
     * Requirements: 1.3, 2.3
     */
    updateDriverPosition(lat, lng, animate = true, driverData = {}) {
        try {
            const newPosition = { lat, lng };

            // Validate coordinates
            if (typeof lat !== 'number' || typeof lng !== 'number' ||
                lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                console.warn('UIUpdateManager: Invalid coordinates:', { lat, lng });
                return false;
            }

            // Debounce rapid position updates
            this.debounceUpdate('driverPosition', () => {
                this.processDriverPositionUpdate(newPosition, animate, driverData);
            });

            return true;

        } catch (error) {
            console.error('UIUpdateManager: Error updating driver position:', error);
            return false;
        }
    }

    /**
     * Process debounced driver position update
     * Requirements: 1.3, 2.3
     */
    processDriverPositionUpdate(position, animate, driverData) {
        try {
            // Update map if map provider is available
            if (this.mapProvider && typeof this.mapProvider.updateDriverPosition === 'function') {
                this.mapProvider.updateDriverPosition(position.lat, position.lng, animate);
            }

            // Update driver status indicators
            this.updateDriverStatusIndicators(driverData);

            // Update last position for calculations
            this.lastDriverPosition = position;
            this.lastUpdateTime = new Date();

            // Trigger position-dependent updates
            this.updatePositionDependentElements(position, driverData);

            console.log('UIUpdateManager: Driver position updated:', position);

        } catch (error) {
            console.error('UIUpdateManager: Error processing driver position update:', error);
        }
    }

    /**
     * Update driver status indicators
     * Requirements: 2.3
     */
    updateDriverStatusIndicators(driverData) {
        try {
            // Update online status dot
            const statusDot = document.querySelector('.status-dot');
            if (statusDot && driverData.is_online !== undefined) {
                const isOnline = driverData.is_online === '1' || driverData.is_online === true;
                statusDot.style.backgroundColor = isOnline ? '#28a745' : '#6c757d';
                statusDot.style.animation = isOnline ? 'pulse 2s infinite' : 'none';
            }

            // Update driver name if available
            if (driverData.driver_name) {
                const driverNameElement = document.getElementById('driver-name');
                if (driverNameElement && driverNameElement.textContent !== driverData.driver_name) {
                    this.animateTextChange(driverNameElement, driverData.driver_name);
                }
            }

            // Update vehicle plate number
            if (driverData.plate_number) {
                const plateElement = document.getElementById('vehicle-plate-number');
                if (plateElement && plateElement.textContent !== driverData.plate_number) {
                    this.animateTextChange(plateElement, driverData.plate_number);
                }
            }

        } catch (error) {
            console.error('UIUpdateManager: Error updating driver status indicators:', error);
        }
    }

    /**
     * Update ride details in sidebar
     * Requirements: 2.3
     */
    updateRideDetails(rideData) {
        try {
            // Debounce ride details updates
            this.debounceUpdate('rideDetails', () => {
                this.processRideDetailsUpdate(rideData);
            });

        } catch (error) {
            console.error('UIUpdateManager: Error updating ride details:', error);
        }
    }

    /**
     * Process debounced ride details update
     * Requirements: 2.3
     */
    processRideDetailsUpdate(rideData) {
        try {
            // Update ride status
            if (rideData.ride_status) {
                this.updateRideStatus(rideData.ride_status);
            }

            // Update ride progress
            if (rideData.distance_remaining !== undefined || rideData.progress !== undefined) {
                this.updateRideProgress(rideData);
            }

            // Update billing information
            if (rideData.fare_details) {
                this.updateBillingInfo(rideData.fare_details);
            }

            // Update ETA
            if (rideData.estimated_arrival) {
                this.updateETA(rideData.estimated_arrival);
            }

            console.log('UIUpdateManager: Ride details updated');

        } catch (error) {
            console.error('UIUpdateManager: Error processing ride details update:', error);
        }
    }

    /**
     * Update ride status with animation
     * Requirements: 2.3
     */
    updateRideStatus(statusData) {
        try {
            const statusElement = document.getElementById('ride-status');
            if (!statusElement || !statusData.name) {
                return;
            }

            const newStatus = statusData.name.toLowerCase();
            const currentStatus = statusElement.textContent.toLowerCase().replace(/\s+/g, '_');

            if (currentStatus !== newStatus) {
                // Animate status change
                this.animateStatusChange(statusElement, statusData);

                // Update timeline
                this.updateStatusTimeline(statusData);
            }

        } catch (error) {
            console.error('UIUpdateManager: Error updating ride status:', error);
        }
    }

    /**
     * Animate status change with visual feedback
     * Requirements: 2.3
     */
    animateStatusChange(element, statusData) {
        try {
            const newStatus = statusData.name.toLowerCase();
            const displayText = newStatus.replace(/_/g, ' ').toUpperCase();

            // Add animation class
            element.style.transition = 'all 0.3s ease';
            element.style.transform = 'scale(1.1)';

            setTimeout(() => {
                // Update text and classes
                element.textContent = displayText;

                // Remove old badge classes
                element.className = element.className.replace(/badge-\w+/g, '');

                // Add new status class
                const statusClass = this.statusColorClasses[newStatus] || 'badge-info';
                element.classList.add(statusClass);

                // Reset animation
                element.style.transform = 'scale(1)';

                // Show brief highlight
                element.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)';
                setTimeout(() => {
                    element.style.boxShadow = '';
                }, 1000);

            }, 150);

        } catch (error) {
            console.error('UIUpdateManager: Error animating status change:', error);
        }
    }

    /**
     * Update status timeline with new status changes
     * Requirements: 2.3, 7.4
     */
    updateStatusTimeline(statusData) {
        try {
            const timeline = document.querySelector('.status-timeline');
            if (!timeline) {
                return;
            }

            const currentStatus = statusData.name.toLowerCase();
            const currentTime = statusData.timestamp ?
                new Date(statusData.timestamp) : new Date();

            // Update current status item
            const currentStatusItem = document.getElementById('current-status-item');
            const currentStatusTitle = document.getElementById('current-status-title');
            const currentStatusTime = document.getElementById('current-status-time');

            if (currentStatusTitle) {
                const displayText = currentStatus.replace(/_/g, ' ').toUpperCase();
                this.animateTextChange(currentStatusTitle, displayText);
            }

            if (currentStatusTime) {
                const timeString = currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                this.animateTextChange(currentStatusTime, timeString);
            }

            // Update timeline progress
            this.updateTimelineProgress(currentStatus);

        } catch (error) {
            console.error('UIUpdateManager: Error updating status timeline:', error);
        }
    }

    /**
     * Update timeline progress based on current status
     * Requirements: 2.3
     */
    updateTimelineProgress(currentStatus) {
        try {
            const timelineItems = document.querySelectorAll('.timeline-item');
            const currentIndex = this.timelineStatuses.indexOf(currentStatus);

            timelineItems.forEach((item, index) => {
                const dot = item.querySelector('.timeline-dot');
                if (!dot) return;

                // Remove existing classes
                item.classList.remove('active', 'current');

                if (index < currentIndex) {
                    // Completed status
                    item.classList.add('active');
                    dot.style.backgroundColor = '#28a745';
                } else if (index === currentIndex) {
                    // Current status
                    item.classList.add('current');
                    dot.style.backgroundColor = '#ffc107';
                    dot.style.animation = 'pulse 2s infinite';
                } else {
                    // Future status
                    dot.style.backgroundColor = '#dee2e6';
                    dot.style.animation = 'none';
                }
            });

        } catch (error) {
            console.error('UIUpdateManager: Error updating timeline progress:', error);
        }
    }

    /**
     * Update ETA display with smooth transitions
     * Requirements: 7.1, 7.3
     */
    updateETA(estimatedArrival) {
        try {
            const etaElement = document.getElementById('eta-time');
            if (!etaElement) {
                return;
            }

            // Debounce ETA updates
            this.debounceUpdate('eta', () => {
                this.processETAUpdate(etaElement, estimatedArrival);
            });

        } catch (error) {
            console.error('UIUpdateManager: Error updating ETA:', error);
        }
    }

    /**
     * Process ETA update with calculation
     * Requirements: 7.1, 7.3
     */
    processETAUpdate(element, estimatedArrival) {
        try {
            let etaText = 'Calculating...';

            if (estimatedArrival) {
                const eta = new Date(estimatedArrival);
                const now = new Date();
                const diffMinutes = Math.round((eta - now) / (1000 * 60));

                if (diffMinutes > 60) {
                    const hours = Math.floor(diffMinutes / 60);
                    const minutes = diffMinutes % 60;
                    etaText = `${hours}h ${minutes}m`;
                } else if (diffMinutes > 0) {
                    etaText = `${diffMinutes} min`;
                } else if (diffMinutes > -5) {
                    etaText = 'Arriving now';
                } else {
                    etaText = 'Arrived';
                }
            }

            // Animate ETA change if different
            if (element.textContent !== etaText) {
                this.animateTextChange(element, etaText);
            }

        } catch (error) {
            console.error('UIUpdateManager: Error processing ETA update:', error);
        }
    }

    /**
     * Update ride progress indicators
     * Requirements: 7.3
     */
    updateRideProgress(rideData) {
        try {
            const progressBar = document.getElementById('progress-bar');
            const progressPercentage = document.getElementById('progress-percentage');

            if (!progressBar) {
                return;
            }

            let progress = 0;

            // Calculate progress from different data sources
            if (rideData.progress !== undefined) {
                progress = Math.max(0, Math.min(100, rideData.progress));
            } else if (rideData.distance_remaining !== undefined && rideData.total_distance) {
                const remaining = rideData.distance_remaining;
                const total = rideData.total_distance;
                progress = Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
            } else if (rideData.ride_status) {
                // Estimate progress based on status
                progress = this.estimateProgressFromStatus(rideData.ride_status.name);
            }

            // Animate progress bar
            this.animateProgressBar(progressBar, progress);

            // Update percentage display
            if (progressPercentage) {
                this.animateTextChange(progressPercentage, `${Math.round(progress)}%`);
            }

        } catch (error) {
            console.error('UIUpdateManager: Error updating ride progress:', error);
        }
    }

    /**
     * Estimate progress percentage from ride status
     * Requirements: 7.3
     */
    estimateProgressFromStatus(status) {
        const statusProgress = {
            'confirmed': 10,
            'driver_assigned': 20,
            'on_the_way': 40,
            'arrived': 60,
            'started': 70,
            'in_progress': 85,
            'completed': 100
        };

        return statusProgress[status.toLowerCase()] || 0;
    }

    /**
     * Animate progress bar with smooth transition
     * Requirements: 7.3
     */
    animateProgressBar(element, targetProgress) {
        try {
            const currentWidth = parseFloat(element.style.width) || 0;
            const targetWidth = targetProgress;

            if (Math.abs(currentWidth - targetWidth) < 1) {
                return; // No significant change
            }

            // Animate to new width
            element.style.transition = 'width 1s ease-in-out';
            element.style.width = `${targetWidth}%`;

            // Add visual feedback for progress increase
            if (targetWidth > currentWidth) {
                element.style.boxShadow = '0 0 10px rgba(40, 167, 69, 0.5)';
                setTimeout(() => {
                    element.style.boxShadow = '';
                }, 1000);
            }

        } catch (error) {
            console.error('UIUpdateManager: Error animating progress bar:', error);
        }
    }

    /**
     * Update position-dependent elements (distance, ETA calculations)
     * Requirements: 7.1, 7.3
     */
    updatePositionDependentElements(position, driverData) {
        try {
            // Update distance remaining if we have destination
            // This would require route calculation in a real implementation

            // Update speed indicator if available
            if (driverData.speed !== undefined) {
                this.updateSpeedIndicator(driverData.speed);
            }

            // Update heading/direction if available
            if (driverData.heading !== undefined) {
                this.updateDirectionIndicator(driverData.heading);
            }

        } catch (error) {
            console.error('UIUpdateManager: Error updating position-dependent elements:', error);
        }
    }

    /**
     * Update speed indicator (if UI element exists)
     * Requirements: 2.3
     */
    updateSpeedIndicator(speed) {
        try {
            const speedElement = document.getElementById('driver-speed');
            if (speedElement && typeof speed === 'number') {
                const speedText = `${Math.round(speed)} km/h`;
                this.animateTextChange(speedElement, speedText);
            }
        } catch (error) {
            console.error('UIUpdateManager: Error updating speed indicator:', error);
        }
    }

    /**
     * Update direction indicator (if UI element exists)
     * Requirements: 2.3
     */
    updateDirectionIndicator(heading) {
        try {
            const directionElement = document.getElementById('driver-direction');
            if (directionElement && typeof heading === 'number') {
                const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
                const index = Math.round(heading / 45) % 8;
                const direction = directions[index];
                this.animateTextChange(directionElement, direction);
            }
        } catch (error) {
            console.error('UIUpdateManager: Error updating direction indicator:', error);
        }
    }

    /**
     * Animate text change with smooth transition
     * Requirements: 2.3
     */
    animateTextChange(element, newText) {
        try {
            if (element.textContent === newText) {
                return; // No change needed
            }

            element.style.transition = 'opacity 0.2s ease';
            element.style.opacity = '0.5';

            setTimeout(() => {
                element.textContent = newText;
                element.style.opacity = '1';
            }, 100);

        } catch (error) {
            console.error('UIUpdateManager: Error animating text change:', error);
        }
    }

    /**
     * Debounce updates to prevent excessive re-renders
     * Requirements: 7.1
     */
    debounceUpdate(key, callback) {
        try {
            // Clear existing timeout
            if (this.debounceTimeouts.has(key)) {
                clearTimeout(this.debounceTimeouts.get(key));
            }

            // Set new timeout
            const timeoutId = setTimeout(() => {
                callback();
                this.debounceTimeouts.delete(key);
            }, this.debounceDelay);

            this.debounceTimeouts.set(key, timeoutId);

        } catch (error) {
            console.error('UIUpdateManager: Error in debounce update:', error);
        }
    }

    /**
     * Update billing information
     * Requirements: 2.3
     */
    updateBillingInfo(fareDetails) {
        try {
            if (!fareDetails) return;

            // Update ride fare
            if (fareDetails.ride_fare !== undefined) {
                const fareElement = document.getElementById('ride-fare-detail');
                if (fareElement) {
                    this.animateTextChange(fareElement, fareDetails.ride_fare);
                }
            }

            // Update additional charges
            if (fareDetails.additional_charges) {
                Object.keys(fareDetails.additional_charges).forEach(chargeType => {
                    const element = document.getElementById(`${chargeType.replace('_', '-')}`);
                    if (element) {
                        this.animateTextChange(element, fareDetails.additional_charges[chargeType]);
                    }
                });
            }

        } catch (error) {
            console.error('UIUpdateManager: Error updating billing info:', error);
        }
    }

    /**
     * Clear all debounce timeouts
     * Requirements: 7.1
     */
    clearDebounceTimeouts() {
        try {
            for (const timeoutId of this.debounceTimeouts.values()) {
                clearTimeout(timeoutId);
            }
            this.debounceTimeouts.clear();

        } catch (error) {
            console.error('UIUpdateManager: Error clearing debounce timeouts:', error);
        }
    }

    /**
     * Get current state information
     * Requirements: 2.3
     */
    getState() {
        return {
            lastDriverPosition: this.lastDriverPosition,
            lastUpdateTime: this.lastUpdateTime,
            isAnimating: this.isAnimating,
            activeDebounces: this.debounceTimeouts.size,
            mapProvider: !!this.mapProvider
        };
    }

    /**
     * Cleanup method
     * Requirements: 2.3
     */
    cleanup() {
        try {
            this.clearDebounceTimeouts();
            this.animationQueue = [];
            this.isAnimating = false;
            console.log('UIUpdateManager: Cleanup completed');

        } catch (error) {
            console.error('UIUpdateManager: Error during cleanup:', error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIUpdateManager;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.UIUpdateManager = UIUpdateManager;
}
