const request = require("supertest");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/message", (req, res) => {
  res.json({ message: "Backend is working!" });
});

describe("API endpoints", () => {
  test("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  test("GET /api/message returns message", async () => {
    const res = await request(app).get("/api/message");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBeDefined();
  });
});