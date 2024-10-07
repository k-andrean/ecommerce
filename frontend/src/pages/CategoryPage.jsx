import React, { useEffect, useState, Fragment } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, FunnelIcon, StarIcon } from '@heroicons/react/20/solid'

import { useGetProductWithCategoryQuery } from 'services/productsAPI';

  // const filters = {
  //   price: [
  //     { value: '0', label: '$0 - $25', checked: false },
  //     { value: '25', label: '$25 - $50', checked: false },
  //     { value: '50', label: '$50 - $75', checked: false },
  //     { value: '75', label: '$75+', checked: false },
  //   ],
  //   color: [
  //     { value: 'white', label: 'White', checked: false },
  //     { value: 'beige', label: 'Beige', checked: false },
  //     { value: 'blue', label: 'Blue', checked: true },
  //     { value: 'brown', label: 'Brown', checked: false },
  //     { value: 'green', label: 'Green', checked: false },
  //     { value: 'purple', label: 'Purple', checked: false },
  //   ],
  //   size: [
  //     { value: 'xs', label: 'XS', checked: false },
  //     { value: 's', label: 'S', checked: true },
  //     { value: 'm', label: 'M', checked: false },
  //     { value: 'l', label: 'L', checked: false },
  //     { value: 'xl', label: 'XL', checked: false },
  //     { value: '2xl', label: '2XL', checked: false },
  //   ],
  // }
  const sortOptions = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
  ]
  

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


const CategoryPage = () => {
    const { categoryName } = useParams();
    const location = useLocation();
    const [productCategoriesData, setProductCategoriesData] = useState([])
    const [productCategoriesOptions, setProductCategoriesOptions] = useState(productCategoriesData? : productCategoriesData : [])
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState([]);

    const searchParams = new URLSearchParams(location.search);
    const categoryId = searchParams.get('id');

    const { data: productsCategoriesRespData, isSuccess: isSuccessProductsCategory} = useGetProductWithCategoryQuery(categoryId);

    useEffect(() => {
        if (isSuccessProductsCategory && productsCategoriesRespData) {
            console.log('Product with Category data:', productsCategoriesRespData);
            const updatedProductCategories = productsCategoriesRespData.map(product => ({
              ...product,
              image_path: process.env.REACT_APP_ECOMMERCE_URL + product.image_path.replace(/\\/g, '/'),
            }));
            setProductCategoriesData(updatedProductCategories);
        }
    }, [isSuccessProductsCategory, productsCategoriesRespData]);

    const priceRanges = [
      { min: 0, max: 50000, label: "Rp 0 - Rp 50000" },
      { min: 50000, max: 100000, label: "Rp 50000 - Rp 100000" },
      { min: 100000, max: 250000, label: "Rp 100000 - Rp 250000" },
      { min: 250000, max: Infinity, label: "Rp 250000+" }
    ];

    const getPriceRange = (price) => {
      const numericPrice = parseFloat(price); // Convert price to number
      return priceRanges.find(
        (range) => numericPrice >= range.min && numericPrice < range.max
      )?.label || "Unknown";
    };
    
    // Extract unique colors, sizes, and price ranges
    const uniqueColors = [...new Set(productCategoriesData.map((product) => product.color))];
    const uniqueSizes = [...new Set(productCategoriesData.map((product) => product.size))];
    const uniquePriceRanges = [...new Set(productCategoriesData.map((product) => getPriceRange(product.price)))];
    
    // Create the filters object dynamically
    const filters = {
      price: uniquePriceRanges.map((priceRange) => ({
        value: priceRange, // You can add a numeric value range if needed
        label: priceRange,
        checked: false
      })),
      color: uniqueColors.map((color) => ({
        value: color,
        label: color,
        checked: false
      })),
      size: uniqueSizes.map((size) => ({
        value: size,
        label: size,
        checked: false
      }))
    };
    
    const handleFilterChange = (filterType, value) => {
      switch (filterType) {
        case 'color':
          setSelectedColors((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
          );
          break;
        case 'size':
          setSelectedSizes((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
          );
          break;
        case 'price':
          setSelectedPrices((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
          );
          break;
        default:
          break;
      }
    };

    const applyFilters = () => {
      let filteredData = products;
    
      // Apply color filters
      if (selectedColors.length > 0) {
        filteredData = filteredData.filter((product) =>
          selectedColors.includes(product.color)
        );
      }
    
      // Apply size filters
      if (selectedSizes.length > 0) {
        filteredData = filteredData.filter((product) =>
          selectedSizes.includes(product.size)
        );
      }
    
      // Apply price filters
      if (selectedPrices.length > 0) {
        filteredData = filteredData.filter((product) => {
          const productPrice = parseFloat(product.price);
          return selectedPrices.some((selectedRange) => {
            const range = priceRanges.find((r) => r.label === selectedRange);
            return productPrice >= range.min && productPrice < range.max;
          });
        });
      }
    
      setProductCategoriesOptions(filteredData);
    };

    useEffect(() => {
      applyFilters();
    }, [selectedColors, selectedSizes, selectedPrices]);

    console.log('product options', productCategoriesOptions);

    return (
        
      <main className="pb-24">
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">{categoryName}</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
          The secret to a tidy desk? Don't get rid of anything, just put it in really really nice looking containers.
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
                2 Filters
              </Disclosure.Button>
            </div>
            <div className="pl-6">
              <button type="button" className="text-gray-500">
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
                        defaultValue={option.value}
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        defaultChecked={option.checked}
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
                        defaultValue={option.value}
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        defaultChecked={option.checked}
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
                        defaultValue={option.value}
                        type="checkbox"
                        className="h-4 w-4 flex-shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        defaultChecked={option.checked}
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.name}>
                        {({ active }) => (
                          <a
                            href={option.href}
                            className={classNames(
                              option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm'
                            )}
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
          {productCategoriesData.map((product) => (
            <div key={product.id} className="group relative border-b border-r border-gray-200 p-4 sm:p-6">
              <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                <img
                  src={product.image_path}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="pb-4 pt-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">
                  <a href={product.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </a>
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

export default CategoryPage;