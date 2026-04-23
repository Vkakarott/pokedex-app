import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useDominantColor } from "@/src/hooks/useDominantColor";
import {
  DEFAULT_POKEMON_ACCENT,
  formatPokemonName,
  withAlpha,
} from "@/src/utils/pokemon";

type PokeCardProps = {
  imageUrl: string;
  isFavorite: boolean;
  name: string;
  onToggleFavorite: () => void;
};

export default function PokeCard({
  imageUrl,
  isFavorite,
  name,
  onToggleFavorite,
}: PokeCardProps) {
  const { color: accentColor } = useDominantColor(imageUrl, {
    fallbackColor: DEFAULT_POKEMON_ACCENT,
  });

  return (
    <View style={[styles.card, { backgroundColor: withAlpha(accentColor, 0.12) }]}>
      <View style={[styles.colorGlow, { backgroundColor: withAlpha(accentColor, 1) }]} />
      <BlurView intensity={75} tint="dark" style={StyleSheet.absoluteFill} />

      <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
        <Entypo
          name={isFavorite ? "heart" : "heart-outlined"}
          size={22}
          color={isFavorite ? "#DD2323" : "#F5F5F5"}
        />
      </Pressable>

      <View style={styles.info}>
        <Text style={styles.name}>{formatPokemonName(name)}</Text>
      </View>

      <Image source={imageUrl} style={styles.image} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 32,
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
    paddingLeft: 46,
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
    width: 340,
    height: 100,
    borderTopRightRadius: 100,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 10, 0.28)",
    zIndex: 2,
  },
});
