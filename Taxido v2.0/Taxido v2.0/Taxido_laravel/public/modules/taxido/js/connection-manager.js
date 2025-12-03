/**
 * ConnectionManager - Handles Firebase connection monitoring and recovery
 *
 * This class provides centralized connection management for Firebase Firestore,
 * implementing exponential backoff reconnection strategy and connection status indicators.
 *
 * Requirements: 5.1, 5.5
 */
class ConnectionManager {
    constructor(options = {}) {
        // Configuration options
        this.options = {
            maxReconnectAttempts: options.maxReconnectAttempts || 5,
            baseReconnectDelay: options.baseRecctDelay || 1000, // 1 second
            maxReconnectDelay: options.maxReconnectDelay || 30000, // 30 seconds
            connectionTimeout: options.connectionTimeout || 10000, // 10 seconds
            ...options
        };

        // Connection state
        this.isConnected = false;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.lastConnectionTime = null;
        this.connectionStartTime = null;

        // Firebase reference
        this.db = null;

        // Reconnection timer
        this.reconnectTimer = null;
        this.connectionTimeoutTimer = null;

        // Event listeners for connection status changes
        this.connectionListeners = [];

        // UI elements
        this.statusIndicator = null;

        // Bind methods to preserve context
        this.handleConnectionLoss = this.handleConnectionLoss.bind(this);
        this.attemptReconnection = this.attemptReconnection.bind(this);
        this.onConnectionStateChange = this.onConnectionStateChange.bind(this);

        // Initialize connection monitoring
        this.initializeConnectionMonitoring();
    }

    /**
     * Initialize connection monitoring
     * Requirements: 5.1
     */
    initializeConnectionMonitoring() {
        try {
            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                console.error('ConnectionManager: Firebase not available');
                this.handleConnectionLoss(new Error('Firebase not available'));
                return;
            }

            // Initialize Firebase connection
            this.initializeFirebase();

            // Set up connection status monitoring
            this.setupConnectionStatusMonitoring();

            // Create UI status indicator
            this.createStatusIndicator();

            console.log('ConnectionManager: Connection monitoring initialized');
        } catch (error) {
            console.error('ConnectionManager: Failed to initialize connection monitoring:', error);
            this.handleConnectionLoss(error);
        }
    }

    /**
     * Initialize Firebase connection
     * Requirements: 5.1
     */
    initializeFirebase() {
        try {
            // Check if Firebase is already initialized
            if (firebase.apps && firebase.apps.length > 0) {
                this.db = firebase.firestore();
                this.isConnected = true;
                this.lastConnectionTime = new Date();
                this.onConnectionStateChange(true);
                console.log('ConnectionManager: Firebase connection established');
            } else {
                throw new Error('Firebase not initialized');
            }
        } catch (error) {
            console.error('ConnectionManager: Firebase initialization failed:', error);
            this.handleConnectionLoss(error);
        }
    }

    /**
     * Set up connection status monitoring using Firebase's built-in connectivity detection
     * Requirements: 5.1
     */
    setupConnectionStatusMonitoring() {
        try {
            if (!this.db) {
                return;
            }

            // Use Firebase's connectivity detection
            const connectedRef = this.db.collection('.info').doc('connected');

            // Note: Firestore doesn't have the same .info/connected as Realtime Database
            // We'll implement a heartbeat mechanism instead
            this.startHeartbeat();

        } catch (error) {
            console.error('ConnectionManager: Failed to setup connection monitoring:', error);
        }
    }

    /**
     * Start heartbeat mechanism to monitor connection
     * Requirements: 5.1
     */
    startHeartbeat() {
        // Perform a lightweight operation every 30 seconds to check connectivity
        this.heartbeatInterval = setInterval(() => {
            this.performConnectivityCheck();
        }, 30000);

        // Perform initial connectivity check
        this.performConnectivityCheck();
    }

    /**
     * Perform connectivity check
     * Requirements: 5.1
     */
    async performConnectivityCheck() {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            // Start connection timeout timer
            this.connectionTimeoutTimer = setTimeout(() => {
                this.handleConnectionLoss(new Error('Connection timeout'));
            }, this.options.connectionTimeout);

            // Perform a lightweight read operation
            const testDoc = await this.db.collection('_connection_test').doc('test').get();

            // Clear timeout timer
            if (this.connectionTimeoutTimer) {
                clearTimeout(this.connectionTimeoutTimer);
                this.connectionTimeoutTimer = null;
            }

            // Connection successful
            if (!this.isConnected) {
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.lastConnectionTime = new Date();
                this.onConnectionStateChange(true);
                console.log('ConnectionManager: Connection restored');
            }

        } catch (error) {
            // Clear timeout timer
            if (this.connectionTimeoutTimer) {
                clearTimeout(this.connectionTimeoutTimer);
                this.connectionTimeoutTimer = null;
            }

            // Handle connection loss
            if (this.isConnected) {
                console.warn('ConnectionManager: Connectivity check failed:', error);
                this.handleConnectionLoss(error);
            }
        }
    }

    /**
     * Handle connection loss with exponential backoff reconnection
     * Requirements: 5.1, 5.5
     */
    handleConnectionLoss(error) {
        try {
            console.error('ConnectionManager: Connection lost:', error);

            // Update connection state
            this.isConnected = false;
            this.onConnectionStateChange(false);

            // Show connection status to user
            this.showConnectionStatus('Connection lost. Attempting to reconnect...', 'warning');

            // Clear any existing reconnection timer
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }

            // Attempt reconnection if we haven't exceeded max attempts
            if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
                this.scheduleReconnection();
            } else {
                this.showConnectionStatus('Connection failed. Please refresh the page.', 'error');
                console.error('ConnectionManager: Max reconnection attempts exceeded');
            }

        } catch (err) {
            console.error('ConnectionManager: Error handling connection loss:', err);
        }
    }

    /**
     * Schedule reconnection with exponential backoff
     * Requirements: 5.1, 5.5
     */
    scheduleReconnection() {
        try {
            // Calculate delay with exponential backoff
            const baseDelay = this.options.baseReconnectDelay;
            const exponentialDelay = Math.pow(2, this.reconnectAttempts) * baseDelay;
            const delay = Math.min(exponentialDelay, this.options.maxReconnectDelay);

            // Add jitter to prevent thundering herd
            const jitter = Math.random() * 0.1 * delay;
            const finalDelay = delay + jitter;

            console.log(`ConnectionManager: Scheduling reconnection attempt ${this.reconnectAttempts + 1} in ${Math.round(finalDelay)}ms`);

            this.reconnectTimer = setTimeout(() => {
                this.attemptReconnection();
            }, finalDelay);

        } catch (error) {
            console.error('ConnectionManager: Error scheduling reconnection:', error);
        }
    }

    /**
     * Attempt to reconnect to Firebase
     * Requirements: 5.1, 5.5
     */
    attemptReconnection() {
        try {
            if (this.isConnecting) {
                console.log('ConnectionManager: Reconnection already in progress');
                return;
            }

            this.isConnecting = true;
            this.reconnectAttempts++;
            this.connectionStartTime = new Date();

            console.log(`ConnectionManager: Attempting reconnection (attempt ${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`);

            // Update status indicator
            this.showConnectionStatus(`Reconnecting... (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`, 'info');

            // Reinitialize Firebase connection
            this.initializeFirebase();

            // Perform connectivity check
            this.performConnectivityCheck()
                .then(() => {
                    this.isConnecting = false;
                    if (this.isConnected) {
                        this.showConnectionStatus('Connected', 'success');

                        // Hide status indicator after delay
                        setTimeout(() => {
                            this.hideConnectionStatus();
                        }, 3000);
                    }
                })
                .catch((error) => {
                    this.isConnecting = false;
                    console.error('ConnectionManager: Reconnection failed:', error);

                    // Schedule next reconnection attempt
                    if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
                        this.scheduleReconnection();
                    } else {
                        this.showConnectionStatus('Connection failed. Please refresh the page.', 'error');
                    }
                });

        } catch (error) {
            this.isConnecting = false;
            console.error('ConnectionManager: Error during reconnection attempt:', error);
            this.handleConnectionLoss(error);
        }
    }

    /**
     * Create connection status indicator in the UI
     * Requirements: 5.1
     */
    createStatusIndicator() {
        try {
            // Remove existing indicator if present
            const existingIndicator = document.getElementById('connection-status-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }

            // Create new status indicator
            this.statusIndicator = document.createElement('div');
            this.statusIndicator.id = 'connection-status-indicator';
            this.statusIndicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 500;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                display: none;
                max-width: 300px;
                text-align: center;
            `;

            document.body.appendChild(this.statusIndicator);

        } catch (error) {
            console.error('ConnectionManager: Error creating status indicator:', error);
        }
    }

    /**
     * Show connection status to user
     * Requirements: 5.1
     */
    showConnectionStatus(message, type = 'info') {
        try {
            if (!this.statusIndicator) {
                this.createStatusIndicator();
            }

            // Set message
            this.statusIndicator.textContent = message;

            // Set styling based on type
            const styles = {
                success: {
                    background: '#28a745',
                    color: '#ffffff'
                },
                warning: {
                    background: '#ffc107',
                    color: '#000000'
                },
                error: {
                    background: '#dc3545',
                    color: '#ffffff'
                },
                info: {
                    background: '#17a2b8',
                    color: '#ffffff'
                }
            };

            const style = styles[type] || styles.info;
            this.statusIndicator.style.backgroundColor = style.background;
            this.statusIndicator.style.color = style.color;
            this.statusIndicator.style.display = 'block';

            // Add pulse animation for connecting states
            if (type === 'info' && message.includes('Reconnecting')) {
                this.statusIndicator.style.animation = 'pulse 1.5s infinite';
            } else {
                this.statusIndicator.style.animation = 'none';
            }

        } catch (error) {
            console.error('ConnectionManager: Error showing connection status:', error);
        }
    }

    /**
     * Hide connection status indicator
     * Requirements: 5.1
     */
    hideConnectionStatus() {
        try {
            if (this.statusIndicator) {
                this.statusIndicator.style.display = 'none';
                this.statusIndicator.style.animation = 'none';
            }
        } catch (error) {
            console.error('ConnectionManager: Error hiding connection status:', error);
        }
    }

    /**
     * Add connection state change listener
     * Requirements: 5.1
     */
    addConnectionListener(callback) {
        if (typeof callback === 'function') {
            this.connectionListeners.push(callback);
        }
    }

    /**
     * Remove connection state change listener
     * Requirements: 5.1
     */
    removeConnectionListener(callback) {
        const index = this.connectionListeners.indexOf(callback);
        if (index > -1) {
            this.connectionListeners.splice(index, 1);
        }
    }

    /**
     * Notify all listeners of connection state change
     * Requirements: 5.1
     */
    onConnectionStateChange(isConnected) {
        try {
            this.connectionListeners.forEach(callback => {
                try {
                    callback(isConnected, this.getConnectionInfo());
                } catch (error) {
                    console.error('ConnectionManager: Error in connection listener:', error);
                }
            });
        } catch (error) {
            console.error('ConnectionManager: Error notifying connection listeners:', error);
        }
    }

    /**
     * Get current connection information
     * Requirements: 5.1
     */
    getConnectionInfo() {
        return {
            isConnected: this.isConnected,
            isConnecting: this.isConnecting,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.options.maxReconnectAttempts,
            lastConnectionTime: this.lastConnectionTime,
            connectionStartTime: this.connectionStartTime
        };
    }

    /**
     * Get Firebase database instance
     * Requirements: 5.1
     */
    getDatabase() {
        return this.db;
    }

    /**
     * Force reconnection attempt
     * Requirements: 5.1, 5.5
     */
    forceReconnect() {
        try {
            console.log('ConnectionManager: Force reconnection requested');

            // Reset reconnection attempts
            this.reconnectAttempts = 0;

            // Clear any existing timers
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }

            // Attempt immediate reconnection
            this.attemptReconnection();

        } catch (error) {
            console.error('ConnectionManager: Error during force reconnect:', error);
        }
    }

    /**
     * Cleanup method to be called on page unload
     * Requirements: 5.1
     */
    cleanup() {
        try {
            // Clear timers
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }

            if (this.connectionTimeoutTimer) {
                clearTimeout(this.connectionTimeoutTimer);
                this.connectionTimeoutTimer = null;
            }

            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
                this.heartbeatInterval = null;
            }

            // Remove status indicator
            if (this.statusIndicator && this.statusIndicator.parentNode) {
                this.statusIndicator.parentNode.removeChild(this.statusIndicator);
            }

            // Clear listeners
            this.connectionListeners = [];

            // Reset state
            this.isConnected = false;
            this.isConnecting = false;
            this.db = null;

            console.log('ConnectionManager: Cleanup completed');

        } catch (error) {
            console.error('ConnectionManager: Error during cleanup:', error);
        }
    }
}

// Add CSS for pulse animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConnectionManager;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.ConnectionManager = ConnectionManager;
}
