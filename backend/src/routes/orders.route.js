import express from 'express';
import { getAllOrders, getOrder, getUserOrder, createNewOrder, updateExistingOrder, removeOrder } from '../controllers/orders.controller.js';

const ordersRoutes = express.Router();

ordersRoutes.get('/', getAllOrders);
ordersRoutes.get('/:userId/:orderId', getOrder);
ordersRoutes.get('/:userId', getUserOrder);
ordersRoutes.post('/', createNewOrder);
ordersRoutes.put('/:id', updateExistingOrder);
ordersRoutes.delete('/:id', removeOrder);

export default ordersRoutes;