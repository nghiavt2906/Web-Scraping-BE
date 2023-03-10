const request = require("supertest");

const app = require("../src/app");

describe("Report APIs", () => {
  let accessToken = "";

  beforeAll(async () => {
    const data = { username: "Peter", password: "123123" };
    await request(app).post("/api/auth/signup").send(data);
    const response = await request(app).post("/api/auth/login").send(data);
    accessToken = response.body.accessToken;
  });

  describe("POST /api/reports/upload", () => {
    it("should upload file successfully", async () => {
      const response = await request(app)
        .post("/api/reports/upload")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("file", `${__dirname}/assets/test.csv`)
        .set("Connection", "keep-alive");

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeDefined();
    });

    it("should fail if user is unauthorized", async () => {
      const response = await request(app)
        .post("/api/reports/upload")
        .attach("file", `${__dirname}/assets/test.csv`)
        .set("Connection", "keep-alive");

      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/reports/all", () => {
    it("should get all reports successfully", async () => {
      const response = await request(app)
        .get("/api/reports/all")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            searchResults: expect.any(Array),
          }),
        ])
      );
    });

    it("should fail if user is unauthorized", async () => {
      const response = await request(app).get("/api/reports/all");
      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/reports/:reportId", () => {
    it("should get report successfully", async () => {
      let response = await request(app)
        .post("/api/reports/upload")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("file", `${__dirname}/assets/test.csv`)
        .set("Connection", "keep-alive");

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeDefined();

      response = await request(app)
        .get(`/api/reports/${response.body.id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          keywords: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
              keyword: expect.any(String),
            }),
          ]),
        })
      );
    });
  });

  describe("GET /api/reports/:reportId/search-results", () => {
    it("should get search results by report successfully", async () => {
      let response = await request(app)
        .post("/api/reports/upload")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("file", `${__dirname}/assets/test.csv`)
        .set("Connection", "keep-alive");

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBeDefined();

      response = await request(app)
        .get(`/api/reports/${response.body.id}/search-results`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            keyword: expect.any(String),
            status: expect.any(String),
          }),
        ])
      );
    });
  });
});
