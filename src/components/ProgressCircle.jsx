import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";

/**
 * Utility to extract color stops from a linear-gradient CSS string
 * Example: "linear-gradient(to bottom, #0A0A3D, #1C1C6B, #2E2E9F, #5050D4, #5050D4)"
 * returns: [ "#0A0A3D", "#1C1C6B", "#2E2E9F", "#5050D4", "#5050D4" ]
 */
function extractColorStops(gradient) {
  if (!gradient || !gradient.startsWith("linear-gradient")) return [];
  // Get the content inside the parentheses
  const inside = gradient.match(/\((.*)\)/)[1];
  // Split by comma and remove the direction part
  const parts = inside.split(",").map(x => x.trim());
  return parts.slice(1); // skip "to bottom"
}

const ProgressCircle = ({ progress = 0.75, size = 90, borderWidth = 14 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  // Extract color stops from your blueAccent[1000] linear-gradient
  const colorStops = extractColorStops(colors.blueAccent[1100]);

  // Build a conic-gradient string with those color stops
  // We'll interpolate the stops along the progress angle
  function buildConicGradient(stops, angle, fallbackColor, bgColor) {
    if (!stops.length) {
      return `conic-gradient(${fallbackColor} 0deg ${angle}deg, ${bgColor} ${angle}deg 360deg)`;
    }
    // Divide the angle among the stops
    const stopAngle = angle / stops.length;
    let result = `conic-gradient(`;
    stops.forEach((color, idx) => {
      const from = (idx * stopAngle).toFixed(1);
      const to = ((idx + 1) * stopAngle).toFixed(1);
      result += `${color} ${from}deg ${to}deg, `;
    });
    // The rest is the background color
    result += `${bgColor} ${angle}deg 360deg)`;
    return result;
  }

  const bgColor = colors.blueAccent[200]; // fallback for inactive progress

  // Inner circle size calculation
  const innerCircleSize = size - borderWidth * 2; // Ensures space for text

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        background: buildConicGradient(
          colorStops,
          angle,
          colors.blueAccent[500],
          bgColor
        ),
      }}
    >
      {/* Inner Circle */}
      <Box
        sx={{
          position: "absolute",
          width: `${innerCircleSize}px`,
          height: `${innerCircleSize}px`,
          borderRadius: "50%",
          backgroundColor: colors.primary[400],
        }}
      />

      {/* Centered Percentage Text */}
      <Typography
        sx={{
          position: "absolute",
          color: "#000",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {Math.round(progress * 100)}%
      </Typography>
    </Box>
  );
};

export default ProgressCircle;