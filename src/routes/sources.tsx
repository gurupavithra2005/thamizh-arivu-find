import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MockBadge } from "@/components/common/MockBadge";
import { SourceCard } from "@/components/sources/SourceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_SOURCES, SOURCE_TYPE_LABEL, type SourceType } from "@/lib/mock-data";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title: "Knowledge Sources — THAMIZHARIVU AI" },
      {
        name: "description",
        content:
          "Every answer is traceable. Review the webpages, books, e-books, PDFs and digital archives retrieved and ranked for each query.",
      },
      { property: "og:title", content: "Knowledge Sources — THAMIZHARIVU AI" },
      {
        property: "og:description",
        content: "Ranked, linkable Tamil knowledge sources with supporting passages.",
      },
    ],
  }),
  component: SourcesPage,
});

const FILTERS: (SourceType | "all")[] = ["all", "webpage", "book", "ebook", "pdf", "archive", "ocr"];

function SourcesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SourceType | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_SOURCES.filter(
      (s) =>
        (type === "all" || s.type === type) &&
        (q === "" ||
          s.title.toLowerCase().includes(q) ||
          s.publisher.toLowerCase().includes(q) ||
          (s.titleTamil ?? "").includes(query.trim())),
    ).sort((a, b) => b.relevance - a.relevance);
  }, [query, type]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        eyebrow="Transparency layer"
        title="Knowledge sources"
        tamilTitle="மூலங்கள்"
        description="Sources are discovered dynamically per query, then ranked by hybrid keyword and semantic relevance."
        action={<MockBadge label="Mock source index" />}
      />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title or publisher"
          aria-label="Filter sources"
          className="max-w-xs"
        />
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={type === f ? "default" : "outline"}
            onClick={() => setType(f)}
          >
            {f === "all" ? "All types" : SOURCE_TYPE_LABEL[f]}
          </Button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sources match this filter.</p>
        ) : (
          results.map((s, i) => <SourceCard key={s.id} source={s} rank={i + 1} />)
        )}
      </div>
    </div>
  );
}
