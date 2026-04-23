import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useDominantColor } from "@/src/hooks/useDominantColor";
import {
  DEFAULT_POKEMON_ACCENT,
  formatPokemonName,
  withAlpha,
} from "@/src/utils/pokemon";

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
  const { color: accentColor } = useDominantColor(imageUrl, {
    fallbackColor: DEFAULT_POKEMON_ACCENT,
  });

  return (
    <View style={styles.shell}>
      <View
        style={[
          styles.backgroundGlow,
          { backgroundColor: withAlpha(accentColor, 0.24) },
        ]}
      />
      <Image source={imageUrl} style={styles.image} contentFit="contain" />

      <View style={[styles.card, { backgroundColor: withAlpha(accentColor, 0.9) }]}>
        <View
          style={[
            styles.innerGlow,
            { backgroundColor: withAlpha(accentColor, 0.75) },
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
    minHeight: 200,
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
    shadowColor: "#ffffff79",
    shadowOpacity: 0.2,
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
