export type RepairStep = {
  number: string;
  title: string;
  description: string;
  icon: "search" | "clipboard" | "wrench" | "credit-card";
};

export const repairSteps: RepairStep[] = [
  {
    number: "01",
    title: "Find a Service",
    description: "Search approved repair services by device, category or area and compare starting prices.",
    icon: "search",
  },
  {
    number: "02",
    title: "Send a Request",
    description: "Describe the problem, add your address and pick a preferred date. No payment needed yet.",
    icon: "clipboard",
  },
  {
    number: "03",
    title: "Technician Fixes It",
    description: "Follow every step as the technician accepts, starts and completes the job.",
    icon: "wrench",
  },
  {
    number: "04",
    title: "Pay After Completion",
    description: "Pay securely with Stripe only once the job is marked completed.",
    icon: "credit-card",
  },
];
