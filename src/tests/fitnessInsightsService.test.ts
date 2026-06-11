import { describe, expect, it } from "vitest";
import type { FitnessSample } from "../types/domain";
import {
  buildFitnessInsights,
  medicationAdherenceCorrelation,
} from "../services/fitnessInsightsService";

const samples: FitnessSample[] = Array.from({ length: 8 }, (_, index) => ({
  patientId: "patient-test",
  date: `2026-06-${String(4 + index).padStart(2, "0")}`,
  steps: index === 7 ? 6000 : 10000,
  restingHeartRate: index === 7 ? 82 : 70,
  sleepHours: index === 7 ? 5.8 : 7.4,
  activeMinutes: index === 7 ? 22 : 42,
  weightLbs: 180,
  systolic: index > 3 ? 136 : 124,
  diastolic: index > 3 ? 84 : 76,
}));

describe("fitnessInsightsService", () => {
  it("builds trend insights against the previous seven samples", () => {
    const insights = buildFitnessInsights(samples, "patient-test");

    expect(insights.find((insight) => insight.metric === "Steps")?.trend).toContain("below");
    expect(insights.find((insight) => insight.metric === "Blood pressure")?.status).toBe("yellow");
  });

  it("phrases adherence correlation as non-causal", () => {
    const insights = buildFitnessInsights(samples, "patient-test");
    const statement = medicationAdherenceCorrelation(70, insights);

    expect(statement).toContain("not proof");
  });
});
