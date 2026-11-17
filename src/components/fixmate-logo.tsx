import Link from "next/link";
import { Wrench } from "lucide-react";

type FixMateLogoProps = {
  light?: boolean;
};

export function FixMateLogo({ light = false }: FixMateLogoProps) {
  return (
    <Link
      href="#home"
      className={`group inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 ${light ? "text-white" : "text-foreground"}`}
      aria-label="FixMate home"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm transition-transform group-hover:-rotate-6">
        <Wrench aria-hidden="true" className="size-[19px]" strokeWidth={2.4} />
      </span>
      <span className="font-heading text-[1.35rem] font-extrabold tracking-[-0.06em]">
        Fix<span className={light ? "text-hero-highlight" : "text-accent"}>Mate</span>
      </span>
    </Link>
  );
}
