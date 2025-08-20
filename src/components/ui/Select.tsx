import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: string;
  helpText?: string;
  error?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({
  label,
  icon,
  helpText,
  error,
  children,
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
        <select
          className={`
            block w-full px-3 py-2 border border-gray-300 rounded-md 
            focus:outline-none focus:ring-2 focus:ring-[#228BE6] focus:border-[#228BE6]
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            appearance-none bg-white
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
