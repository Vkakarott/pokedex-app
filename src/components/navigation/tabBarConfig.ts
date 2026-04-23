export const TAB_BAR_ROUTES = {
  favorite: {
    iconName: "heart",
    isCenter: false,
  },
  map: {
    iconName: "map",
    isCenter: false,
  },
  pokedex: {
    iconName: null,
    isCenter: true,
  },
} as const;

export function getTabBarRouteConfig(routeName: string) {
  return TAB_BAR_ROUTES[routeName as keyof typeof TAB_BAR_ROUTES] ?? null;
}
