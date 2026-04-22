import { Entypo, AntDesign } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PokemonDetailsHeaderProps = {
  isFavorite: boolean;
  name: string;
  pokemonNumber: string;
  onGoBack: () => void;
  onToggleFavorite: () => void;
};

export function PokemonDetailsHeader({
  isFavorite,
  name,
  pokemonNumber,
  onGoBack,
  onToggleFavorite,
}: PokemonDetailsHeaderProps) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeHeader}>
      <View style={styles.header}>
        <Pressable onPress={onGoBack} style={styles.headerButton}>
          <AntDesign name="arrow-left" size={24} color="#F5F5F5" />
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.heroNumber}>{pokemonNumber}</Text>
        </View>

        <Pressable onPress={onToggleFavorite} style={styles.headerButton}>
          <Entypo
            name={isFavorite ? "heart" : "heart-outlined"}
            size={24}
            color="#F5F5F5"
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  headerTextWrap: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    maxWidth: 220,
    fontSize: 22,
    fontWeight: "700",
    color: "#F5F5F5",
    textAlign: "center",
  },
  heroNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.82)",
  },
});
