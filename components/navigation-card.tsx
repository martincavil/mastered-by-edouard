"use client";

import Link from "next/link";

interface NavigationCardProps {
  href: string;
  label: string;
  variant?: "default" | "accent";
}

export function NavigationCard({
  href,
  label,
  variant = "default",
}: NavigationCardProps) {
  const isAccent = variant === "accent";

  return (
    <div className="relative w-full flex">
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
        className={`navigation-link border-2 border-white flex items-center justify-center py-10 w-full font-bold text-4xl md:text-6xl 2xl:text-[80px] relative z-10 rounded-[8px] ${
          isAccent ? "send-files" : "text-white"
        }`}
      >
        <div className="nav-bg-hover" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    </div>
  );
}
