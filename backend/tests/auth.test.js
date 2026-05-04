const request = require("supertest");
const app = require("../app");

describe("POST /api/auth/register", () => {
  it("registers a new user and returns a token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "alice", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.role).toBe("player");
  });

  it("rejects missing username", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ password: "password123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects missing password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "alice" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects duplicate username", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "alice", password: "password123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "alice", password: "differentpassword" });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ username: "alice", password: "password123" });
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "alice", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.role).toBe("player");
  });

  it("rejects wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "alice", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("rejects non-existent user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nobody", password: "password123" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("rejects missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "alice" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
