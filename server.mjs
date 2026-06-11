/* global console, fetch, process, URL */

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const port = Number(process.env.PORT ?? 8501);
const host = process.env.HOST ?? "0.0.0.0";
const distDir = resolve(process.env.MEDDCODE_DIST_DIR ?? "dist");
const keyPath = process.env.OCI_GENAI_API_KEY_PATH ?? "/home/opc/.keys/api_genai_key1";
const genAiEndpoint = process.env.OCI_GENAI_ENDPOINT ?? "";
const genAiModelId = process.env.OCI_GENAI_MODEL_ID ?? "";
const ociRegion = process.env.OCI_REGION ?? "unknown";
const compartmentOcid = process.env.OCI_COMPARTMENT_OCID ?? "";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function readApiKey() {
  if (!existsSync(keyPath)) {
    return "";
  }
  return readFileSync(keyPath, "utf8").trim();
}

function json(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function getGenAiStatus() {
  const key = readApiKey();
  return {
    mode: key ? "oci-genai-key-loaded" : "local-demo",
    label: key ? "OCI GenAI key loaded on jumphost" : "OCI GenAI-ready local demo",
    details: key
      ? "The deployment server can access the OCI GenAI API key from the jumphost. Browser code never receives the key."
      : "The deployment server did not find an OCI GenAI API key, so deterministic local demo logic is used.",
    keyLoaded: Boolean(key),
    keyPath,
    endpointConfigured: Boolean(genAiEndpoint),
    modelConfigured: Boolean(genAiModelId),
    region: ociRegion,
    compartmentConfigured: Boolean(compartmentOcid),
  };
}

async function readRequestJson(req) {
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 128_000) {
      throw new Error("Request body too large");
    }
  }
  return body ? JSON.parse(body) : {};
}

async function handleGenAiDecode(req, res) {
  const status = getGenAiStatus();
  if (!status.keyLoaded || !genAiEndpoint) {
    json(res, 503, {
      ...status,
      message:
        "OCI GenAI key detection is active, but no endpoint is configured. The frontend should continue using deterministic safety-first decoding.",
    });
    return;
  }

  const key = readApiKey();
  const payload = await readRequestJson(req);
  const response = await fetch(genAiEndpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      modelId: genAiModelId || undefined,
      compartmentId: compartmentOcid || undefined,
      input: payload,
      safetyInstruction:
        "Educational plain-language support only. Do not diagnose, prescribe, or replace a licensed clinician.",
    }),
  });

  const text = await response.text();
  res.writeHead(response.status, {
    "content-type": response.headers.get("content-type") ?? "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(text);
}

function serveStatic(req, res) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const requestedPath = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const normalizedPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(join(distDir, normalizedPath));

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  const finalPath = existsSync(filePath) && statSync(filePath).isFile()
    ? filePath
    : join(distDir, "index.html");
  const ext = extname(finalPath);
  res.writeHead(200, {
    "content-type": contentTypes[ext] ?? "application/octet-stream",
    "cache-control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });
  res.end(readFileSync(finalPath));
}

const server = createServer(async (req, res) => {
  try {
    if (req.url?.startsWith("/api/genai/status")) {
      json(res, 200, getGenAiStatus());
      return;
    }
    if (req.url?.startsWith("/api/genai/decode") && req.method === "POST") {
      await handleGenAiDecode(req, res);
      return;
    }
    serveStatic(req, res);
  } catch (error) {
    json(res, 500, {
      error: "MedDcode server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

server.listen(port, host, () => {
  const status = getGenAiStatus();
  console.log(`MedDcode listening on http://${host}:${port}`);
  console.log(`${status.label}; endpointConfigured=${status.endpointConfigured}`);
});
