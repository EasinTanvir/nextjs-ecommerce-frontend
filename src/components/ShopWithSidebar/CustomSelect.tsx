"use client";

import React, { useState, useEffect, useRef } from "react";

export interface SelectOption {
  label: string;
  value: string;
  slug?: string;
}

interface CustomSelectProps {
  options: SelectOption[];

  onChange?: (option: SelectOption) => void;

  value?: string;
}

const CustomSelect = ({ options, onChange, value }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement | null>(null);

  // selected option from query param
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  // close dropdown outside click
  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: SelectOption) => {
    onChange?.(option);

    setIsOpen(false);
  };

  return (
    <div
      className="custom-select custom-select-2 flex-shrink-0 relative"
      ref={selectRef}
    >
      {/* Selected */}
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption.label}
      </div>

      {/* Dropdown */}
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${
              selectedOption.value === option.value ? "same-as-selected" : ""
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
