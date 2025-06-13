const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const goToFirstPage = () => onPageChange(1);
  const goToLastPage = () => onPageChange(totalPages);

  return (
    <div className="mt-20 flex justify-center">
      {/* First Page Button */}
      <button
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        className={`mx-1 px-4 py-2 border rounded ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        First
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`mx-1 px-4 py-2 border rounded ${
            currentPage === index + 1
              ? "bg-gray-900 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {index + 1}
        </button>
      ))}

      {/* Last Page Button */}
      <button
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        className={`mx-1 px-4 py-2 border rounded ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
