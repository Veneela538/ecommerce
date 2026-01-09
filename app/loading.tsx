import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="h-full">
      <main className="flex items-center justify-center container h-[calc(100vh-64px)]">
        <LoaderCircle className="w-16 h-16 animate-spin text-primary" />
      </main>
    </div>
  );
};

export default Loading;
