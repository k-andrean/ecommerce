import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { classNames } from 'utils';
import { useGetProvincesQuery } from 'services/citiesAPI';
import { processPayment } from 'services/paymentAPI';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { clearCart, setShippingPrice } from 'store/reducer/cart';
import {  RadioGroup } from '@headlessui/react'
import { CheckCircleIcon, ChevronDownIcon, TrashIcon } from '@heroicons/react/20/solid'
import fetchAxios from 'utils/axios';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '10000' },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '16000' },
]
const paymentMethods = [
  { id: "creditCard", title: "Credit Card" },
  { id: "stripe", title: "Stripe" }
];

const CheckoutForm = ({ totalAmount, selectedDeliveryMethod, cartUserId, cartItems, cityOption }) => {
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

    const cardElement = elements.getElement(CardElement);

    // Call backend to create paymentIntent and get clientSecret
    const { data } = await fetchAxios.post('/create-payment-intent', { 
      amount: totalAmount + selectedDeliveryMethod.price, 
      currency: 'idr'
    });

    const clientSecret = data.clientSecret;

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement }
    });

    if (paymentError) {
      console.log('Error during payment:', paymentError.message);
      setError(paymentError.message);
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded:', paymentIntent);
      setSuccess(true);


      const cityId = document.getElementById('city').value;

      // Find the city name from cityOption based on the city ID
      const selectedCity = cityOption.find((city) => city.city_id === parseInt(cityId));
      const cityName = selectedCity ? selectedCity.city_name : "";

      // Prepare form data to send to the backend for order creation
      const formData = {
        user_id: cartUserId,
        products: JSON.stringify(cartItems),
        order_date: new Date().toISOString(), // Get the current date and time
        shipping_info: {
          address: document.getElementById('address').value,
          city: cityName,
          state: document.getElementById('region').value,
          zip: document.getElementById('postal-code').value,
          country: document.getElementById('country').value,
          shipping_option:selectedDeliveryMethod
        },
        order_status: true,
        payment_info: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
      },
        total_amount: totalAmount + selectedDeliveryMethod.price,
      };

      try {
        // Send form data to the backend to create an order
        const response = await fetchAxios.post('/orders', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('response', response)

        if (!response.request.status === 201) {
          throw new Error('Failed to create order');
        }

        // const orderData = await response.json();
        toast.info('Order created successfully')
        // Move the dispatch and navigate logic here
        dispatch(clearCart());
        navigate(`/orders/detail/${response?.data?.id}`);

    

      } catch (error) {
        toast.error('Error Creating Order')
        console.error('Error submitting order:', error);
        // Handle error (e.g., show error message to user)
      }
      
      setProcessing(false);
    }
  };
  

  return (
    <form onSubmit={(event) => {
      console.log('stripe payment method called');
      handleSubmitStripe(event)}}>
      <CardElement className="block w-full rounded-md border-gray-300 shadow-sm mt-4" />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        onClick={handleSubmitStripe}
        disabled={!stripe || processing}
        className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-md"
      >
        {processing ? 'Processing...' : 'Pay'}
      </button>
      {success && <div className="text-green-500 mt-2">Payment successful!</div>}
    </form>
  );
};

const CheckoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState("creditCard")
    const [provinceOption, setProvinceOption] = useState([])
    const [cityOption, setCityOption] = useState([]);
    const [selectedCityName, setSelectedCityName] = useState('');
    const [shippingOption, setShippingOption] = useState([]);


    const { data: provinceOptionRespData, isSuccess: isSuccessProvinceOptionRespData} = useGetProvincesQuery();


    useEffect(() => {
      if (isSuccessProvinceOptionRespData && provinceOptionRespData?.data) {
        console.log('Province data:', provinceOptionRespData);
  
        setProvinceOption(provinceOptionRespData?.data)
    }
  }, [isSuccessProvinceOptionRespData, provinceOptionRespData]);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: 'Indonesia',
    region: '',
    postalCode: ''
});

  // Fetch cities based on selected province
    useEffect(() => {
      const fetchCities = async () => {
        if (formData?.region) {
          try {
            const response = await fetchAxios.get(`${process.env.REACT_APP_ECOMMERCE_URL}cities/getCities/${formData?.region}`);
            console.log('city response', response.data);
            setCityOption(response.data.data); // Assuming the response contains the city data
          } catch (error) {
            console.error("Error fetching cities:", error);
          }
        } else {
          setCityOption([]); // Reset city options if no province is selected
        }
      };

      fetchCities();
    }, [formData?.region]);


    useEffect(() => {
      const fetchCitiesCost = async () => {
        if (formData?.city) {
          try {
            // Prepare the data to be sent in x-www-form-urlencoded format
            const response = await fetchAxios.get(`${process.env.REACT_APP_ECOMMERCE_URL}cities/getShipping/${formData?.city}`);
    
            // Check for HTTP errors
            if (!response.status === 200) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results = response?.data?.rajaongkir?.results;

            // Process the results to extract delivery methods
            const deliveryMethods = results.flatMap(result =>
              result.costs.map(cost => ({
                id: Math.random(), // Unique ID for React key (use better ID generation for production)
                title: cost?.service, // Delivery service name
                turnaround: cost?.cost?.[0]?.etd, // Estimated delivery time
                price: cost?.cost?.[0]?.value.toString(), // Shipping cost
              }))
            );

            console.log('delivery methods', deliveryMethods)

            setShippingOption(deliveryMethods)
            setSelectedDeliveryMethod(deliveryMethods?.[0])
    
          } catch (error) {
            console.error("Error fetching cities:", error);
          }
        }
      };
    
      fetchCitiesCost();
    }, [formData?.city]);

   

    const { userId: cartUserId, items: cartItems, totalAmount, shippingPrice } = useSelector((state) => state.cartData);


    const updatedTotalAmount = Number(totalAmount) + (Number(selectedDeliveryMethod?.price) || 0);


    const handlePaymentChange = (event) => {
      setPaymentMethod(event.target.value);
    };

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: value,
      }));
  };

  const handleCityChange = (event) => {
    const { name, value } = event.target;
  
    // Update formData with the selected city ID
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  
    // Find the selected city's name and update selectedCityName
    if (name === "city") {
      const selectedCity = cityOption.find((city) => city.city_id === value);
      setSelectedCityName(selectedCity ? selectedCity.city_name : "");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('credit card payment called');
    const formData = {
        cardNumber:  document.getElementById('card-number').value, // Ensure you have 'card-number' in formData
        nameOnCard: document.getElementById('name-on-card').value,
        expirationDate: document.getElementById('expiration-date').value,
        cvc: document.getElementById('cvc').value
    }
    // Process payment using form data
    const paymentResponse = await processPayment(formData); // Call the processPayment function

    // Check if payment was successful
    if (paymentResponse.status !== 'success') {
        console.error('Payment processing failed:', paymentResponse);
        // Handle payment failure (e.g., show error message to the user)
        return; // Exit the function if payment fails
    }

    const orderData = {
        user_id: cartUserId,
        products: JSON.stringify(cartItems),
        order_date: new Date(), // Current date
        shipping_info: {
            address: formData.address,
            city: selectedCityName,
            state: formData.region,
            zip: formData.postalCode,
            country: formData.country,
            shipping_option:selectedDeliveryMethod
        },
        order_Status: true, // Since payment was successful
        payment_info: paymentResponse, // Include the payment response
        total_amount: updatedTotalAmount
    };

    try {
        // Use fetchAxios to send order data to the backend
        const response = await fetchAxios.post('/orders', orderData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Check if the response is successful
        if (response.status !== 201) {
            throw new Error('Failed to create order');
        }

        const orderResult = response.data; // Assuming response contains the order data
        toast.info('Order Created Successfully')
        dispatch(clearCart())
        navigate(`/orders/detail/${orderResult?.id}`)
    } catch (error) {
        console.error('Error submitting order:', error);
        // Handle error (e.g., show error message to user)
    }
  };
  return (
        
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" 
          // onSubmit={handleSubmit}
          >
              <div>
                  <div>
                      <h2 className="text-lg font-medium text-gray-900">Contact information</h2>

                      <div className="mt-4">
                          <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                              Email address
                          </label>
                          <div className="mt-1">
                              <input
                                  type="email"
                                  id="email-address"
                                  name="email"
                                  autoComplete="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="mt-10 border-t border-gray-200 pt-10">
                      <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>

                      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                          <div>
                              <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                  First name
                              </label>
                              <div className="mt-1">
                                  <input
                                      type="text"
                                      id="first-name"
                                      name="firstName"
                                      autoComplete="given-name"
                                      value={formData.firstName}
                                      onChange={handleChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                              </div>
                          </div>

                          <div>
                              <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                  Last name
                              </label>
                              <div className="mt-1">
                                  <input
                                      type="text"
                                      id="last-name"
                                      name="lastName"
                                      autoComplete="family-name"
                                      value={formData.lastName}
                                      onChange={handleChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                              </div>
                          </div>

                          <div className="sm:col-span-2">
                              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                  Address
                              </label>
                              <div className="mt-1">
                                  <input
                                      type="text"
                                      name="address"
                                      id="address"
                                      autoComplete="street-address"
                                      value={formData.address}
                                      onChange={handleChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                              </div>
                          </div>

                          <div>
                              
                              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                  Country
                              </label>
                              <div className="mt-1">
                                  <select
                                      id="country"
                                      name="country"
                                      autoComplete="country-name"
                                      value={formData.country}
                                      onChange={handleChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  >
                                      <option>Indonesia</option>
                                      <option>Singapore</option>
                                      <option>Malaysia</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                            
                            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                  State / Province
                            </label>
                            <div className="mt-1">
                            <select
                              name="region"
                              id="region"
                              value={formData.region} // This will be the selected province ID
                              onChange={handleChange} // Update the form data when a province is selected
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="">Select a province</option>
                              {provinceOption.map((province) => (
                                <option key={province.province_id} value={province.province_id}>
                                  {province.province}
                                </option>
                              ))}
                            </select>
                            </div>
                          </div>

                          <div>
                              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                  City
                              </label>
                              <div className="mt-1">
                                <select
                                  name="city"
                                  id="city"
                                  value={formData.city} // This will be the selected city ID
                                  onChange={handleCityChange} // Update the form data when a city is selected
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                  <option value="">Select a city</option>
                                  {cityOption?.map((city) => (
                                    <option key={city.city_id} value={city.city_id}>
                                      {city.city_name} {/* Use city_name for the displayed option */}
                                    </option>
                                  ))}
                                </select>
                              </div>
                          </div>

                          <div>
                              <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                                  Postal code
                              </label>
                              <div className="mt-1">
                                  <input
                                      type="text"
                                      name="postalCode"
                                      id="postal-code"
                                      autoComplete="postal-code"
                                      value={formData.postalCode}
                                      onChange={handleChange}
                                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                  />
                              </div>
                          </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod}>
                <RadioGroup.Label className="text-lg font-medium text-gray-900">Delivery method</RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {shippingOption?.map((deliveryMethod) => (
                    <RadioGroup.Option
                      key={deliveryMethod.id}
                      value={deliveryMethod}
                      className={({ checked, active }) =>
                        classNames(
                          checked ? 'border-transparent' : 'border-gray-300',
                          active ? 'ring-2 ring-indigo-500' : '',
                          'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                {deliveryMethod?.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-sm text-gray-500"
                              >
                                {deliveryMethod?.turnaround}
                              </RadioGroup.Description>
                              <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                {deliveryMethod?.price}
                              </RadioGroup.Description>
                            </span>
                          </span>
                          {checked ? (
                            <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                          ) : null}
                          <span
                            className={classNames(
                              active ? 'border' : 'border-2',
                              checked ? 'border-indigo-500' : 'border-transparent',
                              'pointer-events-none absolute -inset-px rounded-lg'
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
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
                      <label htmlFor={method.id} className="ml-3 block text-sm font-medium text-gray-700">
                        {method.title}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              {paymentMethod === "creditCard" && (
              <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                <div className="col-span-4">
                  <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                    Card number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="card-number"
                      name="card-number"
                      autoComplete="cc-number"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-4">
                  <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                    Name on card
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name-on-card"
                      name="name-on-card"
                      autoComplete="cc-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="col-span-3">
                  <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                    Expiration date (MM/YY)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="expiration-date"
                      id="expiration-date"
                      autoComplete="cc-exp"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                    CVC
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="cvc"
                      id="cvc"
                      autoComplete="csc"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-md"
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}


            {paymentMethod === "stripe" && (
              <Elements stripe={stripePromise}>
                <CheckoutForm totalAmount={updatedTotalAmount} selectedDeliveryMethod={selectedDeliveryMethod} cartUserId={cartUserId} cartItems={cartItems} cityOption={cityOption} />
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
                      <img src={product.image_path} 
                       className="w-20 rounded-md" />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm">
                            <Link 
                            to={`/products/detail/${product.id}`}  
                            className="font-medium text-gray-700 hover:text-gray-800">
                              {product.name}
                            </Link>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                          <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                        </div>
                        {/* <p className="quantity text-sm">
                            Total Quantity: {product.quantity}
                          </p> */}
                        <div className="ml-4 flow-root flex-shrink-0">
                        <p className="quantity text-sm font-semibold">
                            Total Quantity: {product.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-1 items-center justify-end pt-2">
                        <p className="mt-1 text-sm font-semibold">Rp {Math.floor(product.price)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">Rp {Math.floor(totalAmount)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">Rp {Math.floor(selectedDeliveryMethod?.price || 0)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total Amount</dt>
                  <dd className="text-base font-medium text-gray-900">Rp {Math.floor(updatedTotalAmount)}</dd>
                </div>
              </dl>

            </div>
          </div>
        </form>
      </div>
    </main>
    )
}

export default CheckoutPage;