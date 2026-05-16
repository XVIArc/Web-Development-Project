import {
  Box,
  Chip,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

export default function AdminQuestionsTable({
  questions,
  onToggle,
  onEdit,
  onDeleteRequest,
}) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Image</TableCell>
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

              <TableCell sx={{ width: 72 }}>
                {q.imageUrl ? (
                  <Box
                    component="img"
                    src={q.imageUrl}
                    alt=""
                    sx={{
                      width: 56,
                      height: 40,
                      objectFit: "cover",
                      borderRadius: 1,
                      display: "block",
                      bgcolor: "action.hover",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    —
                  </Typography>
                )}
              </TableCell>

              <TableCell sx={{ maxWidth: 320 }}>
                <Tooltip title={q.text} placement="top-start">
                  <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                    {q.text}
                  </Typography>
                </Tooltip>
              </TableCell>

              <TableCell sx={{ maxWidth: 220 }}>
                <Stack direction="column" spacing={0.25}>
                  {q.options.map((opt, idx) => (
                    <Typography
                      key={idx}
                      variant="caption"
                      sx={{
                        fontWeight: idx === q.correctIndex ? "bold" : "normal",
                        color:
                          idx === q.correctIndex
                            ? "success.main"
                            : "text.secondary",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </Typography>
                  ))}
                </Stack>
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
                  <IconButton size="small" onClick={() => onToggle(q._id)}>
                    {q.active ? (
                      <ToggleOnIcon color="success" />
                    ) : (
                      <ToggleOffIcon color="disabled" />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => onEdit(q)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteRequest(q._id)}
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
  );
}
