import { AirVent, LaptopMinimal, Lightbulb, Refrigerator, Smartphone, Tv, WashingMachine, type LucideIcon } from "lucide-react";
import type { IconName } from "@/data/service-categories";

const icons: Record<IconName, LucideIcon> = {
  smartphone: Smartphone,
  laptop: LaptopMinimal,
  "air-conditioning": AirVent,
  refrigerator: Refrigerator,
  television: Tv,
  "washing-machine": WashingMachine,
  electrical: Lightbulb,
};

type RepairIconProps = {
  name: IconName;
  className?: string;
};

export function RepairIcon({ name, className }: RepairIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className={className} strokeWidth={1.7} />;
}
