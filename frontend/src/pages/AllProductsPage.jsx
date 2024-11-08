import React, { useEffect, useState, Fragment } from 'react'
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, StarIcon } from '@heroicons/react/20/solid'

import { useGetAllProductsQuery } from 'services/productsAPI';
import {  
  classNames, 
  sortOptions, 
  priceRanges, 
  updateFilters,
} from 'utils';


const AllProductsPage = () => {
    const [allProductsData, setAllProductsData] = useState([])
    const [allProductsOptions, setAllProductsOptions] = useState([])

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10; // Number of items to display per page
    const totalPages = Math.ceil(allProductsData.length / itemsPerPage);

    const { data: allProductsRespData, isSuccess: isSuccessAllProducts} = useGetAllProductsQuery();
    

  useEffect(() => {
    if (isSuccessAllProducts && allProductsRespData) {
      console.log('All Products data:', allProductsRespData);

      // Check if productsCategoriesRespData is an array before mapping
      const updatedAllProducts = Array.isArray(allProductsRespData) ? 
        allProductsRespData.map(product => ({
          ...product,
          image_path: process.env.REACT_APP_ECOMMERCE_URL + product.image_path.replace(/\\/g, '/'),
        })) : [];

      setAllProductsData(updatedAllProducts);
  }
}, [isSuccessAllProducts, allProductsRespData]);

    

  useEffect(() => {
      if (allProductsData && allProductsData.length > 0) {
    
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
    
        const paginatedData = allProductsData.slice(startIndex, endIndex);
        console.log('this run');
        setAllProductsOptions(paginatedData);
      }
       
      }, [currentPage, allProductsData]);


const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
};

const goToFirstPage = () => {
    goToPage(1);
};

const goToLastPage = () => {
  goToPage(totalPages);
};

  console.log('product options', allProductsData);
  console.log('all products options', allProductsOptions);

  return (
        
      <main className="pb-24">
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">All Products</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
        Tidy your desk and workspace by purchasing our assorted collections of different products designed to help you maintain productivity.
        </p>
      </div>

      {/* Product grid */}
      <section aria-labelledby="products-heading" className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {allProductsOptions.map((product) => (
            <div key={product.id} className="group relative border-b border-r border-gray-200 p-4 sm:p-6">
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                  src={product.image_path}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="pb-4 pt-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link to={`/products/detail/${product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <div className="mt-3 flex flex-col items-center">
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          product.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-base font-medium text-gray-900">Rp {Math.floor(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
          {/* Pagination Component */}
          <div className="mt-20 flex justify-center">
                <button 
                    onClick={goToFirstPage} 
                    disabled={currentPage === 1} 
                    className={`mx-1 px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    First
                </button>

                {Array.from({ length: totalPages }, (_, index) => (
                    <button 
                        key={index + 1} 
                        onClick={() => goToPage(index + 1)} 
                        className={`mx-1 px-4 py-2 border rounded ${currentPage === index + 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                        {index + 1}
                    </button>
                ))}

                <button 
                    onClick={goToLastPage} 
                    disabled={currentPage === totalPages} 
                    className={`mx-1 px-4 py-2 border rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    Last
                </button>
            </div>

          <div/>
      </section>
      </main>
    )
}

export default AllProductsPage;