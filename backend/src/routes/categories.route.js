import express from 'express';
import { getAllCategories, getCategory, createNewCategory, updateExistingCategory, removeCategory, createMultiCategories, updateMultiCategories } from '../controllers/categories.controller.js';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/', getAllCategories);
categoriesRoutes.get('/:id', getCategory);
categoriesRoutes.post('/', createNewCategory);
categoriesRoutes.post('/many', createMultiCategories);
categoriesRoutes.put('/:id', updateExistingCategory);
categoriesRoutes.put('/many', updateMultiCategories);
categoriesRoutes.delete('/:id', removeCategory);

export default categoriesRoutes;