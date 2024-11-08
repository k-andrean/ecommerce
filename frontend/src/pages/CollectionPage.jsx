import React, { useEffect, useState, Fragment } from 'react'
import { useParams, useLocation, useFetcher, Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, StarIcon } from '@heroicons/react/20/solid'

import { useGetProductWithCollectionQuery } from 'services/productsAPI';
import {  classNames, sortOptions, priceRanges, updateFilters } from 'utils';


const CollectionPage = () => {
    const { collectionName } = useParams();
    const location = useLocation();
    const [productCollectionsData, setProductCollectionsData] = useState([])
    const [productCollectionsOptions, setProductCollectionsOptions] = useState([])
    const [selectedFilters, setSelectedFilters] = useState({
      color: [],
      size: [],
      price: []
    });
    const [filters, setFilters] = useState({
      price: [],
      color: [],
      size: [],
    });
    const [selectedSortOption, setSelectedSortOption] = useState(null);

    const searchParams = new URLSearchParams(location.search);
    const collectionId = searchParams.get('id');

    const { data: productsCollectionsRespData, isSuccess: isSuccessProductsCollection} = useGetProductWithCollectionQuery(collectionId);
  
  

  useEffect(() => {
    if (isSuccessProductsCollection && productsCollectionsRespData) {
      console.log('Product with Collection data:', productsCollectionsRespData);

      // Check if productsCategoriesRespData is an array before mapping
      const updatedProductCollections = Array.isArray(productsCollectionsRespData) ? 
        productsCollectionsRespData.map(product => ({
          ...product,
          image_path: process.env.REACT_APP_ECOMMERCE_URL + product.image_path.replace(/\\/g, '/'),
        })) : [];

      setProductCollectionsData(updatedProductCollections);
      setProductCollectionsOptions(updatedProductCollections);

      updateFilters(updatedProductCollections, setFilters);
  }
}, [isSuccessProductsCollection, productsCollectionsRespData]);

    
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const currentFilterValues = prev[filterType];
      const updatedFilterValues = currentFilterValues.includes(value)
        ? currentFilterValues.filter((v) => v !== value) // Remove from selected filters if already checked
        : [...currentFilterValues, value]; // Add to selected filters if not already checked
  
      // Update the filters state to reflect the new checked status
      const updatedFilters = {
        ...filters,
        [filterType]: filters[filterType].map(option =>
          option.value === value
            ? { ...option, checked: !option.checked } // Toggle checked state
            : option
        )
      };
  
      // Update the selected filters and filters state
      setFilters(updatedFilters);
  
      return {
        ...prev,
        [filterType]: updatedFilterValues // Return the updated selected filters
      };
    });
  };

  const applyFilters = () => {
      let filteredData = productCollectionsData;
    
      // Apply color filters
      if (selectedFilters.color.length > 0) {
        filteredData = filteredData.filter((product) =>
          selectedFilters.color.includes(product.color)
        );
      }
    
      // Apply size filters
      if (selectedFilters.size.length > 0) {
        filteredData = filteredData.filter((product) =>
          selectedFilters.size.includes(product.size)
        );
      }
    
      // Apply price filters
      if (selectedFilters.price.length > 0) {
        filteredData = filteredData.filter((product) => {
          const productPrice = parseFloat(product.price);
          return selectedFilters.price.some((selectedRange) => {
            const range = priceRanges.find((r) => r.label === selectedRange);
            return productPrice >= range.min && productPrice < range.max;
          });
        });
      }

          // Apply sort based on the selected sort option
      if (selectedSortOption) {
        console.log('selected sort option', selectedSortOption);
        switch (selectedSortOption.name) {
          case 'Best Rating':
            filteredData.sort((a, b) => b.rating - a.rating); // Sort by rating descending
            break;
          case 'Newest':
            filteredData.sort((a, b) => b.id - a.id); // Sort by newest (assuming 'id' or timestamp)
            break;
          case 'Price: Low to High':
            filteredData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); // Sort by price ascending
            break;
          case 'Price: High to Low':
            filteredData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // Sort by price descending
            break;
          default:
            break;
        }
    }
    
      setProductCollectionsOptions(filteredData);
  };

    useEffect(() => {
      applyFilters();
    }, [selectedFilters, selectedSortOption]);

    // reset product options when navigated back to page
    useEffect(() => {
      if (!selectedFilters.color.length && !selectedFilters.size.length && !selectedFilters.price.length) {
        setProductCollectionsOptions(productCollectionsData); // Reset to full list if no filters
      }
    }, [selectedFilters, productCollectionsData]);

    // function for handling sorting filtering data options
  const handleSortOptionClick = (optionName) => {
    setSelectedSortOption(optionName); // Set the selected sort option
  }; 
    
  console.log('product options', productCollectionsData);
  console.log('filter options', filters);

  const handleClearAll = () => {
    setSelectedFilters({
      color: [],
      size: [],
      price: []
    });
    setSelectedSortOption(null);

    const updatedFilters = {
      price: filters.price.map((filter) => ({ ...filter, checked: false })),
      color: filters.color.map((filter) => ({ ...filter, checked: false })),
      size: filters.size.map((filter) => ({ ...filter, checked: false })),
    };
  
    // Set the new filters state to trigger a rerender
    setFilters(updatedFilters);
  };

  const appliedFilterCount = Object.values(selectedFilters).reduce((count, filterArray) => count + filterArray.length, 0);

  const activeSortCount = selectedSortOption ? 1 : 0;

  const totalActiveCount = appliedFilterCount + activeSortCount;

  return (
        
      <main className="pb-24">
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">{collectionName}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
          {productCollectionsData[0]?.collection_description} 
        </p>
      </div>

      {/* Filters */}
      <Disclosure
        as="section"
        aria-labelledby="filter-heading"
        className="grid items-center border-b border-t border-gray-200"
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>
        <div className="relative col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl space-x-6 divide-x divide-gray-200 px-4 text-sm sm:px-6 lg:px-8">
            <div>
              <Disclosure.Button className="group flex items-center font-medium text-gray-700">
                <FunnelIcon
                  className="mr-2 h-5 w-5 flex-none text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {totalActiveCount}
              </Disclosure.Button>
            </div>
            <div className="pl-6">
            <button
              type="button"
              className="text-gray-500 cursor-pointer"
              onClick={handleClearAll}
            >
              Clear all
            </button>
            </div>
          </div>
        </div>
        <Disclosure.Panel className="border-t border-gray-200 py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-3 gap-x-4 px-4 text-sm sm:px-6 md:gap-x-6 lg:px-8">
            <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium">Price</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {filters.price.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`price-${optionIdx}`}
                        name="price[]"
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={option.checked}
                        onChange={() => handleFilterChange('price', option.value)}
                      />
                      <label htmlFor={`price-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium">Color</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {filters.color.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`color-${optionIdx}`}
                        name="color[]"
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={option.checked}
                        onChange={() => handleFilterChange('color', option.value)}
                      />
                      <label htmlFor={`color-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="grid auto-rows-min grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-6">
              <fieldset>
                <legend className="block font-medium">Size</legend>
                <div className="space-y-6 pt-6 sm:space-y-4 sm:pt-4">
                  {filters.size.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center text-base sm:text-sm">
                      <input
                        id={`size-${optionIdx}`}
                        name="size[]"
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={option.checked}
                        onChange={() => handleFilterChange('size', option.value)}
                      />
                      <label htmlFor={`size-${optionIdx}`} className="ml-3 min-w-0 flex-1 text-gray-600">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </Disclosure.Panel>
        <div className="col-start-1 row-start-1 py-4">
          <div className="mx-auto flex max-w-7xl justify-end px-4 sm:px-6 lg:px-8">
            <Menu as="div" className="relative inline-block">
              <div className="flex">
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none hover:cursor-pointer">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            className={classNames(
                              option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default anchor behavior
                              handleSortOptionClick(option); // Handle sort click
                            }}
                          >
                            {option.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </Disclosure>

      {/* Product grid */}
      <section aria-labelledby="products-heading" className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {productCollectionsOptions.map((product) => (
            <div key={product.id} className="group relative border-b border-r border-gray-200 p-4 sm:p-6">
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                  src={product.image_path}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="pb-4 pt-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <Link 
                    to={`/products/detail/${product.id}`} 
                  >
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
      </section>
      </main>
    )
}

export default CollectionPage;