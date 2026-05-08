import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { useToast } from "../../context/useToast";

const schema = z.object({
  text: z.string().min(1, "Question text is required"),
  option0: z.string().min(1, "Option A is required"),
  option1: z.string().min(1, "Option B is required"),
  option2: z.string().min(1, "Option C is required"),
  option3: z.string().min(1, "Option D is required"),
  correctIndex: z.string().min(1, "Mark the correct answer"),
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

  const [loading, setLoading] = useState(isEdit && !navState?.question);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const correctIndex = watch("correctIndex");

  useEffect(() => {
    if (!isEdit) return;

    if (navState?.question) {
      reset(questionToFormValues(navState.question));
      return;
    }

    adminApi
      .getQuestions()
      .then((qs) => {
        const found = qs.find((q) => q._id === id);
        if (found) reset(questionToFormValues(found));
        else toast.error("Question not found.");
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, navState, reset]);

  const onSubmit = async (data) => {
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
      toast.error(err.message);
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

          {/* Option fields — checkmark button marks the correct answer */}
          {["A", "B", "C", "D"].map((letter, i) => {
            const isCorrect = correctIndex === String(i);
            return (
              <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  label={`Option ${letter}`}
                  {...register(`option${i}`)}
                  error={!!errors[`option${i}`]}
                  helperText={errors[`option${i}`]?.message}
                  fullWidth
                />
                <Tooltip title={isCorrect ? "Correct answer" : "Mark as correct"}>
                  <IconButton
                    type="button"
                    onClick={() => setValue("correctIndex", String(i), { shouldValidate: true })}
                    color={isCorrect ? "success" : "default"}
                    sx={{ mt: 1 }}
                  >
                    {isCorrect ? (
                      <CheckCircleIcon />
                    ) : (
                      <RadioButtonUncheckedIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          })}

          {/* Validation message if no correct answer selected */}
          {errors.correctIndex && (
            <FormHelperText error sx={{ mt: -1.5 }}>
              {errors.correctIndex.message}
            </FormHelperText>
          )}

          {/* Action buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate("/admin")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Create Question"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
