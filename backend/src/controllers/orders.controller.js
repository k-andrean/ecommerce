import { getOrders, getOrderById, getOrderByUserId, createOrder, updateOrder, deleteOrder } from '../models/orders.js';

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
    const { orderId, userId } = req.params; // Correctly destructure from req.params
    const order = await getOrderById(parseInt(userId), parseInt(orderId)); // Parse both userId and orderId
    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getUserOrder = async (req, res, next) => {
  try {// Correctly destructure from req.params
    const order = await getOrderByUserId(parseInt(req.params.userId)); // Parse both userId and orderId
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
    console.log(error);
    next(error);
  }
};

export const updateExistingOrder = async (req, res, next) => {
  const orderUpdateData = typeof req.body === 'string'
  ? JSON.parse(req.body)
  : req.body;
  try {
    const updatedOrder = await updateOrder(parseInt(req.params.id), orderUpdateData);
    
    if (updatedOrder) {
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.log('order error', error)
    next(error);
  }
};

export const removeOrder = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const deletedOrderCount = await deleteOrder(orderId);

    if (deletedOrderCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(204).end(); // No content for successful deletion
  } catch (error) {
    next(error);
  }
};