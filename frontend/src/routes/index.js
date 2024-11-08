import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Toast alert element
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// layout
import LayoutPage from "components/Layout";
import LoginPage from "pages/LoginPage";
import RegistrationPage from "pages/RegistrationPage";
import HomePage from "pages/Homepage";
import CategoryPage from "pages/CategoryPage";
import CollectionPage from "pages/CollectionPage";
import AllProductsPage from "pages/AllProductsPage";
import ProductDetailPage from "pages/ProductDetailPage";
import CartPage from "pages/CartPage";
import CheckoutPage from "pages/CheckoutPage";
import OrderDetailPage from "pages/OrderDetailPage";
import OrderHistoryPage from "pages/OrderHistoryPage";


const AppRouter = () => {

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route element={<LayoutPage />}>
          <Route path="/" element={<HomePage />}/>
          <Route path="/categories/:categoryName" element={<CategoryPage />} />
          <Route path="/collections/:collectionName" element={<CollectionPage />} />
          <Route path="/products/detail/:productId" element={<ProductDetailPage  />} />
          <Route path="/products/all" element={<AllProductsPage  />} />
          <Route path="/cart" element={<CartPage  />} />
          <Route path="/orders/detail/:orderId" element={<OrderDetailPage  />} />
          <Route path="/orders/history/:userId" element={<OrderHistoryPage  />} />
          <Route path="/checkout" element={<CheckoutPage  />} />
        </Route>
      </Routes>

      <ToastContainer/>
    </Router>
  );
}

export default AppRouter;
