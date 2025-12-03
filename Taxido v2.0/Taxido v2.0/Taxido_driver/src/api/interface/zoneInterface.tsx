export interface ZoneUpdatePayload {
  success?: boolean
  locations: locationDataPayload
  rentalZones?: rentalZoneInterface
  zoneValue?: currentZoneInterface
  loading?: boolean
}

export interface locationDataPayload {
  lat: number
  lng: number
}

export interface rentalZoneInterface { }

export interface currentZoneInterface { }