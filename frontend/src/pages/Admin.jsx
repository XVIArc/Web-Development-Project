import { Navigate } from "react-router-dom";
import { Grid, Typography, Button, Paper, Stack,Box } from "@mui/material";
export default function Admin() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <Box
            sx={{
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Typography variant="h4">
                Hello Admin
            </Typography>
        </Box>
    );
}
