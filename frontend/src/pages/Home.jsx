import { Grid, Typography, Button, Paper, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import HomeLeaderboard from "./HomesLeaderboard";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Grid
      container
      sx={{
        minHeight: "calc(100vh - 64px)",
        width: "100%",
      }}
    >
      <Grid
        size={{ xs: 12 }}
        sx={{
          minHeight: "calc(100vh - 64px)",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, md: 6 },
          py: 6,
          boxSizing: "border-box",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 2,
            px: { xs: 3, sm: 5 },
            py: { xs: 4, sm: 5 },
            textAlign: "center",
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h3" mb={2}>
              Quiz App
            </Typography>
            <Typography variant="body1" mb={4}>
              Can you beat everyone on the Leaderboard?
              <br />
              Take the quiz and find out!
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
          </Stack>
        </Paper>

        {user && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 640,
              mt: 4,
              mx: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <HomeLeaderboard />
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
