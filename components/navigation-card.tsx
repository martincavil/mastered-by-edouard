"use client";

import Link from "next/link";

interface NavigationCardProps {
  href: string;
  label: string;
  variant?: "default" | "accent";
  className?: string;
}

export function NavigationCard({
  href,
  label,
  variant = "default",
  className = "",
}: NavigationCardProps) {
  const isAccent = variant === "accent";

  return (
    <div className={`relative w-full flex ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full rounded-[8px] ${
          isAccent ? "bg-red" : ""
        }`}
        style={{
          backdropFilter: "blur(24.21px)",
          WebkitBackdropFilter: "blur(24.21px)",
        }}
      />
      <Link
        href={href}
        className={`border  flex items-center justify-center py-4 md:py-10 w-full font-bold text-2xl md:text-4xl lg:text-5xl xl:text-7xl 2xl:text-[80px] relative z-10 rounded-[8px] transition-colors duration-300 ${
          isAccent
            ? "bg-red text-red-dark hover:bg-red-dark hover:text-red border-red hover:border-red-dark"
            : "text-white border-white hover:bg-white hover:text-black"
        }`}
      >
        {label}
      </Link>
    </div>
  );
}
