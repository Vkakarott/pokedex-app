import { StyleSheet, Text, View } from "react-native";

export default function FavoriteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>
      <Text style={styles.description}>
        Estrutura inicial da tela de favoritos.
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
