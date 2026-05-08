import { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider } from "./context/AuthProvider";
import { ToastProvider } from "./context/ToastProvider";
import { QuizProvider } from "./context/QuizProvider";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from './pages/Admin';
import QuestionForm from './pages/admin/QuestionForm';
import BulkImport from './pages/admin/BulkImport';
import ProtectedRoute from './components/ProtectedRoute';
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard.jsx";

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
      <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar mode={mode} toggleTheme={toggleTheme} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
            <Route path="/admin/questions/new" element={<ProtectedRoute adminOnly><QuestionForm /></ProtectedRoute>} />
            <Route path="/admin/questions/:id" element={<ProtectedRoute adminOnly><QuestionForm /></ProtectedRoute>} />
            <Route path="/admin/import" element={<ProtectedRoute adminOnly><BulkImport /></ProtectedRoute>} />

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
        </BrowserRouter>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
