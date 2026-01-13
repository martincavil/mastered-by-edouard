"use client";

import Link from "next/link";
import "../app/navigation-link.css";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "default" | "accent" | "custom";
  className?: string;
  type?: "button" | "submit" | "reset";
  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  borderColor?: string;
}

export function Button({
  href,
  onClick,
  children,
  variant = "default",
  className = "",
  type = "button",
  bgColor,
  hoverBgColor,
  textColor,
  hoverTextColor,
  borderColor,
}: ButtonProps) {
  const isAccent = variant === "accent";
  const isCustom = variant === "custom";

  // Custom variant with inline styles
  if (isCustom && (bgColor || hoverBgColor || textColor || hoverTextColor)) {
    const customStyles = {
      backgroundColor: bgColor,
      color: textColor,
      borderColor: borderColor || "transparent",
    };

    const content = (
      <>
        <div
          className="nav-bg-hover"
          aria-hidden="true"
          style={{
            backgroundColor: hoverBgColor,
          }}
        />
        <span
          style={{
            "--hover-text-color": hoverTextColor,
          } as React.CSSProperties}
          className="[.navigation-link:hover_&]:text-[var(--hover-text-color)]"
        >
          {children}
        </span>
      </>
    );

    const baseClasses = `navigation-link border-2 flex items-center justify-center px-8 py-4 font-bold text-lg relative rounded-[8px] ${className}`;

    if (href) {
      return (
        <Link href={href} className={baseClasses} style={customStyles}>
          {content}
        </Link>
      );
    }

    return (
      <button
        type={type}
        onClick={onClick}
        className={baseClasses}
        style={customStyles}
      >
        {content}
      </button>
    );
  }

  // Default and accent variants
  const baseClasses = `navigation-link border-2 flex items-center justify-center px-8 py-4 font-bold text-lg relative rounded-[8px] ${
    isAccent ? "send-files border-transparent" : "border-black text-white"
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <div className="nav-bg-hover" aria-hidden="true" />
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      <div className="nav-bg-hover" aria-hidden="true" />
      <span>{children}</span>
    </button>
  );
}
