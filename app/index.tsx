import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/pokeball.png")}
        style={{ width: 200, height: 200 }}
      />
      <Text style={{ fontSize: 24, marginTop: 20 }}>
        Welcome to the Poke App!
      </Text>
    </View>
  );
}
