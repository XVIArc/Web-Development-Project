import { Grid, Typography, Button,Paper,Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "@mui/material/styles";
import { quizApi } from "../api/quiz"; 
import HomeLeaderboard from "./HomesLeaderboard";

export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
      <Grid
          container
          sx={{
              minHeight: "calc(100vh - 64px)",
          }} 
      >
          <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                  width: '50%',
                  minHeight: "calc(100vh - 64px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: { xs: 3, md: 6 },
                  py: 6,
                  backgroundColor:
                      theme.palette.mode === "dark"
                          ? "rgba(15, 23, 42, 0.6)"
                          : "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                      theme.palette.mode === "dark"
                          ? "12px 0 40px rgba(0, 0, 0, 0.44)"
                          : "12px 0 40px rgba(0, 0, 0, 0.12)",
              }}
          >
        <Paper elevation={4} sx={{width:'100%',maxWidth:300, borderRadius: 2, px: { xs: 3, sm: 5 }, textAlign: 'center' }}>
            <Stack spacing={3}>
                <Typography variant="h3" mb={2}>
                  Quiz App
                </Typography>
                <Typography variant="body1" mb={4}>
                    {/*Test your knowledge. Climb the leaderboard.*/}
                          Can you beat everyone on the Leaderboard?<br/>
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
          </Grid>
          <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                  minHeight: { xs: "auto", md: "calc(100vh - 64px)" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  px: { xs: 3, md: 6 },
                  py: 6,
              }} />
          {user && <HomeLeaderboard />}
    </Grid>
  );
}
