import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, Grid,Paper,Stack } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/useToast";
import { authApi } from "../api/auth";

const schema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await authApi.login(data);
      login(result.token, result.role);
      navigate("/");
    } catch (err) {
      toast.error(err.message);
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
          Login
        </Typography>

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
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2">
            No account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Paper>
    </Grid>
  </Grid>
);
}
