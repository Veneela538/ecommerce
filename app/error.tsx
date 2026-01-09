"use client";
import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/context/dictionary-context";

export default function Error() {
  const dict = useDictionary();
  const time = `${new Date()
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-")} ${new Date().toLocaleTimeString("en-GB", {
    hour12: false,
  })}`;

  return (
    <div className="flex flex-col h-full items-center justify-center space-y-4">
      <div className="max-w-lg p-6 text-left border rounded-lg grid gap-4">
        <Heading variant={"h2"}>{dict.common.somethingWentWrong}</Heading>
        <span className="block text-gray-500">{time}</span>
        <p>{dict.common.pageLoadError}</p>
        <Button
          onClick={() => {
            window.location.reload();
          }}
        >
          {dict.common.tryAgain}
        </Button>
      </div>
    </div>
  );
}
