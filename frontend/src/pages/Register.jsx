import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    TextField,
    Button,
    Box,
    Typography,
    Alert,
    Grid,
    Paper,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { authApi } from "../api/auth";

const schema = z
    .object({
        username: z.string().min(3, "At least 3 characters"),
        password: z.string().min(6, "At least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function Register() {
    const theme = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setError("");
        try {
            const result = await authApi.register(data);
            login(result.token, result.role);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Grid
            container
            sx={{
                minHeight: "calc(100vh - 64px)",
            }}
        >
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    width: "50%",
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: { xs: 3, md: 6 },
                    py: 6,
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? "rgba(15, 23, 42, 0.6)"
                            : "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(12px)",
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "12px 0 40px rgba(0, 0, 0, 0.35)"
                            : "12px 0 40px rgba(0, 0, 0, 0.12)",
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        width: "100%",
                        maxWidth: 380,
                        borderRadius: 4,
                        px: { xs: 3, sm: 5 },
                        py: { xs: 4, sm: 5 },
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h5" mb={3}>
                        Register
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
                            {error}
                        </Alert>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Username"
                            {...register("username")}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                            fullWidth
                        />

                        <TextField
                            label="Password"
                            type="password"
                            {...register("password")}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            fullWidth
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            {...register("confirmPassword")}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            fullWidth
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                borderRadius: 999,
                                py: 1.1,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </Button>

                        <Typography variant="body2">
                            Already have an account? <Link to="/login">Login</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            <Grid item xs={false} md={6} />
        </Grid>
    );
}