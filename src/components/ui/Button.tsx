import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  loading?: boolean;
  fullWidth?: boolean;
  children? : React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-[#228BE6] text-white hover:bg-[#1E7BC8] focus:ring-[#228BE6]",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-600",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const widthClasses = fullWidth ? "w-full" : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span>{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
