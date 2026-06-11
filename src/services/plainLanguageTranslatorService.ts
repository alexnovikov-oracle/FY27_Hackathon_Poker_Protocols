import type { DocumentTranslation, MedicalDocument } from "../types/domain";
import {
  buildBadges,
  buildGlossary,
  explainLabEntity,
  extractEntities,
} from "./documentParserService";

const documentTypeLabels: Record<MedicalDocument["type"], string> = {
  lab: "lab results",
  prescription: "prescription",
  "doctor-note": "doctor's note",
  diagnosis: "diagnosis summary",
  radiology: "radiology-style report",
};

function commonCaveats(): string[] {
  return [
    "Educational support only: MedDcode cannot diagnose, prescribe, or replace a licensed clinician.",
    "Medication safety checks are non-exhaustive and should be confirmed with a doctor or pharmacist.",
    "If severe or emergency symptoms are happening now, seek urgent or emergency care.",
    "This demo uses synthetic data only and does not store or transmit real PHI.",
  ];
}

function questionsFor(document: MedicalDocument): string[] {
  const base = [
    "What is the most important thing I should do before the next visit?",
    "Are any follow-up labs, imaging, appointments, or medication reviews needed?",
  ];
  if (document.type === "lab") {
    return [
      "Which values are outside my personal target range?",
      "Do any results change my medication plan or monitoring schedule?",
      ...base,
    ];
  }
  if (document.type === "prescription") {
    return [
      "How should I take this medication, and what should I do if I miss a dose?",
      "Does this interact with my current medicines, supplements, or alcohol?",
      ...base,
    ];
  }
  if (document.type === "radiology") {
    return [
      "Which findings matter most for my symptoms and exam?",
      "What follow-up is recommended, and how urgent is it?",
      ...base,
    ];
  }
  return [
    "Can you explain the plan in one or two action steps?",
    "What symptoms should prompt a call or urgent care?",
    ...base,
  ];
}

function meaningFor(document: MedicalDocument, entitySummaries: string[]): string[] {
  if (document.type === "lab") {
    return entitySummaries.length
      ? entitySummaries
      : ["No common demo lab values were detected. Ask the ordering clinician what values matter most."];
  }
  if (document.type === "prescription") {
    return [
      "This document appears to describe how a medicine should be taken.",
      "Confirm the dose, timing, refill plan, and whether it should be linked to reminders.",
      "Ask a pharmacist to review the complete medication list before starting anything new.",
    ];
  }
  if (document.type === "radiology") {
    return [
      "Radiology reports describe what the imaging shows, but the meaning depends on symptoms and a clinician exam.",
      "Terms like degenerative, stenosis, edema, tear, lesion, and impression should be reviewed with the ordering clinician.",
      "This app cannot determine severity beyond the words in the report.",
    ];
  }
  if (document.type === "diagnosis") {
    return [
      "This summary can help organize usual monitoring and care-plan tasks.",
      "The app cannot confirm the diagnosis or decide treatment.",
      "Use it to prepare questions and track follow-up items.",
    ];
  }
  return [
    "The note likely includes an assessment, plan, follow-up, symptoms, and questions.",
    "The safest next step is to confirm unclear tasks with the care team.",
  ];
}

export function translateDocument(document: MedicalDocument): DocumentTranslation {
  const entities = extractEntities(document);
  const badges = buildBadges(document, entities);
  const labSummaries = entities
    .filter((entity) => entity.category === "Lab result")
    .map(explainLabEntity);
  const typeLabel = documentTypeLabels[document.type];
  const plainEnglish =
    `This synthetic ${typeLabel} was decoded into patient-friendly language. ` +
    "The highlights below identify possible follow-up items and terms to ask about, but they do not diagnose or prescribe.";

  return {
    plainEnglish,
    eli12:
      "Think of this as a careful translation of medical words into everyday words. It points out what to ask next, but a clinician still has to make medical decisions.",
    whatThisMayMean: meaningFor(document, labSummaries),
    questionsForDoctor: questionsFor(document),
    glossary: buildGlossary(document.text),
    entities,
    badges,
    caveats: commonCaveats(),
  };
}

export function translateUploadedText(text: string): DocumentTranslation {
  const uploaded: MedicalDocument = {
    id: "uploaded-preview",
    patientId: "uploaded",
    type: inferDocumentType(text),
    title: "Uploaded demo document",
    date: new Date().toISOString().slice(0, 10),
    clinician: "Uploaded by demo user",
    source: "uploaded",
    text,
  };
  return translateDocument(uploaded);
}

export function inferDocumentType(text: string): MedicalDocument["type"] {
  if (/A1C|LDL|eGFR|Creatinine|Potassium|Hemoglobin/i.test(text)) return "lab";
  if (/Prescription|Medication:|Dose:|Refills:/i.test(text)) return "prescription";
  if (/MRI|Findings:|Impression:/i.test(text)) return "radiology";
  if (/Diagnosis:|Usual monitoring:/i.test(text)) return "diagnosis";
  return "doctor-note";
}
