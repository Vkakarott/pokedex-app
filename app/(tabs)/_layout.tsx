import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DD2323",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          backgroundColor: "#141414",
          borderTopColor: "#1F1F1F",
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="pokedex"
        options={{
          title: "Pokemons",
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
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
