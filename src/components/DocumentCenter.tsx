import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FileText, Filter, Loader2, Upload } from "lucide-react";
import type { DocumentTranslation, DocumentType, MedicalDocument } from "../types/domain";
import { translateDocument, translateUploadedText } from "../services/plainLanguageTranslatorService";
import {
  fetchOciGenAiAdapterStatus,
  getOciGenAiAdapterStatus,
} from "../services/ociGenAiService";
import { Badge } from "./Badge";
import { EmptyState } from "./EmptyState";

interface DocumentCenterProps {
  documents: MedicalDocument[];
}

const typeOptions: Array<{ value: "all" | DocumentType; label: string }> = [
  { value: "all", label: "All" },
  { value: "lab", label: "Labs" },
  { value: "prescription", label: "Prescriptions" },
  { value: "doctor-note", label: "Doctor notes" },
  { value: "diagnosis", label: "Diagnoses" },
  { value: "radiology", label: "MRI/radiology" },
];

function badgeTone(color: string) {
  return color === "red" ? "red" : color === "yellow" ? "yellow" : "green";
}

export function DocumentCenter({ documents }: DocumentCenterProps) {
  const [filter, setFilter] = useState<"all" | DocumentType>("all");
  const [selectedId, setSelectedId] = useState(documents[0]?.id ?? "");
  const [eli12, setEli12] = useState(false);
  const [uploadedText, setUploadedText] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [error, setError] = useState("");
  const [adapter, setAdapter] = useState(getOciGenAiAdapterStatus());

  useEffect(() => {
    void fetchOciGenAiAdapterStatus().then((status) => {
      if (status) setAdapter(status);
    });
  }, []);

  const filtered = useMemo(
    () => documents.filter((document) => filter === "all" || document.type === filter),
    [documents, filter],
  );
  const selected = documents.find((document) => document.id === selectedId) ?? filtered[0];
  const uploadedTranslation = uploadedText.trim() ? translateUploadedText(uploadedText) : undefined;
  const translation: DocumentTranslation | undefined = uploadedTranslation ?? (selected ? translateDocument(selected) : undefined);

  function handleFilter(nextFilter: "all" | DocumentType) {
    setFilter(nextFilter);
    const first = documents.find((document) => nextFilter === "all" || document.type === nextFilter);
    setSelectedId(first?.id ?? "");
    setUploadedText("");
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (!file.type.includes("text") && !file.name.endsWith(".txt")) {
      setError("For this local MVP, upload a plain-text synthetic document.");
      return;
    }
    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedText(String(reader.result ?? ""));
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      setError("The file could not be read in the browser demo.");
      setIsReadingFile(false);
    };
    reader.readAsText(file);
  }

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Document center</p>
          <h2>Plain-language decoding for synthetic medical documents.</h2>
          <p>
            Deterministic parsing highlights terms, abnormal demo values, medication mentions,
            follow-up tasks, and questions to bring to a clinician.
          </p>
        </div>
        <div className="status-tile">
          <Badge tone={adapter.keyLoaded || adapter.mode === "configured" ? "green" : "neutral"}>{adapter.label}</Badge>
          <p>{adapter.details}</p>
        </div>
      </section>

      <section className="toolbar-panel">
        <div className="segmented-control" aria-label="Document type filter">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={filter === option.value ? "active" : ""}
              onClick={() => handleFilter(option.value)}
            >
              <Filter size={14} />
              {option.label}
            </button>
          ))}
        </div>
        <label className="upload-button">
          <Upload size={16} />
          Upload text
          <input type="file" accept=".txt,text/plain" onChange={handleFile} />
        </label>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="document-layout">
        <aside className="document-list">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Samples</p>
              <h3>{filtered.length} documents</h3>
            </div>
          </div>
          {filtered.map((document) => (
            <button
              key={document.id}
              type="button"
              className={document.id === selected?.id && !uploadedText ? "document-list-item active" : "document-list-item"}
              onClick={() => {
                setSelectedId(document.id);
                setUploadedText("");
              }}
            >
              <FileText size={17} />
              <span>
                <strong>{document.title}</strong>
                <small>{document.type} · {document.date}</small>
              </span>
            </button>
          ))}
          {!filtered.length && (
            <EmptyState title="No documents" detail="This filter has no synthetic samples for the selected profile." />
          )}
        </aside>

        <div className="document-main">
          <article className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Original text</p>
                <h3>{uploadedText ? "Uploaded synthetic document" : selected?.title ?? "No document selected"}</h3>
              </div>
              <label className="toggle-row">
                <input type="checkbox" checked={eli12} onChange={(event) => setEli12(event.target.checked)} />
                <span>Explain like I’m 12</span>
              </label>
            </div>
            {isReadingFile ? (
              <div className="loading-state">
                <Loader2 className="spin" size={24} />
                Reading file...
              </div>
            ) : (
              <pre className="document-text">{uploadedText || selected?.text || "Select a document to decode."}</pre>
            )}
          </article>

          {translation ? (
            <article className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Translation</p>
                  <h3>Plain-language support</h3>
                </div>
                <Badge tone="neutral">Educational only</Badge>
              </div>
              <p className="translation-lead">{eli12 ? translation.eli12 : translation.plainEnglish}</p>

              <div className="badge-row">
                {translation.badges.map((badge) => (
                  <Badge key={`${badge.label}-${badge.detail}`} tone={badgeTone(badge.color)} title={badge.detail}>
                    {badge.label}
                  </Badge>
                ))}
              </div>

              <div className="two-column">
                <section>
                  <h4>Key extracted entities</h4>
                  <div className="entity-list">
                    {translation.entities.map((entity) => (
                      <div key={`${entity.label}-${entity.value}`}>
                        <span>{entity.label}</span>
                        <strong>{entity.value}</strong>
                        {entity.status && <Badge tone={badgeTone(entity.status)}>{entity.status}</Badge>}
                      </div>
                    ))}
                    {!translation.entities.length && <p className="muted">No structured entities detected.</p>}
                  </div>
                </section>
                <section>
                  <h4>What this may mean</h4>
                  <ul className="clean-list">
                    {translation.whatThisMayMean.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="two-column">
                <section>
                  <h4>Important terms</h4>
                  <div className="glossary-list">
                    {translation.glossary.map((term) => (
                      <div key={term.term}>
                        <strong>{term.term}</strong>
                        <p>{term.explanation}</p>
                      </div>
                    ))}
                    {!translation.glossary.length && <p className="muted">No glossary terms matched the demo library.</p>}
                  </div>
                </section>
                <section>
                  <h4>What to ask your doctor</h4>
                  <ul className="clean-list">
                    {translation.questionsForDoctor.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="safety-box">
                {translation.caveats.map((caveat) => (
                  <p key={caveat}>{caveat}</p>
                ))}
              </div>
            </article>
          ) : (
            <EmptyState title="Select a document" detail="Choose a synthetic sample or upload a plain-text demo document." />
          )}
        </div>
      </section>
    </div>
  );
}
