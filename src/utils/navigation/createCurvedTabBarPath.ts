export function createCurvedTabBarPath(width: number, baseY: number, height: number) {
  const radius = 28;
  const centerX = width / 2;
  const bumpWidth = 116;
  const bumpHeight = 32;
  const bumpStart = centerX - bumpWidth / 2;
  const bumpEnd = centerX + bumpWidth / 2;

  return [
    `M ${radius} ${baseY}`,
    `L ${bumpStart} ${baseY}`,
    `C ${bumpStart + 16} ${baseY} ${centerX - 34} ${baseY - bumpHeight} ${centerX} ${baseY - bumpHeight}`,
    `C ${centerX + 34} ${baseY - bumpHeight} ${bumpEnd - 16} ${baseY} ${bumpEnd} ${baseY}`,
    `L ${width - radius} ${baseY}`,
    `Q ${width} ${baseY} ${width} ${baseY + radius}`,
    `L ${width} ${baseY + height - radius}`,
    `Q ${width} ${baseY + height} ${width - radius} ${baseY + height}`,
    `L ${radius} ${baseY + height}`,
    `Q 0 ${baseY + height} 0 ${baseY + height - radius}`,
    `L 0 ${baseY + radius}`,
    `Q 0 ${baseY} ${radius} ${baseY}`,
    "Z",
  ].join(" ");
}
