import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { useQuiz } from "../context/useQuiz";
import { quizApi } from "../api/quiz";
import AnyCenteredPage from "../components/AnyCenteredPage";
import PageLoader from "../components/PageLoader";
import QuizQuestion from "../components/quiz/QuizQuestion";

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
  }, [state.status, dispatch, navigate]);

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
    <AnyCenteredPage maxWidth="sm">
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
            <QuizQuestion
              question={question}
              questionNumber={state.currentIndex + 1}
              totalQuestions={state.questions.length}
              selected={selected}
              onSelectOption={setSelected}
              onSubmit={handleAnswer}
              isLast={state.currentIndex + 1 === state.questions.length}
            />
          </Box>
        </Grid>
      </Grid>
    </AnyCenteredPage>
  );
}
