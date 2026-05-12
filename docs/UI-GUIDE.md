# UI Prettification Guide

A concrete, step-by-step reference for upgrading the look of the app.
Every change is independent — apply any subset you like.

---

## 1. Better fonts + page title

**`frontend/index.html`** — add a Google Font link and fix the tab title:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QuizApp</title>

  <!-- Inter for body text, Poppins for headings -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700;800&display=swap"
    rel="stylesheet"
  />
</head>
```

---

## 2. Custom MUI theme

Replace the bare `createTheme({ palette: { mode } })` call in **`App.jsx`** with a
richer theme that wires up the fonts, custom colours, rounder corners, and
polished component defaults.

```jsx
const theme = useMemo(
  () =>
    createTheme({
      palette: {
        mode,
        ...(mode === "light"
          ? {
              primary:   { main: "#6C63FF" },   // indigo-violet
              secondary: { main: "#FF6584" },   // coral-pink accent
              background: { default: "#F4F6FB", paper: "#FFFFFF" },
            }
          : {
              primary:   { main: "#9D8FFF" },
              secondary: { main: "#FF8FA3" },
              background: { default: "#0F1117", paper: "#1A1D27" },
            }),
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { fontFamily: "'Poppins', sans-serif", fontWeight: 800 },
        h2: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Poppins', sans-serif", fontWeight: 700 },
        h5: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
        h6: { fontFamily: "'Poppins', sans-serif", fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 600 },
      },
      shape: { borderRadius: 12 },
      components: {
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: { borderRadius: 999, paddingLeft: 24, paddingRight: 24 },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: { borderRadius: 16 },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: { borderRadius: 16 },
          },
        },
        MuiTextField: {
          defaultProps: { size: "small" },
        },
        MuiAppBar: {
          styleOverrides: {
            root: { backdropFilter: "blur(8px)" },
          },
        },
      },
    }),
  [mode],
);
```

---

## 3. Global CSS — smooth scrolling + better focus rings

**`frontend/src/index.css`**:

```css
*, *::before, *::after { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body, #root {
  margin: 0;
  width: 100%;
  min-height: 100vh;
}

/* Nicer focus ring for keyboard nav */
:focus-visible {
  outline: 3px solid #6C63FF;
  outline-offset: 2px;
}
```

---

## 4. Navbar — glassmorphism + gradient logo text

**`frontend/src/components/Navbar.jsx`** — update the `AppBar` and logo:

```jsx
<AppBar
  position="sticky"           /* sticks to top on scroll */
  elevation={0}
  sx={{
    background: mode === "dark"
      ? "rgba(26, 29, 39, 0.85)"
      : "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid",
    borderColor: "divider",
    color: "text.primary",
  }}
>
```

Gradient logo:
```jsx
<Typography
  variant="h6"
  sx={{
    flexGrow: 1,
    cursor: "pointer",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 800,
    background: "linear-gradient(90deg, #6C63FF, #FF6584)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
  onClick={() => navigate("/")}
>
  QuizApp
</Typography>
```

---

## 5. Home page — hero section

Replace the small centered Paper with a full-width hero:

```jsx
export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (t) =>
          t.palette.mode === "dark"
            ? "radial-gradient(ellipse at 60% 40%, #2a2560 0%, #0f1117 70%)"
            : "radial-gradient(ellipse at 60% 40%, #e8e4ff 0%, #f4f6fb 70%)",
        px: 2,
        textAlign: "center",
      }}
    >
      <Stack spacing={3} alignItems="center" maxWidth={520}>
        <Typography variant="h2" sx={{ lineHeight: 1.15 }}>
          Test Your Knowledge 🧠
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: 18 }}>
          Answer 10 questions, beat your friends, top the leaderboard.
        </Typography>
        {user ? (
          <Button variant="contained" size="large" onClick={() => navigate("/quiz")}>
            Start Quiz
          </Button>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large" onClick={() => navigate("/login")}>
              Login to Play
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate("/register")}>
              Register
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
```

---

## 6. Quiz page — highlighted selected option

Add a colour change to the selected answer button so it's unmistakable:

```jsx
<Button
  fullWidth
  variant={selected === i ? "contained" : "outlined"}
  color={selected === i ? "primary" : "inherit"}
  onClick={() => setSelected(i)}
  sx={{
    py: 1.5,
    justifyContent: "flex-start",
    pl: 2,
    transition: "all 0.15s ease",
    borderWidth: 2,
  }}
>
  <Typography variant="body2" fontWeight={600} mr={1} color="text.secondary">
    {String.fromCharCode(65 + i)}.
  </Typography>
  {opt}
</Button>
```

Also replace the plain Card question text with a tinted banner:

```jsx
<Paper
  elevation={0}
  sx={{
    mb: 3,
    p: 3,
    background: (t) =>
      t.palette.mode === "dark" ? "#1e2130" : "#f0eeff",
    border: "1px solid",
    borderColor: "primary.light",
    borderRadius: 3,
  }}
>
  <Typography variant="h6">{question.text}</Typography>
</Paper>
```

---

## 7. Result page — score colour coding

Colour the score based on percentage:

```jsx
const pct = state.score / state.questions.length;
const scoreColor = pct >= 0.8 ? "success.main" : pct >= 0.5 ? "warning.main" : "error.main";

<Typography variant="h2" sx={{ color: scoreColor, fontWeight: 800 }} mb={3}>
  {state.score} / {state.questions.length}
</Typography>
```

---

## 8. Leaderboard — top-3 podium styling

Give the first three rows a distinctive look:

```jsx
const podiumSx = [
  { border: "2px solid gold",   background: "rgba(255,215,0,0.08)" },
  { border: "2px solid silver", background: "rgba(192,192,192,0.08)" },
  { border: "2px solid #cd7f32", background: "rgba(205,127,50,0.08)" },
];

<Card
  key={i}
  sx={{
    mb: 2,
    ...(podiumSx[i] ?? {}),
    transition: "transform 0.15s",
    "&:hover": { transform: "translateY(-2px)" },
  }}
>
```

---

## 9. Login / Register — subtle background

Add a soft gradient behind the form cards (same technique as the hero):

```jsx
<Grid
  container
  sx={{
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    px: 2,
    background: (t) =>
      t.palette.mode === "dark"
        ? "radial-gradient(ellipse at 50% 30%, #1e1a40 0%, #0f1117 80%)"
        : "radial-gradient(ellipse at 50% 30%, #ede9ff 0%, #f4f6fb 80%)",
  }}
>
```

---

## 10. Page transitions (optional but impactful)

Install framer-motion:
```bash
cd frontend && npm install framer-motion
```

Wrap each page's root element:
```jsx
import { motion } from "framer-motion";

const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } };

// Replace the outermost Box/Grid with:
<motion.div {...fade}>
  {/* page content */}
</motion.div>
```

---

## Quick-win priority order

| Priority | Change | Effort |
|---|---|---|
| ⭐⭐⭐ | Custom theme (colours, fonts, rounded corners) | 5 min |
| ⭐⭐⭐ | Google Fonts in index.html | 1 min |
| ⭐⭐ | Navbar glassmorphism + gradient logo | 5 min |
| ⭐⭐ | Home hero section | 10 min |
| ⭐⭐ | Score colour coding on Result | 2 min |
| ⭐⭐ | Leaderboard podium borders | 5 min |
| ⭐ | Quiz option left-align + letter prefix | 5 min |
| ⭐ | Page transitions (framer-motion) | 15 min |
