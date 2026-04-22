import { Tabs } from "expo-router";
import { CustomTabBar } from "../../src/components/navigation/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
        }}
      />
      <Tabs.Screen
        name="pokedex"
        options={{
          title: "Pokemons",
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favoritos",
        }}
      />
    </Tabs>
  );
}
