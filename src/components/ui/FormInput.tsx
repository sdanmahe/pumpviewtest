// src/components/ui/FormInput.tsx
import React from 'react';
import { Input } from './input';
import { Label } from './label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  icon, 
  error, 
  id, 
  required,
  placeholder,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-3">{icon}</div>}
        <Input
          id={inputId}
          className={icon ? "pl-9" : ""}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          required={required}
          title={placeholder || `Enter ${label.toLowerCase()}`}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};