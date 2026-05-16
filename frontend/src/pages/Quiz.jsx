import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { useQuiz } from "../context/useQuiz";
import { quizApi } from "../api/quiz";
import AnyCenteredPage from "../components/AnyCenteredPage";
import PageLoader from "../components/PageLoader";
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

  if (loading) return <PageLoader />;

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
        <AnyCenteredPage maxWidth='sm'> 
    <Grid
      container
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Grid size={{ xs: 12, sm: 8, md: 6 }}>
        <Box sx={{ px: 2 }}>
          <Typography variant="body2" mb={1}>
            Question {state.currentIndex + 1} of {state.questions.length}
          </Typography>

            <Card
                sx={{
                    mb: 3,
                    overflow: "hidden",
                    borderRadius: 3,
                }}
            >
                {question.imageUrl && (
                    <Box
                        component="img"
                        src={question.imageUrl}
                        alt="Question image"
                        sx={{
                            width: "100%",
                            maxHeight: 280,
                            objectFit: "cover",
                            display: "block",
                        }}
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                )}

                <CardContent>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            background: (t) =>
                                t.palette.mode === "dark" ? "#1e2130" : "#f0eeff",
                            border: "1px solid",
                            borderColor: "primary.light",
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6">{question.text}</Typography>
                    </Paper>
                </CardContent>
            </Card>

          <Grid container spacing={2}>
            {question.options.map((opt, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Button
                        fullWidth
                        variant={selected === i ? "contained" : "outlined"}
                        color={selected === i ? "primary" : "inherit"}
                        onClick={() => setSelected(i)}
                        sx={{
                            py: 1.5,
                            justifyContent: "flex-start",
                            pl: 2,
                            transition: "all 0.15s ease",
                            borderWidth: 2,
                            textAlign: "left",
                        }}
                    >
                        <Typography
                            component="span"
                            variant="body2"
                            fontWeight={700}
                            mr={1.5}
                            color={selected === i ? "inherit" : "text.secondary"}
                        >
                            {String.fromCharCode(65 + i)}.
                        </Typography>
                        <Box component="span">{opt}</Box>
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
        </AnyCenteredPage>
  );
}
