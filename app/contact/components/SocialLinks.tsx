import Image from "next/image";

interface SocialLink {
  href: string;
  label: string;
  icon: string;
  alt: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://www.instagram.com/masteredbyedouard/",
    label: "Instagram",
    icon: "/svg/instagram-logo.svg",
    alt: "Instagram",
  },
  {
    href: "https://www.linkedin.com/in/edouard-carbonne/",
    label: "LinkedIn",
    icon: "/svg/linkedin-logo.svg",
    alt: "LinkedIn",
  },
  {
    href: "https://www.facebook.com/masteredbyedouard",
    label: "Facebook",
    icon: "/svg/facebook-logo.svg",
    alt: "Facebook",
  },
  {
    href: "https://wa.me/+33695822071",
    label: "WhatsApp",
    icon: "/svg/whatsapp-logo.svg",
    alt: "WhatsApp",
  },
];

export function SocialLinks() {
  return (
    <div className="flex gap-3 md:gap-3 xl:gap-4 mb-6 md:mb-3 2xl:mb-10">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-white rounded-full px-6 py-2 hover:bg-white hover:scale-105 ml-0.5 transition-all duration-500"
          aria-label={link.label}
        >
          <Image
            width={28}
            height={28}
            src={link.icon}
            alt={link.alt}
            className="w-5 h-5 md:w-6 md:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8 brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-300"
          />
        </a>
      ))}
    </div>
  );
}
