import React, { useEffect, useState, Fragment } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import FilterPanel from "components/FilterPanel";
import Card from "components/Card";

import { useGetProductWithCategoryQuery } from "services/productsAPI";
import { getPriceRange, classNames, sortOptions, priceRanges } from "utils";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const [productCategoriesData, setProductCategoriesData] = useState([]);
  const [productCategoriesOptions, setProductCategoriesOptions] = useState([]);
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
  const categoryId = searchParams.get("id");

  const {
    data: productsCategoriesRespData,
    isSuccess: isSuccessProductsCategory,
  } = useGetProductWithCategoryQuery(categoryId);

  const updateFilters = (data) => {
    const uniqueColors = [...new Set(data.map((product) => product.color))];
    const uniqueSizes = [...new Set(data.map((product) => product.size))];
    const uniquePriceRanges = [
      ...new Set(data.map((product) => getPriceRange(product.price))),
    ];

    const updatedFilters = {
      price: uniquePriceRanges.map((priceRange) => ({
        value: priceRange,
        label: priceRange,
        checked: false,
      })),
      color: uniqueColors.map((color) => ({
        value: color,
        label: color,
        checked: false,
      })),
      size: uniqueSizes.map((size) => ({
        value: size,
        label: size,
        checked: false,
      })),
    };

    setFilters(updatedFilters);
  };

  useEffect(() => {
    if (isSuccessProductsCategory && productsCategoriesRespData) {
      console.log("Product with Category data:", productsCategoriesRespData);

      const updatedProductCategories = Array.isArray(productsCategoriesRespData)
        ? productsCategoriesRespData.map((product) => ({
            ...product,
            image_path:
              process.env.REACT_APP_ECOMMERCE_URL +
              product.image_path.replace(/\\/g, "/"),
          }))
        : [];

      setProductCategoriesData(updatedProductCategories);
      setProductCategoriesOptions(updatedProductCategories);

      updateFilters(updatedProductCategories);
    }
  }, [isSuccessProductsCategory, productsCategoriesRespData]);

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
        [filterType]: updatedFilterValues, // Return the updated selected filters
      };
    });
  };

  const applyFilters = () => {
    let filteredData = productCategoriesData;

    if (selectedFilters.color.length > 0) {
      filteredData = filteredData.filter((product) =>
        selectedFilters.color.includes(product.color)
      );
    }

    if (selectedFilters.size.length > 0) {
      filteredData = filteredData.filter((product) =>
        selectedFilters.size.includes(product.size)
      );
    }

    if (selectedFilters.price.length > 0) {
      filteredData = filteredData.filter((product) => {
        const productPrice = parseFloat(product.price);
        return selectedFilters.price.some((selectedRange) => {
          const range = priceRanges.find((r) => r.label === selectedRange);
          return productPrice >= range.min && productPrice < range.max;
        });
      });
    }

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

    setProductCategoriesOptions(filteredData);
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
      setProductCategoriesOptions(productCategoriesData);
    }
  }, [selectedFilters, productCategoriesData]);

  const handleSortOptionClick = (optionName) => {
    setSelectedSortOption(optionName);
  };

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
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {categoryName}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
          The secret to a tidy desk? Don't get rid of anything, just put it in
          really really nice looking containers.
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
          {productCategoriesOptions.map((product) => (
            <Card key={product.id} data={product} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
