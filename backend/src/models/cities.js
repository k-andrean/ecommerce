import pool from "../config/db.js";
import axios from "axios";

// Function to insert a city into the cities table
export const insertCity = async (cityData) => {
    const {
      city_id, // This should be an integer
      province_id, // This should be an integer
      province,
      type,
      city_name,
      postal_code
    } = cityData;
  
    const query = `
      INSERT INTO cities (city_id, province_id, province, type, city_name, postal_code)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (province_id, city_name) DO NOTHING
    `;
  
    const values = [parseInt(city_id), parseInt(province_id), province, type, city_name, postal_code]; // Make sure to parse integers
    
    try {
      await pool.query(query, values);
      console.log(`Inserted: ${city_name}`);
    } catch (error) {
      console.error(`Error inserting city ${city_name}:`, error);
    }
  };

// Function to fetch and insert all cities from the Raja Ongkir API
export const fetchCitiesFromApi = async () => {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  const url = 'https://api.rajaongkir.com/starter/city';

  try {
    const response = await axios.get(url, {
      headers: {
        key: apiKey,
      },
    });

    const cities = response.data.rajaongkir.results;
    
    for (const city of cities) {
      await insertCity(city);
    }

    console.log('All cities fetched and inserted.');
  } catch (error) {
    console.error('Error fetching cities from API:', error);
  }
};

// Function to get all cities from the cities table
export const getAllCities = async () => {
  const { rows } = await pool.query('SELECT * FROM cities');
  return rows;
};

export const getDistinctProvinces = async () => {
    console.log('distinct called')
    const query = `
      SELECT DISTINCT province_id, province 
      FROM cities 
      ORDER BY province_id;
    `;
    
    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error retrieving distinct provinces:", error);
      throw error; // Rethrow the error for handling in route
    }
  };


export const getCitiesByProvinceId = async (provinceId) => {
    const query = `
      SELECT *
      FROM cities
      WHERE province_id = $1
      ORDER BY city_name;  -- You can order by any other column if needed
    `;
  
    try {
      const { rows } = await pool.query(query, [provinceId]);
      return rows;
    } catch (error) {
      console.error("Error retrieving cities by province ID:", error);
      throw error; // Rethrow the error for handling in the route
    }
  };


