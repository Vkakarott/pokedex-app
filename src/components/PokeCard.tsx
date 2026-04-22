import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getColors } from "react-native-image-colors";

type PokeCardProps = {
  id: number;
  imageUrl: string;
  isFavorite: boolean;
  name: string;
  onToggleFavorite: () => void;
};

export default function PokeCard({
  id,
  imageUrl,
  isFavorite,
  name,
  onToggleFavorite,
}: PokeCardProps) {
  const [accentColor, setAccentColor] = useState("#2A2A2A");

  useEffect(() => {
    let isMounted = true;

    async function loadCardColors() {
      try {
        const result = await getColors(imageUrl, {
          fallback: "#2A2A2A",
          cache: true,
          key: imageUrl,
        });

        if (!isMounted) {
          return;
        }

        setAccentColor(pickDominantColor(result));
      } catch {
        if (isMounted) {
          setAccentColor("#2A2A2A");
        }
      }
    }

    loadCardColors();

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return (
    <View style={styles.card}>
      <View style={[styles.colorGlow, { backgroundColor: withAlpha(accentColor, 0.45) }]} />
      <View style={[styles.colorGlowSecondary, { backgroundColor: withAlpha(accentColor, 0.1) }]} />
      <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />

      <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
        <Entypo
          name={isFavorite ? "heart" : "heart-outlined"}
          size={22}
          color={isFavorite ? "#DD2323" : "#F5F5F5"}
        />
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.badge}>#{String(id).padStart(3, "0")}</Text>
        <Text style={styles.name}>{formatPokemonName(name)}</Text>
      </View>

      <Image source={imageUrl} style={styles.image} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#141414",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#202020",
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    position: "relative",
  },
  info: {
    flex: 1,
    gap: 6,
    zIndex: 1,
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#D1D5DB",
    backgroundColor: "rgba(18, 18, 18, 0.66)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  image: {
    width: 100,
    height: 100,
    zIndex: 1,
  },
  colorGlow: {
    position: "absolute",
    width: 220,
    height: 180,
    borderRadius: 999,
    top: -66,
    right: -52,
  },
  colorGlowSecondary: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 999,
    bottom: -60,
    left: -32,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 10, 0.28)",
    zIndex: 2,
  },
});

function formatPokemonName(name: string) {
  if (!name) {
    return "";
  }

  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

function pickDominantColor(result: Awaited<ReturnType<typeof getColors>>) {
  switch (result.platform) {
    case "android":
      return (
        result.dominant ??
        result.vibrant ??
        result.average ??
        result.lightVibrant ??
        "#2A2A2A"
      );
    case "ios":
      return result.background ?? result.primary ?? result.detail ?? "#2A2A2A";
    case "web":
      return result.dominant ?? result.vibrant ?? result.lightVibrant ?? "#2A2A2A";
    default:
      return "#2A2A2A";
  }
}

function withAlpha(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized.slice(0, 6);

  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
