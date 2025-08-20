import React from "react";

interface CardProps {
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  padding?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  className = "",
  children,
  onClick,
}) => {
  const baseClasses = "bg-white rounded-lg shadow-md border border-gray-200";

  const variantClasses = {
    default: "",
    primary: "border-[#228BE6]/20 bg-[#228BE6]/5",
    success: "border-green-200 bg-green-50",
    warning: "border-yellow-200 bg-yellow-50",
    danger: "border-red-200 bg-red-50",
  };

  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

  return (
    <div
      className={classes}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
