import { getPokemonDetails } from "@/src/api/get-pokemon-details";
import { PokemonDetailsResponse, PokemonListItem } from "@/src/api/types";
import { PokemonDetailsHeader } from "@/src/components/pokemon-details/PokemonDetailsHeader";
import { PokemonDetailsStatRow } from "@/src/components/pokemon-details/PokemonDetailsStatRow";
import { PokemonDetailsSummaryItem } from "@/src/components/pokemon-details/PokemonDetailsSummaryItem";
import { useFavorites } from "@/src/contexts/FavoritesContext";
import {
  DEFAULT_POKEMON_DETAILS_ACCENT,
  formatMetricValue,
  formatPokemonName,
  formatStatName,
  pickDominantColor,
} from "@/src/utils/pokemon-details";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getColors } from "react-native-image-colors";

export default function PokemonDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pokemonName?: string | string[] }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const pokemonName = useMemo(() => {
    const value = params.pokemonName;
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  }, [params.pokemonName]);

  const [pokemon, setPokemon] = useState<PokemonDetailsResponse | null>(null);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState(true);
  const [isAccentLoading, setIsAccentLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadPokemonDetails() {
        if (!pokemonName) {
          if (isMounted) {
            setErrorMessage("Pokemon invalido.");
            setIsDetailsLoading(false);
            setIsAccentLoading(false);
          }
        return;
      }

      try {
        setErrorMessage("");
        setIsDetailsLoading(true);

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
          setIsDetailsLoading(false);
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
          setAccentColor(DEFAULT_POKEMON_DETAILS_ACCENT);
          setIsAccentLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setIsAccentLoading(true);
        }

        const result = await getColors(artworkUrl, {
          fallback: DEFAULT_POKEMON_DETAILS_ACCENT,
          cache: true,
          key: artworkUrl,
        });

        if (!isMounted) {
          return;
        }

        setAccentColor(pickDominantColor(result));
      } catch {
        if (isMounted) {
          setAccentColor(DEFAULT_POKEMON_DETAILS_ACCENT);
        }
      } finally {
        if (isMounted) {
          setIsAccentLoading(false);
        }
      }
    }

    loadAccentColor();

    return () => {
      isMounted = false;
    };
  }, [artworkUrl]);

  const isCurrentFavorite = pokemon ? isFavorite(pokemon.name) : false;
  const screenAccentColor = accentColor ?? DEFAULT_POKEMON_DETAILS_ACCENT;
  const isLoading = isDetailsLoading || isAccentLoading;

  async function handleToggleFavorite() {
    if (!pokemon) {
      return;
    }

    const favoriteItem: PokemonListItem = {
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    };

    await toggleFavorite(favoriteItem);
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: "#0A0A0A" }]}>
        <View style={styles.backgroundVeil} />
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color="#F5F5F5" />
          <Text style={styles.feedbackText}>Carregando detalhes...</Text>
        </View>
      </View>
    );
  }

  if (errorMessage || !pokemon) {
    return (
      <View style={[styles.container, { backgroundColor: screenAccentColor }]}>
        <View style={styles.backgroundVeil} />
        <View style={styles.feedbackContainer}>
          <Text style={styles.errorText}>{errorMessage || "Pokemon nao encontrado."}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: screenAccentColor }]}>
      <View style={styles.backgroundVeil} />

      <PokemonDetailsHeader
        isFavorite={isCurrentFavorite}
        name={formatPokemonName(pokemon.name)}
        pokemonNumber={`#${String(pokemon.id).padStart(3, "0")}`}
        onGoBack={() => router.back()}
        onToggleFavorite={handleToggleFavorite}
      />

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
            <PokemonDetailsSummaryItem
              label="Altura"
              value={`${formatMetricValue(pokemon.height / 10)} m`}
            />
            <PokemonDetailsSummaryItem
              label="Peso"
              value={`${formatMetricValue(pokemon.weight / 10)} kg`}
            />
            <PokemonDetailsSummaryItem
              label="Exp."
              value={String(pokemon.base_experience)}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats</Text>

            <View style={styles.statsList}>
              {pokemon.stats.map((item) => (
                <PokemonDetailsStatRow
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  scrollContent: {
    paddingTop: 118,
    minHeight: "100%",
  },
  heroSection: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
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
