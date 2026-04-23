import { PokemonDetailsResponse } from "@/src/api/types";
import { getColors } from "react-native-image-colors";

export const DEFAULT_POKEMON_ACCENT = "#2A2A2A";
export const DEFAULT_POKEMON_DETAILS_ACCENT = "#f03232";

export function getPokemonIdFromUrl(url: string) {
  const segments = url.split("/").filter(Boolean);
  const id = segments[segments.length - 1];

  return Number(id);
}

export function getPokemonImageUrl(url: string) {
  const id = getPokemonIdFromUrl(url);

  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonArtworkUrl(pokemon: PokemonDetailsResponse | null) {
  return (
    pokemon?.sprites.other?.["official-artwork"]?.front_default ??
    pokemon?.sprites.front_default ??
    null
  );
}

export function formatPokemonName(name: string) {
  if (!name) {
    return "";
  }

  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function pickDominantColor(
  result: Awaited<ReturnType<typeof getColors>>,
  fallbackColor = DEFAULT_POKEMON_ACCENT
) {
  switch (result.platform) {
    case "android":
      return (
        result.dominant ??
        result.vibrant ??
        result.average ??
        result.lightVibrant ??
        fallbackColor
      );
    case "ios":
      return result.background ?? result.primary ?? result.detail ?? fallbackColor;
    case "web":
      return result.dominant ?? result.vibrant ?? result.lightVibrant ?? fallbackColor;
    default:
      return fallbackColor;
  }
}

export function withAlpha(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((character) => `${character}${character}`)
          .join("")
      : normalized.slice(0, 6);

  const red = Number.parseInt(safeHex.slice(0, 2), 16);
  const green = Number.parseInt(safeHex.slice(2, 4), 16);
  const blue = Number.parseInt(safeHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
