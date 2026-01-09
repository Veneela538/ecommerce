import Link from "next/link";

import { Heading } from "@/components/heading";
import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const dict = await getDictionary("en");

  return (
    <div className="flex h-screen items-center justify-center container">
      <div className="w-full md:w-1/3 flex flex-col space-y-4">
        <Heading variant={"h1"} className="font-normal">
          {dict.notFound.title}
        </Heading>
        <Heading variant={"h5"} className="font-normal">
          {dict.notFound.subTitle}
        </Heading>
        <Link
          href="/review"
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          {dict.notFound.action}
        </Link>
      </div>
    </div>
  );
}
