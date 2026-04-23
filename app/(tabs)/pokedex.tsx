import InputSearch from "@/src/components/InputSearch";
import PokeCard from "@/src/components/PokeCard";
import PokedexFilters from "@/src/components/PokedexFilters";
import { useFavorites } from "@/src/contexts/FavoritesContext";
import { usePokedexListing } from "@/src/features/pokedex/usePokedexListing";
import { getPokemonImageUrl } from "@/src/utils/pokemon";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokedexScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    errorMessage,
    generationOptions,
    handleLoadMore,
    isApplyingFilters,
    isInitialLoading,
    isLoadingMore,
    query,
    selectedGeneration,
    selectedOrder,
    selectedType,
    setQuery,
    setSelectedGeneration,
    setSelectedOrder,
    setSelectedType,
    trimmedQuery,
    typeOptions,
    visiblePokemon,
  } = usePokedexListing();

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <InputSearch value={query} onChangeText={setQuery} />

      <PokedexFilters
        generationOptions={generationOptions}
        onSelectGeneration={setSelectedGeneration}
        onSelectOrder={setSelectedOrder}
        onSelectType={setSelectedType}
        selectedGeneration={selectedGeneration}
        selectedOrder={selectedOrder}
        selectedType={selectedType}
        typeOptions={typeOptions}
      />

      {trimmedQuery.length === 1 ? (
        <Text style={styles.helperText}>
          Digite pelo menos 2 caracteres para pesquisar.
        </Text>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {isInitialLoading ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color="#DD2323" />
          <Text style={styles.feedbackText}>Carregando pokemons...</Text>
        </View>
      ) : (
        <FlatList
          data={visiblePokemon}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.4}
          onEndReached={handleLoadMore}
          ListEmptyComponent={
            isApplyingFilters ? (
              <View style={styles.feedbackContainer}>
                <ActivityIndicator color="#DD2323" />
                <Text style={styles.feedbackText}>Aplicando filtros...</Text>
              </View>
            ) : (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  Nenhum pokemon encontrado para essa combinacao.
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <PokeCard
              imageUrl={getPokemonImageUrl(item.url)}
              isFavorite={isFavorite(item.name)}
              name={item.name}
              onToggleFavorite={() => toggleFavorite(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color="#DD2323" />
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0a0a0a",
  },
  helperText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 13,
  },
  errorText: {
    marginTop: 12,
    color: "#F87171",
    fontSize: 14,
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
    gap: 12,
  },
  feedbackText: {
    color: "#9CA3AF",
    fontSize: 15,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 18,
  },
});
