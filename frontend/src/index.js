import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import queryConfig from 'configures/queryConfig';

import { HelmetProvider } from 'react-helmet-async';
import './index.css';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import AppRouter from 'routes';
import reportWebVitals from './reportWebVitals';
import useGetPaypalClientIdQuery from 'services/ordersAPI';

const queryClient = new QueryClient(queryConfig);

// const PayPalWrapper = ({ children }) => {
//   const { data, isLoading, error } = useGetPaypalClientIdQuery();

//   const [clientId, setClientId] = useState(null);

//   useEffect(() => {
//     if (data?.clientId) {
//       setClientId(data.clientId);
//     }
//   }, [data]);

//   console.log('client id', clientId)

//   if (isLoading) {
//     return <p>Loading PayPal...</p>; // Show loading state until the client ID is fetched
//   }

//   if (error) {
//     return <p>Error fetching PayPal client ID</p>; // Handle errors from the API
//   }

//   if (!clientId) {
//     return <p>No PayPal client ID found</p>; // Handle case where clientId is null or undefined
//   }

//   return (
//     <PayPalScriptProvider options={{ 
//       "client-id": clientId, 
//       currency: "USD", 
//       intent: "capture",
//       // deferLoading:true 
//       }}>
//       {children}
//     </PayPalScriptProvider>
//   );
// };

const root = ReactDOM.createRoot(document.getElementById('root'));
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
