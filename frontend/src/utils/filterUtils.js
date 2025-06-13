import { getPriceRange } from "utils";
// Function to update filters based on products data
export const updateFilters = (data) => {
  const uniqueColors = [...new Set(data.map((product) => product.color))];
  const uniqueSizes = [...new Set(data.map((product) => product.size))];
  const uniquePriceRanges = [
    ...new Set(data.map((product) => getPriceRange(product.price))),
  ];

  return {
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
};

// Function to handle filter changes
export const handleFilterChange = (
  filterType,
  value,
  selectedFilters,
  filters,
  setSelectedFilters,
  setFilters
) => {
  setSelectedFilters((prev) => {
    const currentFilterValues = prev[filterType];
    const updatedFilterValues = currentFilterValues.includes(value)
      ? currentFilterValues.filter((v) => v !== value) // Remove from selected filters if already checked
      : [...currentFilterValues, value]; // Add to selected filters if not already checked

    // Update the filters state to reflect the new checked status
    const updatedFilters = {
      ...filters,
      [filterType]: filters[filterType].map((option) =>
        option.value === value
          ? { ...option, checked: !option.checked } // Toggle checked state
          : option
      ),
    };

    // Update the selected filters and filters state
    setFilters(updatedFilters);

    return {
      ...prev,
      [filterType]: updatedFilterValues, // Return the updated selected filters
    };
  });
};

// Function to apply filters and sort data
export const applyFilters = (
  productCategoriesData,
  selectedFilters,
  selectedSortOption,
  priceRanges,
  setProductCategoriesOptions
) => {
  let filteredData = productCategoriesData;

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
    switch (selectedSortOption.name) {
      case "Best Rating":
        filteredData.sort((a, b) => b.rating - a.rating); // Sort by rating descending
        break;
      case "Newest":
        filteredData.sort((a, b) => b.id - a.id); // Sort by newest (assuming 'id' or timestamp)
        break;
      case "Price: Low to High":
        filteredData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); // Sort by price ascending
        break;
      case "Price: High to Low":
        filteredData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); // Sort by price descending
        break;
      default:
        break;
    }
  }

  setProductCategoriesOptions(filteredData);
};

// Function to handle clearing all filters
export const handleClearAll = (setSelectedFilters, setFilters, filters) => {
  setSelectedFilters({
    color: [],
    size: [],
    price: [],
  });

  setFilters({
    price: filters.price.map((filter) => ({ ...filter, checked: false })),
    color: filters.color.map((filter) => ({ ...filter, checked: false })),
    size: filters.size.map((filter) => ({ ...filter, checked: false })),
  });
};

// Function to calculate the total active filters count
export const getActiveFilterCount = (selectedFilters, selectedSortOption) => {
  const appliedFilterCount = Object.values(selectedFilters).reduce(
    (count, filterArray) => count + filterArray.length,
    0
  );

  const activeSortCount = selectedSortOption ? 1 : 0;

  return appliedFilterCount + activeSortCount;
};
