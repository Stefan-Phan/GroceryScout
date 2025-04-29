import Link from "next/link";
import React from "react";

// import logo icons
import {
  MagnifyingGlassIcon,
  ClockIcon,
  ListBulletIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import NavbarItem from "./NavbarItem";

const Navbar = () => {
  return (
    <nav className="px-12 py-4 bg-gray-200">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-l md:text-xl lg:text-2xl tracking-widest font-bold text-gray-700"
          >
            G R O C E R Y S C O U T
          </Link>
        </div>

        {/* Right Section: Icons */}
        <div className="flex items-center space-x-4">
          <NavbarItem
            href="/search"
            icon={<MagnifyingGlassIcon className="h-6 w-6" />}
          />
          <NavbarItem
            href="/history"
            icon={<ClockIcon className="h-6 w-6" />}
          />
          <NavbarItem
            href="/shopping-list"
            icon={<ListBulletIcon className="h-6 w-6" />}
          />
          <NavbarItem
            href="/cart"
            icon={<ShoppingCartIcon className="h-6 w-6" />}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
