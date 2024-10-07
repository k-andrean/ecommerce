import { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../models/orders.js';

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await getOrderById(parseInt(req.params.id));
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createNewOrder = async (req, res, next) => {
  try {
    // Pass the entire req.body object to createOrder
    const newOrder = await createOrder(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

export const updateExistingOrder = async (req, res, next) => {
  try {
    const updatedOrder = await updateOrder(parseInt(req.params.id), req.body);
    
    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const removeOrder = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const deletedOrder = await deleteOrder(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).end(); // No content for successful deletion
  } catch (error) {
    next(error);
  }
};