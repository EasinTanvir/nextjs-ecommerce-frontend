import React from "react";

import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  label: string;

  id: Path<T>;

  type?: string;

  placeholder?: string;

  required?: boolean;

  register: UseFormRegister<T>;

  errors: FieldErrors<T>;

  message?: string;

  minLength?: number;

  validate?: (value: string) => boolean | string;
}

const InputField = <T extends FieldValues>({
  label,
  id,
  type = "text",
  placeholder,
  required,
  register,
  errors,
  message,
  minLength,
  validate,
}: InputFieldProps<T>) => {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block mb-2.5">
        {label}

        {required && <span className="text-red"> *</span>}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete="on"
        {...register(id, {
          required: required ? message || `${label} is required` : false,

          minLength: minLength
            ? {
                value: minLength,
                message: `${label} must be at least ${minLength} characters`,
              }
            : undefined,

          validate,
        })}
        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
      />

      {errors[id] && (
        <p className="text-red text-sm mt-1">{errors[id]?.message as string}</p>
      )}
    </div>
  );
};

export default InputField;
