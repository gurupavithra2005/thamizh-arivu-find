import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileUp, Loader2, ScanText, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MockBadge } from "@/components/common/MockBadge";
import { SectionHeading } from "@/components/common/SectionHeading";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Tamil OCR & Document Upload — THAMIZHARIVU AI" },
      {
        name: "description",
        content:
          "Upload a Tamil image or PDF, extract the text with OCR, edit it, and send it to the knowledge assistant as a grounded source.",
      },
      { property: "og:title", content: "Tamil OCR & Document Upload — THAMIZHARIVU AI" },
      {
        property: "og:description",
        content: "Extract Tamil text from images and PDFs, then query it with citations.",
      },
    ],
  }),
  component: UploadPage,
});

type Status = "idle" | "uploading" | "processing" | "done";

const PLACEHOLDER_TEXT =
  "MOCK OCR OUTPUT — extracted Tamil text will appear here for review and correction before it is indexed as a source.";

function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");

  /** Placeholder pipeline: replaced by a server function running real Tamil OCR. */
  function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setText("");
    setStatus("uploading");
    setProgress(20);
    window.setTimeout(() => {
      setStatus("processing");
      setProgress(65);
    }, 500);
    window.setTimeout(() => {
      setStatus("done");
      setProgress(100);
      setText(PLACEHOLDER_TEXT);
    }, 1400);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading
        eyebrow="Tamil OCR"
        title="Document / image upload"
        tamilTitle="ஆவண பதிவேற்றம்"
        description="Turn scanned Tamil pages, palm-leaf photographs and PDFs into searchable, citable text."
        action={<MockBadge label="Mock OCR pipeline" />}
      />

      <label className="panel mt-8 flex cursor-pointer flex-col items-center gap-2 border-dashed p-10 text-center transition-colors hover:border-primary/40">
        <FileUp className="size-6 text-primary" aria-hidden />
        <span className="text-sm font-medium">Choose an image or PDF</span>
        <span className="text-xs text-muted-foreground">JPG, PNG or PDF — Tamil script supported</span>
        <input
          type="file"
          accept="image/*,application/pdf"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </label>

      {fileName && (
        <div className="panel mt-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{fileName}</p>
            <Badge variant={status === "done" ? "secondary" : "outline"} className="text-[11px]">
              {status === "uploading" && "Uploading"}
              {status === "processing" && "Running OCR"}
              {status === "done" && "Extraction complete"}
              {status === "idle" && "Ready"}
            </Badge>
          </div>
          <Progress value={progress} className="mt-3" />
          {status !== "done" && (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" aria-hidden /> Processing page…
            </p>
          )}
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center gap-2">
          <ScanText className="size-4 text-primary" aria-hidden />
          <h2 className="text-sm font-semibold">Extracted Tamil text</h2>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Extracted text appears here. You can correct OCR errors before sending it to the assistant."
          className="font-tamil mt-3"
          aria-label="Extracted Tamil text"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            disabled={!text.trim()}
            onClick={() =>
              toast.info("Queued for the assistant", {
                description: "Indexing uploaded documents as sources arrives with the retrieval phase.",
              })
            }
          >
            <Send className="mr-1 size-4" aria-hidden /> Send to Knowledge Assistant
          </Button>
          <Button asChild variant="outline">
            <Link to="/assistant">Open assistant</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
