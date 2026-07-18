// Sitewide film grain + vignette. Fixed, pointer-events-none, sits above
// every layer (menu z-95, drawer z-100, wipe bar z-110) so the whole UI
// reads through the same "lens". Static texture — no animation cost.
export const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export default function GrainOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: `url("${NOISE}")` }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%)",
        }}
      />
    </div>
  );
}
