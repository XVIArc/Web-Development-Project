import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { useToast } from "../../context/useToast";
import PageLoader from "../../components/PageLoader";
import AdminQuestionsTable from "../../components/admin/AdminQuestionsTable";
import DeleteQuestionDialog from "../../components/admin/DeleteQuestionDialog";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    adminApi
      .getQuestions()
      .then(setQuestions)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    try {
      const updated = await adminApi.toggleQuestion(id);
      setQuestions((prev) => prev.map((q) => (q._id === id ? updated : q)));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (question) => {
    navigate(`/admin/questions/${question._id}`, { state: { question } });
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteQuestion(deleteId);
      setQuestions((prev) => prev.filter((q) => q._id !== deleteId));
      toast.success("Question deleted.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <Box sx={{ px: 3, py: 4, maxWidth: 1000, mx: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={1}
      >
        <Typography variant="h5" component="h1">
          Admin — Questions ({questions.length})
        </Typography>
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

      {questions.length === 0 ? (
        <Typography color="text.secondary">
          No questions yet. Add one or use Bulk Import!
        </Typography>
      ) : (
        <AdminQuestionsTable
          questions={questions}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDeleteRequest={setDeleteId}
        />
      )}

      <DeleteQuestionDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
