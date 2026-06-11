import type { FitnessInsight, FitnessSample } from "../types/domain";

function formatTrend(today: number, average: number, lowerIsBetter = false): { trend: string; status: FitnessInsight["status"] } {
  if (average === 0) return { trend: "No 7-day comparison available.", status: "green" };
  const delta = Math.round(((today - average) / average) * 100);
  const direction = delta >= 0 ? "above" : "below";
  const magnitude = Math.abs(delta);
  const concerning = lowerIsBetter ? delta > 10 : delta < -15;
  return {
    trend: `${magnitude}% ${direction} 7-day average`,
    status: concerning ? "yellow" : "green",
  };
}

export function getPatientFitnessSamples(samples: FitnessSample[], patientId: string): FitnessSample[] {
  return samples
    .filter((sample) => sample.patientId === patientId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getLatestFitnessSample(samples: FitnessSample[], patientId: string): FitnessSample | undefined {
  return getPatientFitnessSamples(samples, patientId).at(-1);
}

export function average(samples: FitnessSample[], key: keyof Pick<FitnessSample, "steps" | "restingHeartRate" | "sleepHours" | "activeMinutes" | "weightLbs">): number {
  if (samples.length === 0) return 0;
  return samples.reduce((sum, sample) => sum + Number(sample[key]), 0) / samples.length;
}

export function buildFitnessInsights(samples: FitnessSample[], patientId: string): FitnessInsight[] {
  const patientSamples = getPatientFitnessSamples(samples, patientId);
  const latest = patientSamples.at(-1);
  if (!latest) return [];
  const previousSeven = patientSamples.slice(-8, -1);

  const stepsTrend = formatTrend(latest.steps, average(previousSeven, "steps"));
  const sleepTrend = formatTrend(latest.sleepHours, average(previousSeven, "sleepHours"));
  const rhrTrend = formatTrend(latest.restingHeartRate, average(previousSeven, "restingHeartRate"), true);
  const activeTrend = formatTrend(latest.activeMinutes, average(previousSeven, "activeMinutes"));

  const bpReadings = patientSamples.slice(-7).filter((sample) => sample.systolic && sample.diastolic);
  const elevatedBp = bpReadings.filter((sample) => Number(sample.systolic) >= 130 || Number(sample.diastolic) >= 80).length;

  const insights: FitnessInsight[] = [
    {
      metric: "Steps",
      value: latest.steps.toLocaleString(),
      trend: stepsTrend.trend,
      status: stepsTrend.status,
      explanation:
        latest.steps < average(previousSeven, "steps")
          ? "Your step count is below your recent pattern. Consider asking whether your activity target is appropriate."
          : "Activity is at or above your recent pattern. Keep clinician-recommended limits in mind.",
    },
    {
      metric: "Sleep",
      value: `${latest.sleepHours} hrs`,
      trend: sleepTrend.trend,
      status: sleepTrend.status,
      explanation:
        "Sleep changes can affect energy and medication routines, but this demo cannot determine a medical cause.",
    },
    {
      metric: "Resting heart rate",
      value: `${latest.restingHeartRate} bpm`,
      trend: rhrTrend.trend,
      status: rhrTrend.status,
      explanation:
        "Resting heart rate trends can be useful context for a clinician, especially when symptoms are present.",
    },
    {
      metric: "Active minutes",
      value: `${latest.activeMinutes} min`,
      trend: activeTrend.trend,
      status: activeTrend.status,
      explanation:
        "Movement consistency may support care routines. Ask whether the target matches the treatment plan.",
    },
  ];

  if (latest.systolic && latest.diastolic) {
    insights.push({
      metric: "Blood pressure",
      value: `${latest.systolic}/${latest.diastolic}`,
      trend: `${elevatedBp} of last ${bpReadings.length} readings above demo target`,
      status: elevatedBp >= 4 ? "yellow" : "green",
      explanation:
        elevatedBp >= 4
          ? "Ask your clinician whether your treatment plan or home measurement technique needs review."
          : "Recent readings are not persistently above the simple demo target.",
    });
  }

  if (latest.bloodGlucose) {
    insights.push({
      metric: "Blood glucose",
      value: `${latest.bloodGlucose} mg/dL`,
      trend: "Demo-only reading; no diagnosis inferred",
      status: latest.bloodGlucose > 180 ? "yellow" : "green",
      explanation:
        "Blood glucose interpretation depends on timing, meals, medication, and individualized clinician targets.",
    });
  }

  return insights;
}

export function medicationAdherenceCorrelation(adherenceRate: number, insights: FitnessInsight[]): string {
  const sleep = insights.find((insight) => insight.metric === "Sleep");
  if (!sleep) return "No correlation statement available.";
  if (adherenceRate < 80 && sleep.status === "yellow") {
    return "Medication adherence and shorter sleep both changed this week. This is only a pattern to discuss, not proof that one caused the other.";
  }
  return "No concerning demo correlation was detected between adherence and today's wearable summary.";
}
