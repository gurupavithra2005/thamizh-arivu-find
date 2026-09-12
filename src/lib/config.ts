/**
 * Central retrieval / embedding configuration.
 *
 * Nothing in the application should hardcode an embedding dimension or model
 * name. The SQL schema was created with EMBEDDING_DIMENSION below; changing it
 * requires a matching migration on public.document_chunks.embedding.
 *
 * Server-only secrets (OPENAI_API_KEY, WEB_SEARCH_API_KEY,
 * SUPABASE_SERVICE_ROLE_KEY) must never be read from this module in client
 * code — read them with process.env inside a server function handler.
 */

function serverEnv(name: string, fallback: string): string {
  if (typeof process === "undefined") return fallback;
  return process.env[name] ?? fallback;
}

/** Must match the vector(N) column in public.document_chunks. */
export const EMBEDDING_DIMENSION = 768;

export const embeddingConfig = () => ({
  provider: serverEnv("EMBEDDING_PROVIDER", "google"),
  model: serverEnv("EMBEDDING_MODEL", "text-embedding-004"),
  dimension: Number(serverEnv("EMBEDDING_DIMENSION", String(EMBEDDING_DIMENSION))),
});

export const llmConfig = () => ({
  model: serverEnv("LLM_MODEL", "google/gemini-2.5-flash"),
});

export const webSearchConfig = () => ({
  provider: serverEnv("WEB_SEARCH_PROVIDER", "none"),
});

/** Parent / child chunking targets, in tokens. Configurable per ingestion run. */
export const chunkingConfig = {
  childMinTokens: Number(serverEnv("CHUNK_CHILD_MIN_TOKENS", "150")),
  childMaxTokens: Number(serverEnv("CHUNK_CHILD_MAX_TOKENS", "300")),
  parentMinTokens: Number(serverEnv("CHUNK_PARENT_MIN_TOKENS", "700")),
  parentMaxTokens: Number(serverEnv("CHUNK_PARENT_MAX_TOKENS", "1200")),
};

/** Retrieval defaults used by the Phase 2 hybrid search pipeline. */
export const retrievalConfig = {
  childMatchCount: 12,
  keywordMatchCount: 12,
  hydrateParentChunks: true,
  similarityThreshold: 0.2,
};

export const STORAGE_BUCKETS = {
  sourceDocuments: "source-documents",
  ocrDocuments: "ocr-documents",
} as const;
