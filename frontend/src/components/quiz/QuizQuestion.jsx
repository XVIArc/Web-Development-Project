import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selected,
  onSelectOption,
  onSubmit,
  isLast,
}) {
  return (
    <>
      <Typography variant="body2" mb={1}>
        Question {questionNumber} of {totalQuestions}
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
            <Typography variant="h6" component="h2">
              {question.text}
            </Typography>
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
              onClick={() => onSelectOption(i)}
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
        onClick={onSubmit}
      >
        {isLast ? "Finish" : "Next"}
      </Button>
    </>
  );
}
