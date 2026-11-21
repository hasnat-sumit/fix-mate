"use client";

import type { ComponentProps, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { buildServicesHref } from "@/lib/services-url";

type ServicesSearchFormProps = Omit<ComponentProps<"form">, "action" | "method" | "onSubmit">;

function readField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : undefined;
}

/**
 * GET form for /services that navigates to a clean URL (no empty or default params).
 * Without JavaScript it falls back to a native GET submission.
 */
export function ServicesSearchForm({ children, ...props }: ServicesSearchFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Changing the search or filters always starts again from page 1.
    router.push(
      buildServicesHref({
        search: readField(formData, "search"),
        category: readField(formData, "category"),
        serviceMode: readField(formData, "serviceMode"),
        sort: readField(formData, "sort"),
      }),
    );
  }

  return (
    <form action="/services" method="get" onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
}
