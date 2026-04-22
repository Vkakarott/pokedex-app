import { getPokemonCatalog } from "@/src/api/get-catalog";
import { getPokemonList } from "@/src/api/get-list";
import { PokemonListItem } from "@/src/api/types";
import InputSearch from "@/src/components/InputSearch";
import PokeCard from "@/src/components/PokeCard";
import { useFavorites } from "@/src/contexts/FavoritesContext";
import { getPokemonImageUrl } from "@/src/utils/pokemon";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 450;

export default function PokedexScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [searchResults, setSearchResults] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pokemonCatalogRef = useRef<PokemonListItem[] | null>(null);

  const trimmedQuery = query.trim();
  const isSearchActive = debouncedQuery.trim().length >= 2;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialPokemonPage() {
      try {
        setErrorMessage("");
        setIsInitialLoading(true);

        const response = await getPokemonList({
          offset: 0,
          limit: PAGE_SIZE,
        });

        if (!isMounted) {
          return;
        }

        setPokemonList(response.results);
        setOffset(PAGE_SIZE);
        setHasMore(Boolean(response.next));
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Nao foi possivel carregar a pokedex.");
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    }

    loadInitialPokemonPage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function runSearch() {
      const normalizedQuery = debouncedQuery.trim().toLowerCase();

      if (normalizedQuery.length < 2) {
        if (isMounted) {
          setSearchResults([]);
          setIsSearching(false);
          setErrorMessage("");
        }
        return;
      }

      try {
        setErrorMessage("");
        setIsSearching(true);

        if (!pokemonCatalogRef.current) {
          pokemonCatalogRef.current = await getPokemonCatalog();
        }

        if (!isMounted) {
          return;
        }

        const filteredResults = pokemonCatalogRef.current.filter((pokemon) =>
          pokemon.name.includes(normalizedQuery)
        );

        setSearchResults(filteredResults);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Nao foi possivel pesquisar pokemons.");
      } finally {
        if (isMounted) {
          setIsSearching(false);
        }
      }
    }

    runSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  const visiblePokemon = useMemo(
    () => (isSearchActive ? searchResults : pokemonList),
    [isSearchActive, pokemonList, searchResults]
  );

  async function handleLoadMore() {
    if (isSearchActive || isLoadingMore || isInitialLoading || !hasMore) {
      return;
    }

    try {
      setIsLoadingMore(true);

      const response = await getPokemonList({
        offset,
        limit: PAGE_SIZE,
      });

      setPokemonList((currentPokemon) => [...currentPokemon, ...response.results]);
      setOffset((currentOffset) => currentOffset + PAGE_SIZE);
      setHasMore(Boolean(response.next));
    } catch {
      setErrorMessage("Nao foi possivel carregar mais pokemons.");
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Text style={styles.title}>Pokedex</Text>
      <Text style={styles.subtitle}>
        Busque em tempo real ou explore a lista inicial.
      </Text>

      <InputSearch value={query} onChangeText={setQuery} />

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
            isSearching ? (
              <View style={styles.feedbackContainer}>
                <ActivityIndicator color="#DD2323" />
                <Text style={styles.feedbackText}>Pesquisando pokemons...</Text>
              </View>
            ) : (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                  Nenhum pokemon encontrado para essa pesquisa.
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
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 16,
    color: "#9CA3AF",
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
