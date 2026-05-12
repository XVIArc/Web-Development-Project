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
import AnyCenteredPage from "../components/AnyCenteredPage";
export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizApi
      .getLeaderboard()
      .then((data) => setEntries(data))
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

  const medals = ["🥇", "🥈", "🥉"];

    return (
      <AnyCenteredPage maxWidth="sm">
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} sm={10} md={6}>
        <Box sx={{ px: 2 }}>
           <Typography variant="h3" mb={2}>
            Leaderboard
          </Typography>

          {entries.map((entry, i) => (
            <Card key={i} sx={{ mb: 2 }}>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="h6">
                    {medals[i] ?? `#${i + 1}`}
                  </Typography>
                  <Typography variant="body1">{entry.username}</Typography>
                </Box>
                <Typography variant="h6" color="primary">
                  {entry.score}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Grid>
            </Grid>
        </AnyCenteredPage>
  );
}
