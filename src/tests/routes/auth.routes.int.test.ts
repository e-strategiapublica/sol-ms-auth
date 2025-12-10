import request from "supertest";

let app: any;
let originalSetInterval: any;

beforeAll(async () => {
  // Avoid open timers from rate limiter during tests
  originalSetInterval = (global as any).setInterval;
  (global as any).setInterval = ((fn: (...args: any[]) => void, _ms?: number) => 0 as unknown as NodeJS.Timer) as any;

  // Force development path to use manual validation (no Typia transformer in tests)
  process.env.NODE_ENV = "development";

  const mod = await import("../../app");
  app = mod.default;
});

afterAll(() => {
  // Restore original setInterval
  (global as any).setInterval = originalSetInterval as any;
});

describe("Integration - Health endpoint", () => {
  it("GET /health should return 200 with status OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
  });
});

describe("Integration - Auth validation (middleware)", () => {
  it("POST /method/email/send without body should return 400", async () => {
    const res = await request(app)
      .post("/method/email/send")
      .send({});
    expect(res.status).toBe(400);
  });

  it("POST /method/email without body should return 400", async () => {
    const res = await request(app)
      .post("/method/email")
      .send({});
    expect(res.status).toBe(400);
  });

  it("POST /method/pass without body should return 400", async () => {
    const res = await request(app)
      .post("/method/pass")
      .send({});
    expect(res.status).toBe(400);
  });
});
