export function getPokemonIdFromUrl(url: string) {
  const segments = url.split("/").filter(Boolean);
  const id = segments[segments.length - 1];

  return Number(id);
}

export function getPokemonImageUrl(url: string) {
  const id = getPokemonIdFromUrl(url);

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
