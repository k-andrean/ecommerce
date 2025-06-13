import {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateQuantity,
} from "store/reducer/cart";

// Handle adding the product to the cart
export const handleAddToCart = (
  dispatch,
  productDetailData,
  quantity,
  currentUserId
) => {
  if (quantity > 0) {
    // Ensure userId is available
    if (!currentUserId) {
      toast.error("You must be logged in to add products to the cart.");
      return;
    }

    // Dispatch addToCart action with userId
    dispatch(
      addToCart({
        product: productDetailData,
        quantity: parseInt(quantity),
        userId: currentUserId,
      })
    );

    // Update localStorage cart
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = existingCart.findIndex(
      (item) => item.product.id === productDetailData.id
    );

    if (existingProductIndex !== -1) {
      // If product exists in cart, update quantity
      existingCart[existingProductIndex].quantity += parseInt(quantity);
    } else {
      // If product does not exist, add new entry
      existingCart.push({
        product: productDetailData,
        quantity: parseInt(quantity),
        userId: currentUserId,
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // Show success toast
    toast.info("Product added successfully to cart!");
  } else {
    // Show error toast if quantity is invalid
    toast.error("Please select a valid quantity!");
  }
};

// Handle updating the quantity and recalculating the total amount
export const handleQuantityChange = (
  dispatch,
  productId,
  newQuantity,
  cartItems,
  quantities,
  setQuantities,
  setTotalAmount,
  currentUserId
) => {
  if (newQuantity > 0) {
    // Update local state for quantities
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));

    const product = cartItems.find((item) => item.id === productId);
    const priceDiff = (newQuantity - quantities[productId]) * product.price;

    // Update total amount
    setTotalAmount((prevTotalAmount) => prevTotalAmount + priceDiff);

    // Dispatch updated quantity to Redux
    dispatch(
      updateQuantity({
        productId,
        quantity: newQuantity,
        userId: currentUserId,
      })
    );
  }
};

export const handleRemove = (dispatch, productId, currentUserId) => {
  dispatch(removeFromCart({ productId: productId, userId: currentUserId }));
};

export const handleCheckout = (
  dispatch,
  cartItems,
  quantities,
  currentUserId,
  navigate
) => {
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
