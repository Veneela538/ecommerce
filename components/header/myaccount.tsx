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
import { useDictionary } from "@/context/dictionary-context";
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

type props = {
  role?: string;
};

const MyAccount = ({ role }: props) => {
  const dict = useDictionary();
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
                <span>{dict.header.myAccount.profile}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/orders">
                <Package />
                <span>{dict.header.myAccount.orders}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/wishlist">
                <Heart />
                <span>{dict.header.myAccount.wishlist}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications">
                <Bell />
                <span>{dict.header.myAccount.notifications}</span>
              </Link>
            </DropdownMenuItem>
            {!(role === "CUSTOMER") && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/addProduct">
                    <Heart />
                    <span>{dict.header.myAccount.wishlist}</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>
                <LogOut className="h-5 w-5" />
                <span>{dict.header.myAccount.logout.title}</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {dict.header.myAccount.logout.alertDialog.title}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {dict.header.myAccount.logout.alertDialog.cancel}
            </AlertDialogCancel>
            <form action={logout}>
              <AlertDialogAction asChild>
                <Button type="submit">
                  {dict.header.myAccount.logout.alertDialog.submit}
                </Button>
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyAccount;
