const request = require("supertest");
const { app } = require("../netlify/functions/api"); 

describe("/recipes endpoint", () => {
  it("should respond with JSON", async () => {
    const res = await request(app).get("/api/recipes?query=chicken");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("results");
  });
  
  it("returns 404 for invalid route", async () => {
    const res = await request(app).get("/api/invalidroute");
    expect(res.statusCode).toBe(404);
  });

  it("returns error if query missing", async () => {
    const res = await request(app).get("/api/recipes"); 
    expect(res.statusCode).toBe(200); 
    expect(res.body).toHaveProperty("results");
  });

  it("results array is empty if no matches", async () => {
    const res = await request(app).get("/api/recipes?query=asdfghjkl");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
  });
});