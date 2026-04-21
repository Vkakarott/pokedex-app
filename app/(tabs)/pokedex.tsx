import { StyleSheet, Text, View } from "react-native";

export default function PokedexScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <Text style={styles.description}>
        Estrutura inicial da lista de pokemons.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#141414",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    color: "#9CA3AF",
  },
});
