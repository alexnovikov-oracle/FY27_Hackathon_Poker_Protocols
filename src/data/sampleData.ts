import type {
  Appointment,
  CarePlan,
  ConflictScenario,
  FitnessSample,
  MedicalDocument,
  Medication,
  PatientProfile,
  Reminder,
} from "../types/domain";

export const DEMO_TODAY = "2026-06-11";

export const patients: PatientProfile[] = [
  {
    id: "patient-ava",
    displayName: "Ava Synthetic",
    role: "Patient managing prescriptions and cardiometabolic follow-up",
    age: 54,
    pronouns: "she/her",
    summary:
      "Tracking diabetes, blood pressure, cholesterol, medication adherence, and upcoming kidney-function follow-up.",
    privacyMode: true,
    riskLevel: "high",
    primaryGoals: [
      "Avoid medication conflicts",
      "Prepare better questions for appointments",
      "Keep blood pressure and glucose routines consistent",
    ],
  },
  {
    id: "patient-noah",
    displayName: "Noah Synthetic",
    role: "Caregiver profile for an older parent",
    age: 72,
    pronouns: "he/him",
    summary:
      "Caregiver-managed medication schedule, refill reminders, orthopedic follow-up, and sleep/activity trends.",
    privacyMode: true,
    riskLevel: "medium",
    primaryGoals: [
      "Coordinate appointments",
      "Reduce missed refills",
      "Understand radiology reports before specialist visits",
    ],
  },
  {
    id: "patient-sam",
    displayName: "Sam Synthetic",
    role: "Parent managing pediatric asthma follow-up",
    age: 14,
    pronouns: "they/them",
    summary:
      "Monitoring asthma action-plan tasks, medication use, activity, sleep, and follow-up questions.",
    privacyMode: true,
    riskLevel: "low",
    primaryGoals: [
      "Stay on treatment plan",
      "Catch unclear follow-up tasks",
      "Explain medical notes in plain language",
    ],
  },
];

export const medications: Medication[] = [
  {
    id: "med-warfarin",
    patientId: "patient-ava",
    name: "Warfarin",
    genericName: "warfarin",
    dose: "5 mg",
    route: "oral",
    frequency: "once daily at 7 PM",
    prescribingClinician: "Dr. Synthetic Cardiology",
    startDate: "2026-02-04",
    notes: "Anticoagulant. INR monitoring listed in care plan.",
    active: true,
  },
  {
    id: "med-ibuprofen",
    patientId: "patient-ava",
    name: "Ibuprofen",
    genericName: "ibuprofen",
    dose: "400 mg",
    route: "oral",
    frequency: "as needed for knee pain",
    prescribingClinician: "OTC entry",
    startDate: "2026-06-01",
    endDate: "2026-06-20",
    notes: "Added in demo to show bleeding-risk alert with warfarin.",
    active: true,
  },
  {
    id: "med-lisinopril",
    patientId: "patient-ava",
    name: "Lisinopril",
    genericName: "lisinopril",
    dose: "20 mg",
    route: "oral",
    frequency: "once daily",
    prescribingClinician: "Dr. Synthetic Primary Care",
    startDate: "2025-10-14",
    notes: "Blood pressure medication.",
    active: true,
  },
  {
    id: "med-potassium",
    patientId: "patient-ava",
    name: "Potassium supplement",
    genericName: "potassium chloride",
    dose: "20 mEq",
    route: "oral",
    frequency: "once daily",
    prescribingClinician: "Dr. Synthetic Primary Care",
    startDate: "2026-05-12",
    notes: "Needs potassium lab follow-up.",
    active: true,
  },
  {
    id: "med-metformin",
    patientId: "patient-ava",
    name: "Metformin",
    genericName: "metformin",
    dose: "500 mg",
    route: "oral",
    frequency: "twice daily with meals",
    prescribingClinician: "Dr. Synthetic Endocrinology",
    startDate: "2025-09-02",
    notes: "Kidney function should be reviewed in context of eGFR.",
    active: true,
  },
  {
    id: "med-simvastatin",
    patientId: "patient-noah",
    name: "Simvastatin",
    genericName: "simvastatin",
    dose: "40 mg",
    route: "oral",
    frequency: "once nightly",
    prescribingClinician: "Dr. Synthetic Primary Care",
    startDate: "2025-07-15",
    notes: "Cholesterol medication.",
    active: true,
  },
  {
    id: "med-clarithromycin",
    patientId: "patient-noah",
    name: "Clarithromycin",
    genericName: "clarithromycin",
    dose: "500 mg",
    route: "oral",
    frequency: "twice daily for 7 days",
    prescribingClinician: "Dr. Synthetic Urgent Care",
    startDate: "2026-06-08",
    endDate: "2026-06-15",
    notes: "Short course antibiotic in demo conflict scenario.",
    active: true,
  },
  {
    id: "med-acetaminophen",
    patientId: "patient-noah",
    name: "Acetaminophen",
    genericName: "acetaminophen",
    dose: "500 mg",
    route: "oral",
    frequency: "every 8 hours as needed",
    prescribingClinician: "OTC entry",
    startDate: "2026-06-02",
    notes: "Pain relief.",
    active: true,
  },
  {
    id: "med-cold-flu",
    patientId: "patient-noah",
    name: "Cold relief acetaminophen combo",
    genericName: "acetaminophen phenylephrine dextromethorphan",
    dose: "1 caplet",
    route: "oral",
    frequency: "as needed",
    prescribingClinician: "OTC entry",
    startDate: "2026-06-09",
    notes: "Combination product with acetaminophen.",
    active: true,
  },
  {
    id: "med-diphenhydramine",
    patientId: "patient-sam",
    name: "Diphenhydramine",
    genericName: "diphenhydramine",
    dose: "25 mg",
    route: "oral",
    frequency: "as needed at bedtime",
    prescribingClinician: "OTC entry",
    startDate: "2026-05-28",
    notes: "Sedating antihistamine.",
    active: true,
  },
  {
    id: "med-alcohol",
    patientId: "patient-sam",
    name: "Alcohol",
    genericName: "alcohol",
    dose: "exposure flag",
    route: "oral",
    frequency: "demo lifestyle flag",
    prescribingClinician: "Demo flag",
    startDate: "2026-06-10",
    notes: "Used only to demonstrate sedation warning language.",
    active: true,
  },
  {
    id: "med-albuterol",
    patientId: "patient-sam",
    name: "Albuterol inhaler",
    genericName: "albuterol",
    dose: "90 mcg",
    route: "inhaled",
    frequency: "2 puffs every 4-6 hours as needed",
    prescribingClinician: "Dr. Synthetic Pediatrics",
    startDate: "2026-01-08",
    notes: "Rescue inhaler.",
    active: true,
  },
  {
    id: "med-fluticasone",
    patientId: "patient-sam",
    name: "Fluticasone inhaler",
    genericName: "fluticasone",
    dose: "110 mcg",
    route: "inhaled",
    frequency: "2 puffs twice daily",
    prescribingClinician: "Dr. Synthetic Pediatrics",
    startDate: "2026-03-12",
    notes: "Controller inhaler.",
    active: true,
  },
];

export const medicalDocuments: MedicalDocument[] = [
  {
    id: "doc-lab-ava-1",
    patientId: "patient-ava",
    type: "lab",
    title: "Metabolic and diabetes lab panel",
    date: "2026-06-03",
    clinician: "Dr. Synthetic Endocrinology",
    source: "sample",
    relatedMedicationIds: ["med-metformin", "med-lisinopril", "med-potassium"],
    relatedConditionIds: ["condition-diabetes", "condition-hypertension"],
    text: `Lab Results
A1C 8.1 %
LDL 136 mg/dL
HDL 42 mg/dL
Triglycerides 198 mg/dL
Creatinine 1.42 mg/dL
eGFR 48 mL/min
Potassium 5.5 mmol/L
Sodium 139 mmol/L
Hemoglobin 12.2 g/dL
WBC 6.9 K/uL
ALT 30 U/L
AST 27 U/L
Follow up: repeat kidney function and potassium in 2 weeks.`,
  },
  {
    id: "doc-lab-ava-2",
    patientId: "patient-ava",
    type: "lab",
    title: "Anticoagulation safety panel",
    date: "2026-05-18",
    clinician: "Dr. Synthetic Cardiology",
    source: "sample",
    relatedMedicationIds: ["med-warfarin"],
    text: `Lab Results
Hemoglobin 11.6 g/dL
WBC 7.4 K/uL
Creatinine 1.18 mg/dL
eGFR 58 mL/min
Potassium 4.8 mmol/L
ALT 44 U/L
AST 39 U/L
Note: patient reports occasional bruising. Confirm INR plan with anticoagulation clinic.`,
  },
  {
    id: "doc-lab-noah-1",
    patientId: "patient-noah",
    type: "lab",
    title: "Cholesterol and liver panel",
    date: "2026-06-01",
    clinician: "Dr. Synthetic Primary Care",
    source: "sample",
    relatedMedicationIds: ["med-simvastatin"],
    text: `Lab Results
LDL 92 mg/dL
HDL 48 mg/dL
Triglycerides 142 mg/dL
ALT 58 U/L
AST 52 U/L
Creatinine 1.01 mg/dL
eGFR 72 mL/min
Sodium 141 mmol/L
Potassium 4.2 mmol/L
Plan: review liver enzymes if muscle pain or new antibiotics are started.`,
  },
  {
    id: "doc-lab-noah-2",
    patientId: "patient-noah",
    type: "lab",
    title: "Pre-orthopedics basic labs",
    date: "2026-04-23",
    clinician: "Dr. Synthetic Orthopedics",
    source: "sample",
    text: `Lab Results
Hemoglobin 13.0 g/dL
WBC 5.6 K/uL
Creatinine 0.94 mg/dL
eGFR 80 mL/min
Sodium 140 mmol/L
Potassium 4.4 mmol/L
ALT 25 U/L
AST 24 U/L
No urgent abnormality noted in this synthetic sample.`,
  },
  {
    id: "doc-lab-sam-1",
    patientId: "patient-sam",
    type: "lab",
    title: "Asthma follow-up labs",
    date: "2026-05-22",
    clinician: "Dr. Synthetic Pediatrics",
    source: "sample",
    text: `Lab Results
Hemoglobin 13.8 g/dL
WBC 8.9 K/uL
Sodium 138 mmol/L
Potassium 4.1 mmol/L
ALT 18 U/L
AST 20 U/L
Note: seasonal allergies discussed. Bring inhaler technique questions to next visit.`,
  },
  {
    id: "doc-rx-ava-1",
    patientId: "patient-ava",
    type: "prescription",
    title: "Metformin prescription",
    date: "2026-05-31",
    clinician: "Dr. Synthetic Endocrinology",
    source: "sample",
    relatedMedicationIds: ["med-metformin"],
    text: `Prescription
Medication: Metformin
Dose: 500 mg
Route: oral
Frequency: twice daily with meals
Quantity: 60 tablets
Refills: 2
Prescriber: Dr. Synthetic Endocrinology
Start date: 2026-05-31
Note: review kidney function before dose changes.`,
  },
  {
    id: "doc-rx-ava-2",
    patientId: "patient-ava",
    type: "prescription",
    title: "Lisinopril prescription",
    date: "2026-05-20",
    clinician: "Dr. Synthetic Primary Care",
    source: "sample",
    relatedMedicationIds: ["med-lisinopril"],
    text: `Prescription
Medication: Lisinopril
Dose: 20 mg
Route: oral
Frequency: once daily
Quantity: 30 tablets
Refills: 5
Prescriber: Dr. Synthetic Primary Care
Start date: 2026-05-20
Note: monitor blood pressure and potassium.`,
  },
  {
    id: "doc-rx-noah-1",
    patientId: "patient-noah",
    type: "prescription",
    title: "Clarithromycin short course",
    date: "2026-06-08",
    clinician: "Dr. Synthetic Urgent Care",
    source: "sample",
    relatedMedicationIds: ["med-clarithromycin", "med-simvastatin"],
    text: `Prescription
Medication: Clarithromycin
Dose: 500 mg
Route: oral
Frequency: twice daily for 7 days
Quantity: 14 tablets
Refills: 0
Prescriber: Dr. Synthetic Urgent Care
Start date: 2026-06-08
Note: tell pharmacist about cholesterol medications.`,
  },
  {
    id: "doc-rx-noah-2",
    patientId: "patient-noah",
    type: "prescription",
    title: "Simvastatin refill",
    date: "2026-05-15",
    clinician: "Dr. Synthetic Primary Care",
    source: "sample",
    relatedMedicationIds: ["med-simvastatin"],
    text: `Prescription
Medication: Simvastatin
Dose: 40 mg
Route: oral
Frequency: once nightly
Quantity: 90 tablets
Refills: 1
Prescriber: Dr. Synthetic Primary Care
Start date: 2026-05-15
Note: call clinic for muscle pain or dark urine.`,
  },
  {
    id: "doc-rx-sam-1",
    patientId: "patient-sam",
    type: "prescription",
    title: "Fluticasone controller inhaler",
    date: "2026-04-14",
    clinician: "Dr. Synthetic Pediatrics",
    source: "sample",
    relatedMedicationIds: ["med-fluticasone"],
    text: `Prescription
Medication: Fluticasone inhaler
Dose: 110 mcg
Route: inhaled
Frequency: 2 puffs twice daily
Quantity: 1 inhaler
Refills: 3
Prescriber: Dr. Synthetic Pediatrics
Start date: 2026-04-14
Note: rinse mouth after use; review asthma action plan.`,
  },
  {
    id: "doc-note-ava-1",
    patientId: "patient-ava",
    type: "doctor-note",
    title: "Diabetes follow-up note",
    date: "2026-06-04",
    clinician: "Dr. Synthetic Endocrinology",
    source: "sample",
    text: `Assessment: Type 2 diabetes with A1C above individualized target. Kidney function lower than prior sample.
Plan: Continue metformin for now, review eGFR trend, repeat creatinine and potassium in 2 weeks, discuss nutrition support.
Symptoms: fatigue, no chest pain, no severe shortness of breath.
Follow-up: virtual check-in after labs.
Questions: Ask whether medication dose changes are needed if eGFR remains low.`,
  },
  {
    id: "doc-note-ava-2",
    patientId: "patient-ava",
    type: "doctor-note",
    title: "Anticoagulation clinic message",
    date: "2026-06-02",
    clinician: "Synthetic Anticoagulation Clinic",
    source: "sample",
    text: `Assessment: Patient on warfarin with new OTC pain medicine use.
Plan: Confirm INR testing schedule. Avoid adding NSAIDs without pharmacist review.
Follow-up: call clinic if unusual bleeding, black stools, severe headache, or major fall occurs.
Medication note: do not stop warfarin without medical advice.`,
  },
  {
    id: "doc-note-noah-1",
    patientId: "patient-noah",
    type: "doctor-note",
    title: "Urgent care respiratory note",
    date: "2026-06-08",
    clinician: "Dr. Synthetic Urgent Care",
    source: "sample",
    text: `Assessment: Suspected bacterial sinus infection. No emergency symptoms documented.
Plan: Clarithromycin prescribed. Patient should notify pharmacist about simvastatin before starting.
Follow-up: primary care if symptoms worsen or fever persists after 48 hours.`,
  },
  {
    id: "doc-note-noah-2",
    patientId: "patient-noah",
    type: "doctor-note",
    title: "Knee pain pre-specialist note",
    date: "2026-05-28",
    clinician: "Dr. Synthetic Orthopedics",
    source: "sample",
    text: `Assessment: Chronic knee pain with swelling after activity. MRI reviewed.
Plan: Physical therapy, acetaminophen within label limits, bring MRI transcript to specialist.
Follow-up: orthopedic visit scheduled for 2026-06-18.
Questions: Ask whether injection, brace, or surgery discussion is appropriate.`,
  },
  {
    id: "doc-note-sam-1",
    patientId: "patient-sam",
    type: "doctor-note",
    title: "Asthma action plan review",
    date: "2026-05-23",
    clinician: "Dr. Synthetic Pediatrics",
    source: "sample",
    text: `Assessment: Intermittent asthma with exercise and allergy triggers.
Plan: Continue fluticasone, use albuterol rescue inhaler as directed, check inhaler technique.
Follow-up: return sooner for nighttime symptoms, frequent rescue inhaler use, blue lips, severe trouble breathing, or chest retractions.
Questions: Ask how to adjust activity during high pollen days.`,
  },
  {
    id: "doc-dx-ava-1",
    patientId: "patient-ava",
    type: "diagnosis",
    title: "Type 2 diabetes summary",
    date: "2026-06-04",
    clinician: "Dr. Synthetic Endocrinology",
    source: "sample",
    relatedConditionIds: ["condition-diabetes"],
    text: `Diagnosis: Type 2 diabetes mellitus.
Usual monitoring: A1C, kidney function, eye exams, foot checks, medication tolerance.
Current concern: A1C above individualized target. Review treatment plan after repeat labs.`,
  },
  {
    id: "doc-dx-ava-2",
    patientId: "patient-ava",
    type: "diagnosis",
    title: "Hypertension summary",
    date: "2026-05-20",
    clinician: "Dr. Synthetic Primary Care",
    source: "sample",
    relatedConditionIds: ["condition-hypertension"],
    text: `Diagnosis: High blood pressure.
Usual monitoring: home blood pressure readings, kidney function, potassium, dizziness, medication side effects.
Care plan: measure blood pressure three times per week and bring readings to next visit.`,
  },
  {
    id: "doc-dx-noah-1",
    patientId: "patient-noah",
    type: "diagnosis",
    title: "Knee osteoarthritis summary",
    date: "2026-05-28",
    clinician: "Dr. Synthetic Orthopedics",
    source: "sample",
    relatedConditionIds: ["condition-knee"],
    text: `Diagnosis: Knee osteoarthritis with degenerative changes on imaging.
Usual monitoring: pain level, function, swelling, physical therapy response, fall risk.
Care plan: physical therapy exercises and specialist review of MRI report.`,
  },
  {
    id: "doc-dx-noah-2",
    patientId: "patient-noah",
    type: "diagnosis",
    title: "Hyperlipidemia summary",
    date: "2026-04-30",
    clinician: "Dr. Synthetic Primary Care",
    source: "sample",
    relatedConditionIds: ["condition-lipids"],
    text: `Diagnosis: High cholesterol.
Usual monitoring: LDL, HDL, triglycerides, liver enzymes, muscle symptoms, medication interactions.
Care plan: continue statin unless clinician advises otherwise; check medication interactions with new antibiotics.`,
  },
  {
    id: "doc-dx-sam-1",
    patientId: "patient-sam",
    type: "diagnosis",
    title: "Asthma diagnosis summary",
    date: "2026-05-23",
    clinician: "Dr. Synthetic Pediatrics",
    source: "sample",
    relatedConditionIds: ["condition-asthma"],
    text: `Diagnosis: Asthma with exercise and allergy triggers.
Usual monitoring: rescue inhaler use, nighttime symptoms, activity tolerance, peak flow if recommended.
Care plan: follow controller inhaler routine and review action plan before sports camp.`,
  },
  {
    id: "doc-mri-noah-1",
    patientId: "patient-noah",
    type: "radiology",
    title: "Right knee MRI transcript",
    date: "2026-05-26",
    clinician: "Synthetic Radiology Group",
    source: "sample",
    relatedConditionIds: ["condition-knee"],
    text: `MRI Right Knee
Findings: Moderate degenerative cartilage thinning in the medial compartment. Small joint effusion. Complex tear of the posterior horn of the medial meniscus. Mild bone marrow edema adjacent to the medial tibial plateau.
Impression: Degenerative medial meniscus tear and moderate osteoarthritis. No acute fracture. Recommend orthopedic follow-up.`,
  },
  {
    id: "doc-mri-ava-1",
    patientId: "patient-ava",
    type: "radiology",
    title: "Lumbar spine MRI transcript",
    date: "2026-04-11",
    clinician: "Synthetic Imaging Center",
    source: "sample",
    text: `MRI Lumbar Spine
Findings: Mild multilevel degenerative disc disease. Moderate foraminal stenosis at L4-L5. No destructive lesion. No severe central canal stenosis.
Impression: Degenerative changes with moderate L4-L5 foraminal stenosis. Correlate with symptoms and clinician exam.`,
  },
  {
    id: "doc-mri-sam-1",
    patientId: "patient-sam",
    type: "radiology",
    title: "Left ankle radiology-style report",
    date: "2026-03-19",
    clinician: "Synthetic Pediatric Imaging",
    source: "sample",
    text: `MRI Left Ankle
Findings: Mild soft tissue edema near the lateral ankle ligaments. No tendon tear. No suspicious bone lesion. Growth plates are open.
Impression: Mild sprain pattern without fracture. Follow up with clinician if pain persists.`,
  },
];

export const appointments: Appointment[] = [
  {
    id: "appt-ava-labs",
    patientId: "patient-ava",
    title: "Repeat kidney function and potassium lab",
    clinician: "Synthetic Lab Center",
    specialty: "Laboratory",
    dateTime: "2026-06-17T09:00:00",
    location: "Local demo lab",
    status: "confirmed",
  },
  {
    id: "appt-ava-endo",
    patientId: "patient-ava",
    title: "Diabetes plan review",
    clinician: "Dr. Synthetic Endocrinology",
    specialty: "Endocrinology",
    dateTime: "2026-06-24T14:30:00",
    location: "Video visit",
    status: "confirmed",
  },
  {
    id: "appt-ava-cardio",
    patientId: "patient-ava",
    title: "Anticoagulation review",
    clinician: "Synthetic Anticoagulation Clinic",
    specialty: "Cardiology",
    dateTime: "2026-06-13T11:15:00",
    location: "Clinic phone call",
    status: "needs-confirmation",
  },
  {
    id: "appt-noah-ortho",
    patientId: "patient-noah",
    title: "Knee MRI specialist visit",
    clinician: "Dr. Synthetic Orthopedics",
    specialty: "Orthopedics",
    dateTime: "2026-06-18T10:45:00",
    location: "Orthopedics clinic",
    status: "confirmed",
  },
  {
    id: "appt-noah-pt",
    patientId: "patient-noah",
    title: "Physical therapy evaluation",
    clinician: "Synthetic PT Center",
    specialty: "Physical Therapy",
    dateTime: "2026-06-20T08:30:00",
    location: "PT studio",
    status: "confirmed",
  },
  {
    id: "appt-noah-pcp",
    patientId: "patient-noah",
    title: "Medication reconciliation",
    clinician: "Dr. Synthetic Primary Care",
    specialty: "Primary Care",
    dateTime: "2026-06-12T15:00:00",
    location: "Video visit",
    status: "needs-confirmation",
  },
  {
    id: "appt-sam-peds",
    patientId: "patient-sam",
    title: "Asthma action plan check",
    clinician: "Dr. Synthetic Pediatrics",
    specialty: "Pediatrics",
    dateTime: "2026-06-21T13:15:00",
    location: "Pediatric clinic",
    status: "confirmed",
  },
  {
    id: "appt-sam-sports",
    patientId: "patient-sam",
    title: "Sports camp clearance review",
    clinician: "Dr. Synthetic Pediatrics",
    specialty: "Pediatrics",
    dateTime: "2026-06-26T09:45:00",
    location: "Pediatric clinic",
    status: "confirmed",
  },
  {
    id: "appt-sam-allergy",
    patientId: "patient-sam",
    title: "Allergy trigger consult",
    clinician: "Synthetic Allergy Clinic",
    specialty: "Allergy",
    dateTime: "2026-07-02T10:00:00",
    location: "Allergy clinic",
    status: "confirmed",
  },
  {
    id: "appt-ava-eye",
    patientId: "patient-ava",
    title: "Annual diabetes eye exam",
    clinician: "Synthetic Eye Care",
    specialty: "Ophthalmology",
    dateTime: "2026-07-08T09:20:00",
    location: "Eye clinic",
    status: "confirmed",
  },
];

export const carePlans: CarePlan[] = [
  {
    id: "plan-diabetes",
    patientId: "patient-ava",
    conditionId: "condition-diabetes",
    conditionName: "Type 2 diabetes",
    owner: "Ava Synthetic with endocrinology team",
    status: "needs-review",
    goals: [
      "Review A1C trend with clinician",
      "Complete follow-up kidney labs",
      "Keep medication routine visible",
    ],
    tasks: [
      {
        id: "task-ava-med",
        title: "Take metformin with breakfast and dinner",
        cadence: "Daily",
        status: "in-progress",
        linkType: "medication",
        linkedId: "med-metformin",
      },
      {
        id: "task-ava-lab",
        title: "Repeat creatinine, eGFR, and potassium",
        cadence: "Once",
        status: "not-started",
        dueDate: "2026-06-17",
        linkType: "appointment",
        linkedId: "appt-ava-labs",
      },
      {
        id: "task-ava-questions",
        title: "Ask whether kidney function changes medication plan",
        cadence: "Before next visit",
        status: "in-progress",
        dueDate: "2026-06-24",
        linkType: "document",
        linkedId: "doc-lab-ava-1",
      },
    ],
    questionsForNextVisit: [
      "Should the metformin dose change if eGFR stays below the demo threshold?",
      "What A1C target is appropriate for this care plan?",
      "Should potassium supplement continue with lisinopril?",
    ],
    progressNotes: [
      "Medication routine completed 5 of last 7 days in demo data.",
      "Lab follow-up is scheduled but not yet completed.",
    ],
  },
  {
    id: "plan-bp",
    patientId: "patient-ava",
    conditionId: "condition-hypertension",
    conditionName: "High blood pressure",
    owner: "Primary care team",
    status: "active",
    goals: [
      "Record home readings",
      "Review elevated readings without over-interpreting",
    ],
    tasks: [
      {
        id: "task-bp-check",
        title: "Check blood pressure 3x this week",
        cadence: "3x weekly",
        status: "in-progress",
        linkType: "diagnosis",
        linkedId: "doc-dx-ava-2",
      },
      {
        id: "task-bp-list",
        title: "Bring readings to primary care visit",
        cadence: "Before visit",
        status: "not-started",
        dueDate: "2026-06-24",
      },
    ],
    questionsForNextVisit: [
      "Are the current home blood pressure targets appropriate?",
      "Do elevated readings change medication timing?",
    ],
    progressNotes: ["4 of last 7 readings are above the demo target range."],
  },
  {
    id: "plan-knee",
    patientId: "patient-noah",
    conditionId: "condition-knee",
    conditionName: "Knee osteoarthritis and meniscus tear",
    owner: "Caregiver and orthopedics team",
    status: "active",
    goals: [
      "Improve function",
      "Prepare MRI questions",
      "Avoid duplicate pain medicine products",
    ],
    tasks: [
      {
        id: "task-knee-mri",
        title: "Bring MRI transcript to specialist",
        cadence: "Once",
        status: "in-progress",
        dueDate: "2026-06-18",
        linkType: "document",
        linkedId: "doc-mri-noah-1",
      },
      {
        id: "task-knee-pt",
        title: "Complete PT home exercises",
        cadence: "Daily",
        status: "not-started",
        linkType: "appointment",
        linkedId: "appt-noah-pt",
      },
    ],
    questionsForNextVisit: [
      "What does the meniscus tear mean for activity?",
      "Should pain medicine choices be reviewed because of combo products?",
    ],
    progressNotes: [
      "Specialist visit confirmed.",
      "Pain medicine list contains duplicate acetaminophen exposure in demo data.",
    ],
  },
  {
    id: "plan-lipids",
    patientId: "patient-noah",
    conditionId: "condition-lipids",
    conditionName: "High cholesterol",
    owner: "Primary care team",
    status: "needs-review",
    goals: [
      "Review antibiotic and statin overlap",
      "Monitor muscle symptoms during short antibiotic course",
    ],
    tasks: [
      {
        id: "task-statin-pharm",
        title: "Ask pharmacist about simvastatin and clarithromycin",
        cadence: "Before next dose",
        status: "blocked",
        dueDate: "2026-06-11",
        linkType: "medication",
        linkedId: "med-clarithromycin",
      },
      {
        id: "task-statin-note",
        title: "Track muscle pain or dark urine symptoms",
        cadence: "Daily while antibiotic active",
        status: "in-progress",
      },
    ],
    questionsForNextVisit: [
      "Should simvastatin be paused or changed during antibiotic treatment?",
      "Which symptoms require urgent attention?",
    ],
    progressNotes: ["High-severity medication interaction alert is active."],
  },
  {
    id: "plan-asthma",
    patientId: "patient-sam",
    conditionId: "condition-asthma",
    conditionName: "Asthma",
    owner: "Parent/caregiver and pediatrics team",
    status: "monitoring",
    goals: [
      "Keep controller inhaler routine",
      "Know emergency symptoms",
      "Ask about activity targets for sports camp",
    ],
    tasks: [
      {
        id: "task-asthma-controller",
        title: "Use controller inhaler morning and evening",
        cadence: "Daily",
        status: "in-progress",
        linkType: "medication",
        linkedId: "med-fluticasone",
      },
      {
        id: "task-asthma-plan",
        title: "Review asthma action plan before sports camp",
        cadence: "Weekly",
        status: "not-started",
        dueDate: "2026-06-21",
        linkType: "document",
        linkedId: "doc-note-sam-1",
      },
    ],
    questionsForNextVisit: [
      "How often should rescue inhaler use trigger a clinic call?",
      "What activity target is appropriate during high pollen days?",
    ],
    progressNotes: [
      "Controller inhaler adherence is steady in demo reminders.",
      "Sleep dipped on two high-activity days in fitness sample.",
    ],
  },
];

export const reminders: Reminder[] = [
  {
    id: "rem-ava-metformin-am",
    patientId: "patient-ava",
    kind: "medication",
    title: "Metformin with breakfast",
    dueAt: "2026-06-11T08:00:00",
    status: "completed",
    linkedMedicationId: "med-metformin",
  },
  {
    id: "rem-ava-warfarin",
    patientId: "patient-ava",
    kind: "medication",
    title: "Warfarin evening dose",
    dueAt: "2026-06-11T19:00:00",
    status: "scheduled",
    linkedMedicationId: "med-warfarin",
    notes: "Do not stop without clinician guidance.",
  },
  {
    id: "rem-ava-bp",
    patientId: "patient-ava",
    kind: "treatment",
    title: "Log blood pressure reading",
    dueAt: "2026-06-11T20:00:00",
    status: "scheduled",
    linkedCarePlanId: "plan-bp",
  },
  {
    id: "rem-ava-refill",
    patientId: "patient-ava",
    kind: "refill",
    title: "Request potassium refill review",
    dueAt: "2026-06-10T17:00:00",
    status: "missed",
    linkedMedicationId: "med-potassium",
  },
  {
    id: "rem-noah-pharm",
    patientId: "patient-noah",
    kind: "treatment",
    title: "Call pharmacist about antibiotic/statin overlap",
    dueAt: "2026-06-11T10:00:00",
    status: "scheduled",
    linkedMedicationId: "med-clarithromycin",
  },
  {
    id: "rem-noah-appt",
    patientId: "patient-noah",
    kind: "appointment",
    title: "Confirm medication reconciliation visit",
    dueAt: "2026-06-11T16:00:00",
    status: "scheduled",
    linkedAppointmentId: "appt-noah-pcp",
  },
  {
    id: "rem-noah-pt",
    patientId: "patient-noah",
    kind: "treatment",
    title: "Do knee PT home exercises",
    dueAt: "2026-06-11T18:30:00",
    status: "snoozed",
    linkedCarePlanId: "plan-knee",
  },
  {
    id: "rem-sam-inhaler-am",
    patientId: "patient-sam",
    kind: "medication",
    title: "Fluticasone controller inhaler",
    dueAt: "2026-06-11T07:30:00",
    status: "completed",
    linkedMedicationId: "med-fluticasone",
  },
  {
    id: "rem-sam-inhaler-pm",
    patientId: "patient-sam",
    kind: "medication",
    title: "Fluticasone evening dose",
    dueAt: "2026-06-11T20:30:00",
    status: "scheduled",
    linkedMedicationId: "med-fluticasone",
  },
  {
    id: "rem-sam-plan",
    patientId: "patient-sam",
    kind: "treatment",
    title: "Review asthma action plan",
    dueAt: "2026-06-12T17:00:00",
    status: "scheduled",
    linkedCarePlanId: "plan-asthma",
  },
  {
    id: "rem-history-1",
    patientId: "patient-ava",
    kind: "medication",
    title: "Metformin with breakfast",
    dueAt: "2026-06-10T08:00:00",
    status: "completed",
    linkedMedicationId: "med-metformin",
  },
  {
    id: "rem-history-2",
    patientId: "patient-ava",
    kind: "medication",
    title: "Metformin with breakfast",
    dueAt: "2026-06-09T08:00:00",
    status: "completed",
    linkedMedicationId: "med-metformin",
  },
  {
    id: "rem-history-3",
    patientId: "patient-ava",
    kind: "medication",
    title: "Metformin with dinner",
    dueAt: "2026-06-08T18:00:00",
    status: "skipped",
    linkedMedicationId: "med-metformin",
  },
  {
    id: "rem-history-4",
    patientId: "patient-noah",
    kind: "treatment",
    title: "Knee PT home exercises",
    dueAt: "2026-06-10T18:30:00",
    status: "missed",
    linkedCarePlanId: "plan-knee",
  },
];

function buildFitnessSamples(): FitnessSample[] {
  const configs = [
    {
      patientId: "patient-ava",
      baseSteps: 6200,
      baseRhr: 76,
      baseSleep: 6.6,
      baseActive: 34,
      baseWeight: 184,
      bpBase: [136, 84],
      glucoseBase: 145,
    },
    {
      patientId: "patient-noah",
      baseSteps: 4300,
      baseRhr: 70,
      baseSleep: 7.1,
      baseActive: 26,
      baseWeight: 171,
      bpBase: [128, 78],
      glucoseBase: undefined,
    },
    {
      patientId: "patient-sam",
      baseSteps: 9100,
      baseRhr: 64,
      baseSleep: 8.2,
      baseActive: 52,
      baseWeight: 118,
      bpBase: [112, 68],
      glucoseBase: undefined,
    },
  ];
  const start = new Date("2026-05-13T00:00:00");
  return configs.flatMap((config) =>
    Array.from({ length: 30 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const wave = Math.sin(index / 3);
      const weekendDip = index % 7 === 5 ? -900 : index % 7 === 6 ? -450 : 0;
      const todayDip = index === 29 && config.patientId === "patient-ava" ? -1600 : 0;
      const bpLift =
        config.patientId === "patient-ava" && [22, 24, 26, 28].includes(index)
          ? 8
          : 0;
      return {
        date: date.toISOString().slice(0, 10),
        patientId: config.patientId,
        steps: Math.round(config.baseSteps + wave * 600 + weekendDip + todayDip),
        restingHeartRate: Math.round(config.baseRhr + Math.cos(index / 4) * 3),
        sleepHours: Number((config.baseSleep + Math.sin(index / 5) * 0.55 - (index === 29 ? 0.5 : 0)).toFixed(1)),
        activeMinutes: Math.max(
          12,
          Math.round(config.baseActive + Math.sin(index / 2) * 7 + weekendDip / 250),
        ),
        weightLbs: Number((config.baseWeight + Math.sin(index / 8) * 1.4).toFixed(1)),
        systolic: config.bpBase[0] + bpLift + Math.round(Math.sin(index / 2) * 3),
        diastolic: config.bpBase[1] + Math.round(Math.cos(index / 2) * 2),
        bloodGlucose: config.glucoseBase
          ? Math.round(config.glucoseBase + Math.sin(index / 3) * 12 + (index === 29 ? 10 : 0))
          : undefined,
      };
    }),
  );
}

export const fitnessSamples: FitnessSample[] = buildFitnessSamples();

export const conflictScenarios: ConflictScenario[] = [
  {
    id: "scenario-warfarin-ibuprofen",
    title: "Warfarin plus ibuprofen",
    medicationNames: ["Warfarin", "Ibuprofen"],
    expectedSeverity: "Critical",
    expectedAlert: true,
  },
  {
    id: "scenario-lisinopril-potassium",
    title: "Lisinopril plus potassium supplement",
    medicationNames: ["Lisinopril", "Potassium supplement"],
    expectedSeverity: "High",
    expectedAlert: true,
  },
  {
    id: "scenario-metformin-egfr",
    title: "Metformin with reduced kidney function flag",
    medicationNames: ["Metformin", "Reduced kidney function flag"],
    expectedSeverity: "High",
    expectedAlert: true,
  },
  {
    id: "scenario-simvastatin-clarithromycin",
    title: "Simvastatin plus clarithromycin",
    medicationNames: ["Simvastatin", "Clarithromycin"],
    expectedSeverity: "High",
    expectedAlert: true,
  },
  {
    id: "scenario-duplicate-acetaminophen",
    title: "Duplicate acetaminophen products",
    medicationNames: ["Acetaminophen", "Cold relief acetaminophen combo"],
    expectedSeverity: "Moderate",
    expectedAlert: true,
  },
  {
    id: "scenario-antihistamine-alcohol",
    title: "Sedating antihistamine plus alcohol",
    medicationNames: ["Diphenhydramine", "Alcohol"],
    expectedSeverity: "Moderate",
    expectedAlert: true,
  },
  {
    id: "scenario-albuterol-fluticasone",
    title: "Controller and rescue inhalers",
    medicationNames: ["Albuterol inhaler", "Fluticasone inhaler"],
    expectedAlert: false,
  },
  {
    id: "scenario-lisinopril-metformin",
    title: "Lisinopril plus metformin",
    medicationNames: ["Lisinopril", "Metformin"],
    expectedAlert: false,
  },
  {
    id: "scenario-simvastatin-acetaminophen",
    title: "Simvastatin plus acetaminophen",
    medicationNames: ["Simvastatin", "Acetaminophen"],
    expectedAlert: false,
  },
  {
    id: "scenario-warfarin-fluticasone",
    title: "Warfarin plus inhaled fluticasone",
    medicationNames: ["Warfarin", "Fluticasone inhaler"],
    expectedAlert: false,
  },
];
