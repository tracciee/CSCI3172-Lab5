const request = require("supertest");
const app = require("../frontend/api"); 

describe("/recipes endpoint", () => {
  it("should respond with JSON", async () => {
    const res = await request(app).get("/recipes?query=chicken");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("results");
  });
});