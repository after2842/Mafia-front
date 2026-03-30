import React from "react";
import { Skull, ShieldAlert, Search, Moon } from "lucide-react";

type EventVariant = "death" | "saved" | "investigate" | "nothing";

interface EventCardProps {
  variant: EventVariant;
  text: React.ReactNode;
}

const variantStyles = {
  death: {
    wrapper: "bg-white text-black",
    iconBox: "bg-red-500 border-black text-white",
    icon: Skull,
  },
  saved: {
    wrapper: "bg-white text-black",
    iconBox: "bg-amber-400 border-black text-black",
    icon: ShieldAlert,
  },
  investigate: {
    wrapper: "bg-white text-black",
    iconBox: "bg-blue-500 border-black text-white",
    icon: Search,
  },
  nothing: {
    wrapper: "bg-white text-black",
    iconBox: "bg-zinc-200 border-black text-black",
    icon: Moon,
  },
};

export function EventCard({ variant, text }: EventCardProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      className={`w-full sm:w-80 min-h-[6.5rem] p-4 relative rounded-xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-default flex items-center ${styles.wrapper}`}
    >
      <div className="flex items-center gap-4 w-full">
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${styles.iconBox}`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-sm font-bold text-black leading-snug uppercase tracking-wide flex-1">
          {text}
        </div>
      </div>
    </div>
  );
}
