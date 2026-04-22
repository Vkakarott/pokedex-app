export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

export type GetPokemonListParams = {
  offset?: number;
  limit?: number;
};

export type PokemonCatalogResponse = PokemonListItem[];
