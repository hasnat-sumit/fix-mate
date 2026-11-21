import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryHref, type ServiceCategory } from "@/data/service-categories";
import { RepairIcon } from "@/components/repair-icon";

type CategoryCardProps = {
  category: ServiceCategory;
  index: number;
};

export function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <Link
      href={categoryHref(category.name)}
      className="group flex min-h-[158px] flex-col rounded-2xl border border-border/90 bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_14px_36px_rgba(20,44,60,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="mb-5 flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <RepairIcon name={category.icon} className="size-[21px]" />
        </span>
        <span className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground/70">0{index + 1}</span>
      </div>
      <span className="font-heading text-[15px] font-bold tracking-[-0.025em] text-foreground">{category.name}</span>
      <span className="mt-1 text-xs leading-5 text-muted-foreground">{category.countLabel}</span>
      <ArrowUpRight aria-hidden="true" className="ml-auto mt-[-17px] size-4 text-muted-foreground/50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
    </Link>
  );
}
