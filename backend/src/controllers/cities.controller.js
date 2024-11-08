import { getCitiesByProvinceId, getAllCities, getDistinctProvinces } from "../models/cities.js";
import axios from "axios";
// Controller to get all cities
export const getAllCitiesController = async (req, res, next) => {
  try {
    const cities = await getAllCities(); // Assuming you have a function to get all cities
    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

// Controller to get distinct provinces
export const getDistinctProvincesController = async (req, res, next) => {
  try {
    console.log('this should have run');
    const provinces = await getDistinctProvinces();
    res.status(200).json({
      success: true,
      data: provinces,
    });
  } catch (error) {
    console.log('error', error);
    next(error);
  }
};

// Controller to get cities by province ID
export const getCitiesByProvinceIdController = async (req, res, next) => {
  try {
    const { provinceId } = req.params; 
    console.log('province id received', provinceId)
    const cities = await getCitiesByProvinceId(provinceId);
    
    if (cities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cities found for this province ID.",
      });
    }

    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    next(error);
  }
};

 // Function to get shipping cost by city ID
 export const getShippingCostByCitiesIdController = async (req, res, next) => {
    const apiKey = process.env.RAJAONGKIR_API_KEY;
    const url = 'https://api.rajaongkir.com/starter/cost/';
    const { cityId } = req.params
    
    const DEFAULT_FROM_CITY_ID = 151;
    const DEFAULT_COURIER = 'jne';
    const DEFAULT_WEIGHT = 1000;

    try {
        const response = await axios.post(url, {
            origin: DEFAULT_FROM_CITY_ID,
            destination: parseInt(cityId),
            weight: DEFAULT_WEIGHT,
            courier: DEFAULT_COURIER,
        }, {
            headers: {
                key: apiKey,
            },
        });

        // Return the shipping cost response to the client
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching shipping cost:", error);
        res.status(500).json({ error: 'Failed to fetch shipping cost.' });
    }
};