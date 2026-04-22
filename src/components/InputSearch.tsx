import { TextInput, StyleSheet } from "react-native";

type InputSearchProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export default function InputSearch({ value, onChangeText }: InputSearchProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Pesquisar pokemon"
      placeholderTextColor="#9CA3AF"
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#121212",
    borderColor: "#1a1a1a",
    borderWidth: 1,
    color: "#F5F5F5",
    padding: 12,
    borderRadius: 12,
    width: "100%",
  },
});
