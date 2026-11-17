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

export type FeaturedService = {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  technician: string;
  rating: number;
  reviewCount: number;
  image: string;
  imageAlt: string;
  tag: string;
};

export type RepairStep = {
  number: string;
  title: string;
  description: string;
  icon: "search" | "clipboard" | "wrench" | "credit-card";
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

export const featuredServices: FeaturedService[] = [
  {
    id: "phone-screen-replacement",
    name: "Phone screen replacement",
    description: "A clean, precise screen repair with quality tested parts.",
    startingPrice: 49,
    technician: "Amira Chen",
    rating: 4.9,
    reviewCount: 128,
    image: "/images/smartphone-screen-repair.webp",
    imageAlt: "Technician repairing a smartphone with a precision screwdriver",
    tag: "Most requested",
  },
  {
    id: "laptop-diagnostic",
    name: "Laptop diagnostic & tune-up",
    description: "Get to the root of slowdowns, heat and unexpected crashes.",
    startingPrice: 39,
    technician: "Daniel Foster",
    rating: 4.8,
    reviewCount: 94,
    image: "/images/laptop-repair.webp",
    imageAlt: "Technician carefully working on an open laptop",
    tag: "Same-day slots",
  },
  {
    id: "ac-maintenance",
    name: "Air conditioner service",
    description: "Seasonal cleaning and performance checks for a cooler home.",
    startingPrice: 69,
    technician: "Rafiq Hasan",
    rating: 5.0,
    reviewCount: 76,
    image: "/images/air-conditioner-service.webp",
    imageAlt: "Technician servicing a wall-mounted air conditioner",
    tag: "Home comfort",
  },
  {
    id: "refrigerator-maintenance",
    name: "Refrigerator maintenance",
    description: "Routine care to keep your refrigerator clean and running well.",
    startingPrice: 55,
    technician: "Priya Nair",
    rating: 4.9,
    reviewCount: 112,
    image: "/images/refrigerator-maintenance.webp",
    imageAlt: "Hands cleaning a stainless steel refrigerator",
    tag: "Trusted locally",
  },
  {
    id: "television-repair",
    name: "TV troubleshooting",
    description: "Restore the picture, sound and connections you rely on.",
    startingPrice: 45,
    technician: "Mateo Alvarez",
    rating: 4.8,
    reviewCount: 63,
    image: "/images/television-repair.webp",
    imageAlt: "Technician repairing the internal components of a television",
    tag: "Clear diagnosis",
  },
  {
    id: "home-electrical-check",
    name: "Home electrical check",
    description: "A careful inspection of outlets, switches and lighting.",
    startingPrice: 59,
    technician: "Grace Okafor",
    rating: 4.9,
    reviewCount: 87,
    image: "/images/electrical-service.webp",
    imageAlt: "Electrician safely inspecting an electrical control panel",
    tag: "Safety first",
  },
];

export const repairSteps: RepairStep[] = [
  {
    number: "01",
    title: "Find a service",
    description: "Choose the device or home service that needs attention.",
    icon: "search",
  },
  {
    number: "02",
    title: "Send a request",
    description: "Tell us a little about the issue and choose a convenient time.",
    icon: "clipboard",
  },
  {
    number: "03",
    title: "Get it repaired",
    description: "A verified technician keeps you informed as they work.",
    icon: "wrench",
  },
  {
    number: "04",
    title: "Pay after completion",
    description: "Review the finished repair, then pay securely.",
    icon: "credit-card",
  },
];
