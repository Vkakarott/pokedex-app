import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type PokeCardProps = {
  id: number;
  imageUrl: string;
  name: string;
};

export default function PokeCard({ id, imageUrl, name }: PokeCardProps) {
  return (
    <View style={styles.card}>
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
    minHeight: 120,
    backgroundColor: "#141414",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#202020",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
    gap: 8,
    paddingRight: 12,
  },
  badge: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#9CA3AF",
    backgroundColor: "#1E1E1E",
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
    width: 96,
    height: 96,
  },
});

function formatPokemonName(name: string) {
  if (!name) {
    return "";
  }

  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}
