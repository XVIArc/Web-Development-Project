const request = require("supertest");
const app = require("../app");
const Question = require("../models/Question");
const Score = require("../models/Score");
const { createUser, createQuestions } = require("./helpers");

describe("GET /api/quiz/questions", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/quiz/questions");
    expect(res.status).toBe(401);
  });

  it("returns 503 if fewer than 6 active questions exist", async () => {
    const { token } = await createUser();
    await createQuestions(3);

    const res = await request(app)
      .get("/api/quiz/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(503);
    expect(res.body.success).toBe(false);
  });

  it("returns between 6 and 10 questions", async () => {
    const { token } = await createUser();
    await createQuestions(8);

    const res = await request(app)
      .get("/api/quiz/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(6);
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });

  it("caps at 10 questions even when the pool is larger", async () => {
    const { token } = await createUser();
    await createQuestions(15);

    const res = await request(app)
      .get("/api/quiz/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(10);
  });

  it("does not include correctIndex in the response", async () => {
    const { token } = await createUser();
    await createQuestions(6);

    const res = await request(app)
      .get("/api/quiz/questions")
      .set("Authorization", `Bearer ${token}`);

    res.body.data.forEach((q) => {
      expect(q.correctIndex).toBeUndefined();
    });
  });

  it("only returns active questions", async () => {
    const { token } = await createUser();
    await createQuestions(6);
    await Question.create({
      text: "Inactive question",
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
      active: false,
    });

    const res = await request(app)
      .get("/api/quiz/questions")
      .set("Authorization", `Bearer ${token}`);

    const texts = res.body.data.map((q) => q.text);
    expect(texts).not.toContain("Inactive question");
  });
});

describe("POST /api/quiz/submit", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).post("/api/quiz/submit").send({ answers: [] });
    expect(res.status).toBe(401);
  });

  it("rejects missing answers array", async () => {
    const { token } = await createUser();
    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects an empty answers array", async () => {
    const { token } = await createUser();
    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({ answers: [] });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("treats an unknown questionId as a wrong answer, does not crash", async () => {
    const { token } = await createUser();
    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({ answers: [{ questionId: "000000000000000000000000", selectedIndex: 0 }] });

    expect(res.status).toBe(200);
    expect(res.body.data.score).toBe(0);
    expect(res.body.data.total).toBe(1);
  });

  it("scores answers correctly and saves the attempt", async () => {
    const { token, userId, username } = await createUser();
    const questions = await createQuestions(6); // all have correctIndex: 0

    const answers = questions.map((q) => ({
      questionId: q._id,
      selectedIndex: 0, // all correct
    }));

    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({ answers });

    expect(res.status).toBe(200);
    expect(res.body.data.score).toBe(6);
    expect(res.body.data.total).toBe(6);

    const saved = await Score.findOne({ userId });
    expect(saved).not.toBeNull();
    expect(saved.score).toBe(6);
    expect(saved.username).toBe(username);
  });

  it("correctly marks wrong answers", async () => {
    const { token } = await createUser();
    const questions = await createQuestions(6); // all have correctIndex: 0

    const answers = questions.map((q) => ({
      questionId: q._id,
      selectedIndex: 1, // all wrong
    }));

    const res = await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({ answers });

    expect(res.body.data.score).toBe(0);
  });

  it("saves isCorrect on each answer", async () => {
    const { token, userId } = await createUser();
    const questions = await createQuestions(6);

    const answers = questions.map((q, i) => ({
      questionId: q._id,
      selectedIndex: i === 0 ? 0 : 1, // only first is correct
    }));

    await request(app)
      .post("/api/quiz/submit")
      .set("Authorization", `Bearer ${token}`)
      .send({ answers });

    const saved = await Score.findOne({ userId });
    expect(saved.answers[0].isCorrect).toBe(true);
    expect(saved.answers[1].isCorrect).toBe(false);
  });
});

describe("GET /api/quiz/leaderboard", () => {
  it("is public, no auth needed", async () => {
    const res = await request(app).get("/api/quiz/leaderboard");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("returns at most 10 entries even with a larger pool", async () => {
    // create 12 distinct users each with one score
    for (let i = 0; i < 12; i++) {
      const { userId } = await createUser(`player${i}`, "password123");
      await Score.create({ userId, username: `player${i}`, score: i, total: 10, answers: [] });
    }

    const res = await request(app).get("/api/quiz/leaderboard");
    expect(res.body.data.length).toBeLessThanOrEqual(10);
  });

  it("returns one entry per user with their best score, sorted highest first", async () => {
    const { userId: u1 } = await createUser("alice", "password123");
    const { userId: u2 } = await createUser("bob",   "password123");

    // alice plays twice; only her best (4) should appear
    await Score.create({ userId: u1, username: "alice", score: 4, total: 6, answers: [] });
    await Score.create({ userId: u2, username: "bob",   score: 9, total: 6, answers: [] });
    await Score.create({ userId: u1, username: "alice", score: 2, total: 6, answers: [] });

    const res = await request(app).get("/api/quiz/leaderboard");
    const data = res.body.data;

    // each user appears exactly once
    const usernames = data.map((e) => e.username);
    expect(new Set(usernames).size).toBe(usernames.length);

    // bob first with 9, alice second with best-of 4
    expect(data[0].username).toBe("bob");
    expect(data[0].score).toBe(9);
    expect(data[1].username).toBe("alice");
    expect(data[1].score).toBe(4);
  });
});

describe("GET /api/quiz/attempts", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).get("/api/quiz/attempts");
    expect(res.status).toBe(401);
  });

  it("returns only the current user's attempts", async () => {
    const { token: t1, userId: u1 } = await createUser("alice", "password123");
    const { userId: u2 } = await createUser("bob", "password123");

    await Score.create({ userId: u1, username: "alice", score: 5, total: 6, answers: [] });
    await Score.create({ userId: u2, username: "bob",   score: 3, total: 6, answers: [] });

    const res = await request(app)
      .get("/api/quiz/attempts")
      .set("Authorization", `Bearer ${t1}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("returns multiple attempts for the same user, newest first", async () => {
    const { token, userId } = await createUser("alice", "password123");

    // Insert with explicit timestamps so ordering is deterministic
    const older = new Date(Date.now() - 10000);
    const newer = new Date();
    await Score.create({ userId, username: "alice", score: 3, total: 6, answers: [], createdAt: older });
    await Score.create({ userId, username: "alice", score: 6, total: 6, answers: [], createdAt: newer });

    const res = await request(app)
      .get("/api/quiz/attempts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
    // newest (score 6) should come first
    expect(new Date(res.body.data[0].createdAt).getTime())
      .toBeGreaterThan(new Date(res.body.data[1].createdAt).getTime());
  });
});
