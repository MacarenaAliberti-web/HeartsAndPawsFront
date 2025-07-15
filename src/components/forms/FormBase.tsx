'use client';

import { FaEye, FaEyeSlash } from 'react-icons/fa';
import React from 'react';

interface Field<T> {
  name: keyof T;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
}

interface Props<T> {
  title: string;
  fields: Field<T>[];
  formData: T;
  errors: Partial<Record<keyof T, string | undefined>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  setShowPassword?: (value: boolean) => void;
  children?: React.ReactNode;
}

export default function FormBase<T>({
  title,
  fields,
  formData,
  errors,
  onChange,
  onSubmit,
  isLoading = false,
  showPasswordToggle = false,
  showPassword = false,
  setShowPassword,
  children,
}: Props<T>) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white max-w-2xl mx-auto p-8 rounded-xl shadow-lg border border-pink-600 space-y-6"
    >
      <h2 className="text-3xl font-bold text-pink-600 text-center">{title}</h2>

      {fields.map(({ name, label, type = 'text', multiline = false, rows = 4 }) => (
        <div key={String(name)}>
          <label
            htmlFor={String(name)}
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            {label}
          </label>

          {multiline ? (
            <textarea
              id={String(name)}
              name={String(name)}
              value={String(formData[name] ?? '')}
              onChange={onChange}
              disabled={isLoading}
              rows={rows}
              className={`w-full border ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              } rounded-md px-4 py-2 resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none`}
            />
          ) : (
            <div className="relative">
              <input
                type={
                  name === 'contrasena' && showPasswordToggle
                    ? showPassword
                      ? 'text'
                      : 'password'
                    : type
                }
                id={String(name)}
                name={String(name)}
                value={String(formData[name] ?? '')}
                onChange={onChange}
                disabled={isLoading}
                className={`w-full border ${
                  errors[name] ? 'border-red-500' : 'border-gray-300'
                } rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:outline-none`}
              />
              {name === 'contrasena' && showPasswordToggle && setShowPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
          )}

          {/* ✅ Mensaje de error debajo del campo */}
          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
          )}
        </div>
      ))}

      {children}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-4 rounded-md transition disabled:opacity-50"
      >
        {isLoading ? 'Procesando...' : 'Enviar'}
      </button>
    </form>
  );
}
