# MedDcode

**Decode your care. Stay on track.**

MedDcode is an investor-demo-ready healthcare education MVP for helping patients and caregivers understand synthetic medical information, organize treatment tasks, review non-exhaustive medication safety alerts, and connect wearable-style trends to daily care routines.

This app does **not** diagnose, prescribe, or replace a licensed clinician. All data in this repository is synthetic demo data.

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

GitHub Pages HTTPS build:

```bash
npm run build:pages
```

The Pages version is published from `main/docs` at `https://alexnovikov-oracle.github.io/FY27_Hackathon_Poker_Protocols/`.

The HTTPS forwarding link for the live OCI-hosted service is `https://alexnovikov-oracle.github.io/FY27_Hackathon_Poker_Protocols/live/`, which redirects to `http://137.23.19.214:8501/`.

For the OCI jumphost deployment server:

```bash
npm run build
PORT=8501 OCI_GENAI_API_KEY_PATH=/home/opc/.keys/api_genai_key1 npm run serve:oci
```

On the provided jumphost, MedDcode is deployed as a `systemd` service:

```bash
sudo systemctl status meddcode
sudo journalctl -u meddcode -f
```

The server exposes `GET /api/genai/status` to confirm whether the OCI GenAI key is loaded on the host without exposing the key to browser code.

## Verification Commands

```bash
npm run test
npm run build
npm run lint
```

## What Is Included

- Landing page with `Launch Demo`
- Patient dashboard with non-clinical weekly readiness score
- Document center for labs, prescriptions, doctor notes, diagnosis summaries, and MRI/radiology-style transcripts
- Deterministic document parsing and plain-language explanation service
- Medication manager with local synthetic interaction rules
- Reminder module for medications, appointments, treatment tasks, and refills
- Treatment plan dashboard with tasks, goals, timelines, and doctor-question queue
- Fitness tracker demo mode with 30 days of synthetic samples per profile
- Investor demo page and privacy/security page
- Unit tests for medication conflict logic, reminder logic, and fitness insight calculations

## Sample Data

Synthetic data lives in [`src/data/sampleData.ts`](src/data/sampleData.ts).

It includes:

- 3 demo patient/caregiver profiles
- 5 lab result documents
- 5 prescription documents
- 5 doctor-note documents
- 5 diagnosis summaries
- 3 MRI/radiology-style reports
- 30 days of synthetic fitness data for each profile
- 10 appointments
- 5 care plans
- 10 medication conflict scenarios, including no-conflict scenarios

## Deterministic Services

Core logic is organized in [`src/services`](src/services):

- `documentParserService.ts`
- `plainLanguageTranslatorService.ts`
- `medicationInteractionService.ts`
- `reminderService.ts`
- `treatmentPlanService.ts`
- `fitnessInsightsService.ts`
- `reportService.ts`
- `ociGenAiService.ts`

The local MVP does not require an external LLM. The OCI GenAI adapter currently exposes setup/configuration status and documents the secure future integration path.

## OCI Deployment Posture

For a production OCI deployment, use a secure backend between the browser and OCI services:

1. Host the frontend on OCI Object Storage static website hosting, OCI Load Balancer, or an OCI-hosted web tier.
2. Put API Gateway in front of backend Functions, Container Instances, or OKE services.
3. Store secrets in OCI Vault, not in frontend env vars.
4. Use OCI Generative AI from the backend for explanation drafts, with deterministic safety guardrails and clinician-reviewed prompts.
5. Store structured user data in Autonomous Database with wallet-based connectivity from the backend only.
6. Add OCI Logging, Audit, WAF, IAM policies, encryption, RBAC, and consent management before any real PHI workflow.

`.env.example` contains frontend placeholders only. Do not expose private keys, wallets, or API credentials in browser code.

## Known Limitations

- Uses synthetic demo data only.
- Medication interaction rules are intentionally small and non-exhaustive.
- Document parsing is deterministic and covers common demo patterns, not arbitrary clinical documents.
- Fitness integration is simulated and does not use OAuth.
- No real PHI storage, authentication, RBAC, audit logging, clinical validation, or HIPAA compliance implementation is included.
- OCI GenAI key access is handled by the deployment server through `/api/genai/status`; the key is never sent to browser code. `/api/genai/decode` is available for a future configured GenAI endpoint, while deterministic safety-first decoding remains the default fallback.

## Next Steps

- Build secure OCI backend service boundaries.
- Add FHIR import/export and patient-consent workflows.
- Validate medication rules against RxNorm, DrugBank, FDA labels, and pharmacist review.
- Add clinician-reviewed OCI GenAI prompt and response guardrails.
- Add authentication, RBAC, audit logging, encryption, and HIPAA-grade controls.
- Run a clinical usability study focused on comprehension, adherence, and escalation behavior.
