/**
 * FirebaseListenerManager - Manages Firebase Firestore listeners with proper cleanup
 *
 * This module provides utilities for setting up and managing Firebase listeners
 * with proper cleanup on page unload to prevent memory leaks.
 *
 * Requirements: 1.2, 2.3
 */
class FirebaseListenerManager {
    constructor() {
        this.listeners = new Map();
        this.isInitialized = false;
        this.db = null;

        // Bind cleanup to page unload events
        this.setupCleanupHandlers();
    }

    /**
     * Initialize Firebase connection
     * Requirements: 1.2
     */
    initialize() {
        try {
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK not loaded');
            }

            if (!firebase.apps || firebase.apps.length === 0) {
                throw new Error('Firebase not initialized');
            }

            this.db = firebase.firestore();
            this.isInitialized = true;

            console.log('FirebaseListenerManager: Initialized successfully');
            return true;

        } catch (error) {
            console.error('FirebaseListenerManager: Initialization failed:', error);
            return false;
        }
    }

    /**
     * Set up onSnapshot listener for driverTrack collection
     * Requirements: 1.2, 2.3
     */
    setupDriverTrackListener(driverId, callback, errorCallback) {
        if (!this.isInitialized) {
            console.error('FirebaseListenerManager: Not initialized');
            return null;
        }

        if (!driverId) {
            console.error('FirebaseListenerManager: Driver ID is required');
            return null;
        }

        try {
            const listenerKey = `driverTrack_${driverId}`;

            // Remove existing listener if any
            this.removeListener(listenerKey);

            const driverTrackRef = this.db.collection('driverTrack').doc(driverId);

            const unsubscribe = driverTrackRef.onSnapshot(
                (doc) => {
                    try {
                        if (doc.exists) {
                            const data = doc.data();

                            // Add metadata for tracking
                            data._metadata = {
                                fromCache: doc.metadata.fromCache,
                                hasPendingWrites: doc.metadata.hasPendingWrites,
                                lastUpdated: new Date().toISOString()
                            };

                            callback(data);
                        } else {
                            console.warn(`FirebaseListenerManager: Driver document ${driverId} not found`);
                            callback(null);
                        }
                    } catch (error) {
                        console.error('FirebaseListenerManager: Error processing driver data:', error);
                        if (errorCallback) errorCallback(error);
                    }
                },
                (error) => {
                    console.error('FirebaseListenerManager: Driver track listener error:', error);
                    if (errorCallback) errorCallback(error);
                }
            );

            // Store listener for cleanup
            this.listeners.set(listenerKey, {
                unsubscribe,
                type: 'driverTrack',
                id: driverId,
                createdAt: new Date().toISOString()
            });

            console.log(`FirebaseListenerManager: Driver track listener setup for ${driverId}`);
            return unsubscribe;

        } catch (error) {
            console.error('FirebaseListenerManager: Failed to setup driver track listener:', error);
            if (errorCallback) errorCallback(error);
            return null;
        }
    }

    /**
     * Set up onSnapshot listener for rides collection
     * Requirements: 1.2, 2.3
     */
    setupRideListener(rideId, callback, errorCallback) {
        if (!this.isInitialized) {
            console.error('FirebaseListenerManager: Not initialized');
            return null;
        }

        if (!rideId) {
            console.error('FirebaseListenerManager: Ride ID is required');
            return null;
        }

        try {
            const listenerKey = `ride_${rideId}`;

            // Remove existing listener if any
            this.removeListener(listenerKey);

            const rideRef = this.db.collection('rides').doc(rideId);

            const unsubscribe = rideRef.onSnapshot(
                (doc) => {
                    try {
                        if (doc.exists) {
                            const data = doc.data();

                            // Add metadata for tracking
                            data._metadata = {
                                fromCache: doc.metadata.fromCache,
                                hasPendingWrites: doc.metadata.hasPendingWrites,
                                lastUpdated: new Date().toISOString()
                            };

                            callback(data);
                        } else {
                            console.warn(`FirebaseListenerManager: Ride document ${rideId} not found`);
                            callback(null);
                        }
                    } catch (error) {
                        console.error('FirebaseListenerManager: Error processing ride data:', error);
                        if (errorCallback) errorCallback(error);
                    }
                },
                (error) => {
                    console.error('FirebaseListenerManager: Ride listener error:', error);
                    if (errorCallback) errorCallback(error);
                }
            );

            // Store listener for cleanup
            this.listeners.set(listenerKey, {
                unsubscribe,
                type: 'ride',
                id: rideId,
                createdAt: new Date().toISOString()
            });

            console.log(`FirebaseListenerManager: Ride listener setup for ${rideId}`);
            return unsubscribe;

        } catch (error) {
            console.error('FirebaseListenerManager: Failed to setup ride listener:', error);
            if (errorCallback) errorCallback(error);
            return null;
        }
    }

    /**
     * Set up listener with query filters
     * Requirements: 1.2
     */
    setupQueryListener(collection, filters, callback, errorCallback) {
        if (!this.isInitialized) {
            console.error('FirebaseListenerManager: Not initialized');
            return null;
        }

        try {
            let query = this.db.collection(collection);

            // Apply filters
            if (filters && Array.isArray(filters)) {
                filters.forEach(filter => {
                    if (filter.field && filter.operator && filter.value !== undefined) {
                        query = query.where(filter.field, filter.operator, filter.value);
                    }
                });
            }

            const listenerKey = `query_${collection}_${Date.now()}`;

            const unsubscribe = query.onSnapshot(
                (querySnapshot) => {
                    try {
                        const results = [];
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            data.id = doc.id;
                            data._metadata = {
                                fromCache: doc.metadata.fromCache,
                                hasPendingWrites: doc.metadata.hasPendingWrites,
                                lastUpdated: new Date().toISOString()
                            };
                            results.push(data);
                        });

                        callback(results);
                    } catch (error) {
                        console.error('FirebaseListenerManager: Error processing query results:', error);
                        if (errorCallback) errorCallback(error);
                    }
                },
                (error) => {
                    console.error('FirebaseListenerManager: Query listener error:', error);
                    if (errorCallback) errorCallback(error);
                }
            );

            // Store listener for cleanup
            this.listeners.set(listenerKey, {
                unsubscribe,
                type: 'query',
                collection,
                filters,
                createdAt: new Date().toISOString()
            });

            console.log(`FirebaseListenerManager: Query listener setup for ${collection}`);
            return unsubscribe;

        } catch (error) {
            console.error('FirebaseListenerManager: Failed to setup query listener:', error);
            if (errorCallback) errorCallback(error);
            return null;
        }
    }

    /**
     * Remove a specific listener
     * Requirements: 1.2
     */
    removeListener(listenerKey) {
        try {
            const listener = this.listeners.get(listenerKey);
            if (listener && listener.unsubscribe) {
                listener.unsubscribe();
                this.listeners.delete(listenerKey);
                console.log(`FirebaseListenerManager: Removed listener ${listenerKey}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('FirebaseListenerManager: Error removing listener:', error);
            return false;
        }
    }

    /**
     * Remove all listeners of a specific type
     * Requirements: 1.2
     */
    removeListenersByType(type) {
        try {
            let removedCount = 0;

            for (const [key, listener] of this.listeners.entries()) {
                if (listener.type === type) {
                    if (listener.unsubscribe) {
                        listener.unsubscribe();
                    }
                    this.listeners.delete(key);
                    removedCount++;
                }
            }

            console.log(`FirebaseListenerManager: Removed ${removedCount} listeners of type ${type}`);
            return removedCount;

        } catch (error) {
            console.error('FirebaseListenerManager: Error removing listeners by type:', error);
            return 0;
        }
    }

    /**
     * Clean up all listeners
     * Requirements: 1.2
     */
    cleanup() {
        try {
            let cleanedCount = 0;

            for (const [key, listener] of this.listeners.entries()) {
                try {
                    if (listener.unsubscribe) {
                        listener.unsubscribe();
                        cleanedCount++;
                    }
                } catch (error) {
                    console.error(`FirebaseListenerManager: Error cleaning up listener ${key}:`, error);
                }
            }

            this.listeners.clear();
            console.log(`FirebaseListenerManager: Cleaned up ${cleanedCount} listeners`);

        } catch (error) {
            console.error('FirebaseListenerManager: Error during cleanup:', error);
        }
    }

    /**
     * Get information about active listeners
     * Requirements: 1.2
     */
    getListenerInfo() {
        const info = {
            total: this.listeners.size,
            byType: {},
            listeners: []
        };

        for (const [key, listener] of this.listeners.entries()) {
            // Count by type
            if (!info.byType[listener.type]) {
                info.byType[listener.type] = 0;
            }
            info.byType[listener.type]++;

            // Add listener details
            info.listeners.push({
                key,
                type: listener.type,
                id: listener.id || listener.collection,
                createdAt: listener.createdAt
            });
        }

        return info;
    }

    /**
     * Setup cleanup handlers for page unload
     * Requirements: 1.2
     */
    setupCleanupHandlers() {
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Handle page visibility change (mobile browsers)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                // Optionally pause listeners when page is hidden
                console.log('FirebaseListenerManager: Page hidden, listeners remain active');
            } else if (document.visibilityState === 'visible') {
                // Optionally resume listeners when page becomes visible
                console.log('FirebaseListenerManager: Page visible, listeners active');
            }
        });

        // Handle browser back/forward navigation
        window.addEventListener('pagehide', () => {
            this.cleanup();
        });

        // Handle tab close
        window.addEventListener('unload', () => {
            this.cleanup();
        });
    }

    /**
     * Check if Firebase connection is healthy
     * Requirements: 1.2
     */
    async checkConnection() {
        if (!this.isInitialized) {
            return { healthy: false, error: 'Not initialized' };
        }

        try {
            // Try to read from a minimal document to test connection
            const testRef = this.db.collection('_connection_test').doc('test');
            await testRef.get();

            return { healthy: true, timestamp: new Date().toISOString() };

        } catch (error) {
            return {
                healthy: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Enable offline persistence (call before any other operations)
     * Requirements: 1.2
     */
    enableOfflinePersistence() {
        try {
            if (this.db) {
                return this.db.enablePersistence({ synchronizeTabs: true });
            }
            return Promise.reject(new Error('Database not initialized'));

        } catch (error) {
            console.warn('FirebaseListenerManager: Offline persistence not available:', error);
            return Promise.resolve();
        }
    }
}

// Create singleton instance
const firebaseListenerManager = new FirebaseListenerManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FirebaseListenerManager, firebaseListenerManager };
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.FirebaseListenerManager = FirebaseListenerManager;
    window.firebaseListenerManager = firebaseListenerManager;
}
