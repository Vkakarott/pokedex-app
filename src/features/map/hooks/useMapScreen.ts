import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import MapView, { Region } from "react-native-maps";

import {
  MapCoordinate,
  MapPermissionState,
  MapPin,
} from "@/src/features/map/types";
import { generateRandomPins } from "@/src/features/map/utils/generate-random-pins";

const RANDOM_PIN_COUNT = 8;
const RANDOM_PIN_RADIUS_IN_KM = 1.2;
const DEFAULT_REGION_DELTA = 0.025;
const FOCUSED_PIN_REGION_DELTA = 0.0035;
const FOCUS_ANIMATION_DELAY_MS = 250;

export function useMapScreen() {
  const isFocused = useIsFocused();
  const mapRef = useRef<MapView | null>(null);
  const [currentLocation, setCurrentLocation] = useState<MapCoordinate | null>(null);
  const [pins, setPins] = useState<MapPin[]>([]);
  const [permissionState, setPermissionState] =
    useState<MapPermissionState>("idle");
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCurrentLocation = useCallback(async () => {
    try {
      setErrorMessage("");
      setIsLoading(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== Location.PermissionStatus.GRANTED) {
        setPermissionState("denied");
        setCurrentLocation(null);
        setPins([]);
        return;
      }

      setPermissionState("granted");

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const nextLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(nextLocation);
      setPins(
        generateRandomPins({
          ...nextLocation,
          count: RANDOM_PIN_COUNT,
          radiusInKm: RANDOM_PIN_RADIUS_IN_KM,
        })
      );
    } catch {
      setErrorMessage("Nao foi possivel obter sua localizacao atual.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCurrentLocation();
  }, [loadCurrentLocation]);

  useEffect(() => {
    if (!isFocused || !isMapReady || pins.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      const randomPin = pins[Math.floor(Math.random() * pins.length)];

      if (!randomPin) {
        return;
      }

      setSelectedPinId(randomPin.id);
      mapRef.current?.animateToRegion(createFocusedPinRegion(randomPin), 700);
    }, FOCUS_ANIMATION_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [isFocused, isMapReady, pins]);

  const initialRegion = currentLocation
    ? createUserRegion(currentLocation)
    : undefined;

  return {
    currentLocation,
    errorMessage,
    initialRegion,
    isLoading,
    mapRef,
    onMapReady: () => setIsMapReady(true),
    permissionState,
    pins,
    retry: loadCurrentLocation,
    selectedPinId,
  };
}

function createUserRegion(coordinate: MapCoordinate): Region {
  return {
    ...coordinate,
    latitudeDelta: DEFAULT_REGION_DELTA,
    longitudeDelta: DEFAULT_REGION_DELTA,
  };
}

function createFocusedPinRegion(coordinate: MapCoordinate): Region {
  return {
    ...coordinate,
    latitudeDelta: FOCUSED_PIN_REGION_DELTA,
    longitudeDelta: FOCUSED_PIN_REGION_DELTA,
  };
}
