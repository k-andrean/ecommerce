import express from 'express';
import { getAllProducts, getProduct, getProductByCategory, createNewProduct, updateExistingProduct, removeProduct, removeAllProducts, createNewMultiProduct, createMultiProducts, updateMultiProducts, getProductByCollection, searchProductByNameController } from '../controllers/products.controller.js'

import upload from '../services/multer.js';


const productsRoutes = express.Router();


productsRoutes.get('/all', getAllProducts);
productsRoutes.get('/:id', getProduct);
productsRoutes.get('/categories/:categoryId', getProductByCategory);
productsRoutes.get('/collections/:collectionId', getProductByCollection);
productsRoutes.post('/', createNewProduct);
productsRoutes.post('/many', createMultiProducts);
productsRoutes.put('/:id', upload.single('images'),updateExistingProduct);
productsRoutes.put('/many', upload.array('images', 10), updateMultiProducts);
productsRoutes.delete('/:id', removeProduct);
productsRoutes.delete('/multiple/many', removeAllProducts);
productsRoutes.get('/name/search', searchProductByNameController);


export default productsRoutes;