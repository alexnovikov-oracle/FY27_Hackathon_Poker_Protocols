import { describe, expect, it } from "vitest";
import type { Medication } from "../types/domain";
import { checkMedicationInteractions } from "../services/medicationInteractionService";

function med(name: string): Medication {
  return {
    id: `med-${name}`,
    patientId: "patient-test",
    name,
    genericName: name,
    dose: "demo dose",
    route: "oral",
    frequency: "daily",
    prescribingClinician: "Demo clinician",
    startDate: "2026-06-01",
    notes: "Synthetic test medication",
    active: true,
  };
}

describe("medicationInteractionService", () => {
  it("flags warfarin and ibuprofen as a critical bleeding-risk alert", () => {
    const alerts = checkMedicationInteractions([med("Warfarin"), med("Ibuprofen")]);

    expect(alerts[0]).toMatchObject({
      severity: "Critical",
      title: expect.stringContaining("Warfarin"),
    });
    expect(alerts[0].doNotStopWithoutAdvice).toBe(true);
  });

  it("flags duplicate acetaminophen exposure", () => {
    const alerts = checkMedicationInteractions([
      med("Acetaminophen"),
      med("Cold relief acetaminophen combo"),
    ]);

    expect(alerts.some((alert) => alert.id === "duplicate-acetaminophen")).toBe(true);
  });

  it("flags metformin when reduced kidney function context is present", () => {
    const alerts = checkMedicationInteractions([med("Metformin")], {
      reducedKidneyFunction: true,
    });

    expect(alerts).toHaveLength(1);
    expect(alerts[0].severity).toBe("High");
  });

  it("does not produce an alert for a no-conflict inhaler pair", () => {
    const alerts = checkMedicationInteractions([med("Albuterol inhaler"), med("Fluticasone inhaler")]);

    expect(alerts).toHaveLength(0);
  });
});
