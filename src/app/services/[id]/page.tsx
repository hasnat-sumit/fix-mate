import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Info, MapPin } from "lucide-react";
import { Container } from "@/components/container";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { SectionHeading } from "@/components/section-heading";
import { isRemoteImage, ServiceCard } from "@/components/service-card";
import { ServiceRequestForm } from "@/components/services/service-request-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { serviceCategorySlug } from "@/data/service-categories";
import { formatPrice } from "@/lib/format";
import { getService, getServices, type ServiceDetail } from "@/lib/services-api";

// Render the whole route statically from cached API data. IDs not built ahead of time are generated on
// their first request before the response starts, so notFound() still sends a real HTTP 404.
// Trade-off: the API must be reachable during `next build`.
export const ensureStatic = "navigation";

/** Never a real ID (not an ObjectId), so it renders the 404 page without calling the API. */
const PLACEHOLDER_ID = "__placeholder__";

export async function generateStaticParams() {
  const { items } = await getServices({ sort: "featured", limit: 24 });
  // ensureStatic requires at least one param; an empty catalog (e.g. a fresh database) uses a placeholder.
  return items.length > 0 ? items.map((service) => ({ id: service.id })) : [{ id: PLACEHOLDER_ID }];
}

export async function generateMetadata({ params }: PageProps<"/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const service = await getService(id);

  if (!service) return { title: "Service not found — FixMate" };

  return {
    title: `${service.title} — FixMate`,
    description: service.description,
  };
}

/** Same-category services first, then featured services, excluding the current one. */
async function getRelatedServices(service: ServiceDetail, limit = 3) {
  const sameCategory = (await getServices({ category: service.category, limit: limit + 1 })).items;
  const related = sameCategory.filter((item) => item.id !== service.id);
  if (related.length >= limit) return related.slice(0, limit);

  const featured = (await getServices({ featured: true, limit: limit * 2 })).items;
  const extra = featured.filter((item) => item.id !== service.id && item.category !== service.category);
  return [...related, ...extra].slice(0, limit);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function ServiceDetailsPage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) notFound();

  const { technician } = service;
  const relatedServices = await getRelatedServices(service);
  const categoryHref = `/services?category=${serviceCategorySlug(service.category)}`;

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
                  <Link href={categoryHref}>{service.category}</Link>
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
              <Image
                src={service.image}
                alt={service.title}
                fill
                preload
                unoptimized={isRemoteImage(service.image)}
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover"
              />
              {service.isFeatured ? (
                <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-card/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-sm">
                  Featured
                </span>
              ) : null}
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-accent">{service.category}</p>
            <h1 className="mt-3 font-heading text-balance text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/85">{service.description}</p>
            {service.details ? <p className="mt-4 whitespace-pre-line text-base leading-7 text-muted-foreground">{service.details}</p> : null}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">What’s included</h2>
                {service.includes.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-foreground/85">
                        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">The technician confirms the exact scope with you before starting.</p>
                )}
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">Availability</h2>
                <p className="mt-4 flex items-start gap-2.5 text-sm leading-6 text-foreground/85">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                  {service.availability || "Agree a time with the technician when you request this service."}
                </p>
                <p className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                  <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  A final quote is confirmed with you after inspection, before any work begins.
                </p>
              </div>
            </div>

            <section aria-labelledby="technician-heading" className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 id="technician-heading" className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">
                Your technician
              </h2>
              <div className="mt-5 flex items-start gap-4">
                <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary font-heading text-lg font-extrabold text-accent">
                  {initials(technician.name)}
                </span>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-foreground">{technician.name}</p>
                  {technician.area ? (
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-3.5" /> {technician.area}
                    </p>
                  ) : null}
                  {technician.bio ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{technician.bio}</p> : null}
                </div>
              </div>
            </section>
          </div>

          <aside aria-label="Pricing and service request" className="lg:sticky lg:top-24 lg:self-start">
            <div id="request" className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_44px_rgba(20,44,60,0.08)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Starting price</p>
              <p className="mt-1 font-heading text-4xl font-extrabold tracking-[-0.05em] text-foreground tabular-nums">
                {formatPrice(service.price)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Pay after the repair is complete.</p>
              <div className="my-6 border-t border-border" />
              <h2 className="mb-4 font-heading text-lg font-bold tracking-[-0.03em] text-foreground">Request this service</h2>
              <ServiceRequestForm serviceId={service.id} serviceName={service.title} />
            </div>
          </aside>
        </Container>

        {relatedServices.length > 0 ? (
          <section aria-labelledby="related-heading" className="border-t border-border/70 bg-card py-16 sm:py-20">
            <Container>
              <SectionHeading id="related-heading" eyebrow="You might also need" title="Related services" />
              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                {relatedServices.map((related) => (
                  <ServiceCard key={related.id} service={related} />
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
