import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon?: ReactNode;
  tone?: "calm" | "warn" | "danger" | "success";
}

export function MetricCard({ label, value, detail, icon, tone = "calm" }: MetricCardProps) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <div className="metric-icon" aria-hidden="true">
        {icon}
      </div>
      <div>
        <p className="eyebrow">{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}
