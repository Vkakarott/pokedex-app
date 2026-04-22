import { getPokemonDetails } from "@/src/api/get-pokemon-details";
import { PokemonDetailsResponse, PokemonListItem } from "@/src/api/types";
import { useFavorites } from "@/src/contexts/FavoritesContext";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getColors } from "react-native-image-colors";

const DEFAULT_ACCENT = "#C96A95";

export default function PokemonDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pokemonName?: string | string[] }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const pokemonName = useMemo(() => {
    const value = params.pokemonName;
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  }, [params.pokemonName]);

  const [pokemon, setPokemon] = useState<PokemonDetailsResponse | null>(null);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPokemonDetails() {
      if (!pokemonName) {
        if (isMounted) {
          setErrorMessage("Pokemon invalido.");
          setIsLoading(false);
        }
        return;
      }

      try {
        setErrorMessage("");
        setIsLoading(true);

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
          setIsLoading(false);
        }
      }
    }

    loadPokemonDetails();

    return () => {
      isMounted = false;
    };
  }, [pokemonName]);

  const artworkUrl =
    pokemon?.sprites.other?.["official-artwork"]?.front_default ??
    pokemon?.sprites.front_default ??
    null;

  useEffect(() => {
    let isMounted = true;

    async function loadAccentColor() {
      if (!artworkUrl) {
        if (isMounted) {
          setAccentColor(DEFAULT_ACCENT);
        }
        return;
      }

      try {
        const result = await getColors(artworkUrl, {
          fallback: DEFAULT_ACCENT,
          cache: true,
          key: artworkUrl,
        });

        if (!isMounted) {
          return;
        }

        setAccentColor(pickDominantColor(result));
      } catch {
        if (isMounted) {
          setAccentColor(DEFAULT_ACCENT);
        }
      }
    }

    loadAccentColor();

    return () => {
      isMounted = false;
    };
  }, [artworkUrl]);

  const isCurrentFavorite = pokemon ? isFavorite(pokemon.name) : false;

  async function handleToggleFavorite() {
    if (!pokemon) {
      return;
    }

    const favoriteItem: PokemonListItem = {
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.name}/`,
    };

    await toggleFavorite(favoriteItem);
  }

  return (
    <View style={[styles.container, { backgroundColor: accentColor }]}>
      <View
        style={[
          styles.backgroundBloom,
          { backgroundColor: withAlpha(accentColor, 0.3) },
        ]}
      />
      <View style={styles.backgroundVeil} />

      {isLoading ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color="#F5F5F5" />
          <Text style={styles.feedbackText}>Carregando detalhes...</Text>
        </View>
      ) : errorMessage || !pokemon ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.errorText}>{errorMessage || "Pokemon nao encontrado."}</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.headerButton}>
              <AntDesign name="arrow-left" size={24} color="#F5F5F5" />
            </Pressable>

            <Text style={styles.headerTitle} numberOfLines={1}>
              {formatPokemonName(pokemon.name)}
            </Text>

            <Pressable onPress={handleToggleFavorite} style={styles.headerButton}>
              <Entypo
                name={isCurrentFavorite ? "heart" : "heart-outlined"}
                size={24}
                color="#F5F5F5"
              />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.heroSection}>
              {artworkUrl ? (
                <Image source={artworkUrl} style={styles.heroImage} contentFit="contain" />
              ) : null}

              <View style={styles.heroMeta}>
                <Text style={styles.heroNumber}>#{String(pokemon.id).padStart(3, "0")}</Text>
                <View style={styles.typeRow}>
                  {pokemon.types.map((item) => (
                    <View key={item.type.name} style={styles.typeChip}>
                      <Text style={styles.typeText}>{formatPokemonName(item.type.name)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />

              <View style={styles.summaryRow}>
                <SummaryItem label="Altura" value={`${formatMetricValue(pokemon.height / 10)} m`} />
                <SummaryItem label="Peso" value={`${formatMetricValue(pokemon.weight / 10)} kg`} />
                <SummaryItem label="Exp." value={String(pokemon.base_experience)} />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Stats</Text>

                <View style={styles.statsList}>
                  {pokemon.stats.map((item) => (
                    <StatRow
                      key={item.stat.name}
                      label={formatStatName(item.stat.name)}
                      value={item.base_stat}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Habilidades</Text>
                <Text style={styles.abilitiesText}>
                  {pokemon.abilities
                    .map((item) => formatPokemonName(item.ability.name))
                    .join(", ")}
                </Text>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

function StatRow({ label, value }: { label: string; value: number }) {
  const widthPercentage = `${Math.min((value / 150) * 100, 100)}%` as const;
  const barColor = value >= 60 ? "#7EE081" : "#E07E7E";

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statTrack}>
        <View
          style={[
            styles.statFill,
            { width: widthPercentage, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

function formatPokemonName(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatStatName(statName: string) {
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

function formatMetricValue(value: number) {
  return value.toFixed(1).replace(".0", "");
}

function pickDominantColor(result: Awaited<ReturnType<typeof getColors>>) {
  switch (result.platform) {
    case "android":
      return (
        result.dominant ??
        result.vibrant ??
        result.average ??
        result.lightVibrant ??
        DEFAULT_ACCENT
      );
    case "ios":
      return result.background ?? result.primary ?? result.detail ?? DEFAULT_ACCENT;
    case "web":
      return result.dominant ?? result.vibrant ?? result.lightVibrant ?? DEFAULT_ACCENT;
    default:
      return DEFAULT_ACCENT;
  }
}

function withAlpha(hexColor: string, alpha: number) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundBloom: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 999,
    top: 130,
    left: "50%",
    marginLeft: -160,
  },
  backgroundVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 64,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  headerTitle: {
    flex: 1,
    marginHorizontal: 16,
    fontSize: 22,
    fontWeight: "700",
    color: "#F5F5F5",
    textAlign: "center",
  },
  scrollContent: {
    paddingTop: 118,
    minHeight: "100%",
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  heroImage: {
    width: "92%",
    height: 330,
  },
  heroMeta: {
    alignItems: "center",
    marginTop: -6,
    gap: 12,
  },
  heroNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.82)",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
  },
  typeText: {
    color: "#F5F5F5",
    fontSize: 13,
    fontWeight: "700",
  },
  sheet: {
    flex: 1,
    marginTop: 8,
    backgroundColor: "#171717",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 120,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 84,
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    gap: 6,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  section: {
    marginTop: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  statsList: {
    gap: 16,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statLabel: {
    width: 76,
    fontSize: 16,
    color: "#A1A1AA",
  },
  statValue: {
    width: 36,
    fontSize: 16,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  statTrack: {
    flex: 1,
    height: 12,
    borderRadius: 999,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    overflow: "hidden",
  },
  statFill: {
    height: "100%",
    borderRadius: 999,
  },
  abilitiesText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#D4D4D8",
  },
  feedbackContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  feedbackText: {
    fontSize: 15,
    color: "#F5F5F5",
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    color: "#FDE68A",
  },
});
