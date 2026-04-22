import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { PokemonListItem } from "../api/types";

const FAVORITES_STORAGE_KEY = "@poke:favorites";

type FavoritePokemon = PokemonListItem;

type FavoritesContextValue = {
  favorites: FavoritePokemon[];
  isLoading: boolean;
  isFavorite: (pokemonName: string) => boolean;
  toggleFavorite: (pokemon: FavoritePokemon) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type FavoritesProviderProps = {
  children: ReactNode;
};

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadFavorites() {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

        if (!isMounted) {
          return;
        }

        setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, []);

  async function toggleFavorite(pokemon: FavoritePokemon) {
    setFavorites((currentFavorites) => {
      const pokemonAlreadyFavorited = currentFavorites.some(
        (favoritePokemon) => favoritePokemon.name === pokemon.name
      );

      const nextFavorites = pokemonAlreadyFavorited
        ? currentFavorites.filter((favoritePokemon) => favoritePokemon.name !== pokemon.name)
        : [...currentFavorites, pokemon];

      void AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));

      return nextFavorites;
    });
  }

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isLoading,
      isFavorite: (pokemonName: string) =>
        favorites.some((favoritePokemon) => favoritePokemon.name === pokemonName),
      toggleFavorite,
    }),
    [favorites, isLoading]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
}
