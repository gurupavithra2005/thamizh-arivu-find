import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SourceCard } from "@/components/sources/SourceCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listKnowledgeSources, listSourceLibraryStats } from "@/lib/catalogue.functions";
import { SOURCE_TYPE_LABEL, type SourceType } from "@/lib/mock-data";

export const Route = createFileRoute("/sources")({
  loader: async () => {
    const [sources, stats] = await Promise.all([listKnowledgeSources(), listSourceLibraryStats()]);
    return { sources, stats };
  },
  head: () => ({
    meta: [
      { title: "Knowledge Sources — THAMIZHARIVU AI" },
      {
        name: "description",
        content:
          "Every answer is traceable. Review the webpages, books, e-books, PDFs and digital archives available to the assistant.",
      },
      { property: "og:title", content: "Knowledge Sources — THAMIZHARIVU AI" },
      {
        property: "og:description",
        content: "Linkable Tamil knowledge sources with publisher and credibility details.",
      },
    ],
  }),
  errorComponent: SourcesError,
  notFoundComponent: SourcesError,
  component: SourcesPage,
});

function SourcesError() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Sources could not be loaded</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The source library is temporarily unavailable. Please try again.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}

const FILTERS: (SourceType | "all")[] = ["all", "webpage", "book", "ebook", "pdf", "archive", "ocr"];

function SourcesPage() {
  const sources = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SourceType | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sources.filter(
      (s) =>
        (type === "all" || s.type === type) &&
        (q === "" ||
          s.title.toLowerCase().includes(q) ||
          s.publisher.toLowerCase().includes(q) ||
          s.passage.toLowerCase().includes(q)),
    );
  }, [query, type, sources]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading
        eyebrow="Transparency layer"
        title="Knowledge sources"
        tamilTitle="மூலங்கள்"
        description="These are the real archives, e-texts and reference works the assistant is allowed to cite."
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

      <p className="mt-4 text-xs text-muted-foreground">
        {sources.length} source{sources.length === 1 ? "" : "s"} in the library
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sources match this filter.</p>
        ) : (
          results.map((s, i) => <SourceCard key={s.id} source={s} rank={i + 1} />)
        )}
      </div>
    </div>
  );
}
