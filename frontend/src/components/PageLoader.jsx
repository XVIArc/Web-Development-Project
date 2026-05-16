import { Grid, CircularProgress } from "@mui/material";

export default function PageLoader({ minHeight = "80vh" }) {
  return (
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minHeight,
      }}
    >
      <CircularProgress />
    </Grid>
  );
}
