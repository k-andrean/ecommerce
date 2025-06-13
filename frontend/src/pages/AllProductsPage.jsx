import React, { useEffect, useState, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  FunnelIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import Card from "components/Card";
import Pagination from "components/Pagination";

import { useGetAllProductsQuery } from "services/productsAPI";

const AllProductsPage = () => {
  const [allProductsData, setAllProductsData] = useState([]);
  const [allProductsOptions, setAllProductsOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // Number of items to display per page
  const totalPages = Math.ceil(allProductsData.length / itemsPerPage);

  const { data: allProductsRespData, isSuccess: isSuccessAllProducts } =
    useGetAllProductsQuery();

  useEffect(() => {
    if (isSuccessAllProducts && allProductsRespData) {
      console.log("All Products data:", allProductsRespData);

      const updatedAllProducts = Array.isArray(allProductsRespData)
        ? allProductsRespData.map((product) => ({
            ...product,
            image_path:
              process.env.REACT_APP_ECOMMERCE_URL +
              product.image_path.replace(/\\/g, "/"),
          }))
        : [];

      setAllProductsData(updatedAllProducts);
    }
  }, [isSuccessAllProducts, allProductsRespData]);

  useEffect(() => {
    if (allProductsData && allProductsData.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      const paginatedData = allProductsData.slice(startIndex, endIndex);
      console.log("this run");
      setAllProductsOptions(paginatedData);
    }
  }, [currentPage, allProductsData]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  console.log("product options", allProductsData);
  console.log("all products options", allProductsOptions);

  return (
    <main className="pb-24">
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
          All Products
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
          Tidy your desk and workspace by purchasing our assorted collections of
          different products designed to help you maintain productivity.
        </p>
      </div>

      {/* Product grid */}
      <section
        aria-labelledby="products-heading"
        className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8"
      >
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {allProductsOptions.map((product) => (
            <Card key={product.id} data={product} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <div />
      </section>
    </main>
  );
};

export default AllProductsPage;
