import { useEffect, useMemo, useState } from "react";

import { getPokemonDetails } from "@/src/api/get-pokemon-details";
import { PokemonDetailsResponse, PokemonListItem } from "@/src/api/types";
import { useFavorites } from "@/src/contexts/FavoritesContext";
import { useDominantColor } from "@/src/hooks/useDominantColor";
import {
  DEFAULT_POKEMON_DETAILS_ACCENT,
  getPokemonArtworkUrl,
} from "@/src/utils/pokemon";

type UsePokemonDetailsScreenOptions = {
  pokemonName: string;
};

export function usePokemonDetailsScreen({
  pokemonName,
}: UsePokemonDetailsScreenOptions) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState<PokemonDetailsResponse | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPokemonDetails() {
      if (!pokemonName) {
        if (isMounted) {
          setErrorMessage("Pokemon invalido.");
          setIsDetailsLoading(false);
        }
        return;
      }

      try {
        setErrorMessage("");
        setIsDetailsLoading(true);

        const response = await getPokemonDetails(pokemonName);

        if (!isMounted) {
          return;
        }

        setPokemon(response);
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("Nao foi possivel carregar os detalhes do pokemon.");
      } finally {
        if (isMounted) {
          setIsDetailsLoading(false);
        }
      }
    }

    void loadPokemonDetails();

    return () => {
      isMounted = false;
    };
  }, [pokemonName]);

  const artworkUrl = useMemo(() => getPokemonArtworkUrl(pokemon), [pokemon]);
  const { color: accentColor, isLoading: isAccentLoading } = useDominantColor(
    artworkUrl,
    {
      fallbackColor: DEFAULT_POKEMON_DETAILS_ACCENT,
    }
  );

  const isCurrentFavorite = pokemon ? isFavorite(pokemon.name) : false;
  const isLoading = isDetailsLoading || isAccentLoading;

  async function handleToggleFavorite() {
    if (!pokemon) {
      return;
    }

    const favoriteItem: PokemonListItem = {
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    };

    await toggleFavorite(favoriteItem);
  }

  return {
    accentColor,
    artworkUrl,
    errorMessage,
    handleToggleFavorite,
    isCurrentFavorite,
    isLoading,
    pokemon,
  };
}
