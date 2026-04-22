import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getColors } from "react-native-image-colors";

type FavoritePokemonCardProps = {
  imageUrl: string;
  name: string;
  onPressDetails: () => void;
};

export default function FavoritePokemonCard({
  imageUrl,
  name,
  onPressDetails,
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
          styles.backgroundGlow,
          { backgroundColor: withAlpha(accentColor, 0.34) },
        ]}
      />
      <Image source={imageUrl} style={styles.image} contentFit="contain" />

      <View style={[styles.card, { backgroundColor: withAlpha(accentColor, 0.9) }]}>
        <View
          style={[
            styles.innerGlow,
            { backgroundColor: withAlpha(accentColor, 0.55), shadowColor: withAlpha(accentColor, 0.95) },
          ]}
        />
        <View style={styles.content}>
          <View style={styles.footerRow}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {formatPokemonName(name)}
            </Text>

            <Pressable onPress={onPressDetails} style={styles.actionButton}>
              <AntDesign name="right-circle" size={22} color="#F5F5F5" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: "100%",
    minHeight: 220,
    position: "relative",
    paddingTop: 34,
  },
  backgroundGlow: {
    position: "absolute",
    left: 14,
    right: 14,
    top: 50,
    bottom: 10,
    borderRadius: 28,
    opacity: 0.7,
  },
  card: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  innerGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 999,
    top: -52,
    right: -24,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  content: {
    paddingHorizontal: 14,
  },
  image: {
    position: "absolute",
    top: 0,
    left: "60%",
    width: 118,
    height: 118,
    marginLeft: -59,
    zIndex: 2,
  },
  footerRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5F5F5",
    flex: 1,
  },
  actionButton: {
    padding: 2,
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
