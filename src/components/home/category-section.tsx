import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { serviceCategories } from "@/data/services";

export function CategorySection() {
  return (
    <section id="categories" className="py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Find your fix"
            title="Expert help for the things you rely on."
            description="From a cracked screen to a refrigerator that needs care, find the right help for your home and devices."
          />
          <Link href="/services" className="mb-1 inline-flex w-fit items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-accent">
            Browse all services <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {serviceCategories.map((category, index) => (
            <CategoryCard key={category.name} category={category} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
