export const priceRanges = [
    { min: 0, max: 50000, label: "Rp 0 - Rp 50000" },
    { min: 50000, max: 100000, label: "Rp 50000 - Rp 100000" },
    { min: 100000, max: 250000, label: "Rp 100000 - Rp 250000" },
    { min: 250000, max: Infinity, label: "Rp 250000+" }
  ];

export const sortOptions = [
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
    { name: 'Price: Low to High', href: '#', current: false },
    { name: 'Price: High to Low', href: '#', current: false },
  ]

export const getPriceRange = (price) => {
    const numericPrice = parseFloat(price); // Convert price to number
    return priceRanges.find(
      (range) => numericPrice >= range.min && numericPrice < range.max
    )?.label || "Unknown";
  };


export const classNames = (...classes) => {
    return classes.filter(Boolean).join(' ')
}
  
// function for setting filter and unique options 
export const updateFilters = (data, setFilters) => {
    const uniqueColors = [...new Set(data.map((product) => product.color))];
    const uniqueSizes = [...new Set(data.map((product) => product.size))];
    const uniquePriceRanges = [...new Set(data.map((product) => getPriceRange(product.price)))];
  
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
  
    setFilters(updatedFilters); // Update the state
  };


