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

export type DemoTechnician = {
  name: string;
  experience: string;
  bio: string;
};

export const demoTechnicians = {
  amira: {
    name: "Amira Chen",
    experience: "8 years (sample)",
    bio: "Example profile copy for a repair professional. Provider experience and biographies are illustrative for this frontend preview.",
  },
  daniel: {
    name: "Daniel Foster",
    experience: "6 years (sample)",
    bio: "Example profile copy for a repair professional. Provider experience and biographies are illustrative for this frontend preview.",
  },
  rafiq: {
    name: "Rafiq Hasan",
    experience: "9 years (sample)",
    bio: "Example profile copy for a repair professional. Provider experience and biographies are illustrative for this frontend preview.",
  },
  priya: {
    name: "Priya Nair",
    experience: "7 years (sample)",
    bio: "Example profile copy for a repair professional. Provider experience and biographies are illustrative for this frontend preview.",
  },
  mateo: {
    name: "Mateo Alvarez",
    experience: "5 years (sample)",
    bio: "Example profile copy for a repair professional. Provider experience and biographies are illustrative for this frontend preview.",
  },
  grace: {
    name: "Grace Okafor",
    experience: "10 years (sample)",
    bio: "Example profile copy for a repair professional. Provider experience and biographies are illustrative for this frontend preview.",
  },
} as const satisfies Record<string, DemoTechnician>;

export type DemoTechnicianId = keyof typeof demoTechnicians;
export type ServiceSort = "featured" | "price-asc" | "price-desc";

export type PublicService = {
  id: string;
  name: string;
  category: string;
  description: string;
  details: string;
  startingPrice: number;
  technicianId: DemoTechnicianId;
  image: string;
  imageAlt: string;
  tag: string;
  featured: boolean;
  availability: string;
  includes: string[];
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

export const services: PublicService[] = [
  {
    id: "phone-screen-replacement",
    name: "Phone screen replacement",
    category: "Smartphone",
    description: "A clean, precise screen repair with quality tested parts.",
    details: "Example phone screen service details for the FixMate frontend preview. A provider would confirm the device model, part options, and final quote before work begins.",
    startingPrice: 49,
    technicianId: "amira",
    image: "/images/smartphone-screen-repair.webp",
    imageAlt: "Technician repairing a smartphone with a precision screwdriver",
    tag: "Most requested",
    featured: true,
    availability: "Example weekday and Saturday appointments",
    includes: ["Device inspection", "Repair options review", "Post-repair function check"],
  },
  {
    id: "laptop-diagnostic",
    name: "Laptop diagnostic & tune-up",
    category: "Laptop & PC",
    description: "Get to the root of slowdowns, heat and unexpected crashes.",
    details: "Example laptop diagnostic details for the FixMate frontend preview. The technician would discuss the findings and any additional work before proceeding.",
    startingPrice: 39,
    technicianId: "daniel",
    image: "/images/laptop-repair.webp",
    imageAlt: "Technician carefully working on an open laptop",
    tag: "Same-day slots",
    featured: true,
    availability: "Example weekday appointments",
    includes: ["Startup and performance checks", "Thermal inspection", "Recommended next steps"],
  },
  {
    id: "ac-maintenance",
    name: "Air conditioner service",
    category: "Air Conditioning",
    description: "Seasonal cleaning and performance checks for a cooler home.",
    details: "Example air conditioner service details for the FixMate frontend preview. The scope and any required parts would be confirmed after an initial inspection.",
    startingPrice: 69,
    technicianId: "rafiq",
    image: "/images/air-conditioner-service.webp",
    imageAlt: "Technician servicing a wall-mounted air conditioner",
    tag: "Home comfort",
    featured: true,
    availability: "Example weekday and weekend appointments",
    includes: ["Filter and airflow inspection", "Basic unit cleaning", "Operation check"],
  },
  {
    id: "refrigerator-maintenance",
    name: "Refrigerator maintenance",
    category: "Home Appliances",
    description: "Routine care to keep your refrigerator clean and running well.",
    details: "Example refrigerator maintenance details for the FixMate frontend preview. A technician would confirm the appliance and the requested maintenance before scheduling.",
    startingPrice: 55,
    technicianId: "priya",
    image: "/images/refrigerator-maintenance.webp",
    imageAlt: "Hands cleaning a stainless steel refrigerator",
    tag: "Trusted locally",
    featured: true,
    availability: "Example weekday appointments",
    includes: ["Door seal check", "Interior care guidance", "Cooling performance check"],
  },
  {
    id: "television-repair",
    name: "TV troubleshooting",
    category: "Television",
    description: "Restore the picture, sound and connections you rely on.",
    details: "Example television troubleshooting details for the FixMate frontend preview. Repair options and parts would be discussed after diagnosis.",
    startingPrice: 45,
    technicianId: "mateo",
    image: "/images/television-repair.webp",
    imageAlt: "Technician repairing the internal components of a television",
    tag: "Clear diagnosis",
    featured: true,
    availability: "Example weekday appointments",
    includes: ["Display and sound checks", "Connection inspection", "Repair recommendations"],
  },
  {
    id: "home-electrical-check",
    name: "Home electrical check",
    category: "Electrical Services",
    description: "A careful inspection of outlets, switches and lighting.",
    details: "Example home electrical inspection details for the FixMate frontend preview. Work scope and any safety concerns would be explained before repair work begins.",
    startingPrice: 59,
    technicianId: "grace",
    image: "/images/electrical-service.webp",
    imageAlt: "Electrician safely inspecting an electrical control panel",
    tag: "Safety first",
    featured: true,
    availability: "Example weekday appointments",
    includes: ["Outlet and switch inspection", "Lighting check", "Written next steps"],
  },
  {
    id: "phone-battery-replacement",
    name: "Phone battery replacement",
    category: "Smartphone",
    description: "Check battery health and review replacement options.",
    details: "Example phone battery service details for the FixMate frontend preview. Device compatibility and parts would be confirmed with the provider.",
    startingPrice: 35,
    technicianId: "amira",
    image: "/images/smartphone-screen-repair.webp",
    imageAlt: "Close-up of a technician repairing a smartphone",
    tag: "Device care",
    featured: false,
    availability: "Example weekday and Saturday appointments",
    includes: ["Battery health check", "Replacement options", "Charging function check"],
  },
  {
    id: "phone-charging-port-cleaning",
    name: "Phone charging port service",
    category: "Smartphone",
    description: "Inspect charging issues and clean accessible port debris.",
    details: "Example charging port service details for the FixMate frontend preview. Any hardware repair would be quoted separately after inspection.",
    startingPrice: 25,
    technicianId: "amira",
    image: "/images/smartphone-screen-repair.webp",
    imageAlt: "Close-up of a precision phone repair in progress",
    tag: "Quick check",
    featured: false,
    availability: "Example weekday appointments",
    includes: ["Charging symptom review", "Accessible port cleaning", "Charging test"],
  },
  {
    id: "laptop-keyboard-repair",
    name: "Laptop keyboard repair",
    category: "Laptop & PC",
    description: "Investigate unresponsive, damaged or sticking laptop keys.",
    details: "Example laptop keyboard service details for the FixMate frontend preview. The device model and compatible replacement parts would be confirmed first.",
    startingPrice: 65,
    technicianId: "daniel",
    image: "/images/laptop-repair.webp",
    imageAlt: "Technician inspecting the internal components of a laptop",
    tag: "Laptop care",
    featured: false,
    availability: "Example weekday appointments",
    includes: ["Keyboard inspection", "Repair options", "Key function test"],
  },
  {
    id: "laptop-thermal-cleaning",
    name: "Laptop thermal cleaning",
    category: "Laptop & PC",
    description: "Check cooling performance and clear accessible ventilation.",
    details: "Example laptop thermal service details for the FixMate frontend preview. The technician would explain any additional maintenance recommendations.",
    startingPrice: 49,
    technicianId: "daniel",
    image: "/images/laptop-repair.webp",
    imageAlt: "Open laptop being carefully serviced at a workbench",
    tag: "Keep it cool",
    featured: false,
    availability: "Example weekday appointments",
    includes: ["Fan and vent inspection", "Accessible dust removal", "Temperature check"],
  },
  {
    id: "refrigerator-cooling-check",
    name: "Refrigerator cooling check",
    category: "Home Appliances",
    description: "Review temperature, door seals and everyday cooling concerns.",
    details: "Example refrigerator cooling service details for the FixMate frontend preview. Diagnosis and any repair quote would be confirmed during the appointment.",
    startingPrice: 45,
    technicianId: "priya",
    image: "/images/refrigerator-maintenance.webp",
    imageAlt: "Close-up refrigerator maintenance in a home kitchen",
    tag: "Appliance care",
    featured: false,
    availability: "Example weekday appointments",
    includes: ["Temperature review", "Door seal check", "Recommended next steps"],
  },
  {
    id: "television-picture-and-sound-check",
    name: "TV picture and sound check",
    category: "Television",
    description: "Check picture quality, sound output and connected devices.",
    details: "Example television picture and sound service details for the FixMate frontend preview. The provider would discuss findings before any repair.",
    startingPrice: 35,
    technicianId: "mateo",
    image: "/images/television-repair.webp",
    imageAlt: "Television technician checking a display in a workshop",
    tag: "Picture & sound",
    featured: false,
    availability: "Example weekday appointments",
    includes: ["Display test", "Audio check", "Input and cable review"],
  },
  {
    id: "electrical-outlet-inspection",
    name: "Electrical outlet inspection",
    category: "Electrical Services",
    description: "Inspect outlet and switch concerns around your home.",
    details: "Example electrical outlet service details for the FixMate frontend preview. A qualified professional would confirm the work scope before starting.",
    startingPrice: 39,
    technicianId: "grace",
    image: "/images/electrical-service.webp",
    imageAlt: "Electrician inspecting an electrical panel during maintenance",
    tag: "Home safety",
    featured: false,
    availability: "Example weekday appointments",
    includes: ["Outlet symptom review", "Visual inspection", "Repair recommendations"],
  },
  {
    id: "air-conditioner-cleaning",
    name: "Air conditioner cleaning",
    category: "Air Conditioning",
    description: "Clean accessible filters and check airflow performance.",
    details: "Example air conditioner cleaning details for the FixMate frontend preview. Unit type and cleaning scope would be confirmed before a visit.",
    startingPrice: 49,
    technicianId: "rafiq",
    image: "/images/air-conditioner-service.webp",
    imageAlt: "Technician cleaning a wall-mounted air conditioning unit",
    tag: "Seasonal care",
    featured: false,
    availability: "Example weekday and weekend appointments",
    includes: ["Filter care", "Airflow check", "Basic operation test"],
  },
  {
    id: "small-appliance-assessment",
    name: "Small appliance assessment",
    category: "Home Appliances",
    description: "Get an initial assessment for a small household appliance.",
    details: "Example small appliance assessment details for the FixMate frontend preview. Appliance type and available repair options would be reviewed with a provider.",
    startingPrice: 29,
    technicianId: "priya",
    image: "/images/refrigerator-maintenance.webp",
    imageAlt: "Home appliance maintenance in progress",
    tag: "Initial assessment",
    featured: false,
    availability: "Example weekday appointments",
    includes: ["Appliance symptom review", "Initial inspection", "Next step recommendations"],
  },
];

export const featuredServices = services.filter((service) => service.featured);

export function getServiceById(id: string) {
  return services.find((service) => service.id === id);
}

/** Same-category services first, then featured services, excluding the current one. */
export function getRelatedServices(service: PublicService, limit = 3) {
  const others = services.filter((item) => item.id !== service.id);
  const sameCategory = others.filter((item) => item.category === service.category);
  const fallback = others.filter((item) => item.category !== service.category && item.featured);
  return [...sameCategory, ...fallback].slice(0, limit);
}
