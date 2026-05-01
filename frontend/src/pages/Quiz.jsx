import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useQuiz } from "../context/useQuiz";
import { quizApi } from "../api/quiz";

export default function Quiz() {
  const { state, dispatch } = useQuiz();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.status === "idle") {
      setLoading(true);
      quizApi
        .getQuestions()
        .then((q) => dispatch({ type: "START", payload: q }))
        .finally(() => setLoading(false));
    }
    if (state.status === "finished") {
      quizApi.submit({ answers: state.answers }).then((result) => {
        dispatch({ type: "SET_SCORE", payload: result.score });
        navigate("/result");
      });
    }
  }, [state.status]);

  if (loading)
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "80vh" }}
      >
        <CircularProgress />
      </Grid>
    );

  if (state.status !== "active") return null;

  const question = state.questions[state.currentIndex];

  const handleAnswer = () => {
    if (selected === null) return;
    dispatch({
      type: "ANSWER",
      payload: { questionId: question._id, selectedIndex: selected },
    });
    setSelected(null);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "80vh" }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <Box sx={{ px: 2 }}>
          <Typography variant="body2" mb={1}>
            Question {state.currentIndex + 1} of {state.questions.length}
          </Typography>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">{question.text}</Typography>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            {question.options.map((opt, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Button
                  fullWidth
                  variant={selected === i ? "contained" : "outlined"}
                  onClick={() => setSelected(i)}
                >
                  {opt}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={selected === null}
            onClick={handleAnswer}
          >
            {state.currentIndex + 1 === state.questions.length
              ? "Finish"
              : "Next"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
