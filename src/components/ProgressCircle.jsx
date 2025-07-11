import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({
  progress = 0.75,
  size = 90,
  borderWidth = 14,
  gradientStops,
  inactiveColor
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  const innerCircleSize = size - borderWidth * 2;

  // Default gradient stops
  const defaultStops = "#0A0A3D 0deg, #1C1C6B 90deg, #2E2E9F 180deg, #5050D4 270deg, #5050D4 " + angle + "deg";
  const stops = gradientStops || defaultStops;
  const afterAngleColor = inactiveColor || colors.blueAccent[200];

  // Build background based on progress
  const background =
    progress === 0
      ? afterAngleColor // Only inactive color if progress is zero
      : `conic-gradient(${stops}, ${afterAngleColor} ${angle}deg 360deg)`;

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
        background,
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
