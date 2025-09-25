"use client";

import { Header } from "@/components/auth/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
}

export const CardWrapper = ({ children, headerLabel }: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-none sm:shadow-md border-0 sm:border">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
