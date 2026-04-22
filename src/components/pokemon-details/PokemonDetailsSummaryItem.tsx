import { StyleSheet, Text, View } from "react-native";

type PokemonDetailsSummaryItemProps = {
  label: string;
  value: string;
};

export function PokemonDetailsSummaryItem({
  label,
  value,
}: PokemonDetailsSummaryItemProps) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
