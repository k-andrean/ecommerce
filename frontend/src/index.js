import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import queryConfig from 'configures/queryConfig';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import AppRouter from 'routes';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient(queryConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
</QueryClientProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
