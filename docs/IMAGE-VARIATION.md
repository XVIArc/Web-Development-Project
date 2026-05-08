# Image-Based Questions — Implementation Guide

Adds an optional `imageUrl` field to questions so that ≥ 50 % of questions
can include an image displayed alongside the question text.
This satisfies the **Image-based questions** variation from the rubric.

---

## Overview of changes

| Layer | File | What changes |
|---|---|---|
| Model | `backend/models/Question.js` | Add optional `imageUrl` field |
| Quiz API | `backend/controllers/quiz.controller.js` | Include `imageUrl` in sanitised response |
| Admin form | `frontend/src/pages/admin/QuestionForm.jsx` | Add image URL input + live preview |
| Admin dashboard | `frontend/src/pages/admin/AdminDashboard.jsx` | Show thumbnail in table |
| Bulk import | `frontend/src/pages/admin/BulkImport.jsx` | Update example JSON |
| Quiz page | `frontend/src/pages/Quiz.jsx` | Render image above question |
| Seed | `backend/scripts/seed.js` | Add image URLs to sample questions |

---

## Step 1 — Model

**`backend/models/Question.js`** — add one optional field:

```js
const questionSchema = new mongoose.Schema(
  {
    text:         { type: String, required: true },
    options:      { type: [String], validate: (v) => v.length === 4, required: true },
    correctIndex: { type: Number, required: true, min: 0, max: 3 },
    active:       { type: Boolean, default: true },
    imageUrl:     { type: String, default: null },   // ← ADD THIS
  },
  { timestamps: true },
);
```

No migration needed — existing documents just get `imageUrl: null` implicitly.

---

## Step 2 — Quiz controller

**`backend/controllers/quiz.controller.js`** — include `imageUrl` in the
sanitised question sent to the player (it is not sensitive like `correctIndex`):

```js
const sanitized = questions.map((q) => ({
  _id:      q._id,
  text:     q.text,
  options:  q.options,
  imageUrl: q.imageUrl ?? null,   // ← ADD THIS LINE
}));
```

---

## Step 3 — Admin question form

**`frontend/src/pages/admin/QuestionForm.jsx`**

### 3a. Extend the Zod schema

```js
const schema = z.object({
  text:         z.string().min(1, "Question text is required"),
  option0:      z.string().min(1, "Option A is required"),
  option1:      z.string().min(1, "Option B is required"),
  option2:      z.string().min(1, "Option C is required"),
  option3:      z.string().min(1, "Option D is required"),
  correctIndex: z.string().min(1, "Mark the correct answer"),
  imageUrl:     z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});
```

### 3b. Extend `questionToFormValues`

```js
function questionToFormValues(q) {
  return {
    text:         q.text,
    option0:      q.options[0] ?? "",
    option1:      q.options[1] ?? "",
    option2:      q.options[2] ?? "",
    option3:      q.options[3] ?? "",
    correctIndex: String(q.correctIndex),
    imageUrl:     q.imageUrl ?? "",      // ← ADD
  };
}
```

### 3c. Add `imageUrl` to defaultValues

```js
defaultValues: {
  text: "", option0: "", option1: "", option2: "", option3: "",
  correctIndex: "",
  imageUrl: "",   // ← ADD
},
```

### 3d. Include in the submit payload

```js
const payload = {
  text:         data.text,
  options:      [data.option0, data.option1, data.option2, data.option3],
  correctIndex: Number(data.correctIndex),
  imageUrl:     data.imageUrl || null,   // ← ADD (null clears it)
};
```

### 3e. Add the field + live preview to the form JSX

Place this block **above** the option fields (after the question text field):

```jsx
{/* Image URL + live preview */}
<TextField
  label="Image URL (optional)"
  placeholder="https://example.com/image.jpg"
  {...register("imageUrl")}
  error={!!errors.imageUrl}
  helperText={errors.imageUrl?.message}
  fullWidth
/>

{/* Live preview — only shows when a value is typed */}
{watch("imageUrl") && (
  <Box
    component="img"
    src={watch("imageUrl")}
    alt="preview"
    onError={(e) => { e.currentTarget.style.display = "none"; }}
    sx={{
      width: "100%",
      maxHeight: 240,
      objectFit: "cover",
      borderRadius: 2,
      border: "1px solid",
      borderColor: "divider",
    }}
  />
)}
```

You already have `watch` wired up from the correct-answer checkmark feature —
no extra hook changes needed.

---

## Step 4 — Admin dashboard thumbnail

**`frontend/src/pages/admin/AdminDashboard.jsx`**

Add a narrow `Image` column between `#` and `Question`:

```jsx
// In <TableHead>
<TableCell>Image</TableCell>

// In <TableBody> row, matching position
<TableCell sx={{ width: 72 }}>
  {q.imageUrl ? (
    <Box
      component="img"
      src={q.imageUrl}
      alt=""
      sx={{ width: 56, height: 40, objectFit: "cover", borderRadius: 1 }}
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  ) : (
    <Typography variant="caption" color="text.disabled">—</Typography>
  )}
</TableCell>
```

---

## Step 5 — Quiz page

**`frontend/src/pages/Quiz.jsx`** — render the image above the question text
when present. Replace the `<Card>` that shows the question with:

```jsx
<Card sx={{ mb: 3 }}>
  {question.imageUrl && (
    <Box
      component="img"
      src={question.imageUrl}
      alt="Question image"
      sx={{ width: "100%", maxHeight: 280, objectFit: "cover" }}
      onError={(e) => { e.currentTarget.style.display = "none"; }}
    />
  )}
  <CardContent>
    <Typography variant="h6">{question.text}</Typography>
  </CardContent>
</Card>
```

---

## Step 6 — Bulk import example

**`frontend/src/pages/admin/BulkImport.jsx`** — update the placeholder JSON
so users know `imageUrl` is supported:

```js
const PLACEHOLDER = JSON.stringify(
  [
    {
      text: "What animal is shown?",
      options: ["Cat", "Dog", "Fox", "Wolf"],
      correctIndex: 2,
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Vulpes_vulpes_laying.jpg/320px-Vulpes_vulpes_laying.jpg",
    },
    {
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctIndex: 1,
      // imageUrl is optional — omit it or pass null
    },
  ],
  null,
  2
);
```

---

## Step 7 — Seed questions with images

**`backend/scripts/seed.js`** — add `imageUrl` to a few of the sample
questions so the quiz looks good immediately after seeding. Good free sources:
- **Wikimedia Commons** — always safe, public domain
- **Unsplash Source** — `https://source.unsplash.com/800x400/?keyword`
- **Picsum** — `https://picsum.photos/seed/<slug>/800/400`

Example additions to the `QUESTIONS` array:

```js
{
  text: "Which planet is known as the Red Planet?",
  options: ["Venus", "Mars", "Jupiter", "Saturn"],
  correctIndex: 1,
  imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/320px-OSIRIS_Mars_true_color.jpg",
},
{
  text: "What is the largest ocean on Earth?",
  options: ["Atlantic", "Indian", "Arctic", "Pacific"],
  correctIndex: 3,
  imageUrl: "https://picsum.photos/seed/ocean/800/400",
},
```

---

## Step 8 — Tests (optional but recommended)

Add one test to `backend/tests/admin.test.js` to verify `imageUrl` is saved:

```js
it("saves imageUrl when provided", async () => {
  const res = await request(app)
    .post("/api/admin/questions")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      text: "What is shown?",
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
      imageUrl: "https://example.com/img.jpg",
    });

  expect(res.status).toBe(201);
  expect(res.body.data.imageUrl).toBe("https://example.com/img.jpg");
});
```

Add one test to `backend/tests/quiz.test.js` to verify `imageUrl` is
included in the player-facing response:

```js
it("includes imageUrl in question response", async () => {
  const { token } = await createUser();
  await Question.insertMany(
    Array.from({ length: 6 }, (_, i) => ({
      text:         `Q${i}`,
      options:      ["A", "B", "C", "D"],
      correctIndex: 0,
      active:       true,
      imageUrl:     i === 0 ? "https://example.com/img.jpg" : null,
    }))
  );

  const res = await request(app)
    .get("/api/quiz/questions")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  // imageUrl key must be present (null is fine, just not undefined)
  res.body.data.forEach((q) => {
    expect("imageUrl" in q).toBe(true);
  });
});
```

---

## Rubric note

The requirement is that **≥ 50 % of questions include an image URL**.
With 10 seeded questions, at least 5 must have a non-null `imageUrl`.
The admin dashboard makes it easy to check — the thumbnail column is blank
for questions without images.
