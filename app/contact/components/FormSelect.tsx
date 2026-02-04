import { ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  options: SelectOption[];
}

export function FormSelect({
  name,
  value,
  onChange,
  placeholder,
  options,
}: FormSelectProps) {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-white rounded-[10px] px-4 py-2 text-base 2xl:text-lg text-black appearance-none focus:ring-2 focus:ring-inset focus:ring-red outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
        size={20}
      />
    </div>
  );
}
