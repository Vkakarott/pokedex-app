import { Image } from "expo-image";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMapScreen } from "@/src/features/map/hooks/useMapScreen";

export default function MapScreen() {
  const {
    currentLocation,
    errorMessage,
    initialRegion,
    isLoading,
    mapRef,
    onMapReady,
    permissionState,
    pins,
    retry,
    selectedPinId,
  } = useMapScreen();

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.feedbackContainer}>
        <ActivityIndicator color="#DD2323" />
        <Text style={styles.feedbackText}>Buscando sua localizacao...</Text>
      </SafeAreaView>
    );
  }

  if (permissionState === "denied") {
    return (
      <SafeAreaView edges={["top"]} style={styles.feedbackContainer}>
        <Text style={styles.title}>Permissao necessaria</Text>
        <Text selectable style={styles.feedbackText}>
          Permita o acesso a localizacao para visualizar os pokemons no mapa.
        </Text>
        <Pressable onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (errorMessage || !currentLocation || !initialRegion) {
    return (
      <SafeAreaView edges={["top"]} style={styles.feedbackContainer}>
        <Text style={styles.title}>Mapa indisponivel</Text>
        <Text selectable style={styles.feedbackText}>
          {errorMessage || "Nao foi possivel preparar o mapa."}
        </Text>
        <Pressable onPress={retry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        initialRegion={initialRegion}
        onMapReady={onMapReady}
        showsCompass={false}
        showsUserLocation
        style={StyleSheet.absoluteFill}
        userInterfaceStyle="dark"
      >
        {pins.map((pin, index) => (
          <Marker
            key={pin.id}
            anchor={{ x: 0.5, y: 1 }}
            coordinate={pin}
            title={`Pokemon selvagem ${index + 1}`}
          >
            <View
              style={[
                styles.pinContainer,
                pin.id === selectedPinId && styles.pinContainerSelected,
              ]}
            >
              <Image
                source={require("../../assets/images/pin.png")}
                style={styles.pinImage}
                contentFit="contain"
              />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  feedbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    padding: 24,
    backgroundColor: "#0a0a0a",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  feedbackText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    color: "#9CA3AF",
  },
  retryButton: {
    marginTop: 6,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#DD2323",
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  pinContainer: {
    width: 32,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pinContainerSelected: {
    transform: [{ scale: 1.16 }],
  },
  pinImage: {
    width: "100%",
    height: "100%",
  },
});
