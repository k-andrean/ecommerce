import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Disclosure } from "@headlessui/react";
import { addToCart } from "store/reducer/cart";
import { useGetProductQuery } from "services/productsAPI";
import { classNames } from "utils";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import fetchAxios from "utils/axios";
import Button from "components/Button";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [productDetailData, setProductDetailData] = useState({});
  const [quantity, setSelectedQuantity] = useState(1);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const dispatch = useDispatch();

  const currentUserId = useSelector((state) => state.userData.userId);

  const { data: productDetailRespData, isSuccess: isSuccessProductDetail } =
    useGetProductQuery(productId);

  useEffect(() => {
    if (isSuccessProductDetail && productDetailRespData) {
      console.log("product detail data:", productDetailRespData);

      const updatedProductDetail = {
        ...productDetailRespData,
        image_path:
          process.env.REACT_APP_ECOMMERCE_URL +
          productDetailRespData.image_path.replace(/\\/g, "/"),
      };

      setProductDetailData(updatedProductDetail);
    }
  }, [isSuccessProductDetail, productDetailRespData]);

  useEffect(() => {
    if (productDetailData && productDetailData.category_id) {
      const fetchRelatedData = async () => {
        try {
          const response = await fetchAxios.get(
            `/products/categories/${productDetailData.category_id}`
          );

          if (response?.data?.length) {
            const relatedProductData = response.data.filter(
              (data) => data.id !== productDetailData.id
            );

            const updatedRelatedProductsData = relatedProductData.map(
              (product) => ({
                ...product,
                image_path:
                  process.env.REACT_APP_ECOMMERCE_URL +
                  product.image_path.replace(/\\/g, "/"),
              })
            );
            console.log("updated", updatedRelatedProductsData);

            setRelatedProduct(updatedRelatedProductsData);
          } else {
            setRelatedProduct([]);
          }
        } catch (error) {
          console.error("Failed to fetch related products:", error);
        }
      };

      fetchRelatedData();
    }
  }, [productDetailData]);

  const handleAddToCart = () => {
    if (quantity > 0) {
      if (!currentUserId) {
        toast.error("You must be logged in to add products to the cart.");
        return;
      }

      dispatch(
        addToCart({
          product: productDetailData,
          quantity: parseInt(quantity),
          userId: currentUserId,
        })
      );

      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingProductIndex = existingCart.findIndex(
        (item) => item.product.id === productDetailData.id
      );

      if (existingProductIndex !== -1) {
        existingCart[existingProductIndex].quantity += parseInt(quantity);
      } else {
        // If product does not exist, add new entry
        existingCart.push({
          product: productDetailData,
          quantity: parseInt(quantity),
          userId: currentUserId,
        });
      }

      localStorage.setItem("cart", JSON.stringify(existingCart));
      toast.info("Product added successfully to cart!");
    } else {
      toast.error("Please select a valid quantity!");
    }
  };

  return (
    <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image */}
          <div className="aspect-h-1 aspect-w-1 w-full">
            <img
              src={productDetailData.image_path}
              className="h-full w-full object-cover object-center sm:rounded-lg"
            />
          </div>
          {/* Product info */}
          <div className="mt-4 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="flex justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
                {productDetailData.name}
              </h1>
            </div>

            <div className="mt-6">
              <h2 className="sr-only">Product information</h2>
              <p className="text-2xl tracking-tight text-gray-900 mt-4 font-semibold">
                Rp {Math.floor(productDetailData.price)}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: productDetailData.description,
                }}
              />
            </div>

            <div className="mt-6">
              <label
                htmlFor="quantity"
                className="block text-md font-medium text-gray-700 mb-4"
              >
                {productDetailData.quantity > 0 ? "Stock" : "Out of Stock"}
              </label>
              {productDetailData.quantity > 0 ? (
                <select
                  id="quantity"
                  name="quantity"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => setSelectedQuantity(e.target.value)} // Capture the selected value
                >
                  {/* Spread the stock value to create the options */}
                  {Array.from(
                    { length: productDetailData.quantity },
                    (_, i) => i + 1
                  ).map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-red-600 text-sm font-semibold mt-2">
                  Out of Stock
                </p>
              )}
            </div>

            <form className="mt-6">
              <div className="mt-10 flex justify-center">
                <Button label="Add To Bag" onClick={handleAddToCart} />
              </div>
            </form>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                <Disclosure as="div" key="details">
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? "text-indigo-600" : "text-gray-900",
                              "text-md font-semibold"
                            )}
                          >
                            Product Details{" "}
                            {/* Title for the details disclosure */}
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel
                        as="div"
                        className="prose prose-sm pb-6"
                      >
                        <ul role="list">
                          {productDetailData?.details?.map((detail, index) => (
                            <li key={index} className="mt-2">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </section>
            {/* Reviews */}
            <div className="mt-4">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex justify-center items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        productDetailData.rating > rating
                          ? "text-yellow-500"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="ml-4 font-semibold text-indigo-500">
                  {productDetailData.rating} out of 5 stars
                </p>
              </div>
            </div>
          </div>
        </div>

        <section
          aria-labelledby="related-heading"
          className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
        >
          <h2 id="related-heading" className="text-xl font-bold text-gray-900">
            Other similar products
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {relatedProduct?.map((product) => (
              <div key={product.id}>
                <div className="relative">
                  <div className="relative h-72 w-full overflow-hidden rounded-lg">
                    <img
                      src={product.image_path}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="relative mt-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p>
                  </div>
                  <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                    />
                    <p className="relative text-lg font-semibold text-white">
                      Rp {Math.floor(product.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetailPage;
