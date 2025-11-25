// simple HSL rainbow mapping (blue -> green -> yellow -> red)
export function rainbowColor(value, min = -1, max = 1) {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min + 1e-9)));
  const hue = (1 - ratio) * 240; // 240 (blue) -> 0 (red)
  return `hsl(${hue}, 85%, 50%)`;
}
