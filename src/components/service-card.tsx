import Link from "next/link";
import { ArrowRight, House, MapPin, Store, UserRound } from "lucide-react";
import { ServiceImage } from "@/components/service-image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { Service } from "@/lib/services-api";

type ServiceCardProps = {
  service: Service;
};

/** Equal-height service card: image, title, category, mode, area, starting price, technician and View Details. */
export function ServiceCard({ service }: ServiceCardProps) {
  const ModeIcon = service.serviceMode === "Home Visit" ? House : Store;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(20,44,60,0.1)]">
      <div className="relative h-[180px] shrink-0 overflow-hidden bg-muted">
        {/* Decorative: the service title right below describes the card. */}
        <ServiceImage
          src={service.image}
          alt=""
          sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-card/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-sm">
          {service.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="line-clamp-2 min-h-12 font-heading text-lg font-bold leading-6 tracking-[-0.035em] text-foreground">{service.title}</h3>
        <ul className="mb-5 mt-3 space-y-1.5 text-xs leading-5 text-muted-foreground">
          <li className="flex items-center gap-2">
            <ModeIcon aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
            {service.serviceMode}
          </li>
          <li className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
            <span className="truncate">{service.serviceArea}</span>
          </li>
          <li className="flex items-center gap-2">
            <UserRound aria-hidden="true" className="size-3.5 shrink-0 text-accent" />
            <span className="truncate">
              <span className="font-semibold text-foreground">{service.technicianName}</span>
            </span>
          </li>
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-4">
          <div>
            <p className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Starting price</p>
            <p className="mt-0.5 whitespace-nowrap font-heading text-lg font-extrabold tracking-[-0.04em] text-foreground tabular-nums">
              {formatPrice(service.basePrice)}
            </p>
          </div>
          <Button asChild variant="ghost" className="h-11 shrink-0 gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-secondary hover:text-primary">
            <Link href={`/services/${service._id}`} aria-label={`View details for ${service.title}`}>
              View Details <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
