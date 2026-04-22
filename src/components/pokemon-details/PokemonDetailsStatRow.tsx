import { StyleSheet, Text, View } from "react-native";

type PokemonDetailsStatRowProps = {
  label: string;
  value: number;
};

export function PokemonDetailsStatRow({
  label,
  value,
}: PokemonDetailsStatRowProps) {
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

const styles = StyleSheet.create({
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
});
