import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
      <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.18em]", light ? "text-accent" : "text-accent")}>
        {eyebrow}
      </p>
      <h2 className={cn("font-heading text-balance text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-[2.7rem] lg:leading-[1.13]", light ? "text-white" : "text-foreground")}>
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-4 text-base leading-7 sm:text-lg", light ? "text-white/65" : "text-muted-foreground")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
