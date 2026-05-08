import { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";
import { ToastContext } from "./ToastContext";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const show = useCallback((message, severity = "error") => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const value = {
    show,
    error:   (msg) => show(msg, "error"),
    success: (msg) => show(msg, "success"),
    info:    (msg) => show(msg, "info"),
    warning: (msg) => show(msg, "warning"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
