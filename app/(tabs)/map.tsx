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
        <Marker
          coordinate={currentLocation}
          pinColor="#DD2323"
          title="Voce esta aqui"
        />

        {pins.map((pin, index) => (
          <Marker
            key={pin.id}
            coordinate={pin}
            pinColor={pin.id === selectedPinId ? "#DD2323" : "#FBBF24"}
            title={`Pokemon selvagem ${index + 1}`}
          />
        ))}
      </MapView>

      <SafeAreaView edges={["top"]} pointerEvents="box-none" style={styles.overlay}>
        <View style={styles.panel}>
          <Text style={styles.title}>Mapa</Text>
          <Text style={styles.description}>
            A aba foca em um pin aleatorio sempre que voce retorna para ela.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 20,
  },
  panel: {
    gap: 6,
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(10, 10, 10, 0.78)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
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
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "#D1D5DB",
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
});
