import React from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

const DeliveryRadioGroup = ({ options = [], selectedValue, onChange }) => {
  const classNames = (...classes) => classes.filter(Boolean).join(" ");

  return (
    <RadioGroup value={selectedValue} onChange={onChange}>
      <RadioGroup.Label className="text-lg font-medium text-gray-900">
        Delivery method
      </RadioGroup.Label>

      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        {options?.map((option) => (
          <RadioGroup.Option
            key={option.id}
            value={option}
            className={({ checked, active }) =>
              classNames(
                checked ? "border-transparent" : "border-gray-300",
                active ? "ring-2 ring-indigo-500" : "",
                "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-sm font-medium text-gray-900"
                    >
                      {option.title}
                    </RadioGroup.Label>
                    <RadioGroup.Description
                      as="span"
                      className="mt-1 flex items-center text-sm text-gray-500"
                    >
                      {option.turnaround}
                    </RadioGroup.Description>
                    <RadioGroup.Description
                      as="span"
                      className="mt-6 text-sm font-medium text-gray-900"
                    >
                      {option.price}
                    </RadioGroup.Description>
                  </span>
                </span>
                {checked && (
                  <CheckCircleIcon
                    className="h-5 w-5 text-indigo-600"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={classNames(
                    active ? "border" : "border-2",
                    checked ? "border-indigo-500" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};

export default DeliveryRadioGroup;
