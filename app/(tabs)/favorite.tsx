import FavoritePokemonCard from "@/src/components/FavoritePokemonCard";
import { useFavorites } from "@/src/contexts/FavoritesContext";
import { getPokemonImageUrl } from "@/src/utils/pokemon";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function FavoriteScreen() {
  const { favorites, isFavorite, isLoading, toggleFavorite } = useFavorites();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>

      {isLoading ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color="#DD2323" />
          <Text style={styles.description}>Carregando favoritos...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require("../../assets/images/charizard.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.description}>
            Adicione aqui seus Pokemons favoritos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <FavoritePokemonCard
              imageUrl={getPokemonImageUrl(item.url)}
              isFavorite={isFavorite(item.name)}
              name={item.name}
              onToggleFavorite={() => toggleFavorite(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0a0a0a",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F5F5F5",
    marginTop: 24,
  },
  description: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    color: "#9CA3AF",
  },
  listContent: {
    paddingTop: 20,
    paddingBottom: 140,
  },
  separator: {
    height: 14,
  },
  feedbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImage: {
    width: 170,
    height: 170,
  },
});
