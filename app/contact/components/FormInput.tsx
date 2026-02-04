import { ChangeEvent } from "react";

interface FormInputProps {
  type?: "text" | "email" | "tel" | "number";
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
  min?: string;
}

export function FormInput({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  min,
}: FormInputProps) {
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
          error ? "ring-2 ring-inset ring-red" : ""
        }`}
        required={required}
        min={min}
      />
      {error && (
        <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
          {error}
        </p>
      )}
    </div>
  );
}
