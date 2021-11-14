//import { FC } from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

const CssRoot = styled("div")({
  flexGrow: 1,
  height: "60vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .MuiCircularProgress-root": {
    color: "#00695c",
  },
});

function LoaderPage() {
  return (
    <CssRoot>
      <CircularProgress size={30} thickness={5} disableShrink />
    </CssRoot>
  );
}

export default LoaderPage;
