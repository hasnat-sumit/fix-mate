import {
  AirVent,
  LaptopMinimal,
  Lightbulb,
  Refrigerator,
  Smartphone,
  Tv,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/data/services";

const icons: Record<IconName, LucideIcon> = {
  smartphone: Smartphone,
  laptop: LaptopMinimal,
  "air-conditioning": AirVent,
  appliance: Refrigerator,
  television: Tv,
  electrical: Lightbulb,
  other: Wrench,
};

type RepairIconProps = {
  name: IconName;
  className?: string;
};

export function RepairIcon({ name, className }: RepairIconProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" className={className} strokeWidth={1.7} />;
}
