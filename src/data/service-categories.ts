// The seven service categories. Keep in sync with SERVICE_CATEGORIES in fixmate-server: src/modules/services/services.model.ts.

export type IconName = "smartphone" | "laptop" | "air-conditioning" | "refrigerator" | "television" | "washing-machine" | "electrical";

export const serviceCategoryNames = ["Smartphone", "Laptop & PC", "AC", "Refrigerator", "TV", "Washing Machine", "Electrical"] as const;
export type ServiceCategoryName = (typeof serviceCategoryNames)[number];

export const serviceModes = ["Home Visit", "Shop Drop-off"] as const;
export type ServiceMode = (typeof serviceModes)[number];

export type ServiceCategory = {
  name: ServiceCategoryName;
  icon: IconName;
  countLabel: string;
};

export const serviceCategories: ServiceCategory[] = [
  { name: "Smartphone", icon: "smartphone", countLabel: "Screen, battery & port" },
  { name: "Laptop & PC", icon: "laptop", countLabel: "Repairs & tune-ups" },
  { name: "AC", icon: "air-conditioning", countLabel: "Servicing & gas refill" },
  { name: "Refrigerator", icon: "refrigerator", countLabel: "Cooling & gas charging" },
  { name: "TV", icon: "television", countLabel: "Display, power & mounting" },
  { name: "Washing Machine", icon: "washing-machine", countLabel: "Drum, motor & drain" },
  { name: "Electrical", icon: "electrical", countLabel: "Wiring & fittings" },
];

export function isServiceCategory(value: string | undefined): value is ServiceCategoryName {
  return serviceCategoryNames.some((name) => name === value);
}

export function isServiceMode(value: string | undefined): value is ServiceMode {
  return serviceModes.some((mode) => mode === value);
}

/** The /services URL pre-filtered to one category, e.g. /services?category=AC. */
export function categoryHref(category: ServiceCategoryName) {
  return `/services?${new URLSearchParams({ category }).toString()}`;
}
