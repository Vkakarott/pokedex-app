import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { createCurvedTabBarPath } from "../../utils/navigation/createCurvedTabBarPath";

const ACTIVE_COLOR = "#DD2323";
const INACTIVE_COLOR = "rgba(245, 245, 245, 0.58)";
const BAR_FILL = "rgba(26, 26, 28, 0.94)";
const BAR_STROKE = "rgba(255, 255, 255, 0.08)";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const horizontalInset = 18;
  const barWidth = screenWidth - horizontalInset * 2;
  const baseY = 36;
  const barHeight = 76;
  const totalHeight = baseY + barHeight;
  const bottomOffset = Math.max(insets.bottom, 12);
  const shapePath = createCurvedTabBarPath(barWidth, baseY, barHeight);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tabBarShell,
        {
          left: horizontalInset,
          right: horizontalInset,
          bottom: bottomOffset,
          height: totalHeight,
        },
      ]}
    >
      <View style={styles.shadowLayer} />

      <Svg width={barWidth} height={totalHeight} style={styles.shape}>
        <Path d={shapePath} fill={BAR_FILL} stroke={BAR_STROKE} strokeWidth={1} />
      </Svg>

      <View style={[styles.buttonsRow, { paddingBottom: 14 }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === "string"
              ? options.tabBarLabel
              : typeof options.title === "string"
                ? options.title
                : route.name;

          const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;
          const isCenter = route.name === "pokedex";

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => navigation.navigate(route.name)}
              style={[styles.tabButton, isCenter && styles.centerButton]}
            >
              {isCenter ? (
                <View style={styles.centerIconWrap}>
                  <Image
                    source={require("../../../assets/images/pokeball.png")}
                    style={styles.centerIcon}
                    resizeMode="contain"
                  />
                </View>
              ) : (
                <Entypo
                  name={route.name === "map" ? "map" : "heart"}
                  size={24}
                  color={color}
                />
              )}

              <Text style={[styles.label, { color }, isCenter && styles.centerLabel]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarShell: {
    position: "absolute",
    justifyContent: "flex-end",
  },
  shape: {
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  shadowLayer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 4,
    height: 78,
    borderRadius: 30,
    backgroundColor: "rgba(0, 0, 0, 0.16)",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: "100%",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
  },
  centerButton: {
    justifyContent: "center",
    paddingBottom: 2,
  },
  centerIconWrap: {
    marginTop: -28,
    alignItems: "center",
    justifyContent: "center",
  },
  centerIcon: {
    width: 90,
    height: 90,
    bottom: -15,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  centerLabel: {
    marginTop: -6,
  },
});
