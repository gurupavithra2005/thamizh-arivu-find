import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Brain, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatComposer } from "@/components/assistant/ChatComposer";
import { ChatMessageBubble } from "@/components/assistant/ChatMessageBubble";
import { PipelineIndicator } from "@/components/assistant/PipelineIndicator";
import { MockBadge } from "@/components/common/MockBadge";
import { SourceEvidencePanel } from "@/components/sources/SourceEvidencePanel";
import { detectLanguage } from "@/lib/language-detect";
import { EXAMPLE_QUESTIONS, MOCK_SOURCES, type ChatMessage } from "@/lib/mock-data";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Knowledge Assistant — THAMIZHARIVU AI" },
      {
        name: "description",
        content:
          "Ask natural questions in Tamil, English or Tanglish and get source-grounded answers with citations and evidence passages.",
      },
      { property: "og:title", content: "AI Knowledge Assistant — THAMIZHARIVU AI" },
      {
        property: "og:description",
        content: "Source-grounded Tamil answers with citations and evidence passages.",
      },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stage, setStage] = useState(-1);
  const [pending, setPending] = useState(false);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const sources = lastAssistant?.sources ?? [];

  /**
   * Placeholder submit handler.
   * Phase 2 replaces this with a server function that runs the real pipeline:
   * query understanding -> source discovery -> retrieval -> hybrid/semantic
   * search -> ranking -> RAG -> LLM -> grounded answer + citations.
   */
  function handleSubmit(text?: string) {
    const question = (text ?? input).trim();
    if (!question) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: question,
      detectedLanguage: detectLanguage(question),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);

    let step = 0;
    setStage(0);
    const timer = setInterval(() => {
      step += 1;
      setStage(step);
      if (step >= 6) {
        clearInterval(timer);
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            isMock: true,
            grounded: true,
            content:
              "MOCK ANSWER — the grounded response will be generated here from the retrieved passages listed in the evidence panel, in simple modern Tamil and English. If no reliable source can be verified, this area will state that the information could not be verified.",
            sources: MOCK_SOURCES,
            relatedQuestions: [
              "இதற்கான மூல நூல் எது?",
              "Show me the original passage",
              "Idhu pathi innum details venum",
            ],
          },
        ]);
        setPending(false);
        setStage(-1);
      }
    }, 420);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">AI Knowledge Assistant</h1>
          <p className="font-tamil text-sm text-muted-foreground">
            அறிவுத் துணை — தமிழ், English, Tanglish
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <Brain className="size-3.5" aria-hidden /> Conversation memory: {messages.length} turns
          </Badge>
          <Badge variant="outline" className="gap-1.5">
            <History className="size-3.5" aria-hidden /> Context active
          </Badge>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel flex min-h-[560px] flex-col overflow-hidden">
          <header className="flex flex-wrap items-center gap-2 border-b border-border bg-surface/60 px-4 py-3">
            <PipelineIndicator activeStage={stage} />
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-dashed border-border p-5">
                  <h2 className="text-base font-semibold">Ask anything — no predefined questions</h2>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Vague queries and follow-ups are supported; conversation context is carried
                    across turns.
                  </p>
                  <MockBadge className="mt-3" label="Answers are mock until the pipeline is wired" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Example questions
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {EXAMPLE_QUESTIONS.map((q) => (
                      <button
                        key={q.text}
                        onClick={() => handleSubmit(q.text)}
                        className="panel flex flex-col items-start gap-1 p-3 text-left transition-colors hover:border-primary/40"
                      >
                        <span className="font-tamil text-sm">{q.text}</span>
                        <span className="text-[11px] text-muted-foreground">{q.hint}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <ChatMessageBubble key={m.id} message={m} onAskRelated={(q) => handleSubmit(q)} />
              ))
            )}

            {pending && (
              <p className="text-xs text-muted-foreground">Retrieving and ranking sources…</p>
            )}
          </div>

          <div className="border-t border-border p-3">
            <ChatComposer
              value={input}
              onChange={setInput}
              onSubmit={() => handleSubmit()}
              pending={pending}
            />
          </div>
        </section>

        <div className="space-y-4">
          <SourceEvidencePanel sources={sources} isMock={sources.length > 0} />
          {messages.length > 0 && (
            <Button variant="outline" className="w-full" onClick={() => setMessages([])}>
              Clear conversation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
