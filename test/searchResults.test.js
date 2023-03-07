const request = require("supertest");
const matchers = require("jest-extended");

const app = require("../src/app");

expect.extend(matchers);

describe("Search Results APIs", () => {
  let accessToken = "";

  beforeAll(async () => {
    const data = { username: "Thomas", password: "123123" };
    await request(app).post("/api/auth/signup").send(data);
    const response = await request(app).post("/api/auth/login").send(data);
    accessToken = response.body.accessToken;
  });

  describe("GET /api/search-results/:id", () => {
    it("should get search result information successfully", async () => {
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

      response = await request(app)
        .get(`/api/search-results/${response.body[0].id}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          keyword: expect.any(String),
          status: expect.any(String),
          totalSearchResults: expect.toBeOneOf([expect.any(String), null]),
          totalLinks: expect.toBeOneOf([expect.any(Number), null]),
          totalAdwordsAdvertisers: expect.toBeOneOf([expect.any(Number), null]),
          htmlCode: expect.toBeOneOf([expect.any(String), null]),
        })
      );
    });
  });
});
