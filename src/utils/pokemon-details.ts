import {
  DEFAULT_POKEMON_DETAILS_ACCENT,
  formatPokemonName,
  pickDominantColor,
  withAlpha,
} from "@/src/utils/pokemon";

export { DEFAULT_POKEMON_DETAILS_ACCENT, formatPokemonName, pickDominantColor, withAlpha };

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
