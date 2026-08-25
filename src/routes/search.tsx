import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MockBadge } from "@/components/common/MockBadge";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SourceCard } from "@/components/sources/SourceCard";
import { detectLanguage } from "@/lib/language-detect";
import { MOCK_SOURCES } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Search Results — THAMIZHARIVU AI" },
      {
        name: "description",
        content:
          "Ranked search results across Tamil webpages, books, e-books, PDFs and digital archives, each with a supporting passage.",
      },
      { property: "og:title", content: "Search Results — THAMIZHARIVU AI" },
      {
        property: "og:description",
        content: "Ranked, source-grounded Tamil search results with evidence passages.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState(q);
  const language = detectLanguage(q);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading
        eyebrow="Retrieval & ranking"
        title="Search results"
        tamilTitle="தேடல் முடிவுகள்"
        description="Hybrid keyword plus semantic ranking over dynamically discovered sources."
      />

      <form
        className="mt-6 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/search", search: { q: value.trim() } });
        }}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="தமிழில் அல்லது ஆங்கிலத்தில் தேடுங்கள்…"
          aria-label="Search query"
          className="max-w-md"
        />
        <Button type="submit">
          <SearchIcon className="mr-1 size-4" aria-hidden /> Search
        </Button>
      </form>

      {q ? (
        <>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>
              Results for <span className="font-medium text-foreground">“{q}”</span>
            </span>
            <Badge variant="outline">Detected: {language.label}</Badge>
            <MockBadge label="Mock ranking" />
          </div>

          <div className="mt-4 space-y-3">
            {MOCK_SOURCES.map((s, i) => (
              <SourceCard key={s.id} source={s} rank={i + 1} />
            ))}
          </div>

          <div className="panel mt-8 p-5">
            <p className="text-sm text-muted-foreground">
              Want a grounded answer instead of a source list?
            </p>
            <Button asChild className="mt-3">
              <Link to="/assistant">Ask the AI assistant</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">
          Enter a query above, or open a topic from the{" "}
          <Link to="/explorer" className="text-primary underline-offset-4 hover:underline">
            Cultural Heritage Explorer
          </Link>
          .
        </p>
      )}
    </div>
  );
}
