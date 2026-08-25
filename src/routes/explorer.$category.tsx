import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockBadge } from "@/components/common/MockBadge";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SourceCard } from "@/components/sources/SourceCard";
import { HERITAGE_CATEGORIES, MOCK_SOURCES } from "@/lib/mock-data";

export const Route = createFileRoute("/explorer/$category")({
  loader: ({ params }) => {
    const category = HERITAGE_CATEGORIES.find((c) => c.slug === params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Unavailable — THAMIZHARIVU AI" }, { name: "robots", content: "noindex" }],
      };
    }
    const { category } = loaderData;
    const title = `${category.title} (${category.titleTamil}) — Heritage Explorer`;
    return {
      meta: [
        { title },
        { name: "description", content: category.description },
        { property: "og:title", content: title },
        { property: "og:description", content: category.description },
      ],
    };
  },
  notFoundComponent: CategoryNotFound,
  component: CategoryPage,
});

function CategoryNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold">Theme not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        That heritage theme does not exist. Browse all themes instead.
      </p>
      <Button asChild className="mt-6">
        <Link to="/explorer">Back to explorer</Link>
      </Button>
    </div>
  );
}

function CategoryPage() {
  const { category } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <Link
        to="/explorer"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All themes
      </Link>

      <div className="mt-4">
        <SectionHeading
          eyebrow="Heritage theme"
          title={category.title}
          tamilTitle={category.titleTamil}
          description={category.description}
          action={
            <Button asChild>
              <Link to="/assistant">
                <MessagesSquare className="mr-1 size-4" aria-hidden /> Ask about this theme
              </Link>
            </Button>
          }
        />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Topics</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {category.topics.map((topic) => (
          <Link
            key={topic}
            to="/search"
            search={{ q: topic }}
            className="panel p-4 text-sm font-medium transition-colors hover:border-primary/40"
          >
            {topic}
          </Link>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Related knowledge sources</h2>
        <MockBadge label="Mock sources" />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Real sources will be discovered dynamically per query once the retrieval pipeline is wired.
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {MOCK_SOURCES.map((s, i) => (
          <SourceCard key={s.id} source={s} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
