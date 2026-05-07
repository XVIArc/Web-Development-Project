import { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthProvider";
import { QuizProvider } from "./context/QuizProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from './pages/Admin';
import AdminLogin from "./pages/AdminLogin";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard.jsx";
import { Box } from '@mui/material';
import bgImage from "./assets/bg.jpg";

function App() {
  const [mode, setMode] = useState(
    () => localStorage.getItem("themeMode") || "light",
  );

    const theme = useMemo(() => createTheme({
        palette: { mode },
        typography: {
            fontFamily: [
                'Nunito'
            ].join(","),
            h3: {
                fontWeight: 800,
                letterSpacing: "-0.03em",
            },
            body1: {
                fontWeight: 450,
            },
            button: {
                fontWeight: 750,
                textTransform: "none",
                letterSpacing: "0.02em",
            }
        },
        
    }), [mode]);

  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("themeMode", next); 
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundImage:
                    mode === 'dark'
                        ? `linear-gradient(
                            rgba(0, 0, 0, 0.62),
                            rgba(0, 0, 0, 0.62)
                            ),
                        url(${bgImage})`
                        : `linear-gradient(
                            rgba(255, 255, 255, 0.76),
                            rgba(255, 255, 255, 0.76)
                            ),
                            url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                }}
                >
          <Navbar mode={mode} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/history" element={<History />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route
              element={
                <QuizProvider>
                  <Outlet />
                </QuizProvider>
              }
            >
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/result" element={<Result />} />
            </Route>
                  </Routes>
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
