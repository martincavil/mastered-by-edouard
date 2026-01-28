interface ArrowUpRightProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function ArrowUpRight({
  size = 24,
  className = "",
  strokeWidth = 2,
}: ArrowUpRightProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.41406 21L21.4141 1M21.4141 1V16.7895M21.4141 1H6.02945"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
      />
    </svg>
  );
}
