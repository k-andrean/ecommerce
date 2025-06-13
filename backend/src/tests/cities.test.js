import request from "supertest";
import app from "../../server";

describe("Cities API", () => {
  describe("GET /", () => {
    it("should return all cities", async () => {
      const response = await request(app).get("/cities");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /getProvinces", () => {
    it("should return a list of distinct provinces", async () => {
      const response = await request(app).get("/cities/getProvinces");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("GET /getCities/:provinceId", () => {
    it("should return cities for a specific province", async () => {
      const response = await request(app).get(`/cities/getCities/2`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 404 if no cities are found for the given province", async () => {
      const response = await request(app).get("/cities/getCities/9999"); // Non-existent province ID
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "No cities found for this province ID."
      );
    });
  });

  describe("GET /getShipping/:cityId", () => {
    it("should return shipping cost for a valid city ID", async () => {
      const response = await request(app).get(`/cities/getShipping/1`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("rajaongkir"); // Assuming this is the correct response structure
      expect(response.body.rajaongkir).toHaveProperty("results");
    });

    it("should return 500 if shipping cost retrieval fails", async () => {
      const response = await request(app).get("/cities/getShipping/error"); // Non-existent city ID
      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Failed to fetch shipping cost.");
    });
  });
});
