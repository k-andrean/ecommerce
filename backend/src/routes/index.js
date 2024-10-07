import express from "express";
import categoriesRoutes from "./categories.route.js";
import collectionsRoutes from "./collections.route.js";
import ordersRoutes from "./orders.route.js";
import productsRoutes from "./products.route.js";
import usersRoutes from "./users.route.js";

const router = express.Router();

router.use("/categories", categoriesRoutes);
router.use("/collections", collectionsRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);
router.use("/users", usersRoutes);

export default router;

