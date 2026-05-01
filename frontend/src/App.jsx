import { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthProvider";
import { QuizProvider } from "./context/QuizProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Quiz from "./pages/Quiz";

function App() {
  const [mode, setMode] = useState(
    () => localStorage.getItem("themeMode") || "light",
  );

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

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
          <Navbar mode={mode} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              element={
                <QuizProvider>
                  <Outlet />
                </QuizProvider>
              }
            >
              <Route path="/quiz" element={<Quiz />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
