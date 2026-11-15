import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import { COLORS, FONT } from "../../brand";
import { pop, ramp, slam, sp } from "../../anim";
import { Citybot, ArmPose, Expression } from "../../citybot/Citybot";
import { MouthShape } from "../../citybot/Mouths";
import { LineIcon } from "../../components/Icons";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { useLayout } from "../../layout";
import { EndCard } from "../../scenes/EndCard";
import { RealDuo } from "./RealDuo";
import { ARM, ArmAngles, Hamza, HamzaExpr, handAt } from "./Hamza";
import { Match } from "./Match";
import { RoomBack, SofaFront } from "./Room";
import { blinkAt, h2ev, h2scene, visemeFor } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const RED = "#FF3B5C", GREEN = "#2BD96B";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";
const AR = "Cairo"; // Arabic display (Cairo ExtraBold/Black via the brand font stack)

/** 9:16 value or 1:1 value */
const useV = () => {
  const P = useLayout().portrait;
  return <T,>(a: T, b: T) => (P ? a : b);
};

/* ---------- characters, lip-synced only when they speak ---------- */
const HamzaAt: React.FC<{ frame: number; x: number; y: number; w: number; expr: HamzaExpr; legs?: boolean; arms?: { l: ArmAngles; r: ArmAngles }; held?: "phone" | null; lookX?: number; lookY?: number; tilt?: number; lean?: number; id?: string; children?: React.ReactNode }> = ({ frame, x, y, w, expr, children, ...p }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w }}>
    <Hamza width={w} expr={expr} viseme={visemeFor("hamza", frame)} blink={blinkAt("hamza", frame)} breath={(frame / 30) * 0.35} {...p} />
    {children}
  </div>
);

const idleMouth: Record<Expression, MouthShape> = { excited: "grin", happy: "smile", proud: "smile", wink: "smile", neutral: "X" };
const BotAt: React.FC<{ frame: number; cx: number; y: number; w: number; expr?: Expression; l?: ArmPose; r?: ArmPose; face?: React.ReactNode | null; lookX?: number; lookY?: number; tilt?: number; id: string; scale?: number }> = ({ frame, cx, y, w, expr = "happy", l, r, face = null, lookX = 0, lookY = 0, tilt = 0, id, scale = 1 }) => {
  const hover = 10 + Math.sin((frame / 30) * Math.PI * 1.2) * 9;
  const v = visemeFor("citybot", frame);
  return (
    <div style={{ position: "absolute", left: cx - w / 2, top: y, transform: `scale(${scale})`, transformOrigin: "50% 80%" }}>
      <Citybot id={id} width={w} expression={expr} mouth={v ?? idleMouth[expr]} blink={blinkAt("citybot", frame)} hover={hover} lookX={lookX} lookY={lookY} tilt={tilt}
        leftArm={l ?? { rot: 16 + Math.sin(frame / 12) * 4, hand: "open" }} rightArm={r ?? { rot: 16 + Math.sin(frame / 12 + 1.3) * 4, hand: "open" }} face={face} />
    </div>
  );
};

/** Citybot face-screen reactions (screen space x 108-292, y 68-287) */
const AntFaceG: React.FC<{ color?: string }> = ({ color = "#fff" }) => (
  <g>
    {[-1, 0, 1].map((i) => (
      <g key={i} stroke={color} strokeWidth={7} strokeLinecap="round">
        <line x1={i * 26} y1={6} x2={i * 26 - 22} y2={42} />
        <line x1={i * 26} y1={6} x2={i * 26 + 22} y2={42} />
      </g>
    ))}
    <ellipse cx={-40} cy={0} rx={24} ry={21} fill={color} />
    <ellipse cx={0} cy={-2} rx={20} ry={16} fill={color} />
    <ellipse cx={40} cy={-6} rx={19} ry={18} fill={color} />
    <path d="M50 -22 q10 -26 30 -30 M40 -22 q0 -28 14 -40" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);
const AntFace: React.FC = () => <g transform="translate(200 178)"><AntFaceG /></g>;
const CheckFace: React.FC<{ p: number }> = ({ p }) => (
  <g>
    <circle cx={200} cy={178} r={70} fill="none" stroke="#fff" strokeWidth={12} opacity={p} />
    <path d="M165 180 L192 207 L240 152" fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={140} strokeDashoffset={140 * (1 - p)} />
  </g>
);

/* ---------- S1 / L1: living room, the ball is an ant-sized dot ---------- */
export const H2S1: React.FC = () => {
  const frame = useSceneFrame("s1");
  const v = useV();
  const { w: W } = useLayout();
  const cAt = h2ev("s1.closeup"), aAt = h2ev("s1.ant");
  const sofaTop = v(1170, 760);
  const push = interpolate(frame, [0, cAt], [1, 1.07], clamp);
  const close = frame >= cAt;
  const zin = sp(frame, cAt, { damping: 15, stiffness: 140 });
  const pw = v(620, 440), ph = v(1180, 840);
  const ant = ramp(frame, aAt - 4, aAt + 26);
  const t = frame / 30;
  return (
    <SceneShell id="s1" noOut>
      {!close ? (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "50% 60%" }}>
          <RoomBack sofaTop={sofaTop} />
          <HamzaAt frame={frame} id="hz1" legs={false} x={W / 2 - v(300, 230)} y={sofaTop - v(780, 590)} w={v(600, 460)} expr="squint" arms={ARM.phoneUp} held="phone" lookY={0.8} lean={5} tilt={6} />
          <SofaFront sofaTop={sofaTop} />
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", inset: 0, filter: "blur(14px) brightness(0.8)" }}><RoomBack sofaTop={sofaTop} /></div>
          <div style={{ position: "absolute", left: W / 2 - pw / 2, top: v(250, 110), width: pw, height: ph, transform: `scale(${0.55 + 0.45 * zin})`, borderRadius: pw * 0.12, background: "#1A1E28", boxShadow: "0 40px 80px rgba(0,0,0,0.45)", padding: pw * 0.04 }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: pw * 0.09, overflow: "hidden" }}>
              {/* tiny landscape match: the ball is a ~4 px dot */}
              <Match w={pw * 0.92} h={ph - pw * 0.08} t={t} ballR={v(4.5, 3.5)} ant={frame >= aAt - 4 ? ant : -1} playerR={v(9, 7)} antU={v(16, 12)} />
              <svg viewBox="0 0 100 190" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <path d="M62 0 L55 38 L70 66 L48 92 L60 124 L44 160 L50 190 M55 38 L86 30 L100 44 M70 66 L96 82 M48 92 L14 86 L0 100 M60 124 L84 140 M44 160 L18 176" stroke="rgba(255,255,255,0.85)" strokeWidth={0.7} fill="none" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </div>
          {frame >= aAt && (
            <div style={{ position: "absolute", left: 0, right: v(70, 0), top: v(140, 30), display: "flex", justifyContent: "center", opacity: ramp(frame, aAt, aAt + 6), zIndex: 10 }}>
              <div style={{ ...slam(frame, aAt, 1.8), display: "flex", alignItems: "center", gap: 12, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: v(40, 30), padding: "6px 26px 10px", borderRadius: 999, boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", border: `4px solid ${COLORS.blue}` }} />=
                <svg width={v(70, 54)} height={v(40, 31)} viewBox="-70 -40 140 80"><g transform="scale(1.1)"><AntFaceG color={COLORS.blue} /></g></svg>?
              </div>
            </div>
          )}
        </div>
      )}
    </SceneShell>
  );
};

/* ---------- S2 / L2: Citybot bursts out of the phone, box drops, folded Duo rises ---------- */
export const H2S2: React.FC = () => {
  const frame = useSceneFrame("s2");
  const v = useV();
  const { w: W } = useLayout();
  const from = h2scene("s2").from;
  const bAt = h2ev("s2.burst"), tvAt = h2ev("s2.tv"), boxAt = h2ev("s2.box"), rAt = h2ev("s2.rise");
  const t = frame / 30;
  const pw = v(620, 440), ph = v(1180, 840);
  if (frame < bAt) {
    // phone close-up glowing (continues S1's shot)
    const glow = ramp(frame, from, bAt);
    return (
      <SceneShell id="s2" noIn noOut>
        <div style={{ position: "absolute", left: W / 2 - pw / 2, top: v(250, 110), width: pw, height: ph, borderRadius: pw * 0.12, background: "#1A1E28", padding: pw * 0.04, boxShadow: `0 0 ${80 * glow}px ${40 * glow}px rgba(140,235,255,${0.8 * glow})` }}>
          <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: pw * 0.09, overflow: "hidden" }}>
            <Match w={pw * 0.92} h={ph - pw * 0.08} t={t} ballR={v(4.5, 3.5)} playerR={v(9, 7)} />
              <svg viewBox="0 0 100 190" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                <path d="M62 0 L55 38 L70 66 L48 92 L60 124 L44 160 L50 190 M55 38 L86 30 L100 44 M70 66 L96 82 M48 92 L14 86 L0 100 M60 124 L84 140 M44 160 L18 176" stroke="rgba(255,255,255,0.85)" strokeWidth={0.7} fill="none" vectorEffect="non-scaling-stroke" />
              </svg>
            <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: glow * 0.85 }} />
          </div>
        </div>
      </SceneShell>
    );
  }
  const out = sp(frame, bAt, { damping: 11, stiffness: 140, mass: 0.8 });
  const box = { cx: v(560, 540), y: v(1000, 640), w: v(230, 170) };
  const drop = sp(frame, boxAt, { damping: 9, stiffness: 160, mass: 0.7 });
  const rise = sp(frame, rAt, { damping: 13, stiffness: 120 });
  const duoW = v(220, 160);
  return (
    <SceneShell id="s2" noIn>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame - bAt, [0, 2, 10], [0.9, 0.9, 0], clamp), zIndex: 30 }} />
      {/* Hamza falls back, surprised, then listens */}
      <HamzaAt frame={frame} id="hz2" x={v(10, 10)} y={v(880, 470)} w={v(420, 330)} expr={frame < bAt + 25 ? "jaw" : "neutral"} arms={frame < bAt + 25 ? ARM.open : ARM.down} lookX={0.8} lookY={-0.3} lean={frame < bAt + 25 ? -6 : 0} />
      {/* TV crossed out on "تلفزة" */}
      {frame >= tvAt - 1 && (
        <div style={{ position: "absolute", left: v(110, 120), top: v(560, 190), transform: `scale(${pop(frame, tvAt)})` }}>
          <div style={{ width: v(190, 150), height: v(190, 150), borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(6,14,90,0.35)" }}>
            <LineIcon name="tv" size={v(120, 96)} stroke={8} color={COLORS.blue} />
          </div>
          <svg width={v(190, 150)} height={v(190, 150)} viewBox="0 0 190 190" style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M40 40 L150 150" stroke={RED} strokeWidth={16} strokeLinecap="round" opacity={ramp(frame, tvAt + 3, tvAt + 7)} />
          </svg>
        </div>
      )}
      {/* box drops, folded iPhone Duo rises out of it */}
      {frame >= boxAt - 1 && (
        <div style={{ position: "absolute", left: box.cx - box.w / 2, top: box.y - (1 - drop) * 900, width: box.w }}>
          {frame >= rAt - 1 && (
            <>
              <div style={{ position: "absolute", left: box.w / 2 - 320, top: -380, width: 640, height: 640, opacity: ramp(frame, rAt, rAt + 8) }}>
                <Burst x={320} y={320} r={320} rot={frame * 1.2} opacity={0.5} rays={16} />
              </div>
              <Img src={staticFile("hamza2/products/duo_folded_night.png")} style={{ position: "absolute", left: box.w / 2 - duoW / 2, top: 30 - rise * v(470, 350), width: duoW, filter: "drop-shadow(0 24px 30px rgba(6,14,90,0.45))" }} />
            </>
          )}
          <svg viewBox="0 0 230 190" width={box.w} style={{ position: "relative", overflow: "visible" }}>
            <path d="M10 60 L115 30 L220 60 L115 92 Z" fill="#F4F6FF" stroke="#1B2A80" strokeWidth={5} />
            <path d="M10 60 L10 150 L115 182 L115 92 Z" fill="#E1E6FF" stroke="#1B2A80" strokeWidth={5} />
            <path d="M220 60 L220 150 L115 182 L115 92 Z" fill="#CBD3FF" stroke="#1B2A80" strokeWidth={5} />
            <path d="M62 45 L168 77 L168 165" fill="none" stroke={COLORS.blue} strokeWidth={14} />
          </svg>
        </div>
      )}
      {frame >= rAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: v(70, 0), top: v(236, 40), display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, rAt, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: v(96, 76), color: "#fff", textShadow, whiteSpace: "nowrap" }}>iPhone Duo</div>
        </div>
      )}
      {/* Citybot bursts out of the phone, ant on its face as a callback */}
      <BotAt frame={frame} id="cb2" cx={v(790, 870)} y={v(420, 150) + (1 - out) * 500} w={v(320, 230)} scale={0.2 + 0.8 * out} expr="excited" lookX={-0.7}
        face={frame < tvAt ? <AntFace /> : null} r={frame >= rAt ? { rot: 120, hand: "point" } : undefined} />
    </SceneShell>
  );
};

/* ---------- S3 / L3: Citybot unfolds the Duo (book-style hinge), Hamza's jaw drops ---------- */
export const H2S3: React.FC = () => {
  const frame = useSceneFrame("s3");
  const v = useV();
  const { w: W } = useLayout();
  const uAt = h2ev("s3.unfold"), jAt = h2ev("s3.jaw"), q1 = h2ev("s3.q1"), q2 = h2ev("s3.q2");
  const open = sp(frame, uAt, { damping: 16, stiffness: 70, mass: 1 });
  const pw = v(320, 190);
  const Q: React.FC<{ at: number; x: number; y: number; s: number; rot: number }> = ({ at, x, y, s, rot }) =>
    frame < at - 1 ? null : (
      <div style={{ position: "absolute", left: x, top: y, transform: `scale(${pop(frame, at)}) rotate(${rot}deg)`, fontFamily: AR, fontWeight: 900, fontSize: s, color: "#fff", textShadow }}>؟</div>
    );
  return (
    <SceneShell id="s3">
      <div style={{ position: "absolute", left: W / 2 - pw, top: v(330, 120) }}>
        <RealDuo id={`rd${pw}`} w={2 * pw} open={open} t={frame / 30} matchOn={0} />
      </div>
      <BotAt frame={frame} id="cb3" cx={v(840, 920)} y={v(960, 470)} w={v(250, 190)} expr="proud" lookX={-0.6} lookY={-0.6} l={{ rot: 150, hand: "open" }} />
      <HamzaAt frame={frame} id="hz3" x={v(10, 20)} y={v(900, 470)} w={v(400, 320)} expr={frame >= jAt ? "jaw" : "neutral"} arms={frame >= jAt ? ARM.open : ARM.down} lookX={0.6} lookY={-0.7} lean={-4} />
      <Q at={q1} x={v(400, 160)} y={v(930, 330)} s={v(150, 120)} rot={-12} />
      <Q at={q2} x={v(510, 260)} y={v(900, 280)} s={v(110, 90)} rot={14} />
    </SceneShell>
  );
};

/* ---------- S4 / L4: folded 5.4" vs open 7.6" (the match big and clear), colour swatches ---------- */
export const H2S4: React.FC = () => {
  const frame = useSceneFrame("s4");
  const v = useV();
  const { w: W } = useLayout();
  const fAt = h2ev("s4.folded"), oAt = h2ev("s4.open"), bAt = h2ev("s4.biggest"), cAt = h2ev("s4.colors");
  const fold = sp(frame, fAt - 6, { damping: 18, stiffness: 160 });
  const reopen = sp(frame, oAt, { damping: 16, stiffness: 80 });
  const open = 1 - fold + fold * reopen;
  const pw = v(310, 175);
  const devX = v(W / 2 - pw, 330 - pw), devY = v(300, 120);
  const pill = (at: number, text: string, x: number, y: number) =>
    frame < at - 1 ? null : (
      <div style={{ position: "absolute", left: x, top: y, transform: `scale(${pop(frame, at)})`, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: v(56, 44), padding: "2px 22px 6px", borderRadius: 18, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>{text}</div>
    );
  const sw = (src: string, label: string, i: number) => (
    <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${pop(frame, cAt + i * 4)})` }}>
      <div style={{ width: v(200, 170), height: v(140, 120), background: "#fff", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
        <Img src={staticFile(src)} style={{ maxWidth: "88%", maxHeight: "86%" }} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: v(28, 24), color: "#fff", textShadow }}>{label}</div>
    </div>
  );
  return (
    <SceneShell id="s4">
      <div style={{ position: "absolute", left: devX, top: devY }}>
        <RealDuo id={`rd${pw}`} w={2 * pw} open={open} t={frame / 30} matchOn={ramp(frame, oAt + 6, oAt + 18)} />
      </div>
      {frame >= fAt && frame < oAt && pill(fAt, '5,4″', v(W / 2 + 175, 470), v(380, 160))}
      {frame >= oAt && pill(oAt + 10, '7,6″', v(W / 2 + pw - 150, 640), v(200, 100))}
      {frame >= bAt - 1 && (
        <div style={{ position: "absolute", left: v(0, 560), right: v(70, 30), top: v(870, 280), display: "flex", justifyContent: "center", ...slam(frame, bAt, 1.8) }}>
          <div style={{ background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: v(34, 28), padding: "6px 24px 8px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>Le plus grand écran d'iPhone</div>
        </div>
      )}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: v(0, 560), right: v(70, 30), top: v(960, 380), display: "flex", justifyContent: "center", gap: 30 }}>
          {sw("iphoneduo2/products/night.png", "Night Sky", 0)}
          {sw("iphoneduo2/products/open.png", "Star White", 1)}
        </div>
      )}
      {frame >= fAt && (
        <div style={{ position: "absolute", left: v(340, 560), right: v(130, 30), top: v(1170, 610), textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: v(24, 20), color: "#fff", opacity: 0.85, textShadow }}>
          Écran extérieur 5,4″ · écran intérieur 7,6″ (diagonales mesurées en rectangle)
        </div>
      )}
      {v(true, false) && (
        <>
          <HamzaAt frame={frame} id="hz4" x={20} y={1170} w={250} expr="jaw" arms={ARM.open} lookX={0.6} lookY={-0.8} />
          <BotAt frame={frame} id="cb4" cx={850} y={1250} w={160} expr="excited" lookX={-0.5} lookY={-0.8} />
        </>
      )}
    </SceneShell>
  );
};

/* ---------- S5 / L5: "وواش أوريجينال؟" Hamza leans in, suspicious ---------- */
export const H2S5: React.FC = () => {
  const frame = useSceneFrame("s5");
  const v = useV();
  const lAt = h2ev("s5.lean"), qAt = h2ev("s5.q");
  const lean = sp(frame, lAt, { damping: 14, stiffness: 120 });
  return (
    <SceneShell id="s5">
      <div style={{ position: "absolute", left: v(90, 120), top: v(470, 110), transform: `scale(${1 + 0.08 * lean})`, transformOrigin: "50% 100%" }}>
        <HamzaAt frame={frame} id="hz5" x={0} y={0} w={v(640, 500)} expr="suspicious" tilt={-8 * lean} lean={6 * lean} lookX={0.45} />
      </div>
      {frame >= qAt - 1 && (
        <div style={{ position: "absolute", left: v(640, 690), top: v(260, 90), transform: `scale(${pop(frame, qAt)})` }}>
          <div style={{ width: v(260, 220), height: v(260, 220), borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px rgba(6,14,90,0.4)" }}>
            <span style={{ fontFamily: AR, fontWeight: 900, fontSize: v(200, 170), color: COLORS.blue, lineHeight: 1 }}>؟</span>
          </div>
          <div style={{ position: "absolute", left: v(30, 24), bottom: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "46px solid #fff", transform: "rotate(30deg)" }} />
        </div>
      )}
      <BotAt frame={frame} id="cb5" cx={v(840, 930)} y={v(1080, 600)} w={v(190, 160)} expr="neutral" lookX={-0.8} lookY={-0.3} tilt={6} />
    </SceneShell>
  );
};

/* ---------- S6 / L6: "ديما!" Citybot winks, checkmark on its face; three badges stamp in ---------- */
export const H2S6: React.FC = () => {
  const frame = useSceneFrame("s6");
  const v = useV();
  const aAt = h2ev("s6.always");
  const badges = [h2ev("s6.b1"), h2ev("s6.b2"), h2ev("s6.b3")];
  const labels = ["Boîte fermée", "Jamais ouvert", "Jamais activé"];
  const check = frame >= aAt && frame < aAt + 36;
  return (
    <SceneShell id="s6">
      <Burst x={v(540, 270)} y={v(560, 380)} r={v(700, 520)} rot={frame * 0.5} opacity={0.18} rays={18} />
      <BotAt frame={frame} id="cb6" cx={v(540, 280)} y={v(260, 120)} w={v(380, 330)} expr={frame >= aAt + 36 ? "wink" : "proud"} r={{ rot: 72, hand: "thumb" }}
        face={check ? <CheckFace p={ramp(frame, aAt, aAt + 10)} /> : null} />
      <div style={{ position: "absolute", left: v(0, 560), right: v(70, 30), top: v(880, 260), display: "flex", flexDirection: "column", alignItems: "center", gap: v(22, 26) }}>
        {labels.map((t, i) =>
          frame < badges[i] - 1 ? <div key={t} style={{ height: v(84, 80) }} /> : (
            <div key={t} style={{ ...slam(frame, badges[i], 2.4), display: "flex", alignItems: "center", gap: 14, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: v(44, 36), height: v(84, 80), padding: "0 30px 0 16px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)", transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}>
              <svg width={56} height={56} viewBox="0 0 56 56">
                <circle cx={28} cy={28} r={26} fill={GREEN} />
                <path d="M15 29 L24 38 L41 19" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - ramp(frame, badges[i] + 2, badges[i] + 10))} />
              </svg>
              {t}
            </div>
          ),
        )}
      </div>
      {v(true, false) && <HamzaAt frame={frame} id="hz6" x={10} y={1170} w={250} expr="happy" lookX={0.7} lookY={-0.8} />}
    </SceneShell>
  );
};

/* ---------- S7 / L7: CTA, Hamza happily holds the open Duo; message bubble + citystore.ma ---------- */
/** City Store chat on the Duo's inner screen: Hamza types, sends on "ميساج", the bubble lands with ✓✓ */
const MSG = "Salam ! Je veux l'iPhone Duo.";
const ChatScreen: React.FC<{ frame: number; from: number; sendAt: number; w: number; h: number }> = ({ frame, from, sendAt, w, h }) => {
  const u = w / 100; // 1 unit = 1 % of the screen width
  const typed = Math.max(0, Math.min(MSG.length, Math.round(((frame - from - 3) / Math.max(1, sendAt - from - 5)) * MSG.length)));
  const sent = frame >= sendAt;
  const fly = sp(frame, sendAt, { damping: 14, stiffness: 180 });
  const keys = ["azertyuiop", "qsdfghjklm", "wxcvbn"];
  const lit = !sent && typed > 0 ? (typed * 7) % 26 : -1;
  let kIdx = 0;
  return (
    <div style={{ position: "relative", width: w, height: h, background: "#F1F3FA", fontFamily: FONT }}>
      {/* header */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 13 * u, background: "#fff", display: "flex", alignItems: "center", gap: 2.5 * u, padding: `0 ${4 * u}px`, boxShadow: "0 1px 0 #DDE1EE" }}>
        <Img src={staticFile("logo/logo.png")} style={{ width: 8.5 * u, height: 8.5 * u, borderRadius: "50%" }} />
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 900, fontSize: 3.6 * u, color: "#16237F" }}>City Store</div>
          <div style={{ fontWeight: 700, fontSize: 2.4 * u, color: GREEN }}>en ligne</div>
        </div>
      </div>
      {/* sent bubble + reply typing */}
      {sent && (
        <div style={{ position: "absolute", right: 4 * u, top: 17 * u + (1 - fly) * 30 * u, maxWidth: 70 * u, background: COLORS.blue, color: "#fff", fontWeight: 800, fontSize: 3.4 * u, padding: `${1.8 * u}px ${3 * u}px`, borderRadius: `${4 * u}px ${4 * u}px ${1 * u}px ${4 * u}px`, opacity: fly }}>
          {MSG}
          <span style={{ fontSize: 2.4 * u, marginLeft: 1.5 * u, opacity: 0.85 }}>✓✓</span>
        </div>
      )}
      {sent && frame >= sendAt + 10 && (
        <div style={{ position: "absolute", left: 4 * u, top: 31 * u, background: "#fff", borderRadius: 4 * u, padding: `${1.6 * u}px ${3 * u}px`, display: "flex", gap: 1.2 * u, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 1.6 * u, height: 1.6 * u, borderRadius: "50%", background: "#9AA3C7", opacity: 0.4 + 0.6 * Math.max(0, Math.sin(frame / 3 - i)) }} />)}
        </div>
      )}
      {/* input row */}
      <div style={{ position: "absolute", left: 3 * u, right: 3 * u, top: 47 * u, height: 9 * u, display: "flex", alignItems: "center", gap: 2 * u }}>
        <div style={{ flex: 1, height: "100%", background: "#fff", borderRadius: 5 * u, border: "1px solid #D5DAEA", display: "flex", alignItems: "center", padding: `0 ${2.5 * u}px`, fontWeight: 700, fontSize: 3.2 * u, color: "#16237F", whiteSpace: "nowrap", overflow: "hidden" }}>
          {sent ? <span style={{ color: "#9AA3C7" }}>Message</span> : <>{MSG.slice(0, typed)}<span style={{ opacity: Math.floor(frame / 6) % 2 ? 1 : 0 }}>|</span></>}
        </div>
        <div style={{ width: 9 * u, height: 9 * u, borderRadius: "50%", background: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${frame >= sendAt - 2 && frame < sendAt + 4 ? 0.82 : 1})` }}>
          <svg viewBox="0 0 24 24" width={5 * u} height={5 * u}><path d="M3 12 L21 4 L14 21 L11 13 Z" fill="#fff" /></svg>
        </div>
      </div>
      {/* keyboard */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 59 * u, bottom: 0, background: "#D9DDEA", padding: `${1.5 * u}px ${1.5 * u}px`, display: "flex", flexDirection: "column", gap: 1.3 * u }}>
        {keys.map((row) => (
          <div key={row} style={{ display: "flex", justifyContent: "center", gap: 1.1 * u }}>
            {row.split("").map((c) => {
              const on = kIdx++ === lit;
              return <div key={c} style={{ width: 8.4 * u, height: 7.4 * u, borderRadius: 1.2 * u, background: on ? COLORS.blue : "#fff", color: on ? "#fff" : "#16237F", fontWeight: 800, fontSize: 3 * u, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 0 #A9AFC6" }}>{c}</div>;
            })}
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "center" }}><div style={{ width: 50 * u, height: 7 * u, borderRadius: 1.2 * u, background: "#fff", boxShadow: "0 1px 0 #A9AFC6" }} /></div>
      </div>
    </div>
  );
};

/* ---------- S7 / L7: CTA, Hamza types and sends the message on the Duo while Citybot says "صيفط لينا ميساج" ---------- */
export const H2S7: React.FC = () => {
  const frame = useSceneFrame("s7");
  const v = useV();
  const from = h2scene("s7").from;
  const mAt = h2ev("s7.msg"), uAt = h2ev("s7.url");
  const hw = v(640, 520), hx = v(110, 170), hy = v(240, 150);
  const k = hw / 400;
  const hand = handAt(-1, ARM.holdFront.l);
  const pw = 165 * k; // half-width of the device in px (bigger, so the chat reads)
  const dw = 2 * pw, sc = dw / 490;
  const url = "citystore.ma";
  const typedUrl = Math.max(0, Math.min(url.length, Math.floor((frame - uAt) / 1.5) + 1));
  // thumbs tapping while he types, a little lift on "send"
  const typing = frame < mAt + 2;
  const tap = typing ? Math.sin(frame * 1.9) * 7 : 0;
  const arms = { l: { up: ARM.holdFront.l.up, fore: ARM.holdFront.l.fore + tap }, r: { up: ARM.holdFront.r.up, fore: ARM.holdFront.r.fore - tap } };
  return (
    <SceneShell id="s7">
      <HamzaAt frame={frame} id="hz7" x={hx} y={hy} w={hw} expr={frame < mAt ? "happy" : "delighted"} arms={arms} lookY={0.85} lookX={0}>
        <div style={{ position: "absolute", left: 200 * k - pw, top: (hand.y - 190) * k, transform: "rotate(-2deg)" }}>
          <RealDuo id="rd7" w={dw} open={1} t={frame / 30}
            screen={<ChatScreen frame={frame} from={from} sendAt={mAt} w={449 * sc} h={398 * sc} />} />
        </div>
      </HamzaAt>
      {frame >= uAt - 1 && (
        <div style={{ position: "absolute", left: v(60, 40), right: v(130, 330), top: v(150, 60), display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, uAt, 1.6), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: v(64, 52), padding: "4px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", minWidth: v(470, 380), textAlign: "center" }}>
            {url.slice(0, typedUrl)}
            <span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>|</span>
          </div>
        </div>
      )}
      {/* "message sent" pop next to the phone on "ميساج" */}
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: v(800, 830), top: v(330, 60), transform: `scale(${pop(frame, mAt)})` }}>
          <div style={{ width: v(140, 120), height: v(140, 120), borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(6,14,90,0.35)" }}>
            <LineIcon name="chat" size={v(88, 76)} stroke={8} color={COLORS.blue} progress={ramp(frame, mAt, mAt + 10)} />
          </div>
        </div>
      )}
      <BotAt frame={frame} id="cb7" cx={v(880, 940)} y={v(560, 600)} w={v(160, 150)} expr="happy" lookX={-0.6} r={{ rot: 122 + Math.sin(frame / 3) * 18, hand: "wave" }} />
    </SceneShell>
  );
};

/* ---------- END / L8: logo reveal + tagline; Hamza and Citybot high-five ---------- */
export const H2End: React.FC = () => {
  const frame = useSceneFrame("end");
  const v = useV();
  const fAt = h2ev("end.five"), wAt = h2ev("end.wink");
  const five = sp(frame, fAt - 8, { damping: 12, stiffness: 200 });
  const P = v(true, false);
  return (
    <>
      <EndCard tagline="الأصلي ديما!" />
      <SceneShell id="end" noOut>
        <HamzaAt frame={frame} id="hz8" x={v(150 + 40 * five, 650)} y={v(1080, 560)} w={v(330, 230)} expr="delighted" arms={frame >= fAt - 8 ? ARM.highFive : ARM.down} lookX={0.8} lookY={-0.4} />
        <BotAt frame={frame} id="cb8" cx={v(770 - 40 * five, 975)} y={v(1120, 590)} w={v(250, 160)} expr={frame >= wAt ? "wink" : "excited"} lookX={-0.8} l={frame >= fAt - 8 ? { rot: 160, hand: "open" } : undefined} />
        {frame >= fAt && (
          <div style={{ position: "absolute", left: v(505, 840), top: v(1060, 520), transform: `scale(${pop(frame, fAt)})`, opacity: 1 - ramp(frame, fAt + 10, fAt + 22) }}>
            <svg width={P ? 120 : 90} height={P ? 120 : 90} viewBox="-60 -60 120 120">
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={i} x1={0} y1={-24} x2={0} y2={-56} stroke="#FFE27A" strokeWidth={9} strokeLinecap="round" transform={`rotate(${i * 45})`} />
              ))}
            </svg>
          </div>
        )}
      </SceneShell>
    </>
  );
};
