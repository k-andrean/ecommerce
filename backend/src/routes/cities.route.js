import express from 'express';
import { getAllCitiesController, getCitiesByProvinceIdController, getDistinctProvincesController, getShippingCostByCitiesIdController } from '../controllers/cities.controller.js';

const citiesRoutes = express.Router();

citiesRoutes.get('/', getAllCitiesController);
citiesRoutes.get('/getCities/:provinceId', getCitiesByProvinceIdController);
citiesRoutes.get('/getProvinces', getDistinctProvincesController);
citiesRoutes.get('/getShipping/:cityId', getShippingCostByCitiesIdController);

export default citiesRoutes;