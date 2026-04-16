/**
 * Briefing Engine — HTML Renderer
 *
 * Takes structured section content (markdown strings) and produces a
 * self-contained, executive-ready HTML document. The LLM never touches
 * the HTML directly — this renderer owns all markup and styling.
 */

interface SectionInput {
  sectionKey: string;
  title: string;
  content: string;
  ragStatus?: string | null;
}

interface RenderOptions {
  accountName: string;
  industry: string;
  briefingType: "INTERNAL" | "CUSTOMER_FACING" | "BOTH";
  generatedAt: string;
  sources: string[];
}

const RAG_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  GREEN: { bg: "#059669", text: "#ffffff", label: "On Track" },
  AMBER: { bg: "#d97706", text: "#ffffff", label: "At Risk" },
  RED: { bg: "#dc2626", text: "#ffffff", label: "Off Track" },
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert simple markdown to HTML (headings, bold, lists, tables, paragraphs) */
function markdownToHtml(md: string): string {
  let html = escapeHtml(md);

  // Tables: detect | --- | header separator patterns
  html = html.replace(
    /^(\|.+\|)\n(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/gm,
    (_match, header: string, _sep: string, body: string) => {
      const headerCells = header.split("|").filter((c: string) => c.trim());
      const rows = body.trim().split("\n");
      let table = '<table style="width:100%;border-collapse:collapse;margin:1em 0;font-size:0.9em;">';
      table += "<thead><tr>";
      for (const cell of headerCells) {
        table += `<th style="text-align:left;padding:8px 12px;border-bottom:2px solid #374151;color:#d1d5db;">${cell.trim()}</th>`;
      }
      table += "</tr></thead><tbody>";
      for (const row of rows) {
        const cells = row.split("|").filter((c: string) => c.trim());
        table += "<tr>";
        for (const cell of cells) {
          table += `<td style="padding:8px 12px;border-bottom:1px solid #1f2937;color:#9ca3af;">${cell.trim()}</td>`;
        }
        table += "</tr>";
      }
      table += "</tbody></table>";
      return table;
    }
  );

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 style="color:#e5e7eb;margin:1.2em 0 0.4em;font-size:1.1em;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="color:#f3f4f6;margin:1.5em 0 0.5em;font-size:1.3em;">$1</h2>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // RAG emoji chips
  html = html.replace(/🟢/g, '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#059669;margin-right:4px;"></span>');
  html = html.replace(/🟡/g, '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#d97706;margin-right:4px;"></span>');
  html = html.replace(/🔴/g, '<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#dc2626;margin-right:4px;"></span>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li style="margin:0.3em 0;color:#d1d5db;">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => `<ul style="padding-left:1.2em;margin:0.8em 0;">${match}</ul>`);

  // Paragraphs (remaining lines that aren't already HTML)
  html = html.replace(/^(?!<[hultd]|<\/|<strong)(.+)$/gm, '<p style="color:#d1d5db;margin:0.5em 0;line-height:1.6;">$1</p>');

  return html;
}

export function renderBriefingHtml(sections: SectionInput[], options: RenderOptions): string {
  const typeLabel = options.briefingType === "INTERNAL"
    ? "Internal QBR"
    : options.briefingType === "CUSTOMER_FACING"
      ? "Executive Business Review"
      : "Comprehensive QBR (Internal + Customer-Facing)";

  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} FY${new Date().getFullYear() - (new Date().getMonth() < 6 ? 1 : 0) + 1}`;

  let sectionsHtml = "";
  for (const section of sections) {
    const ragChip = section.ragStatus && RAG_COLORS[section.ragStatus]
      ? `<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:0.75em;font-weight:600;background:${RAG_COLORS[section.ragStatus].bg};color:${RAG_COLORS[section.ragStatus].text};margin-left:12px;">${RAG_COLORS[section.ragStatus].label}</span>`
      : "";

    sectionsHtml += `
      <section style="margin:2em 0;padding:1.5em;background:#111827;border-radius:12px;border:1px solid #1f2937;">
        <h2 style="color:#f9fafb;font-size:1.2em;margin:0 0 1em;">${escapeHtml(section.title)}${ragChip}</h2>
        <div>${markdownToHtml(section.content)}</div>
      </section>`;
  }

  const sourcesHtml = options.sources.length > 0
    ? options.sources.map((s) => `<li style="color:#6b7280;font-size:0.8em;">${escapeHtml(s)}</li>`).join("")
    : '<li style="color:#6b7280;font-size:0.8em;">No external data sources connected</li>';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(options.accountName)} — ${typeLabel}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e5e7eb; padding: 2em; }
    .container { max-width: 900px; margin: 0 auto; }
    @media print { body { background: #fff; color: #111; } section { border-color: #e5e7eb !important; background: #f9fafb !important; } }
  </style>
</head>
<body>
  <div class="container">
    <!-- Cover -->
    <header style="text-align:center;padding:3em 0;border-bottom:2px solid #1f2937;margin-bottom:2em;">
      <div style="font-size:0.9em;color:#60a5fa;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;">
        ${escapeHtml(typeLabel)}
      </div>
      <h1 style="font-size:2.2em;color:#f9fafb;margin:0.3em 0;">${escapeHtml(options.accountName)}</h1>
      <div style="color:#9ca3af;font-size:1em;">${quarter} · ${escapeHtml(options.industry)}</div>
      <div style="color:#6b7280;font-size:0.85em;margin-top:0.5em;">Generated ${new Date(options.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
    </header>

    <!-- Sections -->
    ${sectionsHtml}

    <!-- Data Provenance (internal note) -->
    <footer style="margin-top:3em;padding:1.5em;border-top:1px solid #1f2937;">
      <div style="font-size:0.85em;color:#4b5563;font-weight:600;margin-bottom:0.5em;">Data Sources</div>
      <ul style="list-style:disc;padding-left:1.2em;">${sourcesHtml}</ul>
      <p style="color:#4b5563;font-size:0.75em;margin-top:1em;">
        Insights are based on observed usage data, engagement context, and ${options.briefingType === "CUSTOMER_FACING" ? "anonymized industry patterns" : "internal analytics"}.
        ${options.briefingType === "CUSTOMER_FACING" ? "No peer-confidential data is displayed." : ""}
      </p>
    </footer>
  </div>
</body>
</html>`;
}
