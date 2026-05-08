import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { adminApi } from "../../api/admin";

const schema = z.object({
  text: z.string().min(1, "Question text is required"),
  option0: z.string().min(1, "Option A is required"),
  option1: z.string().min(1, "Option B is required"),
  option2: z.string().min(1, "Option C is required"),
  option3: z.string().min(1, "Option D is required"),
  // Radio group value comes in as a string; we coerce on submit
  correctIndex: z.string().min(1, "Select the correct answer"),
});

function questionToFormValues(q) {
  return {
    text: q.text,
    option0: q.options[0] ?? "",
    option1: q.options[1] ?? "",
    option2: q.options[2] ?? "",
    option3: q.options[3] ?? "",
    correctIndex: String(q.correctIndex),
  };
}

export default function QuestionForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { state: navState } = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEdit && !navState?.question);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
      option0: "",
      option1: "",
      option2: "",
      option3: "",
      correctIndex: "",
    },
  });

  useEffect(() => {
    if (!isEdit) return;

    // If navigation passed the question via router state, use it directly
    if (navState?.question) {
      reset(questionToFormValues(navState.question));
      return;
    }

    // Otherwise fetch the full list and find it
    adminApi
      .getQuestions()
      .then((qs) => {
        const found = qs.find((q) => q._id === id);
        if (found) reset(questionToFormValues(found));
        else setError("Question not found.");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, navState, reset]);

  const onSubmit = async (data) => {
    setError("");
    const payload = {
      text: data.text,
      options: [data.option0, data.option1, data.option2, data.option3],
      correctIndex: Number(data.correctIndex),
    };
    try {
      if (isEdit) {
        await adminApi.updateQuestion(id, payload);
      } else {
        await adminApi.createQuestion(payload);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  };

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

  return (
    <Box sx={{ px: 3, py: 4, maxWidth: 620, mx: "auto" }}>
      <Typography variant="h5" mb={3}>
        {isEdit ? "Edit Question" : "New Question"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {/* Question text */}
          <TextField
            label="Question text"
            multiline
            minRows={2}
            {...register("text")}
            error={!!errors.text}
            helperText={errors.text?.message}
            fullWidth
          />

          {/* Four option fields */}
          {["A", "B", "C", "D"].map((letter, i) => (
            <TextField
              key={i}
              label={`Option ${letter}`}
              {...register(`option${i}`)}
              error={!!errors[`option${i}`]}
              helperText={errors[`option${i}`]?.message}
              fullWidth
            />
          ))}

          {/* Correct answer radio group */}
          <FormControl error={!!errors.correctIndex}>
            <FormLabel>Correct Answer</FormLabel>
            <Controller
              name="correctIndex"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field} row>
                  {["A", "B", "C", "D"].map((letter, i) => (
                    <FormControlLabel
                      key={i}
                      value={String(i)}
                      control={<Radio />}
                      label={`Option ${letter}`}
                    />
                  ))}
                </RadioGroup>
              )}
            />
            {errors.correctIndex && (
              <FormHelperText>{errors.correctIndex.message}</FormHelperText>
            )}
          </FormControl>

          {/* Action buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate("/admin")}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {isEdit ? "Save Changes" : "Create Question"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
