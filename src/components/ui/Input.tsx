import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none ${className}`}
    />
  );
}

