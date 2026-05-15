import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
} from "@mui/material";
import { authApi } from "../api/auth";

const schema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (values) => {
        setError("");

        try {

            const payload = await authApi.login(values);
            const token = payload?.token;
            const role = payload?.role;

            if (!token) {
                setError("Login succeeded but no token was returned.");
                return;
            }

            if (role !== "admin") {
                setError("This account does not have admin access.");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            navigate("/admin");
        } catch (err) {
            console.log("Admin login error:", err);


            setError(
                err.message||"Admin login failed"
            );
        }
    };

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 2,
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 360,
                    p: 4,
                    borderRadius: 4,
                }}
            >
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ textAlign: "center" }}>
                            Admin Login
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1, textAlign: "center" }}
                        >
                            Sign in with an administrator account.
                        </Typography>
                    </Box>

                    {error && <Alert severity="error">{error}</Alert>}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <TextField
                                label="Username"
                                fullWidth
                                {...register("username")}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />

                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                {...register("password")}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Login as Admin"}
                            </Button>

                            <Button component={Link} to="/" variant="text">
                                Back to Home
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}