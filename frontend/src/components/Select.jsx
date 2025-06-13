import React from "react";

const SelectField = ({ id, name, label, value, onChange, options }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectField;
