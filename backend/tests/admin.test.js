const request = require("supertest");
const app = require("../app");
const Question = require("../models/Question");
const { createUser, createAdmin, createQuestions } = require("./helpers");

let adminToken;
let playerToken;

beforeEach(async () => {
  const admin = await createAdmin();
  const player = await createUser();
  adminToken = admin.token;
  playerToken = player.token;
});

describe("Admin auth guards", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/admin/questions");
    expect(res.status).toBe(401);
  });

  it("rejects non-admin users", async () => {
    const res = await request(app)
      .get("/api/admin/questions")
      .set("Authorization", `Bearer ${playerToken}`);
    expect(res.status).toBe(403);
  });

  it("blocks unauthenticated POST", async () => {
    const res = await request(app).post("/api/admin/questions").send({});
    expect(res.status).toBe(401);
  });

  it("blocks non-admin DELETE", async () => {
    const res = await request(app)
      .delete("/api/admin/questions/000000000000000000000000")
      .set("Authorization", `Bearer ${playerToken}`);
    expect(res.status).toBe(403);
  });

  it("blocks non-admin PATCH toggle", async () => {
    const res = await request(app)
      .patch("/api/admin/questions/000000000000000000000000/toggle")
      .set("Authorization", `Bearer ${playerToken}`);
    expect(res.status).toBe(403);
  });
});

describe("GET /api/admin/questions", () => {
  it("returns all questions including inactive", async () => {
    await createQuestions(3);
    await Question.create({
      text: "Inactive",
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
      active: false,
    });

    const res = await request(app)
      .get("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(4);
  });

  it("includes correctIndex in the response (not stripped like the quiz endpoint)", async () => {
    await createQuestions(1);

    const res = await request(app)
      .get("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.body.data[0].correctIndex).toBeDefined();
  });

  it("returns questions sorted newest first", async () => {
    const q1 = await Question.create({ text: "First",  options: ["A","B","C","D"], correctIndex: 0 });
    const q2 = await Question.create({ text: "Second", options: ["A","B","C","D"], correctIndex: 0 });

    const res = await request(app)
      .get("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`);

    // "Second" was created later so it should come first
    expect(res.body.data[0].text).toBe("Second");
    expect(res.body.data[1].text).toBe("First");
  });
});

describe("POST /api/admin/questions", () => {
  const valid = {
    text: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
  };

  it("creates a question", async () => {
    const res = await request(app)
      .post("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(valid);

    expect(res.status).toBe(201);
    expect(res.body.data.text).toBe(valid.text);
    expect(res.body.data.active).toBe(true);
  });

  it("rejects missing text", async () => {
    const res = await request(app)
      .post("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...valid, text: undefined });

    expect(res.status).toBe(400);
  });

  it("rejects fewer than 4 options", async () => {
    const res = await request(app)
      .post("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...valid, options: ["A", "B"] });

    expect(res.status).toBe(400);
  });

  it("rejects missing correctIndex", async () => {
    const res = await request(app)
      .post("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ text: "Q", options: ["A", "B", "C", "D"] });

    expect(res.status).toBe(400);
  });

  it("rejects more than 4 options", async () => {
    const res = await request(app)
      .post("/api/admin/questions")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...valid, options: ["A", "B", "C", "D", "E"] });

    expect(res.status).toBe(400);
  });
});

describe("PUT /api/admin/questions/:id", () => {
  it("updates a question", async () => {
    const [q] = await createQuestions(1);

    const res = await request(app)
      .put(`/api/admin/questions/${q._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ text: "Updated text" });

    expect(res.status).toBe(200);
    expect(res.body.data.text).toBe("Updated text");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app)
      .put("/api/admin/questions/000000000000000000000000")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ text: "Updated" });

    expect(res.status).toBe(404);
  });

  it("rejects update with wrong option count", async () => {
    const [q] = await createQuestions(1);

    const res = await request(app)
      .put(`/api/admin/questions/${q._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ options: ["A", "B"] });

    expect(res.status).toBe(400);
  });

  it("updates correctIndex and options together", async () => {
    const [q] = await createQuestions(1);

    const res = await request(app)
      .put(`/api/admin/questions/${q._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ options: ["W", "X", "Y", "Z"], correctIndex: 3 });

    expect(res.status).toBe(200);
    expect(res.body.data.options).toEqual(["W", "X", "Y", "Z"]);
    expect(res.body.data.correctIndex).toBe(3);
  });
});

describe("DELETE /api/admin/questions/:id", () => {
  it("deletes a question", async () => {
    const [q] = await createQuestions(1);

    const res = await request(app)
      .delete(`/api/admin/questions/${q._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const deleted = await Question.findById(q._id);
    expect(deleted).toBeNull();
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app)
      .delete("/api/admin/questions/000000000000000000000000")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it("returns data: null on successful delete", async () => {
    const [q] = await createQuestions(1);

    const res = await request(app)
      .delete(`/api/admin/questions/${q._id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
  });
});

describe("PATCH /api/admin/questions/:id/toggle", () => {
  it("toggles active to false", async () => {
    const [q] = await createQuestions(1); // starts active: true

    const res = await request(app)
      .patch(`/api/admin/questions/${q._id}/toggle`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.active).toBe(false);
  });

  it("toggles back to true", async () => {
    const q = await Question.create({
      text: "Q",
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
      active: false,
    });

    const res = await request(app)
      .patch(`/api/admin/questions/${q._id}/toggle`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.body.data.active).toBe(true);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app)
      .patch("/api/admin/questions/000000000000000000000000/toggle")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});

describe("POST /api/admin/questions/bulk", () => {
  const validBatch = [
    { text: "Q1", options: ["A", "B", "C", "D"], correctIndex: 0 },
    { text: "Q2", options: ["W", "X", "Y", "Z"], correctIndex: 3 },
  ];

  it("imports a valid batch", async () => {
    const res = await request(app)
      .post("/api/admin/questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ questions: validBatch });

    expect(res.status).toBe(201);
    expect(res.body.data.length).toBe(2);

    const count = await Question.countDocuments();
    expect(count).toBe(2);
  });

  it("rejects empty array", async () => {
    const res = await request(app)
      .post("/api/admin/questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ questions: [] });

    expect(res.status).toBe(400);
  });

  it("rejects a non-array questions value", async () => {
    const res = await request(app)
      .post("/api/admin/questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ questions: "not an array" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects batch with invalid entries and returns bad indices", async () => {
    const res = await request(app)
      .post("/api/admin/questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        questions: [
          { text: "Good", options: ["A", "B", "C", "D"], correctIndex: 0 },
          { text: "Bad", options: ["A", "B"] }, // missing correctIndex, wrong options
        ],
      });

    expect(res.status).toBe(400);
    expect(res.body.data).toContain(1); // index of the bad entry
  });

  it("does not write anything if batch has invalid entries", async () => {
    await request(app)
      .post("/api/admin/questions/bulk")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        questions: [
          { text: "Good", options: ["A", "B", "C", "D"], correctIndex: 0 },
          { text: "Bad" },
        ],
      });

    const count = await Question.countDocuments();
    expect(count).toBe(0);
  });
});
