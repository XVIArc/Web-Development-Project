import { useEffect, useState } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { quizApi } from "../api/quiz";
import PageLoader from "../components/PageLoader";

export default function HomeLeaderboard() {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        quizApi
            .getLeaderboard()
            .then((data) => setEntries(data.slice(0, 5)))
            .catch(() => setEntries([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <PageLoader minHeight={260} />;

    const medals = ["🥇", "🥈", "🥉"];

    return (
        <Box sx={{ width: "100%", maxWidth: 420, mx: "auto", px: 2 }}>
            <Typography variant="h3" mb={2} sx={{ textAlign: "center" }}>
                Leaderboard
            </Typography>

            {entries.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography sx={{ textAlign: "center" }} color="text.secondary">
                            No scores yet.
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                entries.map((entry, i) => (
                    <Card key={entry._id || i} sx={{ mb: 2 }}>
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
                ))
            )}
        </Box>
    );
}