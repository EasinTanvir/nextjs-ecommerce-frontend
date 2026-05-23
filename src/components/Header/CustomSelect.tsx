import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export interface SelectOption {
  label: string;
  value: string;
  slug: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  onChange?: (option: SelectOption) => void;
}

const CustomSelect = ({ options, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState<SelectOption>(
    options[0],
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="dropdown-content custom-select relative"
      style={{ width: "200px" }}
    >
      <div
        className={`select-selected whitespace-nowrap ${
          isOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption?.label}
      </div>

      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options.map((option) => (
          <div key={option.value}>
            <Link
              onClick={() => {
                setIsOpen(false);

                setSelectedOption(option);

                onChange?.(option);
              }}
              href={`/category/${option.slug}`}
              className="select-item"
            >
              {option.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
