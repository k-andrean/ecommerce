import express from 'express';
import { getAllCollections, getCollection, createNewCollection, updateExistingCollection, removeCollection, createMultiCollection, updateMultiCollections  } from '../controllers/collections.controller.js';

import upload from '../services/multer.js';

const collectionsRoutes = express.Router();

collectionsRoutes.get('/', getAllCollections);
collectionsRoutes.get('/:id', getCollection);
collectionsRoutes.post('/',  upload.single('images'), createNewCollection);
collectionsRoutes.post('/many',  upload.array('images', 10), createMultiCollection);
collectionsRoutes.put('/:id', upload.single('images'), updateExistingCollection);
collectionsRoutes.put('/multiple/all', upload.array('images', 10), updateMultiCollections);
collectionsRoutes.delete('/:id', removeCollection);

export default collectionsRoutes;