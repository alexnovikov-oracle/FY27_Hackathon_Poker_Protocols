export interface OciGenAiAdapterStatus {
  mode: "local-demo" | "configured" | "oci-genai-key-loaded";
  label: string;
  details: string;
  keyLoaded?: boolean;
  keyPath?: string;
  endpointConfigured?: boolean;
  modelConfigured?: boolean;
  region?: string;
  compartmentConfigured?: boolean;
}

export function getOciGenAiAdapterStatus(): OciGenAiAdapterStatus {
  const externalEnabled = import.meta.env.VITE_ENABLE_EXTERNAL_AI === "true";
  const endpoint = import.meta.env.VITE_OCI_GENAI_ENDPOINT;
  if (externalEnabled && endpoint) {
    return {
      mode: "configured",
      label: "OCI GenAI endpoint configured",
      details:
        "The frontend is configured for an explicit integration path. Production should call OCI GenAI through a secure backend, never with browser-held secrets.",
    };
  }
  return {
    mode: "local-demo",
    label: "OCI GenAI-ready local demo",
    details:
      "This MVP uses deterministic local translation logic by default. README includes OCI deployment and GenAI integration placeholders for a secure backend.",
  };
}

export async function fetchOciGenAiAdapterStatus(): Promise<OciGenAiAdapterStatus | undefined> {
  try {
    const response = await fetch("/api/genai/status", {
      headers: { accept: "application/json" },
    });
    if (!response.ok) return undefined;
    return (await response.json()) as OciGenAiAdapterStatus;
  } catch {
    return undefined;
  }
}
