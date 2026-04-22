import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getColors } from "react-native-image-colors";

type FavoritePokemonCardProps = {
  imageUrl: string;
  isFavorite: boolean;
  name: string;
  onToggleFavorite: () => void;
};

export default function FavoritePokemonCard({
  imageUrl,
  isFavorite,
  name,
  onToggleFavorite,
}: FavoritePokemonCardProps) {
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
    <View style={styles.shell}>
      <View
        style={[
          styles.accentBar,
          { backgroundColor: withAlpha(accentColor, 0.95) },
        ]}
      />
      <View
        style={[
          styles.colorGlow,
          { backgroundColor: withAlpha(accentColor, 0.28) },
        ]}
      />
      <BlurView intensity={55} tint="dark" style={StyleSheet.absoluteFill} />

      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image source={imageUrl} style={styles.image} contentFit="contain" />
        </View>

        <View style={styles.info}>
          <Text style={styles.eyebrow}>Favorito</Text>
          <Text style={styles.name}>{formatPokemonName(name)}</Text>
        </View>

        <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Entypo
            name={isFavorite ? "heart" : "heart-outlined"}
            size={20}
            color={isFavorite ? "#DD2323" : "#F5F5F5"}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    minHeight: 108,
    borderRadius: 30,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(18, 18, 18, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  colorGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    top: -72,
    right: -20,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingLeft: 20,
    paddingRight: 14,
    gap: 14,
  },
  imageWrapper: {
    width: 74,
    height: 74,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  image: {
    width: 68,
    height: 68,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: "#9CA3AF",
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  favoriteButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 10, 0.36)",
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
