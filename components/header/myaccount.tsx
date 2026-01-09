"use client";
import { logout } from "@/actions/auth/logout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bell, Heart, LogOut, Package, User, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const MyAccount = () => {
  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <UserCircle className="h-7 w-7 mt-2 cursor-pointer hover:text-gray-300" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 p-2">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/orders">
                <Package />
                <span>Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/wishlist">
                <Heart />
                <span>Wishlist</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications">
                <Bell />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to logout?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <form action={logout}>
              <AlertDialogAction asChild>
                <Button type="submit">Yes, Logout</Button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyAccount;
