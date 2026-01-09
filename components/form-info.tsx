import { Info } from "lucide-react";

interface FormInfoProps {
  message?: string;
}

export const FormInfo = ({ message }: FormInfoProps) => {
  if (!message) return null;

  return (
    <div className="bg-violet-300/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-violet-500 border border-violet-500">
      <Info className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
