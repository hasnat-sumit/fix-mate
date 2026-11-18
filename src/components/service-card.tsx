import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Star, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { ServiceSummary } from "@/lib/services-api";

type ServiceCardProps = {
  service: ServiceSummary;
};

/**
 * Technician-supplied images are arbitrary https URLs, so they bypass the image optimizer
 * (which would otherwise act as an open proxy for any host). Bundled /images/ files are optimized.
 */
export function isRemoteImage(src: string) {
  return src.startsWith("https://");
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(20,44,60,0.1)]">
      <div className="relative h-[168px] overflow-hidden bg-muted">
        {/* Decorative: the service title right below describes the card. */}
        <Image
          src={service.image}
          alt=""
          fill
          unoptimized={isRemoteImage(service.image)}
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {service.isFeatured ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-card/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-sm">
            Featured
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-accent">{service.category}</p>
        <h3 className="font-heading text-lg font-bold leading-6 tracking-[-0.035em] text-foreground">{service.title}</h3>
        <p className="mt-2 min-h-[42px] text-sm leading-[1.55] text-muted-foreground">{service.description}</p>
        <ul className="mb-5 mt-3 space-y-1.5 text-xs leading-5 text-muted-foreground">
          {service.availability ? (
            <li className="flex items-start gap-2">
              <CalendarDays aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-accent" />
              {service.availability}
            </li>
          ) : null}
          <li className="flex items-start gap-2">
            <UserRound aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-accent" />
            <span>
              Technician · <span className="font-semibold text-foreground">{service.technician.name}</span>
            </span>
          </li>
          {service.reviewCount > 0 ? (
            <li className="flex items-start gap-2">
              <Star aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 fill-warning text-warning" />
              <span>
                <span className="font-semibold text-foreground tabular-nums">{service.ratingAverage.toFixed(1)}</span>{" "}
                ({service.reviewCount} {service.reviewCount === 1 ? "review" : "reviews"})
              </span>
            </li>
          ) : null}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Starting price</p>
            <p className="mt-0.5 whitespace-nowrap font-heading text-lg font-extrabold tracking-[-0.04em] text-foreground tabular-nums">
              <span className="mr-1 font-sans text-xs font-semibold tracking-normal text-muted-foreground">from</span>
              {formatPrice(service.price)}
            </p>
          </div>
          <Button asChild variant="ghost" className="h-11 shrink-0 gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-secondary hover:text-primary">
            <Link href={`/services/${service.id}`} aria-label={`View details for ${service.title}`}>
              View details <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
