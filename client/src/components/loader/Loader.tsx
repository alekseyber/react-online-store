// import { FC } from "react";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

const CssRoot = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
  "& > div": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "rgba(0, 0, 0, .05)",
  },
});

function Loader() {
  return (
    <CssRoot>
      <div>
        <CircularProgress disableShrink />
      </div>
    </CssRoot>
  );
}

export default Loader;
