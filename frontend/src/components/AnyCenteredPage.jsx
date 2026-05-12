import { Box, Container } from "@mui/material";

export default function CenteredPage({ children, maxWidth = "md" }) {
    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                px: 2,
                py: { xs: 3, md: 5 },
            }}
        >
            <Container
                maxWidth={maxWidth}
                sx={{
                    width: "100%",
                }}
            >
                {children}
            </Container>
        </Box>
    );
}