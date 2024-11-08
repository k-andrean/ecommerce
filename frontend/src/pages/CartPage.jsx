import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity } from 'store/reducer/cart';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current user ID from user slice
  const currentUserId = useSelector((state) => state.userData.userId);

  // Get cart data from cart slice
  const { userId: cartUserId, items: cartItems } = useSelector((state) => state.cartData);

  // Initialize totalAmount based on initial cart items
  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState({});

  // Effect to initialize quantities and totalAmount if the userId matches
  useEffect(() => {
    if (cartUserId === currentUserId) {
      const initialQuantities = {};
      cartItems.forEach(item => {
        initialQuantities[item.id] = item.quantity;
      });

      setQuantities(initialQuantities);

      const initialTotalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      setTotalAmount(initialTotalAmount);
    } else {
      // If userId doesn't match, reset cart items and quantities
      setQuantities({});
      setTotalAmount(0);
    }
  }, [cartUserId, currentUserId, cartItems]);

  // Handle updating the quantity and recalculating the total amount
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: newQuantity,
      }));

      const product = cartItems.find((item) => item.id === productId);
      const priceDiff = (newQuantity - quantities[productId]) * product.price;

      setTotalAmount((prevTotalAmount) => prevTotalAmount + priceDiff);

      // Dispatch the updated quantity to Redux
      dispatch(updateQuantity({ productId, quantity: newQuantity, userId: currentUserId }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    let isUpdated = false;

    cartItems.forEach((item) => {
      if (quantities[item.id] !== item.quantity) {
        dispatch(updateQuantity({ productId: item.id, quantity: quantities[item.id], userId: currentUserId }));
        isUpdated = true;
      }
    });

    if (isUpdated) {
      console.log("Cart updated before checkout.");
    }

    navigate('/checkout');
  };


  return (
      <main>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cartItems.length > 0 ? (
                cartItems.map((product) => (
                  <li key={product.id} className="flex py-6">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image_path}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col sm:ml-6">
                      <div>
                        <div className="flex justify-between">
                          <h4 className="text-sm">
                            <Link 
                            className="font-medium text-gray-700 hover:text-gray-800"
                            to={`/products/detail/${product.id}`} 
                            >
                              {product.name}
                            </Link>
                          </h4>
                          <p className="ml-4 text-sm font-medium text-gray-900">Rp {Math.floor(product.price)}</p>
                        </div>
                          {/* Quantity controls */}
                          <div className="mt-2 flex items-center">
                            <button
                                type="button"
                                className="text-sm font-medium text-gray-700 hover:text-gray-800"
                                onClick={() => {
                                    const newQuantity = quantities[product.id] - 1;
                                    handleQuantityChange(product.id, newQuantity);
                                }}
                                disabled={quantities[product.id] <= 1} // Disable if quantity is 1 or less
                            >
                                -
                            </button>
                            <p className="mx-4 text-sm font-medium text-gray-900">{quantities[product.id]}</p>
                            <button
                                type="button"
                                className="text-sm font-medium text-gray-700 hover:text-gray-800"
                                onClick={() => {
                                    const newQuantity = quantities[product.id] + 1;
                                    handleQuantityChange(product.id, newQuantity);
                                }}
                            >
                                +
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                        <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                      </div>

                      <div className="mt-4 flex flex-1 items-end justify-end">
                        <div className="ml-4">
                          <button
                            type="button"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            onClick={() => handleRemove(product.id)}
                          >
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">Your cart is empty</p>
              )}
            </ul>
          </section>

          {/* Order summary */}
          <section aria-labelledby="summary-heading" className="mt-10">
            <h2 id="summary-heading" className="sr-only">
              Order summary
            </h2>

            <div>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-base font-medium text-gray-900">Subtotal</dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">Rp {Math.floor(totalAmount)}</dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">Shipping and taxes will be calculated at checkout.</p>
            </div>

            <div className="mt-10">
              <button
                type="button"
                className="w-full rounded-md border border-transparent bg-gray-400 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                or{' '}
                <Link 
                to={'/products/all'} 
                className="font-medium text-indigo-600 hover:text-indigo-500">
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </section>
        </form>
      </div>
      </main>
  );
};

export default CartPage;