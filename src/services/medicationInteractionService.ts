import type {
  InteractionRule,
  Medication,
  MedicationInteractionAlert,
} from "../types/domain";

export interface InteractionContext {
  reducedKidneyFunction?: boolean;
}

export const interactionRules: InteractionRule[] = [
  {
    id: "warfarin-ibuprofen",
    match: ["warfarin", "ibuprofen"],
    severity: "Critical",
    title: "Warfarin and ibuprofen may increase bleeding risk",
    explanation:
      "This combination can make bleeding more likely in some patients. The app cannot determine personal risk from the list alone.",
    whyItMatters:
      "Warfarin affects clotting, and ibuprofen can irritate the stomach and affect platelet function.",
    askClinician:
      "Ask your doctor or pharmacist what pain relief options are safest with warfarin and whether INR monitoring should change.",
    doNotStopWithoutAdvice: true,
  },
  {
    id: "lisinopril-potassium",
    match: ["lisinopril", "potassium"],
    severity: "High",
    title: "Lisinopril and potassium may raise potassium too much",
    explanation:
      "ACE inhibitors such as lisinopril can increase potassium. Potassium supplements may add to that effect.",
    whyItMatters:
      "Very high potassium can affect heart rhythm and may require urgent clinician review.",
    askClinician:
      "Ask whether the supplement should continue and when potassium labs should be repeated.",
    doNotStopWithoutAdvice: true,
  },
  {
    id: "simvastatin-clarithromycin",
    match: ["simvastatin", "clarithromycin"],
    severity: "High",
    title: "Simvastatin and clarithromycin may increase statin toxicity risk",
    explanation:
      "Clarithromycin can raise simvastatin levels in some people, which may increase muscle-related side effects.",
    whyItMatters:
      "Severe muscle injury is uncommon but important to catch early, especially with new muscle pain or dark urine.",
    askClinician:
      "Ask whether simvastatin should be held, changed, or monitored while taking clarithromycin.",
    doNotStopWithoutAdvice: true,
  },
  {
    id: "diphenhydramine-alcohol",
    match: ["diphenhydramine", "alcohol"],
    severity: "Moderate",
    title: "Sedating antihistamine and alcohol may increase sedation",
    explanation:
      "Both can make a person sleepy or less coordinated. The effect can be stronger when combined.",
    whyItMatters:
      "Increased sedation can raise fall, driving, and breathing-safety concerns depending on the person.",
    askClinician:
      "Ask whether a non-sedating allergy option or different routine would be safer.",
    doNotStopWithoutAdvice: false,
  },
];

const sourceNote =
  "Future production version should validate against RxNorm, DrugBank, FDA labels, and pharmacist-reviewed clinical rules.";

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function medicationTokens(medication: Medication): string {
  return normalize(`${medication.name} ${medication.genericName ?? ""}`);
}

function hasMatch(medications: Medication[], term: string): boolean {
  const needle = normalize(term);
  return medications.some((medication) => medicationTokens(medication).includes(needle));
}

function matchedMedicationNames(medications: Medication[], match: string[]): string[] {
  return medications
    .filter((medication) =>
      match.some((term) => medicationTokens(medication).includes(normalize(term))),
    )
    .map((medication) => medication.name);
}

function createAlert(
  id: string,
  medicationNames: string[],
  rule: Omit<InteractionRule, "id" | "match">,
): MedicationInteractionAlert {
  return {
    id,
    medicationNames,
    severity: rule.severity,
    title: rule.title,
    explanation: rule.explanation,
    whyItMatters: rule.whyItMatters,
    askClinician: rule.askClinician,
    doNotStopWithoutAdvice: rule.doNotStopWithoutAdvice,
    sourceNote,
  };
}

export function checkMedicationInteractions(
  medications: Medication[],
  context: InteractionContext = {},
): MedicationInteractionAlert[] {
  const activeMedications = medications.filter((medication) => medication.active);
  const ruleAlerts = interactionRules
    .filter((rule) => rule.match.every((term) => hasMatch(activeMedications, term)))
    .map((rule) => createAlert(rule.id, matchedMedicationNames(activeMedications, rule.match), rule));

  const acetaminophenProducts = activeMedications.filter((medication) =>
    medicationTokens(medication).includes("acetaminophen"),
  );
  const duplicateAcetaminophenAlert =
    acetaminophenProducts.length > 1
      ? [
          createAlert(
            "duplicate-acetaminophen",
            acetaminophenProducts.map((medication) => medication.name),
            {
              severity: "Moderate",
              title: "Multiple products contain acetaminophen",
              explanation:
                "Several medicines may contain acetaminophen. Taking more than the labeled daily limit can be harmful.",
              whyItMatters:
                "Too much acetaminophen can injure the liver, especially when products are combined accidentally.",
              askClinician:
                "Ask a pharmacist to confirm the safe daily total and which combination products include acetaminophen.",
              doNotStopWithoutAdvice: false,
            },
          ),
        ]
      : [];

  const metforminKidneyAlert =
    context.reducedKidneyFunction && hasMatch(activeMedications, "metformin")
      ? [
          createAlert("metformin-reduced-kidney-function", ["Metformin", "Reduced kidney function flag"], {
            severity: "High",
            title: "Metformin with reduced kidney function requires clinician review",
            explanation:
              "The demo detected an eGFR flag in the sample labs. Metformin dosing can depend on kidney function.",
            whyItMatters:
              "Kidney function helps clinicians decide whether metformin is appropriate and how it should be monitored.",
            askClinician:
              "Ask whether the current eGFR changes the medication plan or follow-up lab schedule.",
            doNotStopWithoutAdvice: true,
          }),
        ]
      : [];

  return [...ruleAlerts, ...duplicateAcetaminophenAlert, ...metforminKidneyAlert].sort(
    (a, b) => severityRank(a.severity) - severityRank(b.severity),
  );
}

export function severityRank(severity: MedicationInteractionAlert["severity"]): number {
  return {
    Critical: 0,
    High: 1,
    Moderate: 2,
    Informational: 3,
  }[severity];
}

export function createMedicationFromDraft(
  draft: Pick<Medication, "name" | "dose" | "route" | "frequency" | "notes">,
  patientId: string,
): Medication {
  return {
    ...draft,
    id: `med-${Date.now()}`,
    patientId,
    genericName: draft.name,
    prescribingClinician: "Demo user entry",
    startDate: new Date().toISOString().slice(0, 10),
    active: true,
  };
}
