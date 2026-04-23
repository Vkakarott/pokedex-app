import { useEffect, useMemo, useRef, useState } from "react";

import { getPokemonCatalog } from "@/src/api/get-catalog";
import {
  getPokemonGenerationFilter,
  getPokemonGenerations,
  getPokemonTypeFilter,
  getPokemonTypes,
} from "@/src/api/get-pokemon-filters";
import { getPokemonList } from "@/src/api/get-list";
import { NamedApiResource, PokemonListItem } from "@/src/api/types";
import { PokedexOrderOption } from "@/src/components/PokedexFilters";
import { getPokemonIdFromUrl } from "@/src/utils/pokemon";

const PAGE_SIZE = 20;
const SEARCH_DELAY_MS = 450;
const DEFAULT_ORDER: PokedexOrderOption = "name-asc";

export function usePokedexListing() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<PokemonListItem[]>([]);
  const [typeOptions, setTypeOptions] = useState<NamedApiResource[]>([]);
  const [generationOptions, setGenerationOptions] = useState<NamedApiResource[]>(
    []
  );
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] =
    useState<PokedexOrderOption>(DEFAULT_ORDER);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pokemonCatalogRef = useRef<PokemonListItem[] | null>(null);
  const pokemonTypeMapRef = useRef<Map<string, Set<string>>>(new Map());
  const pokemonGenerationMapRef = useRef<Map<string, Set<number>>>(new Map());

  const trimmedQuery = query.trim();
  const normalizedQuery = debouncedQuery.trim().toLowerCase();
  const isSearchActive = normalizedQuery.length >= 2;
  const hasActiveFilters =
    Boolean(selectedType) ||
    Boolean(selectedGeneration) ||
    selectedOrder !== DEFAULT_ORDER;
  const isCatalogMode = isSearchActive || hasActiveFilters;

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

    void loadInitialPokemonPage();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadFilterOptions() {
      try {
        const [types, generations] = await Promise.all([
          getPokemonTypes(),
          getPokemonGenerations(),
        ]);

        if (!isMounted) {
          return;
        }

        setTypeOptions(types);
        setGenerationOptions(generations);
      } catch {
        if (isMounted) {
          setErrorMessage("Nao foi possivel carregar os filtros.");
        }
      }
    }

    void loadFilterOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function applyFilters() {
      if (!isCatalogMode) {
        if (isMounted) {
          setFilteredResults([]);
          setIsApplyingFilters(false);
          setErrorMessage("");
        }
        return;
      }

      try {
        setErrorMessage("");
        setIsApplyingFilters(true);

        if (!pokemonCatalogRef.current) {
          pokemonCatalogRef.current = await getPokemonCatalog();
        }

        if (!isMounted) {
          return;
        }

        let nextResults = [...pokemonCatalogRef.current];

        if (selectedType) {
          let pokemonNames = pokemonTypeMapRef.current.get(selectedType);

          if (!pokemonNames) {
            const response = await getPokemonTypeFilter(selectedType);
            pokemonNames = new Set(
              response.pokemon.map((item) => item.pokemon.name)
            );
            pokemonTypeMapRef.current.set(selectedType, pokemonNames);
          }

          nextResults = nextResults.filter((pokemon) =>
            pokemonNames.has(pokemon.name)
          );
        }

        if (selectedGeneration) {
          let pokemonIds = pokemonGenerationMapRef.current.get(selectedGeneration);

          if (!pokemonIds) {
            const response = await getPokemonGenerationFilter(selectedGeneration);
            pokemonIds = new Set(
              response.pokemon_species.map((item) => getPokemonIdFromUrl(item.url))
            );
            pokemonGenerationMapRef.current.set(selectedGeneration, pokemonIds);
          }

          nextResults = nextResults.filter((pokemon) =>
            pokemonIds.has(getPokemonIdFromUrl(pokemon.url))
          );
        }

        if (normalizedQuery.length >= 2) {
          nextResults = nextResults.filter((pokemon) =>
            pokemon.name.includes(normalizedQuery)
          );
        }

        nextResults.sort((current, next) =>
          comparePokemon(current, next, selectedOrder)
        );

        setFilteredResults(nextResults);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Nao foi possivel aplicar os filtros.");
      } finally {
        if (isMounted) {
          setIsApplyingFilters(false);
        }
      }
    }

    void applyFilters();

    return () => {
      isMounted = false;
    };
  }, [
    isCatalogMode,
    normalizedQuery,
    selectedGeneration,
    selectedOrder,
    selectedType,
  ]);

  const visiblePokemon = useMemo(
    () => (isCatalogMode ? filteredResults : pokemonList),
    [filteredResults, isCatalogMode, pokemonList]
  );

  async function handleLoadMore() {
    if (isCatalogMode || isLoadingMore || isInitialLoading || !hasMore) {
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

  return {
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
  };
}

function comparePokemon(
  current: PokemonListItem,
  next: PokemonListItem,
  order: PokedexOrderOption
) {
  switch (order) {
    case "name-asc":
      return current.name.localeCompare(next.name);
    case "name-desc":
      return next.name.localeCompare(current.name);
    default:
      return current.name.localeCompare(next.name);
  }
}
