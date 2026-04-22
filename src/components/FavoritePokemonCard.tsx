import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

type FavoritePokemonCardProps = {
  imageUrl: string;
  name: string;
  onToggleFavorite: () => void;
};

export default function FavoritePokemonCard({
  imageUrl,
  name,
  onToggleFavorite,
}: FavoritePokemonCardProps) {
  return (
    <View style={styles.shell}>
      <Image source={imageUrl} style={styles.image} contentFit="contain" />

      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.footerRow}>
            <Text style={styles.name}>{formatPokemonName(name)}</Text>

            <Pressable onPress={onToggleFavorite} style={styles.actionButton}>
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
  card: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 74,
  },
  image: {
    position: "absolute",
    top: 0,
    left: "50%",
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
