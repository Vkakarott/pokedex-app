import {
  NamedApiResourceListResponse,
  PokemonGenerationFilterResponse,
  PokemonTypeFilterResponse,
} from "./types";

const API_BASE_URL = "https://pokeapi.co/api/v2";

async function requestJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os filtros.");
  }

  return response.json();
}

export async function getPokemonTypes() {
  const response = await requestJson<NamedApiResourceListResponse>("/type?limit=100");

  return response.results;
}

export async function getPokemonGenerations() {
  const response = await requestJson<NamedApiResourceListResponse>(
    "/generation?limit=100"
  );

  return response.results;
}

export async function getPokemonTypeFilter(typeName: string) {
  return requestJson<PokemonTypeFilterResponse>(`/type/${encodeURIComponent(typeName)}`);
}

export async function getPokemonGenerationFilter(generationName: string) {
  return requestJson<PokemonGenerationFilterResponse>(
    `/generation/${encodeURIComponent(generationName)}`
  );
}
