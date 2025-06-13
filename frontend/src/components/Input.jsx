import React from "react";

const InputField = ({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  autoComplete,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  </div>
);

export default InputField;
