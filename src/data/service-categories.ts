// The seven service categories. Keep in sync with SERVICE_CATEGORIES in server/src/modules/services/services.model.ts.

export type IconName =
  | "smartphone"
  | "laptop"
  | "air-conditioning"
  | "appliance"
  | "television"
  | "electrical"
  | "other";

export type ServiceCategory = {
  name: string;
  icon: IconName;
  countLabel: string;
};

export const serviceCategories: ServiceCategory[] = [
  { name: "Smartphone", icon: "smartphone", countLabel: "Screen, battery & more" },
  { name: "Laptop & PC", icon: "laptop", countLabel: "Repairs & tune-ups" },
  { name: "Air Conditioning", icon: "air-conditioning", countLabel: "Cool, clean, efficient" },
  { name: "Home Appliances", icon: "appliance", countLabel: "Everyday essentials" },
  { name: "Television", icon: "television", countLabel: "Picture & sound" },
  { name: "Electrical Services", icon: "electrical", countLabel: "Safe home electrics" },
  { name: "Other Repairs", icon: "other", countLabel: "Tell us what you need" },
];

export function serviceCategorySlug(category: string) {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The category whose URL slug matches, if any (e.g. "laptop-and-pc" -> "Laptop & PC"). */
export function categoryFromSlug(slug: string) {
  return serviceCategories.find((category) => serviceCategorySlug(category.name) === slug);
}
