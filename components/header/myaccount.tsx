"use client";
import { logout } from "@/actions/logout";
import { Bell, Heart, LogOut, Package, User, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const MyAccount = () => {
  const router = useRouter();
  const handleLogout = () => {
    // 🔍 You can route to a search page or filter products
    logout().then(() => router.push("/auth/login"));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserCircle className="h-7 w-7 mt-2 cursor-pointer hover:text-gray-300" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 p-2">
        <DropdownMenuItem onClick={() => window.location.assign("/profile")}>
          <User />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.assign("/orders")}>
          <Package />
          <span>Orders</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.location.assign("/wishlist")}>
          <Heart />
          <span>Wishlist</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => window.location.assign("/notifications")}
        >
          <Bell />
          <span>Notifications</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="h-7 w-7 mt-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MyAccount;
