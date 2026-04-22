import { StyleSheet, Text, Image, View } from "react-native";

export default function FavoriteScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/sharizard.png")}
        style={{ width: 170, height: 170 }}
        resizeMode="contain"
      />
      <Text style={styles.title}>Favoritos</Text>
      <Text style={styles.description}>
        Adicione aqui seus Pokemons favoritos.
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
    backgroundColor: "#0a0a0a",
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
