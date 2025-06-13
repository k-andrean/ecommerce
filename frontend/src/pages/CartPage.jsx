import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, removeFromCart, updateQuantity } from "store/reducer/cart";
import { Link, useNavigate } from "react-router-dom";
import CustomLink from "components/CustomLink";
import Button from "components/Button";
import CartItem from "components/CartItem";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUserId = useSelector((state) => state.userData.userId);
  const { userId: cartUserId, items: cartItems } = useSelector(
    (state) => state.cartData
  );

  const [totalAmount, setTotalAmount] = useState(0);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (cartUserId === currentUserId) {
      const initialQuantities = {};
      cartItems.forEach((item) => {
        initialQuantities[item.id] = item.quantity;
      });

      setQuantities(initialQuantities);

      const initialTotalAmount = cartItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );
      setTotalAmount(initialTotalAmount);
    } else {
      setQuantities({});
      setTotalAmount(0);
    }
  }, [cartUserId, currentUserId, cartItems]);

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
      dispatch(
        updateQuantity({
          productId,
          quantity: newQuantity,
          userId: currentUserId,
        })
      );
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart({ productId: productId, userId: currentUserId }));
  };

  const handleCheckout = () => {
    let isUpdated = false;

    cartItems.forEach((item) => {
      if (quantities[item.id] !== item.quantity) {
        dispatch(
          updateQuantity({
            productId: item.id,
            quantity: quantities[item.id],
            userId: currentUserId,
          })
        );
        isUpdated = true;
      }
    });

    if (isUpdated) {
      console.log("Cart updated before checkout.");
    }

    navigate("/checkout");
  };

  return (
    <main>
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-0">
        <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        <form className="mt-12">
          <section aria-labelledby="cart-heading">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-b border-t border-gray-200"
            >
              {cartItems.length > 0 ? (
                cartItems.map((product) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    quantity={quantities[product.id]}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
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
                  <dt className="text-base font-medium text-gray-900">
                    Subtotal
                  </dt>
                  <dd className="ml-4 text-base font-medium text-gray-900">
                    Rp {Math.floor(totalAmount)}
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-sm text-gray-500">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>

            <div className="mt-10">
              <Button label="Checkout" onClick={handleCheckout} />
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                or{" "}
                <CustomLink
                  to={"/products/all"}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                  <span aria-hidden="true"> &rarr;</span>
                </CustomLink>
              </p>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
};

export default CartPage;
