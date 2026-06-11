# Safety And Privacy

MedDcode is a synthetic-data demo. It is designed to show a credible healthcare safety posture without pretending to be a medical device or clinician.

## Medical Boundaries

- MedDcode does not diagnose.
- MedDcode does not prescribe.
- MedDcode does not replace licensed clinicians.
- Medical explanations are educational/plain-language support only.
- Medication conflict alerts are non-exhaustive safety checks.
- Users should confirm medication concerns with a doctor or pharmacist.
- Users should not stop prescribed medication without medical advice.
- Emergency symptoms should trigger urgent or emergency care, not app-based handling.

## Privacy Boundaries

- Synthetic demo data only.
- No real PHI should be entered into the repository.
- No telemetry is implemented.
- No external API calls are required for the local demo.
- User consent would be required before any production integration.
- Browser-held secrets are not acceptable for production.

## Production Controls Required

Before real patient data, MedDcode would need:

- HIPAA-grade security and privacy review
- Authentication and RBAC
- Encryption in transit and at rest
- Audit logging
- Consent management
- Data retention policies
- Incident response procedures
- Secure secret storage through OCI Vault or equivalent
- Clinical review of explanations and medication rules
- Validation of safety behavior and escalation language

## OCI And GenAI Safety Posture

The local demo uses deterministic services. In production, OCI Generative AI should be called through a secure backend, with no secrets in the browser. Outputs should be bounded by deterministic parsers, safety copy, clinician-reviewed prompts, response filters, and user-facing caveats.

## Repository Hygiene

Credential-like local files are ignored in `.gitignore`. Do not commit wallets, keys, tokens, passwords, or real patient data.
