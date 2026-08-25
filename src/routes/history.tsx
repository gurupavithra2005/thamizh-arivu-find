import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockBadge } from "@/components/common/MockBadge";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Conversation History — THAMIZHARIVU AI" },
      {
        name: "description",
        content:
          "Review earlier Tamil, English and Tanglish conversations. Context memory lets follow-up questions build on previous turns.",
      },
      { property: "og:title", content: "Conversation History — THAMIZHARIVU AI" },
      {
        property: "og:description",
        content: "Past conversations with context-aware follow-up support.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading
        eyebrow="Conversation memory"
        title="History"
        tamilTitle="உரையாடல் வரலாறு"
        description="Follow-up questions reuse prior context, so you can keep refining a topic naturally."
        action={<MockBadge label="Mock history" />}
      />

      <ul className="mt-8 space-y-3">
        {MOCK_CONVERSATIONS.map((c) => (
          <li key={c.id} className="panel p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[11px]">
                {c.language}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MessageSquare className="size-3.5" aria-hidden /> {c.turns} turns
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3.5" aria-hidden /> {c.updatedAt}
              </span>
            </div>
            <h2 className="font-tamil mt-2 text-base font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.preview}</p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link to="/assistant">Continue conversation</Link>
            </Button>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-xs text-muted-foreground">
        Persistent, per-user conversation storage arrives with the backend phase; this list is a
        UI-only placeholder.
      </p>
    </div>
  );
}
