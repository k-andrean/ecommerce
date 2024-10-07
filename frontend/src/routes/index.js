import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// layout
import LayoutPage from "components/Layout";
import HomePage from "pages/Homepage";
import CategoryPage from "pages/CategoryPage";
import ProductDetailPage from "pages/ProductDetailPage";
import CartPage from "pages/CartPage";
import CheckoutPage from "pages/CheckoutPage";
import OrderDetailPage from "pages/OrderDetailPage";
import OrderHistoryPage from "pages/OrderHistoryPage";


const AppRouter = () => {

  return (
    <Router>
      <Routes>
        <Route element={<LayoutPage />}>
          <Route path="/" element={<HomePage />}/>
          <Route path="/categories/:categoryName" element={<CategoryPage />} />
          <Route path="/products" element={<ProductDetailPage  />} />
          <Route path="/cart" element={<CartPage  />} />
          <Route path="/orders" element={<OrderDetailPage  />} />
          <Route path="/orders/history" element={<OrderHistoryPage  />} />
          <Route path="/checkout" element={<CheckoutPage  />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
