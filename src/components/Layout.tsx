import type { ReactNode } from "react";
import {
  Activity,
  CalendarClock,
  ClipboardList,
  FileText,
  HeartPulse,
  Home,
  LockKeyhole,
  Pill,
  Presentation,
  ShieldCheck,
} from "lucide-react";
import type { PatientProfile } from "../types/domain";
import { Badge } from "./Badge";

export type AppView =
  | "dashboard"
  | "documents"
  | "medications"
  | "reminders"
  | "treatment"
  | "fitness"
  | "investor"
  | "privacy";

interface LayoutProps {
  children: ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  patient: PatientProfile;
  patients: PatientProfile[];
  onPatientChange: (patientId: string) => void;
}

const navItems: Array<{ view: AppView; label: string; icon: ReactNode }> = [
  { view: "dashboard", label: "Dashboard", icon: <Home size={18} /> },
  { view: "documents", label: "Documents", icon: <FileText size={18} /> },
  { view: "medications", label: "Medications", icon: <Pill size={18} /> },
  { view: "reminders", label: "Reminders", icon: <CalendarClock size={18} /> },
  { view: "treatment", label: "Treatment", icon: <ClipboardList size={18} /> },
  { view: "fitness", label: "Fitness", icon: <Activity size={18} /> },
  { view: "investor", label: "Investor", icon: <Presentation size={18} /> },
  { view: "privacy", label: "Privacy", icon: <LockKeyhole size={18} /> },
];

export function Layout({
  children,
  currentView,
  onViewChange,
  patient,
  patients,
  onPatientChange,
}: LayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand-button" type="button" onClick={() => onViewChange("dashboard")}>
          <span className="brand-mark">
            <HeartPulse size={22} />
          </span>
          <span>
            <strong>MedDcode</strong>
            <small>Decode your care. Stay on track.</small>
          </span>
        </button>

        <label className="patient-switcher">
          <span>Demo profile</span>
          <select value={patient.id} onChange={(event) => onPatientChange(event.target.value)}>
            {patients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.displayName}
              </option>
            ))}
          </select>
        </label>

        <nav className="nav-list" aria-label="Product navigation">
          {navItems.map((item) => (
            <button
              key={item.view}
              type="button"
              className={item.view === currentView ? "active" : ""}
              onClick={() => onViewChange(item.view)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="trust-panel">
          <ShieldCheck size={18} />
          <div>
            <strong>Privacy-first demo</strong>
            <p>Synthetic data, local mode, no telemetry.</p>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Patient workspace</p>
            <h1>{patient.displayName}</h1>
          </div>
          <div className="topbar-actions">
            <Badge tone={patient.riskLevel === "high" ? "red" : patient.riskLevel === "medium" ? "yellow" : "green"}>
              {patient.riskLevel} demo risk
            </Badge>
            <Badge tone="neutral">Synthetic only</Badge>
            <Badge tone="neutral">No medical advice</Badge>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
