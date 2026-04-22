import api from ".";
import { GetPokemonListParams, PokemonListResponse } from "./types";

const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 20;

export async function getPokemonList({
  offset = DEFAULT_OFFSET,
  limit = DEFAULT_LIMIT,
}: GetPokemonListParams = {}): Promise<PokemonListResponse> {
  const response = await api.get<PokemonListResponse>("/pokemon", {
    params: {
      offset,
      limit,
    },
  });

  return response.data;
}
