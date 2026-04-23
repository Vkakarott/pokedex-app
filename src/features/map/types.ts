export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type MapPin = MapCoordinate & {
  id: string;
};

export type MapPermissionState = "idle" | "granted" | "denied";
