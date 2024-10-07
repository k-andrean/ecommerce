import express from 'express';
import { getAllOrders, getOrder, createNewOrder, updateExistingOrder, removeOrder } from '../controllers/orders.controller.js';

const ordersRoutes = express.Router();

ordersRoutes.get('/', getAllOrders);
ordersRoutes.get('/:id', getOrder);
ordersRoutes.post('/', createNewOrder);
ordersRoutes.put('/:id', updateExistingOrder);
ordersRoutes.delete('/:id', removeOrder);

export default ordersRoutes;