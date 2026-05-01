import { Grid, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "80vh" }}
    >
      <Grid item xs={12} sm={8} md={6} sx={{ textAlign: "center" }}>
        <Typography variant="h3" mb={2}>
          Quiz App
        </Typography>
        <Typography variant="body1" mb={4}>
          Test your knowledge. Climb the leaderboard.
        </Typography>
        {user ? (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/quiz")}
          >
            Start Quiz
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/login")}
          >
            Login to Play
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
