import { MapCoordinate, MapPin } from "@/src/features/map/types";

type GenerateRandomPinsOptions = MapCoordinate & {
  count: number;
  radiusInKm: number;
};

export function generateRandomPins({
  count,
  latitude,
  longitude,
  radiusInKm,
}: GenerateRandomPinsOptions): MapPin[] {
  return Array.from({ length: count }, (_, index) => {
    const distance = Math.sqrt(Math.random()) * radiusInKm;
    const angle = Math.random() * Math.PI * 2;
    const latitudeOffset = (distance * Math.cos(angle)) / 111;
    const longitudeOffset =
      (distance * Math.sin(angle)) / (111 * Math.cos(toRadians(latitude)));

    return {
      id: `wild-pokemon-${index + 1}`,
      latitude: latitude + latitudeOffset,
      longitude: longitude + longitudeOffset,
    };
  });
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
