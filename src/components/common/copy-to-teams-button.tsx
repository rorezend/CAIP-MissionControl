"use client";

import { useMemo } from "react";
import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyToTeamsButton({ title, bullets }: { title: string; bullets: string[] }) {
  const summary = useMemo(() => {
    const body = bullets.map((item) => `- ${item}`).join("\n");
    return `# ${title}\n\n${body}\n\nKey links:\n- [Add offer link]\n- [Add dashboard link]`;
  }, [title, bullets]);

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(summary);
      }}
      aria-label="Copy markdown summary for Teams"
    >
      <Copy className="mr-2 h-4 w-4" />
      Copy to Teams
    </Button>
  );
}
