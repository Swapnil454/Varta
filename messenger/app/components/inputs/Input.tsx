
'use client'

import clsx from "clsx"
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegister
} from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps<T extends Record<string, any>> {
  label: string;
  id: keyof T;
  type?: string;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: Partial<Record<keyof T, FieldError | Merge<FieldError, FieldErrorsImpl<any>>>>;
  disabled?: boolean;
  validate?: (value: string) => true | string; // ✅ custom validation
}

const Input = <T extends Record<string, any>>({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
  validate
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      <label
        className="block text-sm font-medium leading-6 text-gray-900"
        htmlFor={String(id)}
      >
        {label}
      </label>

      <div className="mt-2 relative">
        <input
          id={String(id)}
          type={isPassword && showPassword ? "text" : type}
          autoComplete={String(id)}
          disabled={disabled}
          {...register(id as any, {
            required: required ? `${label} is required` : false,
            validate
          })}
          className={clsx(
            `form-input block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
             focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6`,
            errors[id] && "ring-rose-500 focus:ring-rose-500",
            disabled && "opacity-50 cursor-default"
          )}
        />

        {/* ✅ Toggle password visibility */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* ✅ Show error message */}
      {errors[id] && (
        <p className="mt-1 text-xs text-rose-500">
          {String(errors[id]?.message)}
        </p>
      )}
    </div>
  );
}

export default Input;
