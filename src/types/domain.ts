export type PatientRisk = "low" | "medium" | "high";

export type DocumentType =
  | "lab"
  | "prescription"
  | "doctor-note"
  | "diagnosis"
  | "radiology";

export type StatusColor = "green" | "yellow" | "red";

export type Severity = "Critical" | "High" | "Moderate" | "Informational";

export interface PatientProfile {
  id: string;
  displayName: string;
  role: string;
  age: number;
  pronouns: string;
  summary: string;
  privacyMode: boolean;
  riskLevel: PatientRisk;
  primaryGoals: string[];
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  type: DocumentType;
  title: string;
  date: string;
  clinician: string;
  source: "sample" | "uploaded";
  text: string;
  relatedMedicationIds?: string[];
  relatedConditionIds?: string[];
}

export interface ExtractedEntity {
  label: string;
  value: string;
  category: string;
  status?: StatusColor;
}

export interface GlossaryTerm {
  term: string;
  explanation: string;
}

export interface DocumentBadge {
  label: string;
  color: StatusColor;
  detail: string;
}

export interface DocumentTranslation {
  plainEnglish: string;
  eli12: string;
  whatThisMayMean: string[];
  questionsForDoctor: string[];
  glossary: GlossaryTerm[];
  entities: ExtractedEntity[];
  badges: DocumentBadge[];
  caveats: string[];
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  genericName?: string;
  dose: string;
  route: string;
  frequency: string;
  prescribingClinician: string;
  startDate: string;
  endDate?: string;
  notes: string;
  active: boolean;
}

export interface MedicationInteractionAlert {
  id: string;
  medicationNames: string[];
  severity: Severity;
  title: string;
  explanation: string;
  whyItMatters: string;
  askClinician: string;
  doNotStopWithoutAdvice: boolean;
  sourceNote: string;
}

export interface InteractionRule {
  id: string;
  match: string[];
  severity: Severity;
  title: string;
  explanation: string;
  whyItMatters: string;
  askClinician: string;
  doNotStopWithoutAdvice: boolean;
}

export type ReminderKind = "medication" | "appointment" | "treatment" | "refill";
export type ReminderStatus = "scheduled" | "completed" | "skipped" | "snoozed" | "missed";

export interface Reminder {
  id: string;
  patientId: string;
  kind: ReminderKind;
  title: string;
  dueAt: string;
  status: ReminderStatus;
  linkedMedicationId?: string;
  linkedAppointmentId?: string;
  linkedCarePlanId?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  title: string;
  clinician: string;
  specialty: string;
  dateTime: string;
  location: string;
  status: "confirmed" | "needs-confirmation" | "completed";
  notes?: string;
}

export interface CareTask {
  id: string;
  title: string;
  cadence: string;
  status: "not-started" | "in-progress" | "done" | "blocked";
  dueDate?: string;
  linkType?: "document" | "medication" | "appointment" | "diagnosis";
  linkedId?: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  conditionId: string;
  conditionName: string;
  owner: string;
  status: "active" | "monitoring" | "needs-review";
  goals: string[];
  tasks: CareTask[];
  questionsForNextVisit: string[];
  progressNotes: string[];
}

export interface FitnessSample {
  date: string;
  patientId: string;
  steps: number;
  restingHeartRate: number;
  sleepHours: number;
  activeMinutes: number;
  weightLbs: number;
  systolic?: number;
  diastolic?: number;
  bloodGlucose?: number;
}

export interface FitnessInsight {
  metric: string;
  value: string;
  trend: string;
  status: StatusColor;
  explanation: string;
}

export interface ReadinessScore {
  score: number;
  label: string;
  drivers: string[];
  caveat: string;
}

export interface ConflictScenario {
  id: string;
  title: string;
  medicationNames: string[];
  expectedSeverity?: Severity;
  expectedAlert?: boolean;
}
