const Button = ({ label, onClick, className, type = "button", ...props }) => (
  <button
    type={type}
    className={`w-full rounded-md border border-transparent bg-indigo-400 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 ${className}`}
    onClick={onClick}
    {...props}
  >
    {label}
  </button>
);

export default Button;
