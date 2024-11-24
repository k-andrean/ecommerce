import request from 'supertest';
import app from '../../server'; // Import your Express app
import pool from '../config/db';// Assuming you export your pool connection for testing purposes

describe('Cities API', () => {
  // Set up some data to use in tests
//   const testCityData = {
//     city_id: 101,
//     province_id: 10,
//     province: 'Test Province',
//     type: 'City',
//     city_name: 'Test City',
//     postal_code: '12345'
//   };

//   // Helper function to insert a city directly into the database for testing
//   const insertTestCity = async () => {
//     const query = `
//       INSERT INTO cities (city_id, province_id, province, type, city_name, postal_code)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       ON CONFLICT (city_id) DO NOTHING
//     `;
//     const values = [
//       testCityData.city_id,
//       testCityData.province_id,
//       testCityData.province,
//       testCityData.type,
//       testCityData.city_name,
//       testCityData.postal_code
//     ];
//     await pool.query(query, values);
//   };

//   // Clean up the test city from the database
//   const deleteTestCity = async () => {
//     await pool.query('DELETE FROM cities WHERE city_id = $1', [testCityData.city_id]);
//   };

//   // Run before each test to ensure test data exists
//   beforeEach(async () => {
//     await insertTestCity();
//   });

//   // Run after each test to clean up the test data
//   afterEach(async () => {
//     await deleteTestCity();
//   });

  describe('GET /', () => {
    it('should return all cities', async () => {
      const response = await request(app).get('/cities');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /getProvinces', () => {
    it('should return a list of distinct provinces', async () => {
      const response = await request(app).get('/cities/getProvinces');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /getCities/:provinceId', () => {
    it('should return cities for a specific province', async () => {
      const response = await request(app).get(`/cities/getCities/2`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 if no cities are found for the given province', async () => {
      const response = await request(app).get('/cities/getCities/9999'); // Non-existent province ID
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No cities found for this province ID.');
    });
  });

  describe('GET /getShipping/:cityId', () => {
    it('should return shipping cost for a valid city ID', async () => {
      const response = await request(app).get(`/cities/getShipping/1`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('rajaongkir'); // Assuming this is the correct response structure
      expect(response.body.rajaongkir).toHaveProperty('results');
    });

    it('should return 500 if shipping cost retrieval fails', async () => {
      const response = await request(app).get('/cities/getShipping/error'); // Non-existent city ID
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch shipping cost.');
    });
  });
});