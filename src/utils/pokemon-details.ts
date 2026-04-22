import { getColors } from "react-native-image-colors";

export const DEFAULT_POKEMON_DETAILS_ACCENT = "#f03232";

export function formatPokemonName(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatStatName(statName: string) {
  const statMap: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  };

  return statMap[statName] ?? formatPokemonName(statName);
}

export function formatMetricValue(value: number) {
  return value.toFixed(1).replace(".0", "");
}

export function pickDominantColor(result: Awaited<ReturnType<typeof getColors>>) {
  switch (result.platform) {
    case "android":
      return (
        result.dominant ??
        result.vibrant ??
        result.average ??
        result.lightVibrant ??
        DEFAULT_POKEMON_DETAILS_ACCENT
      );
    case "ios":
      return (
        result.background ??
        result.primary ??
        result.detail ??
        DEFAULT_POKEMON_DETAILS_ACCENT
      );
    case "web":
      return (
        result.dominant ??
        result.vibrant ??
        result.lightVibrant ??
        DEFAULT_POKEMON_DETAILS_ACCENT
      );
    default:
      return DEFAULT_POKEMON_DETAILS_ACCENT;
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
