/**
 * Pixel-art logo for "CAIP" — styled after the Microsoft Build 2026
 * hero image. Each filled pixel gets a vibrant colour cycling through
 * the Build palette; empty cells are transparent.
 */

const COLORS = [
  "#FF0000", // red
  "#E3170D", // dark-red
  "#0078D4", // MS blue
  "#00CC6A", // green
  "#FFB900", // yellow
  "#FF8C00", // orange
  "#50E6FF", // cyan
  "#E3008C", // magenta
  "#00B7C3", // teal
  "#7FBA00", // lime
];

/* ------------------------------------------------------------------ */
/* Letter bitmaps – 9 rows tall, variable width.                      */
/* '#' = filled pixel, '.' = empty                                    */
/* ------------------------------------------------------------------ */
const LETTERS: Record<string, string[]> = {
  C: [
    ".####.",
    "##..##",
    "##....",
    "##....",
    "##....",
    "##....",
    "##....",
    "##..##",
    ".####.",
  ],
  A: [
    ".####.",
    "##..##",
    "##..##",
    "##..##",
    "######",
    "##..##",
    "##..##",
    "##..##",
    "##..##",
  ],
  I: [
    "####",
    ".##.",
    ".##.",
    ".##.",
    ".##.",
    ".##.",
    ".##.",
    ".##.",
    "####",
  ],
  P: [
    "#####.",
    "##..##",
    "##..##",
    "#####.",
    "##....",
    "##....",
    "##....",
    "##....",
    "##....",
  ],
};

const WORD = "CAIP";
const LETTER_GAP = 2; // empty columns between letters
const ROWS = 9;

/** Deterministic but visually-varied colour per cell */
function pickColor(row: number, col: number): string {
  return COLORS[(row * 7 + col * 13 + 5) % COLORS.length];
}

export function PixelLogo({ className = "" }: { className?: string }) {
  // Assemble one flat grid from letter bitmaps
  const grid: (string | null)[][] = [];

  for (let r = 0; r < ROWS; r++) {
    const row: (string | null)[] = [];

    for (let li = 0; li < WORD.length; li++) {
      // gap between letters
      if (li > 0) {
        for (let g = 0; g < LETTER_GAP; g++) row.push(null);
      }

      const pattern = LETTERS[WORD[li]];
      for (let c = 0; c < pattern[r].length; c++) {
        const globalCol = row.length;
        row.push(
          pattern[r][c] === "#" ? pickColor(r, globalCol) : null,
        );
      }
    }

    grid.push(row);
  }

  const totalCols = grid[0].length;

  return (
    <div
      className={`mx-auto w-full max-w-[720px] ${className}`}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${totalCols}, 1fr)`,
        gap: "2px",
      }}
      role="img"
      aria-label="CAIP in pixel art"
    >
      {grid.flat().map((color, i) => (
        <div
          key={i}
          style={{
            aspectRatio: "1",
            background: color ?? "transparent",
          }}
        />
      ))}
    </div>
  );
}
