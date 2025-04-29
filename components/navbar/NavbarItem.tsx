import Link from "next/link";
import React from "react";

interface NavbarItemProps {
  href: string;
  icon: React.ReactElement;
}

export default function NavbarItem({ href, icon }: NavbarItemProps) {
  return (
    <Link
      href={href}
      className="group relative text-gray-700 hover:text-gray-900 transition-colors duration-300"
    >
      {icon}
      <span className="absolute left-0 bottom-[-8px] w-full h-[2px] bg-emerald-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
    </Link>
  );
}
