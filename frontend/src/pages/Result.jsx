import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/useQuiz";
import AnyCenteredPage from "../components/AnyCenteredPage";
export default function Result() {
  const { state, dispatch } = useQuiz();
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    dispatch({ type: "RESET" });
    navigate("/quiz");
  };

  if (state.score === null) {
    return null;
  }

    return (
        <AnyCenteredPage maxWidth="sm">
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "80vh" }}
    >
      <Grid item xs={12} sm={8} md={5}>
        <Box sx={{ px: 2, textAlign: "center" }}>
          <Typography variant="h3" mb={2}>
            Quiz Complete!
          </Typography>
          <Typography variant="h2" color="primary" mb={3}>
            {state.score} / {state.questions.length}
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="body1">
                You answered {state.score} question
                {state.score !== 1 ? "s" : ""} correctly.
              </Typography>
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="contained" onClick={handlePlayAgain}>
              Play Again
            </Button>
            <Button variant="outlined" onClick={() => navigate("/leaderboard")}>
              Leaderboard
            </Button>
            <Button variant="outlined" onClick={() => navigate("/history")}>
              My History
            </Button>
          </Box>
        </Box>
      </Grid>
            </Grid>
        </AnyCenteredPage>
  );
}
