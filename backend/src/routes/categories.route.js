import express from 'express';
import { getAllCategories, getCategory, createNewCategory, updateExistingCategory, removeCategory, removeAllCategoriesController, createMultiCategories, updateMultiCategories } from '../controllers/categories.controller.js';

import upload from '../services/multer.js';

const categoriesRoutes = express.Router();

categoriesRoutes.get('/', getAllCategories);
categoriesRoutes.get('/:id', getCategory);
categoriesRoutes.post('/',  upload.single('images'), createNewCategory);
categoriesRoutes.post('/many',  upload.array('images', 10), createMultiCategories);
categoriesRoutes.put('/:id',  upload.single('images'), updateExistingCategory);
categoriesRoutes.put('/multiple/all',  upload.array('images', 10), updateMultiCategories);
categoriesRoutes.delete('/:id', removeCategory);
categoriesRoutes.delete('/multiple/all', removeAllCategoriesController);

export default categoriesRoutes;