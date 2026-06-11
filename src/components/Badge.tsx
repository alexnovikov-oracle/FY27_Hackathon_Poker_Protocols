import type { ReactNode } from "react";
import type { StatusColor } from "../types/domain";

type BadgeTone = StatusColor | "neutral" | "critical" | "high" | "moderate" | "info";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  title?: string;
}

export function Badge({ children, tone = "neutral", title }: BadgeProps) {
  return (
    <span className={`badge badge-${tone}`} title={title}>
      {children}
    </span>
  );
}
