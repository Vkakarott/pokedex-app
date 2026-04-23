import { NamedApiResource } from "@/src/api/types";
import { ScrollView, Pressable, StyleSheet, Text, View } from "react-native";

export type PokedexOrderOption =
  | "id-asc"
  | "id-desc"
  | "name-asc"
  | "name-desc";

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
  { label: "Menor ID", value: "id-asc" },
  { label: "Maior ID", value: "id-desc" },
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
  return (
    <View style={styles.container}>
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
