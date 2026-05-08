import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null); // id of question pending confirmation

  const load = () => {
    setLoading(true);
    adminApi
      .getQuestions()
      .then(setQuestions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    setError("");
    try {
      const updated = await adminApi.toggleQuestion(id);
      setQuestions((prev) => prev.map((q) => (q._id === id ? updated : q)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    setError("");
    try {
      await adminApi.deleteQuestion(deleteId);
      setQuestions((prev) => prev.filter((q) => q._id !== deleteId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteId(null);
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
    <Box sx={{ px: 3, py: 4, maxWidth: 1000, mx: "auto" }}>
      {/* Header row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={1}
      >
        <Typography variant="h5">Admin — Questions ({questions.length})</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<FileUploadIcon />}
            onClick={() => navigate("/admin/import")}
          >
            Bulk Import
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/questions/new")}
          >
            Add Question
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {questions.length === 0 ? (
        <Typography color="text.secondary">
          No questions yet. Add one or use Bulk Import!
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Options</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questions.map((q, i) => (
                <TableRow key={q._id} hover>
                  <TableCell>{i + 1}</TableCell>

                  {/* Question text — truncated */}
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Tooltip title={q.text} placement="top-start">
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: 300 }}
                      >
                        {q.text}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  {/* Show options with correct one highlighted */}
                  <TableCell sx={{ maxWidth: 200 }}>
                    {q.options.map((opt, idx) => (
                      <Typography
                        key={idx}
                        variant="caption"
                        display="block"
                        sx={{
                          fontWeight:
                            idx === q.correctIndex ? "bold" : "normal",
                          color:
                            idx === q.correctIndex
                              ? "success.main"
                              : "text.secondary",
                        }}
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                      </Typography>
                    ))}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={q.active ? "Active" : "Inactive"}
                      color={q.active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Tooltip title={q.active ? "Deactivate" : "Activate"}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggle(q._id)}
                      >
                        {q.active ? (
                          <ToggleOnIcon color="success" />
                        ) : (
                          <ToggleOffIcon color="disabled" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/admin/questions/${q._id}`, {
                            state: { question: q },
                          })
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(q._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Question?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This cannot be undone. The question will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
