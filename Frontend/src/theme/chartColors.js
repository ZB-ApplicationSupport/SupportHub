export const CHART_GREEN = {
  50: "#F1FCF2",
  100: "#DEFAE1",
  200: "#B2F2BB",
  300: "#8BEA99",
  400: "#51D766",
  500: "#2ABD41",
  600: "#1D9C31",
  700: "#1A7B2A",
  800: "#1A6126",
  900: "#175022",
  950: "#072C0E",
};

export const CHART_SERIES = [
  CHART_GREEN[500],
  CHART_GREEN[700],
  CHART_GREEN[400],
  CHART_GREEN[800],
  CHART_GREEN[300],
  CHART_GREEN[900],
];

export const chartFill = (hex, alpha) => {
  const value = String(hex).replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
