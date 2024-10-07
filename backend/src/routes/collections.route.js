import express from 'express';
import { getAllCollections, getCollection, createNewCollection, updateExistingCollection, removeCollection, createMultiCollection, updateMultiCollections  } from '../controllers/collections.controller.js';

const collectionsRoutes = express.Router();

collectionsRoutes.get('/', getAllCollections);
collectionsRoutes.get('/:id', getCollection);
collectionsRoutes.post('/', createNewCollection);
collectionsRoutes.post('/many', createMultiCollection);
// collectionsRoutes.put('/:id', updateExistingCollection);
collectionsRoutes.put('/many', updateMultiCollections);
collectionsRoutes.delete('/:id', removeCollection);

export default collectionsRoutes;