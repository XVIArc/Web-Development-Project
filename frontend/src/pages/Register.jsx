import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, Alert, Grid,Paper } from "@mui/material";
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
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
        }}
    >
        <Grid item xs={12} sm={8} md={4}>
            <Paper
                elevation={4}
                sx={{
                    width: "100%",
                    maxWidth: 380,
                    borderRadius: 4,
                    px: { xs: 3, sm: 5 },
                    py: { xs: 4, sm: 5 },
                    mx: "auto",
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
    </Grid>
);
}
