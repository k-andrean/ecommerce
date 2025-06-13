import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { classNames } from "utils";
import { useGetProvincesQuery } from "services/citiesAPI";
import { processPayment } from "services/paymentAPI";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { clearCart, setShippingPrice } from "store/reducer/cart";
import { RadioGroup } from "@headlessui/react";
import InputField from "components/Input";
import SelectField from "components/Select";
import DeliveryRadioGroup from "components/RadioGroup";
import Button from "components/Button";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import fetchAxios from "utils/axios";
import { toast } from "react-toastify";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log(
  "Stripe Publishable Key:",
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

const paymentMethods = [{ id: "stripe", title: "Credit Card" }];

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

  return (
    <form
      onSubmit={(event) => {
        console.log("stripe payment method called");
        handleSubmitStripe(event);
      }}
    >
      <CardElement className="block w-full rounded-md border-gray-300 shadow-sm my-4" />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button
        type="submit"
        onClick={handleSubmitStripe}
        disabled={!stripe || processing}
        label={processing ? "Processing..." : "Pay"}
      />
      {success && (
        <div className="text-green-500 mt-2">Payment successful!</div>
      )}
    </form>
  );
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [provinceOption, setProvinceOption] = useState([]);
  const [cityOption, setCityOption] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [shippingOption, setShippingOption] = useState([]);

  const {
    data: provinceOptionRespData,
    isSuccess: isSuccessProvinceOptionRespData,
  } = useGetProvincesQuery();

  useEffect(() => {
    if (isSuccessProvinceOptionRespData && provinceOptionRespData?.data) {
      console.log("Province data:", provinceOptionRespData);

      setProvinceOption(provinceOptionRespData?.data);
    }
  }, [isSuccessProvinceOptionRespData, provinceOptionRespData]);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "Indonesia",
    region: "",
    postalCode: "",
  });

  // Fetch cities based on selected province
  useEffect(() => {
    const fetchCities = async () => {
      if (formData?.region) {
        try {
          const response = await fetchAxios.get(
            `${process.env.REACT_APP_ECOMMERCE_URL}cities/getCities/${formData?.region}`
          );
          console.log("city response", response.data);
          setCityOption(response.data.data); // Assuming the response contains the city data
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      } else {
        setCityOption([]);
      }
    };

    fetchCities();
  }, [formData?.region]);

  useEffect(() => {
    const fetchCitiesCost = async () => {
      if (formData?.city) {
        try {
          const response = await fetchAxios.get(
            `${process.env.REACT_APP_ECOMMERCE_URL}cities/getShipping/${formData?.city}`
          );

          if (!response.status === 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const results = response?.data?.rajaongkir?.results;

          const deliveryMethods = results.flatMap((result) =>
            result.costs.map((cost) => ({
              id: Math.random(),
              title: cost?.service,
              turnaround: cost?.cost?.[0]?.etd,
              price: cost?.cost?.[0]?.value.toString(),
            }))
          );

          console.log("delivery methods", deliveryMethods);

          setShippingOption(deliveryMethods);
          setSelectedDeliveryMethod(deliveryMethods?.[0]);
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    };

    fetchCitiesCost();
  }, [formData?.city]);

  const {
    userId: cartUserId,
    items: cartItems,
    totalAmount,
    shippingPrice,
  } = useSelector((state) => state.cartData);

  const updatedTotalAmount =
    Number(totalAmount) + (Number(selectedDeliveryMethod?.price) || 0);

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCityChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "city") {
      const selectedCity = cityOption.find((city) => city.city_id === value);
      setSelectedCityName(selectedCity ? selectedCity.city_name : "");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <h1 className="sr-only">Checkout</h1>

        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-4">
                <InputField
                  id="email-address"
                  name="email"
                  type="email"
                  label="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {/* </div> */}
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <InputField
                    id="first-name"
                    name="firstName"
                    label="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                  />
                </div>

                <div>
                  <InputField
                    id="last-name"
                    name="lastName"
                    label="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <InputField
                    id="address"
                    name="address"
                    label="Address"
                    value={formData.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                </div>

                <div>
                  <SelectField
                    id="country"
                    name="country"
                    label="Country"
                    value={formData.country}
                    onChange={handleChange}
                    options={[{ value: "Indonesia", label: "Indonesia" }]}
                  />
                  {/* </div> */}
                </div>

                <div>
                  <SelectField
                    id="region"
                    name="region"
                    label="State / Province"
                    value={formData.region}
                    onChange={handleChange}
                    options={provinceOption.map((province) => ({
                      value: province.province_id,
                      label: province.province,
                    }))}
                    placeholder="Select a province"
                  />
                </div>

                <div>
                  <SelectField
                    id="city"
                    name="city"
                    label="City"
                    value={formData.city}
                    onChange={handleCityChange}
                    options={cityOption.map((city) => ({
                      value: city.city_id,
                      label: city.city_name,
                    }))}
                    placeholder="Select a city"
                  />
                </div>

                <div>
                  <InputField
                    id="postal-code"
                    name="postalCode"
                    label="Postal code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    autoComplete="postal-code"
                  />
                  {/* </div> */}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <DeliveryRadioGroup
                options={shippingOption}
                selectedValue={selectedDeliveryMethod}
                onChange={setSelectedDeliveryMethod}
              />
            </div>

            {/* Payment */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>

              <fieldset className="mt-4">
                <legend className="sr-only">Payment type</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center">
                      <input
                        id={method.id}
                        name="payment-type"
                        type="radio"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={handlePaymentChange}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={method.id}
                        className="ml-3 block text-sm font-medium text-gray-700"
                      >
                        {method.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
              {paymentMethod === "stripe" && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    totalAmount={updatedTotalAmount}
                    selectedDeliveryMethod={selectedDeliveryMethod}
                    cartUserId={cartUserId}
                    cartItems={cartItems}
                    cityOption={cityOption}
                  />
                </Elements>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((product) => (
                  <li key={product.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image_path}
                        className="w-20 rounded-md"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <Link
                              to={`/products/detail/${product.id}`}
                              className="font-medium text-gray-700 hover:text-gray-800"
                            >
                              {product.name}
                            </Link>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.color}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.size}
                          </p>
                        </div>
                        <div className="ml-4 flow-root flex-shrink-0">
                          <p className="quantity text-sm font-semibold">
                            Total Quantity: {product.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-center justify-end pt-2">
                        <p className="mt-1 text-sm font-semibold">
                          Rp {Math.floor(product.price)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Rp {Math.floor(totalAmount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Rp {Math.floor(selectedDeliveryMethod?.price || 0)}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total Amount</dt>
                  <dd className="text-base font-medium text-gray-900">
                    Rp {Math.floor(updatedTotalAmount)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
