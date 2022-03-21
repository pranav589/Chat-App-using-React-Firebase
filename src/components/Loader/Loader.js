import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader({ style, text }) {
  return (
    <Box sx={{ display: "flex" }} style={style}>
      <CircularProgress color="success" />
      {text && <p>{text}</p>}
    </Box>
  );
}
