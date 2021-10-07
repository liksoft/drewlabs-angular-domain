export interface GeoPosition {
  coords?: Partial<{
    accuracy: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: any;
    latitude: number;
    longitude: number;
  }>;
  timestamps?: number;
}

export const createGeoposition = (position: GeolocationPosition) =>
  ({
    coords: {
      accuracy: position?.coords?.accuracy,
      altitude: position?.coords?.altitude || undefined,
      altitudeAccuracy: position?.coords?.altitudeAccuracy || undefined,
      heading: position?.coords?.heading,
      latitude: position?.coords?.latitude,
      longitude: position?.coords?.longitude,
    },
    timestamps: position?.timestamp,
  } as GeoPosition);
