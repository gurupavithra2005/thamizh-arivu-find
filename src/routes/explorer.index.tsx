import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { HERITAGE_CATEGORIES } from "@/lib/mock-data";

export const Route = createFileRoute("/explorer/")({
  head: () => ({
    meta: [
      { title: "Cultural Heritage Explorer — THAMIZHARIVU AI" },
      {
        name: "description",
        content:
          "Browse Tamil knowledge by theme: literature, classical Tamil, festivals, traditions, arts, architecture, food, history and cultural practices.",
      },
      { property: "og:title", content: "Cultural Heritage Explorer — THAMIZHARIVU AI" },
      {
        property: "og:description",
        content: "Explore Tamil literature, culture and heritage by theme.",
      },
    ],
  }),
  component: ExplorerIndex,
});

function ExplorerIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeading
        eyebrow="Cultural Heritage Explorer"
        title="Explore by theme"
        tamilTitle="பண்பாட்டுத் தேடல்"
        description="Pick a domain to see curated topics. Each topic opens a source-grounded query in the assistant."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HERITAGE_CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to="/explorer/$category"
            params={{ category: c.slug }}
            className="panel flex flex-col gap-2 p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-primary" aria-hidden />
              <span className="font-tamil text-sm text-primary">{c.titleTamil}</span>
            </div>
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.topics.slice(0, 3).map((t) => (
                <Badge key={t} variant="secondary" className="text-[11px]">
                  {t}
                </Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
