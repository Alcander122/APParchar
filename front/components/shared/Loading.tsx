import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface LoadingProps {
  text?: string;
  className?: string;
}

export function Loading({ text = "Cargando parche...", className }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[200px] gap-3 text-zinc-400",
        className
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
