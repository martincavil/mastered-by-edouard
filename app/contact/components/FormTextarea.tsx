import { ChangeEvent } from "react";

interface FormTextareaProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  error?: string;
  required?: boolean;
}

export function FormTextarea({
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
}: FormTextareaProps) {
  return (
    <div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black placeholder-black h-16 resize-none focus:ring-2 focus:ring-inset focus:ring-red outline-none ${
          error ? "ring-2 ring-inset ring-red" : ""
        }`}
        required={required}
      />
      {error && (
        <p className="text-red text-sm 2xl:text-base mt-1 font-poppins">
          {error}
        </p>
      )}
    </div>
  );
}
