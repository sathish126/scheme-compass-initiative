
import React from "react";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  className = "",
  text = "Loading...",
}) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-healthcare-600 ${sizeClasses[size]}`}></div>
      {text && <p className="ml-3 text-healthcare-800">{text}</p>}
    </div>
  );
};

export default Loading;
