interface DeezerIconProps {
  size?: number;
  className?: string;
}

export function DeezerIcon({
  size = 32,
  className = "",
}: DeezerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="6" y="18" width="4" height="8" fill="currentColor" />
      <rect x="11" y="14" width="4" height="12" fill="currentColor" />
      <rect x="16" y="10" width="4" height="16" fill="currentColor" />
      <rect x="21" y="14" width="4" height="12" fill="currentColor" />
    </svg>
  );
}
