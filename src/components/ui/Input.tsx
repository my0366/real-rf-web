import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  helpText?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  icon,
  helpText,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        <input
          className={`
            block w-full px-3 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-[#228BE6] focus:border-[#228BE6]
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
