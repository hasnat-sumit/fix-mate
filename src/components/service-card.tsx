import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { demoTechnicians, type PublicService } from "@/data/services";
import { Button } from "@/components/ui/button";

type ServiceCardProps = {
  service: PublicService;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const technician = demoTechnicians[service.technicianId];

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(20,44,60,0.1)]">
      <div className="relative h-[168px] overflow-hidden bg-muted">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-card/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-sm">
          {service.tag}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">{service.category}</p>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg font-bold leading-6 tracking-[-0.035em] text-foreground">{service.name}</h3>
          <span aria-label={`Sample rating ${service.rating.toFixed(1)} out of 5`} className="inline-flex shrink-0 items-center gap-1 rounded-md bg-warning/10 px-2 py-1 text-xs font-bold tabular-nums text-foreground">
            <Star aria-hidden="true" className="size-3.5 fill-warning text-warning" /> Sample {service.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-2 min-h-[42px] text-sm leading-[1.55] text-muted-foreground">{service.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Example starting price</p>
            <p className="mt-0.5 font-heading text-lg font-extrabold tracking-[-0.04em] text-foreground tabular-nums">${service.startingPrice}</p>
          </div>
          <p className="text-right text-xs leading-5 text-muted-foreground">
            <span className="block font-semibold text-foreground">Example provider · {technician.name}</span>
            {service.reviewCount} sample reviews
          </p>
        </div>
        <Button asChild variant="ghost" className="mt-4 h-10 w-full justify-between rounded-lg px-3 text-sm font-semibold text-primary hover:bg-secondary hover:text-primary">
          <Link href={`/services/${service.id}`}>
            View details <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
