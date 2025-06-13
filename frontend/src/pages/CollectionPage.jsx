import React, { useEffect, useState, Fragment } from "react";
import { useParams, useLocation, useFetcher, Link } from "react-router-dom";
import Card from "components/Card";
import FilterPanel from "components/FilterPanel";

import { useGetProductWithCollectionQuery } from "services/productsAPI";
import { classNames, sortOptions, priceRanges, updateFilters } from "utils";

const CollectionPage = () => {
  const { collectionName } = useParams();
  const location = useLocation();
  const [productCollectionsData, setProductCollectionsData] = useState([]);
  const [productCollectionsOptions, setProductCollectionsOptions] = useState(
    []
  );
  const [selectedFilters, setSelectedFilters] = useState({
    color: [],
    size: [],
    price: [],
  });
  const [filters, setFilters] = useState({
    price: [],
    color: [],
    size: [],
  });
  const [selectedSortOption, setSelectedSortOption] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const collectionId = searchParams.get("id");

  const {
    data: productsCollectionsRespData,
    isSuccess: isSuccessProductsCollection,
  } = useGetProductWithCollectionQuery(collectionId);

  useEffect(() => {
    if (isSuccessProductsCollection && productsCollectionsRespData) {
      console.log("Product with Collection data:", productsCollectionsRespData);

      // Check if productsCategoriesRespData is an array before mapping
      const updatedProductCollections = Array.isArray(
        productsCollectionsRespData
      )
        ? productsCollectionsRespData.map((product) => ({
            ...product,
            image_path:
              process.env.REACT_APP_ECOMMERCE_URL +
              product.image_path.replace(/\\/g, "/"),
          }))
        : [];

      setProductCollectionsData(updatedProductCollections);
      setProductCollectionsOptions(updatedProductCollections);

      updateFilters(updatedProductCollections, setFilters);
    }
  }, [isSuccessProductsCollection, productsCollectionsRespData]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => {
      const currentFilterValues = prev[filterType];
      const updatedFilterValues = currentFilterValues.includes(value)
        ? currentFilterValues.filter((v) => v !== value)
        : [...currentFilterValues, value];

      const updatedFilters = {
        ...filters,
        [filterType]: filters[filterType].map((option) =>
          option.value === value
            ? { ...option, checked: !option.checked }
            : option
        ),
      };

      setFilters(updatedFilters);

      return {
        ...prev,
        [filterType]: updatedFilterValues,
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
      console.log("selected sort option", selectedSortOption);
      switch (selectedSortOption.name) {
        case "Best Rating":
          filteredData.sort((a, b) => b.rating - a.rating);
          break;
        case "Newest":
          filteredData.sort((a, b) => b.id - a.id);
          break;
        case "Price: Low to High":
          filteredData.sort(
            (a, b) => parseFloat(b.price) - parseFloat(a.price)
          );
          break;
        case "Price: High to Low":
          filteredData.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
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

  useEffect(() => {
    if (
      !selectedFilters.color.length &&
      !selectedFilters.size.length &&
      !selectedFilters.price.length
    ) {
      setProductCollectionsOptions(productCollectionsData);
    }
  }, [selectedFilters, productCollectionsData]);

  const handleSortOptionClick = (optionName) => {
    setSelectedSortOption(optionName);
  };

  console.log("product options", productCollectionsData);
  console.log("filter options", filters);

  const handleClearAll = () => {
    setSelectedFilters({
      color: [],
      size: [],
      price: [],
    });
    setSelectedSortOption(null);

    const updatedFilters = {
      price: filters.price.map((filter) => ({ ...filter, checked: false })),
      color: filters.color.map((filter) => ({ ...filter, checked: false })),
      size: filters.size.map((filter) => ({ ...filter, checked: false })),
    };

    setFilters(updatedFilters);
  };

  const appliedFilterCount = Object.values(selectedFilters).reduce(
    (count, filterArray) => count + filterArray.length,
    0
  );

  const activeSortCount = selectedSortOption ? 1 : 0;

  const totalActiveCount = appliedFilterCount + activeSortCount;

  return (
    <main className="pb-24">
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">
          {collectionName}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
          {productCollectionsData[0]?.collection_description}
        </p>
      </div>
      <FilterPanel
        filters={filters}
        totalActiveCount={totalActiveCount}
        handleFilterChange={handleFilterChange}
        handleClearAll={handleClearAll}
        sortOptions={sortOptions}
        handleSortOptionClick={handleSortOptionClick}
      />

      {/* Product grid */}
      <section
        aria-labelledby="products-heading"
        className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8"
      >
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {productCollectionsOptions.map((product) => (
            <Card key={product.id} data={product} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default CollectionPage;
