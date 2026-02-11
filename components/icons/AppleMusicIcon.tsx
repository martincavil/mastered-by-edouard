interface AppleMusicIconProps {
  size?: number;
  className?: string;
}

export function AppleMusicIcon({
  size = 32,
  className = "",
}: AppleMusicIconProps) {
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
        d="M25.5 8.5V19.5C25.5 21.7091 23.7091 23.5 21.5 23.5C19.2909 23.5 17.5 21.7091 17.5 19.5C17.5 17.2909 19.2909 15.5 21.5 15.5C22.163 15.5 22.7891 15.663 23.3333 15.9552V10.8333L13.5 12.6667V23.5C13.5 25.7091 11.7091 27.5 9.5 27.5C7.29086 27.5 5.5 25.7091 5.5 23.5C5.5 21.2909 7.29086 19.5 9.5 19.5C10.163 19.5 10.7891 19.663 11.3333 19.9552V11L25.5 8.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
