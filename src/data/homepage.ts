export type RepairStep = {
  number: string;
  title: string;
  description: string;
  icon: "search" | "clipboard" | "wrench" | "credit-card";
};

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
    description: "Your technician keeps you informed as the work progresses.",
    icon: "wrench",
  },
  {
    number: "04",
    title: "Pay after completion",
    description: "Review the finished repair, then pay securely.",
    icon: "credit-card",
  },
];
