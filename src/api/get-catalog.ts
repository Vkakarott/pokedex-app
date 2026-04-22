import { getPokemonList } from "./get-list";
import { PokemonCatalogResponse } from "./types";

export async function getPokemonCatalog(): Promise<PokemonCatalogResponse> {
  const firstPage = await getPokemonList({ limit: 1 });

  if (firstPage.count === 0) {
    return [];
  }

  const fullCatalog = await getPokemonList({
    offset: 0,
    limit: firstPage.count,
  });

  return fullCatalog.results;
}
