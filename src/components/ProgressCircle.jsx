import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";


// Robust utility to extract color stops (handles gradients with or without direction)
// function extractColorStops(gradient) {
//   if (!gradient || !gradient.startsWith("linear-gradient")) return [];
//   const inside = gradient.match(/\((.*)\)/)[1];
//   const parts = inside.split(",").map(x => x.trim());
//   if (
//     /^to /.test(parts[0]) ||
//     /^[0-9.]+deg$/.test(parts[0]) ||
//     /^[0-9.]+rad$/.test(parts[0])
//   ) {
//     return parts.slice(1);
//   }
//   return parts;
// }

const ProgressCircle = ({ progress = 0.75, size = 90, borderWidth = 14 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  // Use blueAccent[1100] which is a linear-gradient string
const colorStops = ["#2E2E9F"];

  function buildConicGradient(stops, angle, fallbackColor, bgColor) {
    if (!stops.length) {
      return `conic-gradient(${fallbackColor} 0deg ${angle}deg, ${bgColor} ${angle}deg 360deg)`;
    }
    const stopAngle = angle / stops.length;
    let result = `conic-gradient(`;
    stops.forEach((color, idx) => {
      const from = (idx * stopAngle).toFixed(1);
      const to = ((idx + 1) * stopAngle).toFixed(1);
      result += `${color} ${from}deg ${to}deg, `;
    });
    result += `${bgColor} ${angle}deg 360deg)`;
    return result;
  }

  const bgColor = colors.blueAccent[200];

  const innerCircleSize = size - borderWidth * 2;

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