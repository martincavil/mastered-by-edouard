interface TidalIconProps {
  size?: number;
  className?: string;
}

export function TidalIcon({
  size = 32,
  className = "",
}: TidalIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 8L20 12L16 16L12 12L16 8Z"
        fill="currentColor"
      />
      <path
        d="M12 16L16 20L12 24L8 20L12 16Z"
        fill="currentColor"
      />
      <path
        d="M20 16L24 20L20 24L16 20L20 16Z"
        fill="currentColor"
      />
    </svg>
  );
}
