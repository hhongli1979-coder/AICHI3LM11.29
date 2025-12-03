/**
 * Status Timeline Component
 *
 * Manages the ride status timeline UI showing ride status history with timestamps.
 * Provides real-time timeline updates when status changes occur with visual indicators.
 *
 * Requirements: 2.3, 7.4
 */
class StatusTimelineComponent {
    constructor(containerId = 'status-timeline') {
        this.containerId = containerId;
        this.container = null;
        this.timelineItems = [];
        this.currentStatus = null;
        this.statusHistory = [];

ration
        this.config = {
            animationDuration: 300, // Animation duration in ms
            autoScroll: true, // Auto scroll to current status
            showTimestamps: true, // Show timestamps for each status
            compactMode: false, // Compact mode for mobile
            maxHistoryItems: 10 // Maximum number of history items to show
        };

        // Status configuration
        this.statusConfig = {
            'pending': {
                label: 'Ride Requested',
                icon: 'ri-time-line',
                color: '#6c757d',
                description: 'Your ride request has been submitted'
            },
            'confirmed': {
                label: 'Ride Confirmed',
                icon: 'ri-check-line',
                color: '#17a2b8',
                description: 'Your ride has been confirmed'
            },
            'driver_assigned': {
                label: 'Driver Assigned',
                icon: 'ri-user-line',
                color: '#007bff',
                description: 'A driver has been assigned to your ride'
            },
            'on_the_way': {
                label: 'Driver En Route',
                icon: 'ri-car-line',
                color: '#ffc107',
                description: 'Driver is on the way to pickup location'
            },
            'arrived': {
                label: 'Driver Arrived',
                icon: 'ri-map-pin-line',
                color: '#fd7e14',
                description: 'Driver has arrived at pickup location'
            },
            'started': {
                label: 'Ride Started',
                icon: 'ri-play-line',
                color: '#28a745',
                description: 'Your ride has started'
            },
            'completed': {
                label: 'Ride Completed',
                icon: 'ri-flag-line',
                color: '#28a745',
                description: 'Your ride has been completed successfully'
            },
            'cancelled': {
                label: 'Ride Cancelled',
                icon: 'ri-close-line',
                color: '#dc3545',
                description: 'The ride has been cancelled'
            }
        };

        // Bind methods
        this.updateTimeline = this.updateTimeline.bind(this);
        this.addTimelineItem = this.addTimelineItem.bind(this);
        this.updateCurrentStatus = this.updateCurrentStatus.bind(this);

        // Initialize component
        this.initialize();
    }

    /**
     * Initialize the timeline component
     * Requirements: 2.3, 7.4
     */
    initialize() {
        try {
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                console.error('StatusTimelineComponent: Container element not found:', this.containerId);
                return false;
            }

            // Set up container attributes for accessibility
            this.container.setAttribute('role', 'list');
            this.container.setAttribute('aria-label', 'Ride status timeline');

            // Add CSS classes
            this.container.classList.add('status-timeline-component');

            console.log('StatusTimelineComponent: Initialized successfully');
            return true;

        } catch (error) {
            console.error('StatusTimelineComponent: Initialization failed:', error);
            return false;
        }
    }

    /**
     * Update the entire timeline with new status history
     * Requirements: 2.3, 7.4
     *
     * @param {Array} statusHistory - Array of status objects with timestamps
     * @param {string} currentStatus - Current active status
     */
    updateTimeline(statusHistory, currentStatus = null) {
        try {
            console.log('StatusTimelineComponent: Updating timeline with', statusHistory.length, 'items');

            // Store status data
            this.statusHistory = Array.isArray(statusHistory) ? statusHistory : [];
            this.currentStatus = currentStatus;

            // Clear existing timeline
            this.clearTimeline();

            // Build timeline items
            this.buildTimeline();

            // Update current status indicator
            if (currentStatus) {
                this.updateCurrentStatus(currentStatus);
            }

            // Auto scroll to current status if enabled
            if (this.config.autoScroll) {
                this.scrollToCurrentStatus();
            }

            console.log('StatusTimelineComponent: Timeline updated successfully');

        } catch (error) {
            console.error('StatusTimelineComponent: Error updating timeline:', error);
        }
    }

    /**
     * Add a new status item to the timeline
     * Requirements: 2.3, 7.4
     *
     * @param {Object} statusData - Status data object
     * @param {boolean} animate - Whether to animate the addition
     */
    addTimelineItem(statusData, animate = true) {
        try {
            if (!statusData || !statusData.status) {
                console.warn('StatusTimelineComponent: Invalid status data provided');
                return;
            }

            console.log('StatusTimelineComponent: Adding timeline item:', statusData.status);

            // Check if item already exists
            const existingItem = this.findTimelineItem(statusData.status);
            if (existingItem) {
                this.updateTimelineItem(existingItem, statusData);
                return;
            }

            // Create timeline item element
            const timelineItem = this.createTimelineItemElement(statusData);

            // Add to container
            this.container.appendChild(timelineItem);

            // Add to items array
            this.timelineItems.push({
                element: timelineItem,
                status: statusData.status,
                timestamp: statusData.timestamp,
                data: statusData
            });

            // Animate if requested
            if (animate) {
                this.animateItemAddition(timelineItem);
            }

            // Update status history
            this.statusHistory.push(statusData);

            // Limit history items if configured
            this.limitHistoryItems();

        } catch (error) {
            console.error('StatusTimelineComponent: Error adding timeline item:', error);
        }
    }

    /**
     * Update current status indicator
     * Requirements: 2.3, 7.4
     *
     * @param {string} newStatus - New current status
     */
    updateCurrentStatus(newStatus) {
        try {
            if (!newStatus) {
                return;
            }

            console.log('StatusTimelineComponent: Updating current status to:', newStatus);

            // Remove current status from all items
            this.timelineItems.forEach(item => {
                item.element.classList.remove('current', 'active');
                const dot = item.element.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.remove('current', 'active');
                }
            });

            // Find and update current status item
            const currentItem = this.findTimelineItem(newStatus);
            if (currentItem) {
                currentItem.element.classList.add('current');
                const dot = currentItem.element.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.add('current');
                }

                // Mark all previous items as active
                this.markPreviousItemsActive(currentItem);
            }

            // Update stored current status
            this.currentStatus = newStatus;

            // Update global status display
            this.updateGlobalStatusDisplay(newStatus);

        } catch (error) {
            console.error('StatusTimelineComponent: Error updating current status:', error);
        }
    }

    /**
     * Build the complete timeline from status history
     * Requirements: 2.3, 7.4
     */
    buildTimeline() {
        try {
            // Sort status history by timestamp
            const sortedHistory = this.statusHistory.sort((a, b) => {
                return new Date(a.timestamp) - new Date(b.timestamp);
            });

            // Create timeline items
            sortedHistory.forEach((statusData, index) => {
                const timelineItem = this.createTimelineItemElement(statusData);
                this.container.appendChild(timelineItem);

                this.timelineItems.push({
                    element: timelineItem,
                    status: statusData.status,
                    timestamp: statusData.timestamp,
                    data: statusData,
                    index: index
                });
            });

            // Add future status items (if configured)
            this.addFutureStatusItems();

        } catch (error) {
            console.error('StatusTimelineComponent: Error building timeline:', error);
        }
    }

    /**
     * Create timeline item element
     * Requirements: 2.3, 7.4
     *
     * @param {Object} statusData - Status data object
     * @returns {HTMLElement} Timeline item element
     */
    createTimelineItemElement(statusData) {
        try {
            const statusInfo = this.statusConfig[statusData.status] || this.getDefaultStatusInfo(statusData.status);

            // Create main timeline item
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('role', 'listitem');
            timelineItem.setAttribute('data-status', statusData.status);

            // Create timeline dot
            const timelineDot = document.createElement('div');
            timelineDot.className = 'timeline-dot';
            timelineDot.style.backgroundColor = statusInfo.color;
            timelineDot.setAttribute('aria-hidden', 'true');

            // Add icon to dot if available
            if (statusInfo.icon) {
                const icon = document.createElement('i');
                icon.className = statusInfo.icon;
                icon.setAttribute('aria-hidden', 'true');
                timelineDot.appendChild(icon);
            }

            // Create timeline content
            const timelineContent = document.createElement('div');
            timelineContent.className = 'timeline-content';

            // Create title
            const timelineTitle = document.createElement('div');
            timelineTitle.className = 'timeline-title';
            timelineTitle.textContent = statusInfo.label;

            // Create description (if available)
            const timelineDescription = document.createElement('div');
            timelineDescription.className = 'timeline-description';
            timelineDescription.textContent = statusInfo.description;

            // Create timestamp
            const timelineTime = document.createElement('div');
            timelineTime.className = 'timeline-time';
            if (statusData.timestamp) {
                const time = new Date(statusData.timestamp);
                timelineTime.textContent = this.formatTimestamp(time);
                timelineTime.setAttribute('datetime', time.toISOString());
            } else {
                timelineTime.textContent = '--:--';
            }

            // Assemble content
            timelineContent.appendChild(timelineTitle);
            if (statusInfo.description) {
                timelineContent.appendChild(timelineDescription);
            }
            if (this.config.showTimestamps) {
                timelineContent.appendChild(timelineTime);
            }

            // Assemble timeline item
            timelineItem.appendChild(timelineDot);
            timelineItem.appendChild(timelineContent);

            // Add accessibility attributes
            timelineItem.setAttribute('aria-label',
                `${statusInfo.label}${statusData.timestamp ? ' at ' + this.formatTimestamp(new Date(statusData.timestamp)) : ''}`
            );

            return timelineItem;

        } catch (error) {
            console.error('StatusTimelineComponent: Error creating timeline item:', error);
            return this.createFallbackTimelineItem(statusData);
        }
    }

    /**
     * Add future status items to show expected progression
     * Requirements: 2.3
     */
    addFutureStatusItems() {
        try {
            if (!this.currentStatus) {
                return;
            }

            // Define typical status progression
            const statusProgression = [
                'pending',
                'confirmed',
                'driver_assigned',
                'on_the_way',
                'arrived',
                'started',
                'completed'
            ];

            const currentIndex = statusProgression.indexOf(this.currentStatus);
            if (currentIndex === -1 || currentIndex === statusProgression.length - 1) {
                return;
            }

            // Add future status items
            for (let i = currentIndex + 1; i < statusProgression.length; i++) {
                const futureStatus = statusProgression[i];

                // Skip if already exists in history
                if (this.statusHistory.some(item => item.status === futureStatus)) {
                    continue;
                }

                const futureItem = this.createTimelineItemElement({
                    status: futureStatus,
                    timestamp: null
                });

                futureItem.classList.add('future');
                this.container.appendChild(futureItem);

                this.timelineItems.push({
                    element: futureItem,
                    status: futureStatus,
                    timestamp: null,
                    data: { status: futureStatus },
                    future: true
                });
            }

        } catch (error) {
            console.error('StatusTimelineComponent: Error adding future status items:', error);
        }
    }

    /**
     * Mark previous timeline items as active
     * Requirements: 2.3
     *
     * @param {Object} currentItem - Current timeline item
     */
    markPreviousItemsActive(currentItem) {
        try {
            const currentIndex = this.timelineItems.indexOf(currentItem);

            for (let i = 0; i < currentIndex; i++) {
                const item = this.timelineItems[i];
                item.element.classList.add('active');

                const dot = item.element.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.add('active');
                }
            }

        } catch (error) {
            console.error('StatusTimelineComponent: Error marking previous items active:', error);
        }
    }

    /**
     * Find timeline item by status
     * Requirements: 2.3
     *
     * @param {string} status - Status to find
     * @returns {Object|null} Timeline item object or null
     */
    findTimelineItem(status) {
        return this.timelineItems.find(item => item.status === status) || null;
    }

    /**
     * Update existing timeline item
     * Requirements: 2.3, 7.4
     *
     * @param {Object} timelineItem - Timeline item to update
     * @param {Object} statusData - New status data
     */
    updateTimelineItem(timelineItem, statusData) {
        try {
            // Update timestamp if provided
            if (statusData.timestamp) {
                const timeElement = timelineItem.element.querySelector('.timeline-time');
                if (timeElement) {
                    const time = new Date(statusData.timestamp);
                    timeElement.textContent = this.formatTimestamp(time);
                    timeElement.setAttribute('datetime', time.toISOString());
                }

                // Update stored data
                timelineItem.timestamp = statusData.timestamp;
                timelineItem.data = statusData;
            }

            // Remove future class if it was a future item
            timelineItem.element.classList.remove('future');

            console.log('StatusTimelineComponent: Updated timeline item:', statusData.status);

        } catch (error) {
            console.error('StatusTimelineComponent: Error updating timeline item:', error);
        }
    }

    /**
     * Animate timeline item addition
     * Requirements: 7.4
     *
     * @param {HTMLElement} element - Element to animate
     */
    animateItemAddition(element) {
        try {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateX(-20px)';
            element.style.transition = `all ${this.config.animationDuration}ms ease-in-out`;

            // Trigger animation
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
            }, 50);

            // Clean up transition after animation
            setTimeout(() => {
                element.style.transition = '';
            }, this.config.animationDuration + 100);

        } catch (error) {
            console.error('StatusTimelineComponent: Error animating item addition:', error);
        }
    }

    /**
     * Scroll to current status item
     * Requirements: 7.4
     */
    scrollToCurrentStatus() {
        try {
            const currentItem = this.timelineItems.find(item =>
                item.element.classList.contains('current')
            );

            if (currentItem && currentItem.element) {
                currentItem.element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }

        } catch (error) {
            console.error('StatusTimelineComponent: Error scrolling to current status:', error);
        }
    }

    /**
     * Update global status display elements
     * Requirements: 2.3
     *
     * @param {string} status - Current status
     */
    updateGlobalStatusDisplay(status) {
        try {
            const statusInfo = this.statusConfig[status] || this.getDefaultStatusInfo(status);

            // Update main status display
            const statusElement = document.getElementById('ride-status');
            if (statusElement) {
                statusElement.textContent = statusInfo.label;

                // Update status badge color
                statusElement.className = statusElement.className.replace(/badge-\w+/g, '');
                statusElement.classList.add(this.getStatusBadgeClass(status));
            }

            // Update status dot color
            const statusDot = document.querySelector('.status-dot');
            if (statusDot) {
                statusDot.style.backgroundColor = statusInfo.color;
            }

        } catch (error) {
            console.error('StatusTimelineComponent: Error updating global status display:', error);
        }
    }

    /**
     * Get status badge CSS class
     * Requirements: 2.3
     *
     * @param {string} status - Status name
     * @returns {string} CSS class name
     */
    getStatusBadgeClass(status) {
        const badgeClasses = {
            'pending': 'badge-secondary',
            'confirmed': 'badge-info',
            'driver_assigned': 'badge-primary',
            'on_the_way': 'badge-warning',
            'arrived': 'badge-warning',
            'started': 'badge-success',
            'completed': 'badge-success',
            'cancelled': 'badge-danger'
        };

        return badgeClasses[status] || 'badge-secondary';
    }

    /**
     * Format timestamp for display
     * Requirements: 2.3
     *
     * @param {Date} date - Date object to format
     * @returns {string} Formatted timestamp
     */
    formatTimestamp(date) {
        try {
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error('StatusTimelineComponent: Error formatting timestamp:', error);
            return '--:--';
        }
    }

    /**
     * Get default status information for unknown statuses
     * Requirements: 2.3
     *
     * @param {string} status - Status name
     * @returns {Object} Default status info
     */
    getDefaultStatusInfo(status) {
        return {
            label: status.replace('_', ' ').toUpperCase(),
            icon: 'ri-information-line',
            color: '#6c757d',
            description: `Status: ${status}`
        };
    }

    /**
     * Create fallback timeline item for errors
     * Requirements: 2.3
     *
     * @param {Object} statusData - Status data
     * @returns {HTMLElement} Fallback timeline item
     */
    createFallbackTimelineItem(statusData) {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-dot" style="background-color: #6c757d;"></div>
            <div class="timeline-content">
                <div class="timeline-title">${statusData.status || 'Unknown Status'}</div>
                <div class="timeline-time">--:--</div>
            </div>
        `;
        return timelineItem;
    }

    /**
     * Clear timeline items
     * Requirements: 2.3
     */
    clearTimeline() {
        try {
            if (this.container) {
                this.container.innerHTML = '';
            }
            this.timelineItems = [];

        } catch (error) {
            console.error('StatusTimelineComponent: Error clearing timeline:', error);
        }
    }

    /**
     * Limit history items to configured maximum
     * Requirements: 2.3
     */
    limitHistoryItems() {
        try {
            if (this.statusHistory.length > this.config.maxHistoryItems) {
                // Remove oldest items
                const itemsToRemove = this.statusHistory.length - this.config.maxHistoryItems;
                this.statusHistory.splice(0, itemsToRemove);

                // Remove corresponding timeline items
                for (let i = 0; i < itemsToRemove; i++) {
                    const item = this.timelineItems.shift();
                    if (item && item.element && item.element.parentNode) {
                        item.element.parentNode.removeChild(item.element);
                    }
                }
            }

        } catch (error) {
            console.error('StatusTimelineComponent: Error limiting history items:', error);
        }
    }

    /**
     * Set compact mode for mobile devices
     * Requirements: 7.4
     *
     * @param {boolean} compact - Whether to enable compact mode
     */
    setCompactMode(compact) {
        try {
            this.config.compactMode = compact;

            if (this.container) {
                if (compact) {
                    this.container.classList.add('compact-mode');
                } else {
                    this.container.classList.remove('compact-mode');
                }
            }

        } catch (error) {
            console.error('StatusTimelineComponent: Error setting compact mode:', error);
        }
    }

    /**
     * Get current timeline status
     * Requirements: 2.3
     *
     * @returns {Object} Current status information
     */
    getStatus() {
        return {
            currentStatus: this.currentStatus,
            itemCount: this.timelineItems.length,
            historyCount: this.statusHistory.length,
            hasContainer: !!this.container,
            compactMode: this.config.compactMode
        };
    }

    /**
     * Update configuration
     * Requirements: 2.3
     *
     * @param {Object} newConfig - New configuration options
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('StatusTimelineComponent: Configuration updated');
    }

    /**
     * Cleanup method
     * Requirements: 2.3
     */
    cleanup() {
        try {
            this.clearTimeline();
            this.statusHistory = [];
            this.currentStatus = null;
            this.container = null;
            console.log('StatusTimelineComponent: Cleanup completed');

        } catch (error) {
            console.error('StatusTimelineComponent: Error during cleanup:', error);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatusTimelineComponent;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.StatusTimelineComponent = StatusTimelineComponent;
}
