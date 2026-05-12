import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { useToast } from "../../context/useToast";

const PLACEHOLDER = JSON.stringify(
  [
    {
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctIndex: 1,
    },
    {
      text: "Which planet is closest to the Sun?",
      options: ["Venus", "Earth", "Mercury", "Mars"],
      correctIndex: 2,
    },
  ],
  null,
  2
);

export default function BulkImport() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const handleImport = async () => {
    // Client-side JSON parse before hitting the API
    let questions;
    try {
      questions = JSON.parse(raw);
    } catch {
      toast.error("Invalid JSON — please fix the syntax and try again.");
      return;
    }

    if (!Array.isArray(questions)) {
      toast.error("The JSON must be an array of question objects [ … ].");
      return;
    }

    if (questions.length === 0) {
      toast.error("The array is empty — add at least one question.");
      return;
    }

    setSubmitting(true);
    try {
      const imported = await adminApi.bulkImport({ questions });
      toast.success(
        `${imported.length} question${imported.length === 1 ? "" : "s"} imported successfully!`
      );
      setRaw("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ px: 3, py: 4, maxWidth: 720, mx: "auto" }}>
      <Typography variant="h5" mb={1}>
        Bulk Import Questions
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Paste a JSON array of question objects. Each object must have:
        <br />
        &nbsp;&nbsp;• <strong>text</strong> — the question string
        <br />
        &nbsp;&nbsp;• <strong>options</strong> — array of exactly 4 strings
        <br />
        &nbsp;&nbsp;• <strong>correctIndex</strong> — integer 0–3 pointing to
        the correct option
      </Typography>

      <TextField
        label="JSON array"
        multiline
        minRows={14}
        fullWidth
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={PLACEHOLDER}
        inputProps={{ style: { fontFamily: "monospace", fontSize: 13 } }}
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={submitting || !raw.trim()}
        >
          {submitting ? "Importing…" : "Import"}
        </Button>
      </Stack>
    </Box>
  );
}
