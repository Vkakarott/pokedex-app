import { getPokemonDetails } from "@/src/api/get-pokemon-details";
import { PokemonDetailsResponse } from "@/src/api/types";
import { AntDesign } from "@expo/vector-icons";
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

export default function PokemonDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ pokemonName?: string | string[] }>();
  const pokemonName = useMemo(() => {
    const value = params.pokemonName;
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
  }, [params.pokemonName]);

  const [pokemon, setPokemon] = useState<PokemonDetailsResponse | null>(null);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrow-left" size={22} color="#F5F5F5" />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color="#DD2323" />
          <Text style={styles.feedbackText}>Carregando detalhes...</Text>
        </View>
      ) : errorMessage || !pokemon ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.errorText}>{errorMessage || "Pokemon nao encontrado."}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.heroCard}>
            {artworkUrl ? (
              <Image source={artworkUrl} style={styles.heroImage} contentFit="contain" />
            ) : null}

            <Text style={styles.pokemonNumber}>#{String(pokemon.id).padStart(3, "0")}</Text>
            <Text style={styles.pokemonName}>{formatPokemonName(pokemon.name)}</Text>

            <View style={styles.typeRow}>
              {pokemon.types.map((item) => (
                <View key={item.type.name} style={styles.typeChip}>
                  <Text style={styles.typeText}>{formatPokemonName(item.type.name)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informacoes</Text>
            <View style={styles.infoGrid}>
              <InfoItem
                label="Altura"
                value={`${formatMetricValue(pokemon.height / 10)} m`}
              />
              <InfoItem
                label="Peso"
                value={`${formatMetricValue(pokemon.weight / 10)} kg`}
              />
              <InfoItem
                label="Experiencia"
                value={String(pokemon.base_experience)}
              />
              <InfoItem
                label="Habilidades"
                value={pokemon.abilities.map((item) => formatPokemonName(item.ability.name)).join(", ")}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stats base</Text>
            <View style={styles.statsList}>
              {pokemon.stats.map((item) => (
                <View key={item.stat.name} style={styles.statRow}>
                  <Text style={styles.statLabel}>{formatStatName(item.stat.name)}</Text>
                  <Text style={styles.statValue}>{item.base_stat}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Atk. Esp.",
    "special-defense": "Def. Esp.",
    speed: "Velocidade",
  };

  return statMap[statName] ?? formatPokemonName(statName);
}

function formatMetricValue(value: number) {
  return value.toFixed(1).replace(".0", "");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    gap: 18,
  },
  heroCard: {
    backgroundColor: "#141414",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  heroImage: {
    width: 180,
    height: 180,
    marginBottom: 8,
  },
  pokemonNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  pokemonName: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: "700",
    color: "#F5F5F5",
    textAlign: "center",
  },
  typeRow: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(221, 35, 35, 0.16)",
  },
  typeText: {
    color: "#F5F5F5",
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#141414",
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  infoValue: {
    fontSize: 16,
    color: "#F5F5F5",
    fontWeight: "600",
  },
  statsList: {
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  statLabel: {
    fontSize: 15,
    color: "#D1D5DB",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F5F5F5",
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
    color: "#9CA3AF",
  },
  errorText: {
    fontSize: 15,
    textAlign: "center",
    color: "#F87171",
  },
});
