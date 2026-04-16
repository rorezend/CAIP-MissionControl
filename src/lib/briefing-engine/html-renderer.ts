/**
 * Briefing Engine — HTML Renderer (Executive Dashboard Style)
 *
 * Produces a visually rich, number-forward executive dashboard.
 * KPI cards with big numbers, inline SVG charts, RAG indicators,
 * and minimal prose. Designed for C-level readability.
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
  metrics?: BriefingMetrics;
}

/** Structured metrics extracted by the orchestrator for visual rendering */
export interface BriefingMetrics {
  acr?: {
    current: number;
    target?: number;
    growth6M: number | null;
    growth3M: number | null;
    trend: { month: string; acr: number; target?: number }[];
    topServices: { name: string; acr: number; delta: number }[];
  };
  pipeline?: {
    totalValue: number;
    committedValue: number;
    uncommittedValue: number;
    stages: { stage: string; count: number; value: number }[];
  };
  engagement?: {
    meetingCount: number;
    openActions: number;
    riskCount: number;
  };
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmt$(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function trendArrow(val: number): string {
  if (val > 1) return '<span style="color:#34d399;">&#9650;</span>';
  if (val < -1) return '<span style="color:#f87171;">&#9660;</span>';
  return '<span style="color:#9ca3af;">&#9644;</span>';
}

function ragChip(status: string): string {
  const colors: Record<string, string> = {
    GREEN: "background:#059669;", AMBER: "background:#d97706;", RED: "background:#dc2626;",
  };
  const labels: Record<string, string> = { GREEN: "On Track", AMBER: "At Risk", RED: "Off Track" };
  return `<span style="display:inline-block;padding:3px 12px;border-radius:20px;font-size:0.7em;font-weight:700;color:#fff;letter-spacing:0.05em;${colors[status] || "background:#6b7280;"}">${labels[status] || status}</span>`;
}

/** Generate a mini SVG sparkline from data points */
function sparkline(data: number[], width = 180, height = 48, color = "#60a5fa"): string {
  if (data.length < 2) return "";
  const min = Math.min(...data) * 0.95;
  const max = Math.max(...data) * 1.05;
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const points = data.map((v, i) => `${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`).join(" ");
  const lastY = (height - ((data[data.length - 1] - min) / range) * height).toFixed(1);
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="display:block;">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${width}" cy="${lastY}" r="3.5" fill="${color}"/>
  </svg>`;
}

/** SVG horizontal bar chart */
function hBarChart(items: { label: string; value: number; color?: string }[], maxWidth = 320): string {
  const max = Math.max(...items.map((i) => i.value), 1);
  return items
    .map((item) => {
      const w = Math.max((item.value / max) * maxWidth, 4);
      const c = item.color || "#60a5fa";
      return `<div style="display:flex;align-items:center;gap:10px;margin:6px 0;">
        <div style="width:110px;font-size:0.78em;color:#d1d5db;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(item.label)}</div>
        <div style="flex:1;position:relative;height:22px;background:#1f2937;border-radius:4px;overflow:hidden;">
          <div style="height:100%;width:${w}px;max-width:100%;background:${c};border-radius:4px;"></div>
        </div>
        <div style="width:60px;font-size:0.78em;color:#9ca3af;font-weight:600;">${fmt$(item.value)}</div>
      </div>`;
    })
    .join("");
}

/** SVG donut chart for pipeline split */
function donutChart(committed: number, uncommitted: number, size = 100): string {
  const total = committed + uncommitted || 1;
  const pct = committed / total;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="#1f2937" stroke-width="10"/>
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="#34d399" stroke-width="10"
      stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}" transform="rotate(-90 50 50)" stroke-linecap="round"/>
    <text x="50" y="48" text-anchor="middle" style="font-size:14px;font-weight:700;fill:#e5e7eb;">${(pct * 100).toFixed(0)}%</text>
    <text x="50" y="62" text-anchor="middle" style="font-size:7px;fill:#9ca3af;">committed</text>
  </svg>`;
}

/** Render markdown section content to simplified HTML */
function mdToHtml(md: string): string {
  let html = esc(md);
  // Tables
  html = html.replace(
    /^(\|.+\|)\n(\|[\s\-:|]+\|)\n((?:\|.+\|\n?)+)/gm,
    (_m, hdr: string, _sep: string, body: string) => {
      const hCells = hdr.split("|").filter((c: string) => c.trim());
      const rows = body.trim().split("\n");
      let t = '<table style="width:100%;border-collapse:collapse;margin:0.8em 0;font-size:0.82em;">';
      t += "<thead><tr>" + hCells.map((c: string) => `<th style="text-align:left;padding:6px 10px;border-bottom:2px solid #374151;color:#9ca3af;font-weight:600;font-size:0.85em;text-transform:uppercase;letter-spacing:0.05em;">${c.trim()}</th>`).join("") + "</tr></thead><tbody>";
      for (const row of rows) {
        const cells = row.split("|").filter((c: string) => c.trim());
        t += "<tr>" + cells.map((c: string) => `<td style="padding:6px 10px;border-bottom:1px solid #1f2937;color:#d1d5db;">${c.trim()}</td>`).join("") + "</tr>";
      }
      return t + "</tbody></table>";
    }
  );
  html = html.replace(/^### (.+)$/gm, '<h3 style="color:#e5e7eb;margin:1em 0 0.3em;font-size:0.95em;font-weight:600;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="color:#f3f4f6;margin:1.2em 0 0.4em;font-size:1.1em;font-weight:700;">$1</h2>');
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong style='color:#e5e7eb;'>$1</strong>");
  html = html.replace(/🟢/g, '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#059669;margin:0 3px;vertical-align:middle;"></span>');
  html = html.replace(/🟡/g, '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#d97706;margin:0 3px;vertical-align:middle;"></span>');
  html = html.replace(/🔴/g, '<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#dc2626;margin:0 3px;vertical-align:middle;"></span>');
  html = html.replace(/^- (.+)$/gm, '<li style="margin:0.2em 0;color:#d1d5db;font-size:0.9em;">$1</li>');
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (m) => `<ul style="padding-left:1.2em;margin:0.5em 0;">${m}</ul>`);
  html = html.replace(/^(?!<[hultd]|<\/|<strong)(.+)$/gm, '<p style="color:#d1d5db;margin:0.3em 0;line-height:1.5;font-size:0.9em;">$1</p>');
  return html;
}

// ── Main Render Function ────────────────────────────────────

export function renderBriefingHtml(sections: SectionInput[], options: RenderOptions): string {
  const m = options.metrics;
  const typeLabel = options.briefingType === "INTERNAL" ? "Internal QBR"
    : options.briefingType === "CUSTOMER_FACING" ? "Executive Business Review"
    : "Comprehensive QBR";
  const quarter = `Q${Math.ceil((new Date().getMonth() + 1) / 3)} FY${new Date().getFullYear() - (new Date().getMonth() < 6 ? 1 : 0) + 1}`;
  const dateStr = new Date(options.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // ── KPI Hero Cards ──
  const kpiCards = buildKPICards(m);

  // ── ACR Trend Chart ──
  const acrChart = m?.acr?.trend
    ? `<div style="background:#111827;border-radius:12px;padding:20px;border:1px solid #1f2937;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-size:0.85em;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;">Consumption Trend (6 months)</span>
          <span style="font-size:0.78em;color:#6b7280;">${m.acr.trend[0]?.month} → ${m.acr.trend[m.acr.trend.length - 1]?.month}</span>
        </div>
        ${sparkline(m.acr.trend.map((t) => t.acr), 500, 80, "#60a5fa")}
        <div style="display:flex;gap:16px;margin-top:10px;">
          <span style="font-size:0.75em;color:#6b7280;">■ Actual</span>
          ${m.acr.trend[0]?.target ? '<span style="font-size:0.75em;color:#374151;">□ Target</span>' : ""}
        </div>
      </div>`
    : "";

  // ── Top Services Bar Chart ──
  const servicesChart = m?.acr?.topServices
    ? `<div style="background:#111827;border-radius:12px;padding:20px;border:1px solid #1f2937;">
        <div style="font-size:0.85em;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Top Services by ACR</div>
        ${hBarChart(
          m.acr.topServices.map((s) => ({
            label: s.name,
            value: s.acr,
            color: s.delta >= 0 ? "#34d399" : "#f87171",
          }))
        )}
      </div>`
    : "";

  // ── Pipeline Visual ──
  const pipelineViz = m?.pipeline
    ? `<div style="background:#111827;border-radius:12px;padding:20px;border:1px solid #1f2937;">
        <div style="font-size:0.85em;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;">Pipeline Distribution</div>
        <div style="display:flex;align-items:center;gap:24px;">
          ${donutChart(m.pipeline.committedValue, m.pipeline.uncommittedValue)}
          <div style="flex:1;">
            ${hBarChart(
              m.pipeline.stages.map((s) => ({
                label: s.stage,
                value: s.value,
                color: s.stage === "Close" ? "#34d399" : s.stage.includes("Develop") ? "#60a5fa" : "#6b7280",
              }))
            )}
          </div>
        </div>
        <div style="display:flex;gap:16px;margin-top:12px;">
          <span style="font-size:0.75em;color:#34d399;">● Committed ${fmt$(m.pipeline.committedValue)}</span>
          <span style="font-size:0.75em;color:#6b7280;">○ Uncommitted ${fmt$(m.pipeline.uncommittedValue)}</span>
        </div>
      </div>`
    : "";

  // ── Sections ──
  const sectionBlocks = sections.map((s) => {
    const rag = s.ragStatus ? `<div style="margin-left:auto;">${ragChip(s.ragStatus)}</div>` : "";
    return `<div style="margin:1.5em 0;background:#111827;border-radius:12px;padding:20px 24px;border:1px solid #1f2937;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <h2 style="margin:0;font-size:1em;font-weight:700;color:#f3f4f6;">${esc(s.title)}</h2>
        ${rag}
      </div>
      <div>${mdToHtml(s.content)}</div>
    </div>`;
  }).join("");

  // ── Assemble ──
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${esc(options.accountName)} — ${typeLabel}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a0a;color:#e5e7eb;padding:0}
.page{max-width:960px;margin:0 auto;padding:2em 1.5em}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:768px){.grid-4{grid-template-columns:1fr 1fr}.grid-2{grid-template-columns:1fr}}
@media print{body{background:#fff;color:#111}[data-card]{background:#f9fafb!important;border-color:#e5e7eb!important}}
</style>
</head>
<body>
<div class="page">

<!-- Cover -->
<header style="text-align:center;padding:2.5em 0 2em;border-bottom:1px solid #1f2937;margin-bottom:1.5em;">
  <div style="font-size:0.8em;color:#60a5fa;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;">${esc(typeLabel)}</div>
  <h1 style="font-size:2.2em;color:#f9fafb;margin:0.2em 0;">${esc(options.accountName)}</h1>
  <div style="color:#9ca3af;font-size:0.95em;">${quarter} · ${esc(options.industry)}</div>
  <div style="color:#6b7280;font-size:0.8em;margin-top:0.3em;">${dateStr}</div>
</header>

<!-- KPI Hero Cards -->
${kpiCards ? `<div class="grid-4" style="margin-bottom:1.5em;">${kpiCards}</div>` : ""}

<!-- Charts Row -->
${acrChart || servicesChart ? `<div class="grid-2" style="margin-bottom:1.5em;">${acrChart}${servicesChart}</div>` : ""}

<!-- Pipeline -->
${pipelineViz ? `<div style="margin-bottom:1.5em;">${pipelineViz}</div>` : ""}

<!-- Content Sections -->
${sectionBlocks}

<!-- Provenance -->
<footer style="margin-top:2em;padding:1.2em 0;border-top:1px solid #1f2937;">
  <div style="font-size:0.75em;color:#4b5563;font-weight:600;margin-bottom:0.3em;">Data Sources</div>
  <div style="font-size:0.7em;color:#6b7280;">${options.sources.map(esc).join(" · ")}</div>
  <p style="font-size:0.7em;color:#4b5563;margin-top:0.5em;">
    Insights based on observed data and engagement context.${options.briefingType === "CUSTOMER_FACING" ? " No peer-confidential data displayed." : ""}
  </p>
</footer>

</div>
</body>
</html>`;
}

// ── KPI Card Builder ────────────────────────────────────────

function buildKPICards(m?: BriefingMetrics): string {
  if (!m) return "";

  const cards: string[] = [];

  if (m.acr) {
    cards.push(kpiCard("Monthly ACR", fmt$(m.acr.current), m.acr.growth3M != null ? fmtPct(m.acr.growth3M) : null, m.acr.growth3M ?? 0, "#60a5fa"));
    cards.push(kpiCard("6M Growth", m.acr.growth6M != null ? fmtPct(m.acr.growth6M) : "N/A", "trailing 6 months", m.acr.growth6M ?? 0, "#818cf8"));
  }

  if (m.pipeline) {
    cards.push(kpiCard("Pipeline", fmt$(m.pipeline.totalValue), `${((m.pipeline.committedValue / (m.pipeline.totalValue || 1)) * 100).toFixed(0)}% committed`, 1, "#34d399"));
  }

  if (m.engagement) {
    const riskColor = m.engagement.riskCount > 2 ? -1 : m.engagement.riskCount > 0 ? 0 : 1;
    cards.push(kpiCard("Engagement", `${m.engagement.meetingCount}`, `meetings · ${m.engagement.openActions} open actions`, riskColor, "#fbbf24"));
  }

  return cards.join("");
}

function kpiCard(label: string, value: string, subtitle: string | null, trendVal: number, accentColor: string): string {
  return `<div data-card style="background:#111827;border-radius:12px;padding:16px 18px;border:1px solid #1f2937;border-top:3px solid ${accentColor};">
    <div style="font-size:0.72em;color:#9ca3af;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">${esc(label)}</div>
    <div style="font-size:1.8em;font-weight:800;color:#f9fafb;margin:4px 0 2px;line-height:1;">${value} ${trendArrow(trendVal)}</div>
    ${subtitle ? `<div style="font-size:0.72em;color:#6b7280;">${esc(subtitle)}</div>` : ""}
  </div>`;
}
