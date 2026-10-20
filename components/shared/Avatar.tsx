import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  const initials = (name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 overflow-hidden shrink-0",
        sizeMap[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={name || "Avatar"} fill className="object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
