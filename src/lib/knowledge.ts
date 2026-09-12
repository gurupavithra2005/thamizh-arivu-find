import type { Tables } from "@/integrations/supabase/types";
import type { KnowledgeSource, SourceType } from "@/lib/mock-data";

export type KnowledgeSourceRow = Tables<"knowledge_sources">;
export type ConversationRow = Tables<"conversations">;
export type MessageRow = Tables<"messages">;
export type CitationRow = Tables<"citations">;
export type OcrDocumentRow = Tables<"ocr_documents">;

const SOURCE_TYPE_MAP: Record<string, SourceType> = {
  webpage: "webpage",
  book: "book",
  ebook: "ebook",
  pdf: "pdf",
  document: "document",
  digital_archive: "archive",
  ocr_document: "ocr",
};

/**
 * Maps a stored knowledge_sources row onto the shape the existing UI cards use.
 * `relevance` is only meaningful for ranked retrieval results (Phase 2); for a
 * plain catalogue listing it is passed in explicitly or left at 0.
 */
export function toUiSource(row: KnowledgeSourceRow, relevance = 0): KnowledgeSource {
  return {
    id: row.id,
    title: row.title,
    type: SOURCE_TYPE_MAP[row.source_type] ?? "document",
    url: row.url ?? "#",
    publisher: row.publisher ?? row.author ?? "Unknown publisher",
    relevance,
    passage: row.description ?? "",
    language: row.language === "en" ? "en" : row.language === "ta" ? "ta" : "mixed",
    verified: row.credibility_level === "trusted" || row.credibility_level === "verified",
  };
}
