# Map Provider Abstraction Layer

This directory contains the map provider abstraction layer that supports both Google Maps and OpenStreetMap for the real-time ride tracking feature.

## Files Overview

### Core Files

1. **map-provider.js** - Abse class defining the MapProvider interface
2. **google-maps-provider.js** - Google Maps implementation with real-time tracking
3. **osm-provider.js** - OpenStreetMap implementation using Leaflet
4. **map-provider-factory.js** - Factory class for provider selection and asset loading
5. **map-provider-usage.js** - Usage examples and utility functions

## Architecture

```
MapProvider (Abstract)
├── GoogleMapsProvider (Google Maps API)
└── OSMProvider (Leaflet + OpenStreetMap)
```

## Usage

### Basic Initialization

```javascript
// Initialize with automatic provider selection
const mapProvider = await mapProviderFactory.createProvider('map-container', {
    lat: 23.8103,
    lng: 90.4125,
    zoom: 13
});
```

### Configuration

```javascript
// Configure the factory
mapProviderFactory.initialize({
    defaultProvider: 'google', // or 'osm'
    googleMapsApiKey: 'your-api-key',
    fallbackProvider: 'osm'
});
```

### Real-time Tracking

```javascript
// Add driver marker
await mapProvider.addDriverMarker(lat, lng, {
    name: 'John Doe',
    vehicle_icon: '/images/car.png',
    plate_number: 'ABC123',
    heading: 45
});

// Update driver position with animation
await mapProvider.updateDriverPosition(newLat, newLng, true, newHeading);

// Add route markers
await mapProvider.addRouteMarkers([
    { lat: 23.8103, lng: 90.4125, type: 'pickup', address: 'Pickup Location' },
    { lat: 23.8203, lng: 90.4225, type: 'dropoff', address: 'Drop-off Location' }
]);

// Draw route
await mapProvider.drawRoute([
    { lat: 23.8103, lng: 90.4125 },
    { lat: 23.8203, lng: 90.4225 }
]);
```

## Features

### Common Features (Both Providers)

- Real-time driver marker with smooth animation
- Route rendering with waypoints
- Custom marker icons for pickup/drop-off locations
- Map centering and bounds adjustment
- Custom controls support
- Info windows/popups for markers
- Map type switching (where supported)

### Google Maps Specific

- Google Maps Directions API for accurate routing
- Traffic layer support
- Advanced map styling options
- Street View integration
- Places API integration (if needed)

### OpenStreetMap Specific

- No API key required
- Leaflet Routing Machine for routing
- Multiple tile layer options (standard, satellite, terrain)
- Lightweight and fast loading
- Open source and free

## Error Handling

The system includes comprehensive error handling:

- Automatic fallback to secondary provider
- Asset loading timeout protection
- Connection failure recovery
- User-friendly error messages
- Graceful degradation

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Touch gesture support for mobile devices
- Responsive design adaptation

## Dependencies

### Google Maps Provider
- Google Maps JavaScript API
- Requires API key

### OSM Provider
- Leaflet.js (loaded automatically)
- Leaflet Routing Machine (optional, for routing)
- No API key required

## Performance Considerations

- Lazy loading of map assets
- Efficient marker management
- Debounced position updates
- Memory leak prevention
- Asset caching

## Integration with Existing Code

The map provider system integrates with existing tracking components:

```javascript
// In your tracking page
const mapProvider = await MapProviderUtils.initializeRideTracking('map-container', {
    locations: rideData.locations,
    driverLocation: rideData.driverLocation,
    driverData: rideData.driverData
}, {
    mapProvider: systemConfig.mapProvider,
    googleMapsApiKey: systemConfig.googleMapsApiKey
});

// Update from Firebase listener
firebase.onSnapshot(doc => {
    MapProviderUtils.updateDriverLocation(mapProvider, doc.data());
});
```

## Customization

### Custom Icons

Place custom marker icons in the public images directory:
- `/images/pickup-marker.png`
- `/images/dropoff-marker.png`
- `/images/default-car-icon.png`

### Styling

Map controls and error displays can be customized via CSS:
- `.map-control-btn` - Control button styling
- `.map-error-container` - Error display styling
- `.custom-driver-marker` - Driver marker styling

## Testing

The abstraction layer supports testing through:
- Mock provider implementations
- Isolated unit tests for each provider
- Integration tests with real map APIs
- Error scenario testing

## Future Enhancements

Potential future improvements:
- Additional map providers (Mapbox, HERE, etc.)
- Offline map support
- Advanced routing options
- Real-time traffic integration
- Geofencing capabilities
