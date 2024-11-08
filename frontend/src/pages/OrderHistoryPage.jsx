import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import fetchAxios from 'utils/axios';
import { useGetUserOrdersQuery } from 'services/ordersAPI';

const orders = [
  {
    number: '4376',
    status: 'Delivered on January 22, 2021',
    href: '#',
    invoiceHref: '#',
    products: [
      {
        id: 1,
        name: 'Machined Brass Puzzle',
        href: '#',
        price: '$95.00',
        color: 'Brass',
        size: '3" x 3" x 3"',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/order-history-page-07-product-01.jpg',
        imageAlt: 'Brass puzzle in the shape of a jack with overlapping rounded posts.',
      },
      // More products...
    ],
  },
  // More orders...
]

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const currentUserId = useSelector((state) => state.userData.userId);
    const [ordersHistoryData, setOrdersHistoryData] = useState({});

    const { data: ordersHistoryRespData, isSuccess: isSuccessOrdersHistory } = useGetUserOrdersQuery(currentUserId);

    useEffect(() => {
      if (isSuccessOrdersHistory && ordersHistoryRespData) {
          console.log('order history data:', ordersHistoryRespData);
          setOrdersHistoryData(ordersHistoryRespData);

      }
  }, [isSuccessOrdersHistory, ordersHistoryRespData]);


  const handleClickBuyAgain = () =>{
    navigate('/products/all')
  }

    return (
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Orders</h1>
          <p className="mt-2 text-sm text-gray-500">
            Check the status of recent orders, manage returns, and discover similar products.
          </p>
        </div>

        <div className="mt-12 space-y-16 sm:mt-16">
          {Object.values(ordersHistoryData)?.map((order) => (
            <section key={order.id} aria-labelledby={`${order.id}-heading`}>
              <div className="space-y-1 md:flex md:items-baseline md:space-x-4 md:space-y-0">
                <h2 id={`${order.id}-heading`} className="text-lg font-medium text-gray-900 md:flex-shrink-0">
                  Order #{order.id}
                </h2>
                <div className="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                  <p className="text-sm font-medium text-gray-500">{order.status}</p>
                  <div className="flex text-sm font-medium">
                    <div className="ml-4 border-l border-gray-200 pl-4 sm:ml-6 sm:pl-6">
                      <Link to={`/orders/detail/${order.id}`} className="text-indigo-600 hover:text-indigo-500">
                        View Order
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="-mb-6 mt-6 flow-root divide-y divide-gray-200 border-t border-gray-200">
                {order.products.map((product) => (
                  <div key={product.id} className="py-6 sm:flex">
                    <div className="flex space-x-4 sm:min-w-0 sm:flex-1 sm:space-x-6 lg:space-x-8">
                      <img
                        src={product.image_path}
                        className="h-20 w-20 flex-none rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                      <div className="min-w-0 flex-1 pt-1.5 sm:pt-0">
                        <h3 className="text-sm font-medium text-gray-900">
                            <Link 
                            to={`/products/detail/${product.id}`} 
                          >
                            {product.name}
                          </Link>
                        </h3>
                        <p className="truncate text-sm text-gray-500">
                          <span>{product.color}</span>{' '}
                          <span className="mx-1 text-gray-400" aria-hidden="true">
                            &middot;
                          </span>{' '}
                          <span>{product.size}</span>
                        </p>
                        <p className="mt-1 font-medium text-gray-900">Rp {Math.floor(product.price)}</p>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4 sm:ml-6 sm:mt-0 sm:w-40 sm:flex-none">
                      <button
                        type="button"
                        onClick={handleClickBuyAgain}
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-gray-400 px-2.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-full sm:flex-grow-0"
                      >
                            Buy Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    )
}

export default OrderHistoryPage;