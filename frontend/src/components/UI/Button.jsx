import { memo } from "react";

const Button = memo(
  ({
    children,
    type = "button",
    variant = "primary",
    onClick,
    disabled = false,
    className = "",
    ...props
  }) => {
    const variatClass = {
      primary:
        "px-4 py-2 font-semibold text-white rounded-md transition duration-300 bg-blue-600 hover:bg-blue-800",
      secondary:
        "px-4 py-2  text-black bg-gray-300 rounded-md transition duration-300 hover:bg-gray-700",
      secondary1:
        "px-4 py-2  text-blue-600 bg-white rounded-md transition duration-300 hover:bg-gray-300",
      secondary2:
        "px-4 py-2  text-white bg-blue-500 rounded-md transition duration-300 hover:bg-blue-800  border-2 border-white inline-block",
    };
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${variatClass[variant]} ${className}`}
        {...props}>
        {children}
      </button>
    );
  }
);

export default Button;
