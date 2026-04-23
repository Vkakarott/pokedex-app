import { NamedApiResource } from "@/src/api/types";
import { useState } from "react";
import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";

export type PokedexOrderOption = "name-asc" | "name-desc";

type PokedexFiltersProps = {
  generationOptions: NamedApiResource[];
  onSelectGeneration: (generation: string | null) => void;
  onSelectOrder: (order: PokedexOrderOption) => void;
  onSelectType: (type: string | null) => void;
  selectedGeneration: string | null;
  selectedOrder: PokedexOrderOption;
  selectedType: string | null;
  typeOptions: NamedApiResource[];
};

const ORDER_OPTIONS: { label: string; value: PokedexOrderOption }[] = [
  { label: "A-Z", value: "name-asc" },
  { label: "Z-A", value: "name-desc" },
];

export default function PokedexFilters({
  generationOptions,
  onSelectGeneration,
  onSelectOrder,
  onSelectType,
  selectedGeneration,
  selectedOrder,
  selectedType,
  typeOptions,
}: PokedexFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasActiveFilters =
    Boolean(selectedType) ||
    Boolean(selectedGeneration) ||
    selectedOrder !== "name-asc";

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsExpanded((current) => !current)}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Filtros</Text>
        <View style={styles.headerMeta}>
          {hasActiveFilters ? <View style={styles.activeDot} /> : null}
          <Text style={styles.headerAction}>
            {isExpanded ? "Ocultar" : "Mostrar"}
          </Text>
        </View>
      </Pressable>

      {isExpanded ? (
        <View style={styles.panel}>
          <FilterRow
            label="Tipo"
            options={typeOptions.map((item) => ({
              label: formatPokemonLabel(item.name),
              value: item.name,
            }))}
            selectedValue={selectedType}
            onSelect={onSelectType}
          />

          <FilterRow
            label="Generation"
            options={generationOptions.map((item) => ({
              label: formatGenerationLabel(item.name),
              value: item.name,
            }))}
            selectedValue={selectedGeneration}
            onSelect={onSelectGeneration}
          />

          <FilterRow
            label="Ordenar"
            options={ORDER_OPTIONS}
            selectedValue={selectedOrder}
            onSelect={(value) => onSelectOrder(value as PokedexOrderOption)}
            allowClear={false}
          />
        </View>
      ) : null}
    </View>
  );
}

type FilterRowProps = {
  allowClear?: boolean;
  label: string;
  onSelect: (value: string | null) => void;
  options: { label: string; value: string }[];
  selectedValue: string | null;
};

function FilterRow({
  allowClear = true,
  label,
  onSelect,
  options,
  selectedValue,
}: FilterRowProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {allowClear ? (
          <FilterChip
            label="Todos"
            isSelected={selectedValue === null}
            onPress={() => onSelect(null)}
          />
        ) : null}

        {options.map((option) => (
          <FilterChip
            key={option.value}
            label={option.label}
            isSelected={selectedValue === option.value}
            onPress={() => onSelect(option.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function FilterChip({
  isSelected,
  label,
  onPress,
}: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, isSelected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function formatPokemonLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatGenerationLabel(value: string) {
  const match = value.match(/generation-(.+)/);

  if (!match) {
    return formatPokemonLabel(value);
  }

  return `Gen ${match[1].toUpperCase()}`;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F5F5F5",
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#DD2323",
  },
  headerAction: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  panel: {
    gap: 14,
  },
  group: {
    gap: 10,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  row: {
    gap: 10,
    paddingRight: 24,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  chipSelected: {
    backgroundColor: "#DD2323",
    borderColor: "#DD2323",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#D1D5DB",
  },
  chipTextSelected: {
    color: "#F5F5F5",
  },
});
