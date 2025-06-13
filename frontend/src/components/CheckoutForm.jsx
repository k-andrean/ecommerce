import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";

const CheckoutForm = ({
  totalAmount,
  selectedDeliveryMethod,
  cartUserId,
  cartItems,
  cityOption,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmitStripe = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    console.log("total amount", totalAmount);
    console.log("selected delivery", selectedDeliveryMethod);

    const cardElement = elements.getElement(CardElement);

    // Call backend to create paymentIntent and get clientSecret
    const { data } = await fetchAxios.post("/create-payment-intent", {
      amount: totalAmount + selectedDeliveryMethod.price,
      currency: "idr",
    });

    const clientSecret = data.clientSecret;

    const { error: paymentError, paymentIntent } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

    if (paymentError) {
      console.log("Error during payment:", paymentError.message);
      setError(paymentError.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded:", paymentIntent);
      setSuccess(true);

      const cityId = document.getElementById("city").value;

      const selectedCity = cityOption.find(
        (city) => city.city_id === parseInt(cityId)
      );
      const cityName = selectedCity ? selectedCity.city_name : "";

      const formData = {
        user_id: cartUserId,
        products: JSON.stringify(cartItems),
        order_date: new Date().toISOString(),
        shipping_info: {
          address: document.getElementById("address").value,
          city: cityName,
          state: document.getElementById("region").value,
          zip: document.getElementById("postal-code").value,
          country: document.getElementById("country").value,
          shipping_option: selectedDeliveryMethod,
        },
        order_status: true,
        payment_info: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
        },
        total_amount: totalAmount + parseInt(selectedDeliveryMethod.price),
      };

      console.log("form data total price", formData.total_amount);

      try {
        const response = await fetchAxios.post("/orders", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("response", response);

        if (!response.request.status === 201) {
          throw new Error("Failed to create order");
        }

        toast.info("Order created successfully");
        dispatch(clearCart());
        navigate(`/orders/detail/${response?.data?.id}`);
      } catch (error) {
        toast.error("Error Creating Order");
        console.error("Error submitting order:", error);
      }

      setProcessing(false);
    }
  };
};

export default CheckoutForm;
