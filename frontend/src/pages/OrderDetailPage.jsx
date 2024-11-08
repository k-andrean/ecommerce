import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import fetchAxios from 'utils/axios';
import { useGetOrderDetailQuery } from 'services/ordersAPI';// Make sure to import your custom hook

const products = [
    {
      id: 1,
      name: 'Cold Brew Bottle',
      description:
        'This glass bottle comes with a mesh insert for steeping tea or cold-brewing coffee. Pour from any angle and remove the top for easy cleaning.',
      href: '#',
      quantity: 1,
      price: '$32.00',
      imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-05-product-01.jpg',
      imageAlt: 'Glass bottle with black plastic pour top and mesh insert.',
    },
  ]
  
  const OrderDetailPage = () => {
    
    const { orderId } = useParams(); // Get orderId from the URL
    const currentUserId = useSelector((state) => state.userData.userId);
    const [orderDetailsData, setOrderDetailsData] = useState({});
    const [userData, setUserData] = useState({});
    const { data: orderDetailsRespData, isSuccess: isSuccessOrderDetails } = useGetOrderDetailQuery(currentUserId, orderId);
   
    useEffect(() => {
      if (isSuccessOrderDetails && orderDetailsRespData) {
          console.log('order details data:', orderDetailsRespData);
          setOrderDetailsData(orderDetailsRespData);

          // Define an async function to fetch user data
          const fetchUserData = async () => {
              try {
                  const userDataResp = await fetchAxios.get(`/users/${orderDetailsRespData.user_id}`);
                  setUserData(userDataResp?.data); 
                  console.log('user data', userDataResp)
              } catch (error) {
                  console.error('Error fetching user data:', error);
              }
          };

          // Call the async function
          fetchUserData();
      }
  }, [isSuccessOrderDetails, orderDetailsRespData]);
   
    return (
      <main className="bg-white px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="max-w-xl">
            <h1 className="text-base font-medium text-indigo-600">Thank you!</h1>
            <p className="mt-2 text-4xl font-bold tracking-tight">It's on the way!</p>
            <p className="mt-2 text-base text-gray-500">Your order #{orderDetailsData.id} has shipped and will be with you soon.</p>
  
            <dl className="mt-12 text-sm font-medium">
              <dt className="text-gray-900">Tracking number</dt>
              <dd className="mt-2 text-indigo-600">51547878755545848512</dd>
            </dl>
          </div>
  
          <section aria-labelledby="order-heading" className="mt-10 border-t border-gray-200">
            <h2 id="order-heading" className="sr-only">
              Your order
            </h2>
  
            <h3 className="sr-only">Items</h3>
            {orderDetailsData?.products?.map((product) => (
              <div key={product.id} className="flex space-x-6 border-b border-gray-200 py-10">
                <img
                  src={product.image_path}
                  className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
                />
                <div className="flex flex-auto flex-col">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      <Link 
                        to={`/products/detail/${product.id}`} 
                      >
                        {product.name}
                      </Link>
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                  </div>
                  <div className="mt-6 flex flex-1 items-end">
                    <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                      <div className="flex">
                        <dt className="font-medium text-gray-900">Quantity</dt>
                        <dd className="ml-2 text-gray-700">{product.quantity}</dd>
                      </div>
                      <div className="flex pl-4 sm:pl-6">
                        <dt className="font-medium text-gray-900">Price</dt>
                        <dd className="ml-2 text-gray-700">Rp {Math.floor(product.price)}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
  
            <div className="sm:ml-40 sm:pl-6">
              <h3 className="sr-only">Your information</h3>
  
              <h4 className="sr-only">Addresses</h4>
              <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
                <div>
                  <dt className="font-medium text-gray-900">Shipping address</dt>
                  <dd className="mt-2 text-gray-700">
                    <address className="not-italic">
                      <span className="block">{userData?.name}</span>
                      <span className="block">{orderDetailsData?.shipping_info?.address}</span>
                      <span className="block">{orderDetailsData?.shipping_info?.city}</span>
                    </address>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Billing address</dt>
                  <dd className="mt-2 text-gray-700">
                    <address className="not-italic">
                    <span className="block">{userData?.name}</span>
                      <span className="block">{orderDetailsData?.shipping_info?.city}</span>
                    </address>
                  </dd>
                </div>
              </dl>
  
              <h4 className="sr-only">Payment</h4>
              <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
                <div>
                  <dt className="font-medium text-gray-900">Payment method</dt>
                  <dd className="mt-2 text-gray-700">
                    {orderDetailsData?.payment_info?.paymentIntentId ? (
                          <p>Stripe</p>
                      ) : (
                          <p>Credit Card</p>
                    )}
                    <p>
                      <span aria-hidden="true">••••</span>
                      <span className="sr-only">Ending in </span>1545
                    </p>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Shipping method</dt>
                  <dd className="mt-2 text-gray-700">
                    <p>{orderDetailsData?.shipping_info?.shipping_option?.title}</p>
                    <p>Takes up to {orderDetailsData?.shipping_info?.shipping_option?.turnaround} working days</p>
                  </dd>
                </div>
              </dl>
  
              <h3 className="sr-only">Summary</h3>
  
              <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
                <div className="flex justify-between">
                  <dt className="text-lg font-bold text-gray-900">Total</dt>
                  <dd className="text-lg font-bold text-gray-900">Rp {Math.floor(orderDetailsData?.total_amount)}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </main>
    )
  }
  
  export default OrderDetailPage;