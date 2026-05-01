import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { quizApi } from "../api/quiz";

export default function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizApi
      .getAttempts()
      .then((data) => setAttempts(data))
      .finally(() => setLoading(false));
  }, []);

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
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} sm={10} md={7}>
        <Box sx={{ px: 2 }}>
          <Typography variant="h5" mb={3}>
            History
          </Typography>

          {attempts.length === 0 ? (
            <Typography color="text.secondary">
              No attempts yet. Go play a quiz!
            </Typography>
          ) : (
            attempts.map((attempt, i) => (
              <Card key={attempt._id} sx={{ mb: 2 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h6">
                      {attempt.score} / {attempt.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(attempt.createdAt).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    #{i + 1}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Grid>
    </Grid>
  );
}
