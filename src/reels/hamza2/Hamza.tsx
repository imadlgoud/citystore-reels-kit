import React from "react";
import { Viseme } from "../../citybot/Mouths";

/*
 * HAMZA: original character (not based on any real person or existing character). Young Moroccan guy, early 20s,
 * short dark hair with a fade, light beard, warm red hoodie. Flat vector, clean dark outlines, soft shadows.
 * Waist-up rig, viewBox 0 0 400 620: head pivot at the neck (200, 318).
 * Layers: hoodie body > arms (2 joints each) > neck > head (ears, face, beard, hair) > eyes (look, blink, squint)
 * > brows (per-brow raise / angle) > mouth (9 visemes A-H, X, plus expression mouths when silent).
 */
export type HamzaExpr = "neutral" | "squint" | "jaw" | "suspicious" | "delighted" | "happy";
export type ArmAngles = { up: number; fore: number }; // degrees; 0 = hanging down, + = outward / raised, - = across the body
export type HeldItem = "phone" | null;

const SKIN = "#C98A5C", SKIN_D = "#A86B42", HAIR = "#1D1714", BEARD = "#3A2A22", HOOD = "#C9443A", HOOD_D = "#9E2F28", LINE = "#2B1B16";

export const ARM: Record<string, { l: ArmAngles; r: ArmAngles }> = {
  down: { l: { up: 8, fore: 4 }, r: { up: 8, fore: 4 } },
  phoneUp: { l: { up: -28, fore: -150 }, r: { up: -28, fore: -150 } },
  open: { l: { up: 48, fore: 95 }, r: { up: 48, fore: 95 } },
  holdFront: { l: { up: 14, fore: -58 }, r: { up: 14, fore: -58 } },
  highFive: { l: { up: 8, fore: 4 }, r: { up: 150, fore: 172 } },
};

const rad = (d: number) => (d * Math.PI) / 180;
/** arm segment direction for viewer-left (side -1) / viewer-right (side 1) arms */
const dir = (side: number, a: number) => ({ x: side * Math.sin(rad(a)), y: Math.cos(rad(a)) });

const Arm: React.FC<{ side: number; ang: ArmAngles; held?: HeldItem }> = ({ side, ang }) => {
  const sh = { x: 200 + side * 92, y: 372 };
  const d1 = dir(side, ang.up), d2 = dir(side, ang.fore);
  const el = { x: sh.x + d1.x * 118, y: sh.y + d1.y * 118 };
  const hd = { x: el.x + d2.x * 108, y: el.y + d2.y * 108 };
  return (
    <g>
      <line x1={sh.x} y1={sh.y} x2={el.x} y2={el.y} stroke={LINE} strokeWidth={56} strokeLinecap="round" />
      <line x1={sh.x} y1={sh.y} x2={el.x} y2={el.y} stroke={HOOD} strokeWidth={48} strokeLinecap="round" />
      <line x1={el.x} y1={el.y} x2={hd.x} y2={hd.y} stroke={LINE} strokeWidth={50} strokeLinecap="round" />
      <line x1={el.x} y1={el.y} x2={hd.x} y2={hd.y} stroke={HOOD} strokeWidth={42} strokeLinecap="round" />
      <circle cx={hd.x} cy={hd.y} r={23} fill={SKIN} stroke={LINE} strokeWidth={4} />
    </g>
  );
};

/** hand position (viewBox units) for a pose, so scenes can place props in the hands */
export const handAt = (side: number, ang: ArmAngles) => {
  const d1 = dir(side, ang.up), d2 = dir(side, ang.fore);
  return { x: 200 + side * 92 + d1.x * 118 + d2.x * 108, y: 372 + d1.y * 118 + d2.y * 108 };
};

const Mouth: React.FC<{ v: Viseme | null; expr: HamzaExpr }> = ({ v, expr }) => {
  const dark = "#5B1A1A", tongue = "#E07A7A";
  const shape = (w: number, h: number, round = 0.5, teeth = false, tongueUp = false) => (
    <g>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={Math.min(w, h) * round} fill={dark} stroke={LINE} strokeWidth={4} />
      {teeth && <rect x={-w / 2 + 6} y={-h / 2 + 2} width={w - 12} height={Math.min(10, h * 0.35)} rx={3} fill="#fff" />}
      {h > 14 && <ellipse cx={0} cy={tongueUp ? -h * 0.1 : h * 0.28} rx={w * 0.3} ry={h * 0.22} fill={tongue} />}
    </g>
  );
  let m: React.ReactNode;
  switch (v) {
    case "A": m = <path d="M-26 0 Q0 4 26 0" stroke={LINE} strokeWidth={6} fill="none" strokeLinecap="round" />; break; // M B P
    case "B": m = shape(48, 16, 0.4, true); break; // K S T, clenched
    case "C": m = shape(50, 30, 0.45, true); break; // EH AE
    case "D": m = shape(54, 46, 0.45, true); break; // AA wide open
    case "E": m = shape(40, 34, 0.5); break; // AO ER
    case "F": m = shape(24, 24, 0.5); break; // UW OW W, puckered
    case "G": m = <g>{shape(48, 18, 0.4)}<rect x={-18} y={-11} width={36} height={9} rx={3} fill="#fff" /></g>; break; // F V
    case "H": m = shape(46, 32, 0.45, false, true); break; // L
    case "X": m = <path d="M-22 0 Q0 6 22 0" stroke={LINE} strokeWidth={6} fill="none" strokeLinecap="round" />; break;
    default:
      // silent: expression mouth
      if (expr === "jaw") m = shape(60, 74, 0.45, true);
      else if (expr === "delighted" || expr === "happy") m = <path d="M-34 -6 Q0 34 34 -6 Z" fill={dark} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />;
      else if (expr === "squint") m = <path d="M-24 4 Q-8 -6 4 2 T 26 -2" stroke={LINE} strokeWidth={6} fill="none" strokeLinecap="round" />;
      else if (expr === "suspicious") m = <path d="M-22 2 L 22 -4" stroke={LINE} strokeWidth={6} fill="none" strokeLinecap="round" />;
      else m = <path d="M-22 0 Q0 8 22 0" stroke={LINE} strokeWidth={6} fill="none" strokeLinecap="round" />;
  }
  return <g transform={`translate(200 ${expr === "jaw" && !v ? 262 : 252})`}>{m}</g>;
};

const Eye: React.FC<{ id: string; cx: number; open: number; happy: boolean; lookX: number; lookY: number; wide: boolean }> = ({ id, cx, open, happy, lookX, lookY, wide }) => {
  const cy = 186, rx = 19, ry = wide ? 24 : 20;
  if (happy) return <path d={`M${cx - 18} ${cy + 6} Q${cx} ${cy - 16} ${cx + 18} ${cy + 6}`} stroke={LINE} strokeWidth={7} fill="none" strokeLinecap="round" />;
  const o = Math.max(0.06, open);
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry * o} fill="#fff" stroke={LINE} strokeWidth={4} />
      {o > 0.2 && (
        <g clipPath={`url(#${id})`}>
          <clipPath id={id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry * o} /></clipPath>
          <circle cx={cx + lookX * 7} cy={cy + lookY * 5} r={wide ? 8 : 10} fill={LINE} />
          <circle cx={cx + lookX * 7 + 3} cy={cy + lookY * 5 - 3} r={3} fill="#fff" />
        </g>
      )}
    </g>
  );
};

export const Hamza: React.FC<{
  width?: number;
  expr?: HamzaExpr;
  viseme?: Viseme | null;
  blink?: number;
  lookX?: number;
  lookY?: number;
  tilt?: number;
  lean?: number; // whole-body lean, degrees
  arms?: { l: ArmAngles; r: ArmAngles };
  held?: HeldItem;
  breath?: number; // 0..1 idle breathing phase
  style?: React.CSSProperties;
  id?: string; // unique prefix for clip ids when several Hamzas are on screen
}> = ({ id = "hz", width = 400, expr = "neutral", viseme = null, blink = 0, lookX = 0, lookY = 0, tilt = 0, lean = 0, arms = ARM.down, held = null, breath = 0, style }) => {
  const squint = expr === "squint" ? 0.42 : expr === "suspicious" ? 0.7 : 1;
  const open = (1 - blink) * squint;
  const happy = expr === "delighted" || expr === "happy";
  const wide = expr === "jaw";
  const brow = {
    neutral: { l: [0, 0], r: [0, 0] },
    squint: { l: [8, 14], r: [8, -14] },
    jaw: { l: [-18, -6], r: [-18, 6] },
    suspicious: { l: [-16, -10], r: [8, -12] },
    delighted: { l: [-12, -4], r: [-12, 4] },
    happy: { l: [-6, 0], r: [-6, 0] },
  }[expr];
  const bob = Math.sin(breath * Math.PI * 2) * 3;
  const ph = held === "phone" ? { x: (handAt(-1, arms.l).x + handAt(1, arms.r).x) / 2, y: Math.min(handAt(-1, arms.l).y, handAt(1, arms.r).y) - 38 } : null;
  return (
    <svg viewBox="0 0 400 620" width={width} height={(width * 620) / 400} style={{ overflow: "visible", ...style }}>
      <g transform={`rotate(${lean} 200 620)`}>
        {/* body: hoodie */}
        <g transform={`translate(0 ${bob})`}>
          <path d="M70 620 Q74 420 132 372 Q200 344 268 372 Q326 420 330 620 Z" fill={HOOD} stroke={LINE} strokeWidth={6} />
          <path d="M150 372 Q200 410 250 372" fill="none" stroke={HOOD_D} strokeWidth={14} strokeLinecap="round" />
          <path d="M184 400 L180 470 M216 400 L220 470" stroke="#F4E6D8" strokeWidth={6} strokeLinecap="round" />
          <path d="M130 530 Q200 556 270 530" fill="none" stroke={HOOD_D} strokeWidth={8} strokeLinecap="round" />
          {/* neck */}
          <rect x={176} y={300} width={48} height={70} rx={14} fill={SKIN_D} stroke={LINE} strokeWidth={5} />
        </g>
        <Arm side={-1} ang={arms.l} />
        <Arm side={1} ang={arms.r} />
        {ph && (
          <g transform={`translate(${ph.x} ${ph.y})`}>
            <rect x={-34} y={-62} width={68} height={124} rx={12} fill="#20242E" stroke={LINE} strokeWidth={4} />
            <rect x={-28} y={-54} width={56} height={108} rx={7} fill="#4BB563" />
            <circle cx={0} cy={0} r={46} fill="#BFF5FF" opacity={0.18} />
          </g>
        )}
        {/* head */}
        <g transform={`rotate(${tilt} 200 318) translate(0 ${bob * 0.6})`}>
          <ellipse cx={92} cy={196} rx={18} ry={26} fill={SKIN} stroke={LINE} strokeWidth={5} />
          <ellipse cx={308} cy={196} rx={18} ry={26} fill={SKIN} stroke={LINE} strokeWidth={5} />
          <path d="M100 150 Q100 64 200 62 Q300 64 300 150 L300 220 Q296 300 200 312 Q104 300 100 220 Z" fill={SKIN} stroke={LINE} strokeWidth={6} />
          {/* light beard */}
          <path d="M104 210 Q108 300 200 310 Q292 300 296 210 Q284 262 240 270 Q200 252 160 270 Q116 262 104 210 Z" fill={BEARD} opacity={0.55} />
          <path d="M164 236 Q200 222 236 236" stroke={BEARD} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.75} />
          {/* hair: short top with a fade */}
          <path d="M96 156 Q92 52 200 44 Q312 50 304 156 Q290 108 248 104 Q200 92 150 106 Q108 116 96 156 Z" fill={HAIR} stroke={LINE} strokeWidth={5} />
          <path d="M98 150 Q100 176 104 196 M302 150 Q300 176 296 196" stroke={HAIR} strokeWidth={10} strokeLinecap="round" opacity={0.45} />
          {/* nose */}
          <path d="M200 196 Q190 226 204 232" stroke={SKIN_D} strokeWidth={6} fill="none" strokeLinecap="round" />
          <Eye id={`${id}-el`} cx={158} open={open} happy={happy} lookX={lookX} lookY={lookY} wide={wide} />
          <Eye id={`${id}-er`} cx={242} open={expr === "suspicious" ? (1 - blink) * 1 : open} happy={happy} lookX={lookX} lookY={lookY} wide={wide} />
          {/* brows: [raise (- = up), angle] */}
          <path d="M134 152 Q158 140 182 150" transform={`translate(0 ${brow.l[0]}) rotate(${brow.l[1]} 158 148)`} stroke={HAIR} strokeWidth={11} fill="none" strokeLinecap="round" />
          <path d="M218 150 Q242 140 266 152" transform={`translate(0 ${brow.r[0]}) rotate(${brow.r[1]} 242 148)`} stroke={HAIR} strokeWidth={11} fill="none" strokeLinecap="round" />
          <Mouth v={viseme} expr={expr} />
          {expr === "squint" && <path d="M120 120 l10 10 M280 120 l-10 10" stroke={LINE} strokeWidth={5} strokeLinecap="round" opacity={0.6} />}
        </g>
      </g>
    </svg>
  );
};
