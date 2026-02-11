interface SpotifyIconProps {
  size?: number;
  className?: string;
}

export function SpotifyIcon({
  size = 32,
  className = "",
}: SpotifyIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="16"
        cy="16"
        r="11"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 13C10 13 12.5 11.5 16 11.5C19.5 11.5 22 13 22 13M10.5 16.5C10.5 16.5 12.5 15.5 16 15.5C19.5 15.5 21.5 16.5 21.5 16.5M11.5 20C11.5 20 13 19.5 16 19.5C19 19.5 20.5 20 20.5 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
