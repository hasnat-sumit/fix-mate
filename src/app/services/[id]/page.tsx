import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3, House, Info, LayoutGrid, MapPin, Store } from "lucide-react";
import { UserAvatar } from "@/components/auth/user-identity";
import { Container } from "@/components/container";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { ServiceImage } from "@/components/service-image";
import { ServiceRequestForm } from "@/components/services/service-request-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categoryHref } from "@/data/service-categories";
import { formatPrice } from "@/lib/format";
import { getService, getServices, type ServiceDetail } from "@/lib/services-api";

// Render the whole route statically from cached API data. IDs not built ahead of time are generated on
// their first request before the response starts, so notFound() still sends a real HTTP 404.
// Trade-off: the API must be reachable during `next build`.
export const ensureStatic = "navigation";

/** Never a real ID (not an ObjectId), so it renders the 404 page without calling the API. */
const PLACEHOLDER_ID = "__placeholder__";

export async function generateStaticParams() {
  const { items } = await getServices({ sort: "newest", limit: 24 });
  // ensureStatic requires at least one param; an empty catalog (e.g. a fresh database) uses a placeholder.
  return items.length > 0 ? items.map((service) => ({ id: service._id })) : [{ id: PLACEHOLDER_ID }];
}

export async function generateMetadata({ params }: PageProps<"/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (!service) return { title: "Service not found — FixMate" };

  return {
    title: `${service.title} — FixMate`,
    description: service.description.slice(0, 160),
  };
}

/** Same-category services first, then the newest others, excluding the current one. */
async function getRelatedServices(service: ServiceDetail, limit = 3) {
  const sameCategory = (await getServices({ category: service.category, limit: limit + 1 })).items;
  const related = sameCategory.filter((item) => item._id !== service._id);
  if (related.length >= limit) return related.slice(0, limit);

  const newest = (await getServices({ sort: "newest", limit: limit * 3 })).items;
  const extra = newest.filter((item) => item._id !== service._id && item.category !== service.category);
  return [...related, ...extra].slice(0, limit);
}

export default async function ServiceDetailsPage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  const service = await getService(id);

  // Missing, pending, rejected or unavailable services all render the Not Found page.
  if (!service) notFound();

  const { technician } = service;
  const relatedServices = await getRelatedServices(service);
  const ModeIcon = service.serviceMode === "Home Visit" ? House : Store;
  const facts = [
    { label: "Category", value: service.category, icon: LayoutGrid },
    { label: "Estimated duration", value: service.estimatedDuration, icon: Clock3 },
    { label: "Service mode", value: service.serviceMode, icon: ModeIcon },
    { label: "Service area", value: service.serviceArea, icon: MapPin },
  ];

  return (
    <>
      <PublicNavbar />
      <main id="main-content">
        <Container className="pt-8 sm:pt-10">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/services">Services</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={categoryHref(service.category)}>{service.category}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{service.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>

        <Container className="grid grid-cols-1 gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 lg:pb-20">
          <div className="min-w-0">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              <ServiceImage src={service.image} alt={service.title} preload sizes="(min-width: 1024px) 760px, 100vw" />
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-accent">{service.category}</p>
            <h1 className="mt-3 font-heading text-balance text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 whitespace-pre-line text-lg leading-8 text-foreground/85">{service.description}</p>

            <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {facts.map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-accent">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</dt>
                    <dd className="mt-1 font-semibold text-foreground">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <section aria-labelledby="technician-heading" className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 id="technician-heading" className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">
                Your technician
              </h2>
              <div className="mt-5 flex items-start gap-4">
                <UserAvatar name={technician.name} image={technician.image} className="size-16 rounded-2xl text-lg" />
                <div className="min-w-0">
                  <p className="font-heading font-bold text-foreground">{technician.name}</p>
                  {technician.area ? (
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-3.5" /> {technician.area}
                    </p>
                  ) : null}
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {technician.bio || "This technician hasn’t added a bio yet."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside aria-label="Pricing and repair request" className="lg:sticky lg:top-24 lg:self-start">
            <div id="request" className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_44px_rgba(20,44,60,0.08)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Starting price</p>
              <p className="mt-1 font-heading text-4xl font-extrabold tracking-[-0.05em] text-foreground tabular-nums">
                {formatPrice(service.basePrice)}
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                The technician sets the final amount when the job is done. You pay only after completion.
              </p>
              <div className="my-6 border-t border-border" />
              <ServiceRequestForm serviceId={service._id} serviceName={service.title} technicianEmail={service.technicianEmail} />
            </div>
          </aside>
        </Container>

        {relatedServices.length > 0 ? (
          <section aria-labelledby="related-heading" className="border-t border-border/70 bg-card py-16 sm:py-20">
            <Container>
              <SectionHeading id="related-heading" eyebrow="You might also need" title="Related services" />
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {relatedServices.map((related) => (
                  <ServiceCard key={related._id} service={related} />
                ))}
              </div>
            </Container>
          </section>
        ) : null}
      </main>
      <PublicFooter />
    </>
  );
}
