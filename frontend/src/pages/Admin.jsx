import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Button, Box, Typography, Alert, Grid, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Admin() {
    return (
        <Box
            sx={{
                minHeight: '80vh',
                display:'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Typography variant="h4">
               Hello Admin
            </Typography>
        </Box>

    );
}