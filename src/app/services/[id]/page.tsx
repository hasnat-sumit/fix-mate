import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Info, UserRound } from "lucide-react";
import { Container } from "@/components/container";
import { PublicFooter } from "@/components/public-footer";
import { PublicNavbar } from "@/components/public-navbar";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { ServiceRequestForm } from "@/components/services/service-request-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { demoTechnicians, getRelatedServices, getServiceById, serviceCategorySlug, services } from "@/data/services";

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }: PageProps<"/services/[id]">): Promise<Metadata> {
  const { id } = await params;
  const service = getServiceById(id);

  if (!service) return { title: "Service not found — FixMate" };

  return {
    title: `${service.name} — FixMate`,
    description: service.description,
  };
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
  const service = getServiceById(id);

  if (!service) notFound();

  const technician = demoTechnicians[service.technicianId];
  const relatedServices = getRelatedServices(service);
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
                <BreadcrumbPage className="font-medium">{service.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>

        <Container className="grid grid-cols-1 gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 lg:pb-20">
          <div className="min-w-0">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                preload
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-card/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground shadow-sm backdrop-blur-sm">
                {service.tag}
              </span>
            </div>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-accent">{service.category}</p>
            <h1 className="mt-3 font-heading text-balance text-3xl font-extrabold tracking-[-0.055em] text-foreground sm:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/85">{service.description}</p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{service.details}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">What’s included</h2>
                <ul className="mt-4 space-y-3">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-foreground/85">
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <h2 className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">Availability</h2>
                <p className="mt-4 flex items-start gap-2.5 text-sm leading-6 text-foreground/85">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                  {service.availability}
                </p>
                <p className="mt-3 flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                  <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  A final quote is confirmed with you after inspection, before any work begins.
                </p>
              </div>
            </div>

            <section aria-labelledby="technician-heading" className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="technician-heading" className="font-heading text-lg font-bold tracking-[-0.03em] text-foreground">
                  Your technician
                </h2>
                <span className="rounded-full bg-warning/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">
                  Sample profile
                </span>
              </div>
              <div className="mt-5 flex items-start gap-4">
                <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary font-heading text-lg font-extrabold text-accent">
                  {initials(technician.name)}
                </span>
                <div className="min-w-0">
                  <p className="font-heading font-bold text-foreground">{technician.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <UserRound aria-hidden="true" className="size-3.5" /> Experience: {technician.experience}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{technician.bio}</p>
                </div>
              </div>
              <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
                Technician names, experience and biographies are mock data for this frontend preview and do not describe real people.
              </p>
            </section>
          </div>

          <aside aria-label="Pricing and service request" className="lg:sticky lg:top-24 lg:self-start">
            <div id="request" className="rounded-2xl border border-border bg-card p-5 shadow-[0_18px_44px_rgba(20,44,60,0.08)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Example starting price</p>
              <p className="mt-1 font-heading text-4xl font-extrabold tracking-[-0.05em] text-foreground tabular-nums">
                ${service.startingPrice}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Pay after the repair is complete.</p>
              <div className="my-6 border-t border-border" />
              <h2 className="mb-4 font-heading text-lg font-bold tracking-[-0.03em] text-foreground">Request this service</h2>
              <ServiceRequestForm serviceName={service.name} />
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
