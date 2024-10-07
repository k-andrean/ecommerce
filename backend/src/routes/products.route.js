import express from 'express';
import { getAllProducts, getProduct, getProductByCategory, createNewProduct, updateExistingProduct, removeProduct, createNewMultiProduct, createMultiProducts, updateMultiProducts } from '../controllers/products.controller.js'

import upload from '../services/multer.js';

const productsRoutes = express.Router();


productsRoutes.get('/', getAllProducts);
productsRoutes.get('/:id', getProduct);
productsRoutes.get('/categories/:categoryId', getProductByCategory);
productsRoutes.post('/', createNewProduct);
productsRoutes.post('/many', createMultiProducts);
productsRoutes.put('/:id', upload.single('images'),updateExistingProduct);
productsRoutes.put('/many', upload.array('images', 10), updateMultiProducts);
productsRoutes.delete('/:id', removeProduct);


export default productsRoutes;