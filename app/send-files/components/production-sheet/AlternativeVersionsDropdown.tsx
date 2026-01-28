"use client";

interface AlternativeVersionsDropdownProps {
  label: string;
  selectedVersions: string[];
  isOpen: boolean;
  onToggle: () => void;
  onVersionToggle: (version: string) => void;
}

const VERSIONS = ["instrumental", "a capella", "pbo", "radio edit", "other"];

export function AlternativeVersionsDropdown({
  label,
  selectedVersions,
  isOpen,
  onToggle,
  onVersionToggle,
}: AlternativeVersionsDropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`px-4 py-2 rounded-full border text-sm transition-colors flex items-center gap-2 ${
          selectedVersions.length > 0
            ? "bg-black text-white border-black"
            : "bg-white text-black border-black"
        }`}
      >
        {label}
        {selectedVersions.length > 0 ? (
          <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {selectedVersions.length}
          </span>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-black rounded-lg p-2 min-w-[200px] z-10 shadow-lg">
          {VERSIONS.map((version) => (
            <label
              key={version}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedVersions.includes(version)}
                onChange={() => onVersionToggle(version)}
                className="w-4 h-4"
              />
              <span className="text-sm text-black">{version}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
