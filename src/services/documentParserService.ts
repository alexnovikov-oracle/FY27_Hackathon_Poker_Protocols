import type {
  DocumentBadge,
  DocumentType,
  ExtractedEntity,
  GlossaryTerm,
  MedicalDocument,
  StatusColor,
} from "../types/domain";

interface LabRange {
  low?: number;
  high?: number;
  unit: string;
  plain: string;
}

export const labReferenceRanges: Record<string, LabRange> = {
  A1C: {
    high: 5.7,
    unit: "%",
    plain:
      "A1C estimates average blood sugar over about three months. Targets vary by person and clinician plan.",
  },
  LDL: {
    high: 100,
    unit: "mg/dL",
    plain:
      "LDL is often called bad cholesterol because higher levels can be associated with artery plaque risk.",
  },
  HDL: {
    low: 40,
    unit: "mg/dL",
    plain:
      "HDL is often called good cholesterol. Low HDL may be one factor clinicians review with overall risk.",
  },
  Triglycerides: {
    high: 150,
    unit: "mg/dL",
    plain: "Triglycerides are a type of blood fat that can rise with diet, diabetes, or other factors.",
  },
  Creatinine: {
    high: 1.3,
    unit: "mg/dL",
    plain:
      "Creatinine is a waste product used with other information to estimate kidney function.",
  },
  eGFR: {
    low: 60,
    unit: "mL/min",
    plain:
      "eGFR is an estimate of kidney filtering function. Lower values often prompt clinician review.",
  },
  Potassium: {
    low: 3.5,
    high: 5.1,
    unit: "mmol/L",
    plain: "Potassium helps nerves, muscles, and heart rhythm work normally.",
  },
  Sodium: {
    low: 135,
    high: 145,
    unit: "mmol/L",
    plain: "Sodium is an electrolyte that helps balance fluid and nerve function.",
  },
  Hemoglobin: {
    low: 12,
    high: 17.5,
    unit: "g/dL",
    plain: "Hemoglobin carries oxygen in red blood cells.",
  },
  WBC: {
    low: 4,
    high: 11,
    unit: "K/uL",
    plain: "White blood cells help fight infection and inflammation.",
  },
  ALT: {
    high: 45,
    unit: "U/L",
    plain: "ALT is a liver enzyme clinicians may review with medicines and liver health.",
  },
  AST: {
    high: 40,
    unit: "U/L",
    plain: "AST is an enzyme found in liver and muscle tissue.",
  },
};

const glossaryLibrary: Record<string, string> = {
  A1C: "A blood test that estimates average blood sugar over about three months.",
  eGFR: "An estimate of how well the kidneys are filtering blood.",
  creatinine: "A waste product used to help estimate kidney function.",
  potassium: "An electrolyte important for muscle, nerve, and heart rhythm.",
  INR: "A blood test used to monitor warfarin effect.",
  stenosis: "Narrowing of a passageway, often used in spine imaging.",
  degenerative: "Wear-and-tear type change, often related to aging or repeated stress.",
  edema: "Swelling or fluid signal seen in tissue.",
  tear: "A disruption in tissue such as cartilage, tendon, or ligament.",
  lesion: "A broad imaging term for an area that looks different from surrounding tissue.",
  impression: "The radiologist's summary of the most important imaging findings.",
  osteoarthritis: "Joint wear-and-tear changes that can cause pain or stiffness.",
  anticoagulant: "A medicine that reduces blood clotting.",
  refills: "How many additional fills the prescriber authorized.",
};

const emergencyTerms = [
  "severe shortness of breath",
  "blue lips",
  "chest pain",
  "black stools",
  "severe headache",
  "major fall",
  "dark urine",
];

function statusForLab(name: string, value: number): StatusColor {
  const range = labReferenceRanges[name];
  if (!range) return "green";
  if (range.low !== undefined && value < range.low) return "yellow";
  if (range.high !== undefined && value > range.high) {
    return name === "Potassium" || name === "eGFR" || name === "Creatinine" ? "red" : "yellow";
  }
  return "green";
}

export function parseLabResults(text: string): ExtractedEntity[] {
  return Object.keys(labReferenceRanges).flatMap((name) => {
    const expression = new RegExp(`${name}\\\\s+([0-9]+(?:\\\\.[0-9]+)?)`, "i");
    const match = text.match(expression);
    if (!match) return [];
    const value = Number(match[1]);
    const status = statusForLab(name, value);
    return [
      {
        label: name,
        value: `${value} ${labReferenceRanges[name].unit}`,
        category: "Lab result",
        status,
      },
    ];
  });
}

export function hasReducedKidneyFunction(document: MedicalDocument): boolean {
  if (document.type !== "lab") return false;
  const egfr = parseLabResults(document.text).find((entity) => entity.label === "eGFR");
  if (!egfr) return false;
  const value = Number(egfr.value.split(" ")[0]);
  return value < 60;
}

export function parsePrescription(text: string): ExtractedEntity[] {
  const fields = ["Medication", "Dose", "Route", "Frequency", "Quantity", "Refills", "Prescriber", "Start date"];
  return fields.flatMap((field) => {
    const match = text.match(new RegExp(`${field}:\\\\s*(.+)`, "i"));
    return match
      ? [
          {
            label: field,
            value: match[1].trim(),
            category: "Prescription detail",
          },
        ]
      : [];
  });
}

export function parseCareNote(text: string): ExtractedEntity[] {
  const fields = ["Assessment", "Plan", "Follow-up", "Medication note", "Symptoms", "Questions"];
  return fields.flatMap((field) => {
    const match = text.match(new RegExp(`${field}:\\\\s*([^\\n]+)`, "i"));
    return match
      ? [
          {
            label: field,
            value: match[1].trim(),
            category: "Clinical note section",
            status: field === "Follow-up" ? "yellow" : undefined,
          },
        ]
      : [];
  });
}

export function parseRadiology(text: string): ExtractedEntity[] {
  const bodyPart = text.match(/MRI\\s+([^\\n]+)/i)?.[1]?.trim();
  const findings = text.match(/Findings:\\s*([^]+?)(?:Impression:|$)/i)?.[1]?.trim();
  const impression = text.match(/Impression:\\s*([^]+)$/i)?.[1]?.trim();
  return [
    bodyPart
      ? {
          label: "Body part",
          value: bodyPart,
          category: "Radiology",
        }
      : undefined,
    findings
      ? {
          label: "Findings",
          value: findings,
          category: "Radiology",
          status: /moderate|tear|stenosis|lesion/i.test(findings) ? "yellow" : "green",
        }
      : undefined,
    impression
      ? {
          label: "Impression",
          value: impression,
          category: "Radiology",
          status: /recommend|follow-up|correlate/i.test(impression) ? "yellow" : "green",
        }
      : undefined,
  ].filter(Boolean) as ExtractedEntity[];
}

export function parseDiagnosis(text: string): ExtractedEntity[] {
  return ["Diagnosis", "Usual monitoring", "Current concern", "Care plan"].flatMap((field) => {
    const match = text.match(new RegExp(`${field}:\\\\s*([^\\n]+)`, "i"));
    return match
      ? [
          {
            label: field,
            value: match[1].trim(),
            category: "Diagnosis summary",
            status: /concern|review|monitor/i.test(field + match[1]) ? "yellow" : undefined,
          },
        ]
      : [];
  });
}

export function extractEntities(document: MedicalDocument): ExtractedEntity[] {
  const parsers: Record<DocumentType, (text: string) => ExtractedEntity[]> = {
    lab: parseLabResults,
    prescription: parsePrescription,
    "doctor-note": parseCareNote,
    diagnosis: parseDiagnosis,
    radiology: parseRadiology,
  };
  return parsers[document.type](document.text);
}

export function buildGlossary(text: string): GlossaryTerm[] {
  const lower = text.toLowerCase();
  return Object.entries(glossaryLibrary)
    .filter(([term]) => lower.includes(term.toLowerCase()))
    .map(([term, explanation]) => ({ term, explanation }));
}

export function buildBadges(document: MedicalDocument, entities: ExtractedEntity[]): DocumentBadge[] {
  const badges: DocumentBadge[] = [];
  const red = entities.filter((entity) => entity.status === "red");
  const yellow = entities.filter((entity) => entity.status === "yellow");
  const emergencyHits = emergencyTerms.filter((term) => document.text.toLowerCase().includes(term));

  if (red.length) {
    badges.push({
      label: "Red: clinician review",
      color: "red",
      detail: `${red.map((entity) => entity.label).join(", ")} outside demo safety thresholds.`,
    });
  }
  if (yellow.length) {
    badges.push({
      label: "Yellow: follow-up needed",
      color: "yellow",
      detail: `${yellow.map((entity) => entity.label).join(", ")} may need clarification or follow-up.`,
    });
  }
  if (!red.length && !yellow.length) {
    badges.push({
      label: "Green: no urgent demo flag",
      color: "green",
      detail: "No abnormality was detected by the simple deterministic demo parser.",
    });
  }
  if (emergencyHits.length) {
    badges.unshift({
      label: "Seek urgent/emergency care",
      color: "red",
      detail:
        "Emergency-type symptoms appear in this document. If these are happening now, seek urgent or emergency care.",
    });
  }
  if (/follow up|follow-up|repeat|schedule/i.test(document.text)) {
    badges.push({
      label: "Follow-up task",
      color: "yellow",
      detail: "The document mentions follow-up, repeat testing, scheduling, or monitoring.",
    });
  }
  if (/warfarin|clarithromycin|potassium|ibuprofen|acetaminophen/i.test(document.text)) {
    badges.push({
      label: "Medication safety check",
      color: "yellow",
      detail: "Medication names appear in the document; confirm interaction risk with a clinician or pharmacist.",
    });
  }
  return badges;
}

export function explainLabEntity(entity: ExtractedEntity): string {
  const range = labReferenceRanges[entity.label];
  const status =
    entity.status === "red"
      ? "is outside a demo safety threshold"
      : entity.status === "yellow"
        ? "is outside the simple demo reference range"
        : "is within the simple demo reference range";
  return range ? `${entity.label} ${status}. ${range.plain}` : `${entity.label} was extracted.`;
}
