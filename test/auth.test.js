const request = require("supertest");
const cookie = require("cookie");

const app = require("../src/app");

describe("Authentication APIs", () => {
  describe("POST /api/auth/signup", () => {
    const newUser = { username: `john${Date.now()}`, password: "123123" };

    it("should signup successfully", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send(newUser);
      expect(response.statusCode).toBe(200);
    });

    it("should fail if user already exists", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send(newUser);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      const data = { username: "john", password: "123123" };

      const response = await request(app).post("/api/auth/login").send(data);

      const setCookies = response.headers["set-cookie"];
      const tokenCookie =
        setCookies && setCookies.length > 0 ? cookie.parse(setCookies[0]) : {};

      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe(data.username);
      expect(response.body.accessToken).toBeDefined();
      expect(tokenCookie.token).toBeDefined();
    });

    it("should fail if username is invalid", async () => {
      const data = { username: "test", password: "123456" };
      const response = await request(app).post("/api/auth/login").send(data);

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe("Username or password is invalid!");
    });

    it("should fail if password is invalid", async () => {
      const data = { username: "john", password: "abcdef" };
      const response = await request(app).post("/api/auth/login").send(data);

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe("Username or password is invalid!");
    });
  });

  describe("GET /api/auth/refresh", () => {
    it("should get new access token successfully", async () => {
      const data = { username: "john", password: "123123" };

      let response = await request(app).post("/api/auth/login").send(data);

      const setCookies = response.headers["set-cookie"];
      const tokenCookie =
        setCookies && setCookies.length > 0 ? cookie.parse(setCookies[0]) : {};

      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe(data.username);
      expect(response.body.accessToken).toBeDefined();
      expect(tokenCookie.token).toBeDefined();

      response = await request(app)
        .get("/api/auth/refresh")
        .set("Cookie", [`token=${tokenCookie.token}`])
        .send();

      expect(response.statusCode).toBe(200);
      expect(response.body.username).toBe(data.username);
      expect(response.body.accessToken).toBeDefined();
    });

    it("should fail if invalid refresh token", async () => {
      const response = await request(app)
        .get("/api/auth/refresh")
        .set("Cookie", ["token=test"])
        .send();

      expect(response.statusCode).toBe(403);
    });

    it("should fail if user is unauthorized", async () => {
      const response = await request(app).get("/api/auth/refresh").send();
      expect(response.statusCode).toBe(401);
    });
  });

  describe("GET /api/auth/logout", () => {
    it("should logout successfully", async () => {
      const response = await request(app).get("/api/auth/logout").send();

      const setCookies = response.headers["set-cookie"];
      const tokenCookie =
        setCookies.length > 0 ? cookie.parse(setCookies[0]) : {};

      expect(response.statusCode).toBe(204);
      expect(tokenCookie.token).toBe("");
    });
  });
});
