import { PokemonDetailsResponse } from "./types";

export async function getPokemonDetails(
  pokemonName: string
): Promise<PokemonDetailsResponse> {
  const normalizedName = pokemonName.trim().toLowerCase();

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(normalizedName)}`
  );

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os detalhes do pokemon.");
  }

  return response.json();
}
