import { useMemo, useState } from "react";
import {
  appointments,
  carePlans,
  conflictScenarios,
  DEMO_TODAY,
  fitnessSamples,
  medicalDocuments,
  medications,
  patients,
  reminders,
} from "./data/sampleData";
import type { Medication, Reminder } from "./types/domain";
import { hasReducedKidneyFunction } from "./services/documentParserService";
import { checkMedicationInteractions } from "./services/medicationInteractionService";
import { getPatientFitnessSamples, buildFitnessInsights } from "./services/fitnessInsightsService";
import { calculateWeeklyAdherence, getTodayReminders } from "./services/reminderService";
import { computeReadinessScore } from "./services/reportService";
import { Layout, type AppView } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { HomeDashboard } from "./components/HomeDashboard";
import { DocumentCenter } from "./components/DocumentCenter";
import { MedicationManager } from "./components/MedicationManager";
import { RemindersModule } from "./components/RemindersModule";
import { TreatmentPlanDashboard } from "./components/TreatmentPlanDashboard";
import { FitnessInsights } from "./components/FitnessInsights";
import { InvestorDemo } from "./components/InvestorDemo";
import { PrivacySecurity } from "./components/PrivacySecurity";

export default function App() {
  const [view, setView] = useState<AppView | "landing">("landing");
  const [patientId, setPatientId] = useState(patients[0].id);
  const [medicationList, setMedicationList] = useState<Medication[]>(medications);
  const [reminderList, setReminderList] = useState<Reminder[]>(reminders);

  const patient = patients.find((item) => item.id === patientId) ?? patients[0];
  const patientDocuments = useMemo(
    () => medicalDocuments.filter((document) => document.patientId === patientId),
    [patientId],
  );
  const patientMedications = useMemo(
    () => medicationList.filter((medication) => medication.patientId === patientId),
    [medicationList, patientId],
  );
  const patientReminders = useMemo(
    () => reminderList.filter((reminder) => reminder.patientId === patientId),
    [reminderList, patientId],
  );
  const patientAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.patientId === patientId),
    [patientId],
  );
  const patientPlans = useMemo(
    () => carePlans.filter((plan) => plan.patientId === patientId),
    [patientId],
  );
  const patientFitnessSamples = useMemo(
    () => getPatientFitnessSamples(fitnessSamples, patientId),
    [patientId],
  );
  const reducedKidneyFunction = useMemo(
    () => patientDocuments.some((document) => hasReducedKidneyFunction(document)),
    [patientDocuments],
  );
  const medicationAlerts = useMemo(
    () => checkMedicationInteractions(patientMedications, { reducedKidneyFunction }),
    [patientMedications, reducedKidneyFunction],
  );
  const remindersToday = useMemo(
    () => getTodayReminders(reminderList, patientId, DEMO_TODAY),
    [reminderList, patientId],
  );
  const fitnessInsights = useMemo(
    () => buildFitnessInsights(fitnessSamples, patientId),
    [patientId],
  );
  const weeklyAdherence = useMemo(
    () => calculateWeeklyAdherence(reminderList, patientId, DEMO_TODAY),
    [reminderList, patientId],
  );
  const readinessScore = useMemo(
    () =>
      computeReadinessScore({
        reminders: patientReminders,
        alerts: medicationAlerts,
        appointments: patientAppointments,
        carePlans: patientPlans,
        fitnessInsights,
      }),
    [patientReminders, medicationAlerts, patientAppointments, patientPlans, fitnessInsights],
  );

  function updatePatientMedications(nextPatientMedications: Medication[]) {
    setMedicationList((current) => [
      ...current.filter((medication) => medication.patientId !== patientId),
      ...nextPatientMedications,
    ]);
  }

  function updatePatientReminders(nextPatientReminders: Reminder[]) {
    setReminderList((current) => [
      ...current.filter((reminder) => reminder.patientId !== patientId),
      ...nextPatientReminders,
    ]);
  }

  function renderView(currentView: AppView) {
    if (currentView === "dashboard") {
      return (
        <HomeDashboard
          patient={patient}
          documents={patientDocuments}
          alerts={medicationAlerts}
          remindersToday={remindersToday}
          appointments={patientAppointments}
          carePlans={patientPlans}
          fitnessInsights={fitnessInsights}
          readinessScore={readinessScore}
          onNavigate={setView}
        />
      );
    }
    if (currentView === "documents") {
      return <DocumentCenter documents={patientDocuments} />;
    }
    if (currentView === "medications") {
      return (
        <MedicationManager
          patientId={patientId}
          medications={patientMedications}
          alerts={medicationAlerts}
          conflictScenarios={conflictScenarios}
          reducedKidneyFunction={reducedKidneyFunction}
          onMedicationsChange={updatePatientMedications}
        />
      );
    }
    if (currentView === "reminders") {
      return (
        <RemindersModule
          patientId={patientId}
          reminders={patientReminders}
          onRemindersChange={updatePatientReminders}
        />
      );
    }
    if (currentView === "treatment") {
      return (
        <TreatmentPlanDashboard
          carePlans={patientPlans}
          appointments={patientAppointments}
          documents={patientDocuments}
          medications={patientMedications}
        />
      );
    }
    if (currentView === "fitness") {
      return (
        <FitnessInsights
          samples={patientFitnessSamples}
          insights={fitnessInsights}
          adherenceRate={weeklyAdherence.rate}
        />
      );
    }
    if (currentView === "investor") {
      return <InvestorDemo />;
    }
    return <PrivacySecurity />;
  }

  if (view === "landing") {
    return <LandingPage patients={patients} onLaunch={() => setView("dashboard")} />;
  }

  return (
    <Layout
      currentView={view}
      onViewChange={setView}
      patient={patient}
      patients={patients}
      onPatientChange={(nextPatientId) => {
        setPatientId(nextPatientId);
        setView("dashboard");
      }}
    >
      {renderView(view)}
    </Layout>
  );
}
