import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import queryConfig from "configures/queryConfig";

import { HelmetProvider } from "react-helmet-async";
import "./index.css";

import AppRouter from "routes";
import reportWebVitals from "./reportWebVitals";

const queryClient = new QueryClient(queryConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AppRouter />
        </HelmetProvider>
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

reportWebVitals();
