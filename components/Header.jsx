"use client";

import useUser from "@/hooks/useUser";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut } from "lucide-react";

const Header = () => {
  const { currentUser: user } = useUser();
  const fullName = user?.user_metadata?.full_name;
  const username = fullName?.split(" ")[0];
  const avatarUrl = user?.user_metadata?.avatar_url;

  function getInitials(full_name) {
    if (!full_name) return ""; // Handle case where full_name is undefined

    // Split the full name by spaces
    const nameParts = full_name.split(" ");

    // Ensure nameParts has at least one element
    if (nameParts.length === 0) return "";

    // Get the first letter of the first name (if exists)
    const firstInitial = nameParts[0]?.charAt(0) || "";

    // Get the first letter of the last name (if exists)
    const lastInitial = nameParts[nameParts.length - 1]?.charAt(0) || "";

    // Combine both initials
    const initials = firstInitial + lastInitial;

    return initials.toUpperCase(); // Ensure initials are uppercase
  }

  // console.log(user);
  return (
    <div className="w-full border-b border-white/5 sticky top-0 bg-black z-50 bg-opacity-20 filter backdrop-blur-lg px-6 py-3">
      {/* Logo */}
      <nav className="space-x-6 flex items-center justify-between text-white">
        <Link href={"/"}>
          <div className="font-bold">Analytics</div>
        </Link>

        <div className="flex items-center space-x-4">
          <p className="text-sm text-white/60 hover:text-white smooth">
            Snippet
          </p>
          <Link prefetch href="/dashboard">
            Dashboard
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white outline-none border-none ">
              <div className="flex items-center">
                <p>{user?.user_metadata?.full_name.split(" ")[0]}</p>
                {/* <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
                </Avatar> */}
                <img
                  src={avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0a0a0a] text-white border-white/5 outline-none bg-opacity-20 backdrop-blur-md filter">
              <DropdownMenuLabel>{username}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Docs</DropdownMenuItem>
              <DropdownMenuItem>My API</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/settings"}>Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </div>
  );
};

export default Header;
