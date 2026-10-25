import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { mmev, mmscene, OFFICIAL, PORTS } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";

const Chip: React.FC<{ frame: number; at: number; text: string; icon?: IconName; size: number; solid?: boolean }> = ({ frame, at, text, icon, size, solid }) => {
  if (frame < at - 1) return null;
  const p = sp(frame, at, { damping: 11, stiffness: 220, mass: 0.6 });
  const fg = solid ? COLORS.blue : "#fff";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.22}px ${size * 0.62}px`, borderRadius: 999, background: solid ? "#fff" : "rgba(255,255,255,0.18)", border: solid ? "none" : "3px solid rgba(255,255,255,0.75)", color: fg, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", transform: `scale(${p})`, boxShadow: "0 12px 30px rgba(6,14,90,0.3)" }}>
      {icon ? <LineIcon name={icon} size={size * 1.2} stroke={7} color={fg} progress={ramp(frame, at, at + 10)} /> : null}
      {text}
    </div>
  );
};

const Row: React.FC<{ top: number; left?: number; children: React.ReactNode }> = ({ top, left = 340, children }) => (
  <div style={{ position: "absolute", left, right: 130, top, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>{children}</div>
);

/** small honest footnote under a claim (kept clear of Citybot and the subtitles) */
const Footnote: React.FC<{ frame: number; at: number; text: string; top: number }> = ({ frame, at, text, top }) =>
  frame < at ? null : (
    <div style={{ position: "absolute", left: 340, right: 130, top, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, lineHeight: 1.25, color: "#fff", opacity: 0.88 * ramp(frame, at, at + 8), textShadow: "0 4px 14px rgba(8,20,110,0.45)" }}>
      {text}
    </div>
  );

const Title: React.FC<{ frame: number; at: number; children: React.ReactNode; pill?: boolean; size?: number; top?: number }> = ({ frame, at, children, pill, size = 72, top = 236 }) =>
  frame < at - 1 ? null : (
    <div style={{ position: "absolute", left: 0, right: 70, top, display: "flex", justifyContent: "center", zIndex: 20 }}>
      <div style={{ ...slam(frame, at, 2.2), display: "flex", alignItems: "center", gap: size * 0.22, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", ...(pill ? { background: "#fff", color: COLORS.blue, padding: `${size * 0.06}px ${size * 0.45}px ${size * 0.14}px`, borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" } : { color: "#fff", textShadow }) }}>
        {children}
      </div>
    </div>
  );

const Img: React.FC<{ k: keyof typeof OFFICIAL; w: number; sweep?: number; children?: React.ReactNode }> = ({ k, w, sweep = -1, children }) => (
  <div style={{ position: "relative", filter: SHADOW }}>
    <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
    {children}
  </div>
);

/** glowing ring around a port */
const PortRing: React.FC<{ frame: number; at: number; x: number; y: number; w: number; h: number }> = ({ frame, at, x, y, w, h }) =>
  frame < at - 1 ? null : (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, borderRadius: Math.min(w, h) / 2, border: "6px solid #6CF3FF", boxShadow: "0 0 24px #6CF3FF", transform: `scale(${pop(frame, at)})` }} />
  );

/*
 * 0.0-2.5 s HOOK ("small as your hand... and works like a big PC!")
 * visual: the Mac mini (official top view) lands on a drawn open palm; then a big tower-PC silhouette slams in with "=".
 */
export const MMHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const hAt = mmev("hook.hand"), pAt = mmev("hook.pc"), bAt = mmev("hook.big");
  const drop = sp(frame, 3, { damping: 11, stiffness: 150 });
  const tower = sp(frame, pAt, { damping: 11, stiffness: 140 });
  const sk = shake(frame, bAt, 14, 10);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={480} r={900} rot={frame * 0.6} opacity={0.18} rays={20} />
      {/* drawn palm */}
      <svg width={420} height={300} viewBox="0 0 420 300" style={{ position: "absolute", left: 40, top: 470, overflow: "visible", opacity: ramp(frame, 0, 6) }}>
        <path d="M40 120 Q 30 60 70 70 L 90 140 L 110 40 Q 130 10 150 40 L 150 130 L 175 30 Q 195 5 212 35 L 205 135 L 240 50 Q 262 28 275 60 L 255 160 Q 300 110 330 130 Q 350 145 330 175 Q 270 250 200 280 Q 110 300 70 240 Q 45 190 40 120 Z" fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 105, top: 330 + (1 - drop) * -700, transform: `rotate(${lerp(-20, -6, drop)}deg)` }}>
        <Img k="top" w={230} />
      </div>
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 60, top: 790, ...slam(frame, hAt, 2) }}>
          <div dir="rtl" style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", textShadow, whiteSpace: "nowrap" }}>قد اليد</div>
        </div>
      )}
      {frame >= pAt - 1 && (
        <>
          <div style={{ position: "absolute", left: 440, top: 440, fontFamily: FONT, fontWeight: 900, fontSize: 130, color: "#fff", textShadow, transform: `scale(${pop(frame, pAt)})` }}>=</div>
          {/* big tower PC silhouette */}
          <div style={{ position: "absolute", left: 620, top: 250, transform: `translateY(${(1 - tower) * 600}px) scale(${lerp(0.6, 1, tower)})`, transformOrigin: "50% 100%" }}>
            <svg width={300} height={520} viewBox="0 0 300 520">
              <rect x={10} y={10} width={280} height={500} rx={24} fill="rgba(6,14,90,0.35)" stroke="#fff" strokeWidth={10} />
              {[0, 1, 2].map((i) => <rect key={i} x={50} y={60 + i * 50} width={200} height={26} rx={8} fill="rgba(255,255,255,0.35)" />)}
              <circle cx={150} cy={330} r={60} fill="none" stroke="#fff" strokeWidth={8} />
              <circle cx={150} cy={330} r={12} fill="#fff" />
              <circle cx={240} cy={460} r={14} fill="#6CF3FF" />
            </svg>
            {frame >= bAt - 1 && <div style={{ ...slam(frame, bAt, 2.4), position: "absolute", left: 30, top: -70, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "2px 22px 8px", borderRadius: 14, whiteSpace: "nowrap" }}>PC</div>}
          </div>
        </>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp) }} />
    </SceneShell>
  );
};

/** 2.5-7.5 s INTRO: Mac mini M6, 16GB RAM, 256GB, DISPONIBLE. */
export const MMIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = mmev("intro.name"), rAt = mmev("intro.ram"), sAt = mmev("intro.sto"), dAt = mmev("intro.dispo");
  const enter = sp(frame, mmscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const t = frame / 30;
  const W = 820;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={640} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <span style={{ ...slam(frame, nAt, 2), fontSize: 92, letterSpacing: -1 }}>Mac mini</span>
        <span style={{ ...slam(frame, nAt + 5, 2.4), fontSize: 92, color: COLORS.blue, background: "#fff", padding: "0 24px 6px", borderRadius: 18, textShadow: "none" }}>M6</span>
      </div>
      <div style={{ position: "absolute", left: 505 - W / 2, top: 520, transform: `translateY(${(1 - enter) * 900 + Math.sin(t * Math.PI) * 8}px) scale(${lerp(0.8, 1, enter)})` }}>
        <Img k="front" w={W} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1000} left={300}>
        <Chip frame={frame} at={rAt} text="16GB RAM" icon="chip" size={40} solid />
        <Chip frame={frame} at={sAt} text="256GB" icon="box" size={40} solid />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", background: "#2BD96B", padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={44} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 7.5-12.75 s M6 chip: first 2 nm chip from Apple, 12-core CPU and 12-core GPU. */
export const MMChip: React.FC = () => {
  const frame = useSceneFrame("chip");
  const mAt = mmev("chip.m6"), nAt = mmev("chip.nm"), cAt = mmev("chip.cpu"), gAt = mmev("chip.gpu");
  const chipP = sp(frame, mAt, { damping: 12, stiffness: 160 });
  const C = { x: 505 - 190, y: 320, s: 380 };
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.4);
  const count = (at: number) => Math.round(12 * easeOut(ramp(frame, at, at + 12)));
  const card = (at: number, label: string) =>
    frame < at - 1 ? null : (
      <div style={{ transform: `scale(${pop(frame, at)})`, display: "flex", flexDirection: "column", alignItems: "center", width: 250, padding: "14px 0 18px", borderRadius: 30, background: "#fff", color: COLORS.blue, fontFamily: FONT, boxShadow: "0 16px 40px rgba(6,14,90,0.35)" }}>
        <div style={{ fontWeight: 900, fontSize: 96, lineHeight: 1 }}>{count(at)}</div>
        <div style={{ fontWeight: 900, fontSize: 28, letterSpacing: 2 }}>CŒURS {label}</div>
      </div>
    );
  return (
    <SceneShell id="chip">
      <Burst x={505} y={C.y + C.s / 2} r={900} rot={frame * 0.6} opacity={0.18 * chipP} rays={20} />
      <div style={{ position: "absolute", left: C.x, top: C.y, width: C.s, height: C.s, transform: `scale(${chipP}) rotate(${lerp(-25, 0, chipP)}deg)` }}>
        <svg width={C.s} height={C.s} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const p = 20 + i * 12;
            return (
              <g key={i} stroke="#fff" strokeWidth={2.4} strokeLinecap="round" opacity={0.6 + 0.4 * pulse}>
                <line x1={p} y1={2} x2={p} y2={12} /><line x1={p} y1={88} x2={p} y2={98} />
                <line x1={2} y1={p} x2={12} y2={p} /><line x1={88} y1={p} x2={98} y2={p} />
              </g>
            );
          })}
          <rect x={12} y={12} width={76} height={76} rx={10} fill={COLORS.navy} stroke="#fff" strokeWidth={2.6} />
          <rect x={18} y={18} width={64} height={64} rx={6} fill="none" stroke={COLORS.cyan} strokeWidth={1} opacity={0.6 + 0.4 * pulse} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#fff" }}>
          <div style={{ fontWeight: 900, fontSize: 120, lineHeight: 1 }}>M6</div>
        </div>
      </div>
      {frame >= nAt - 1 && (
        <div style={{ position: "absolute", left: C.x + C.s - 80, top: C.y - 10, ...slam(frame, nAt, 2.4) }}>
          <div style={{ transform: "rotate(10deg)", background: "linear-gradient(90deg,#FFD25A,#FFB020)", color: "#3a2500", fontFamily: FONT, fontWeight: 900, fontSize: 44, lineHeight: 1.05, textAlign: "center", padding: "6px 20px 10px", borderRadius: 16, boxShadow: "0 14px 34px rgba(6,14,90,0.45)" }}>2 nm<br /><span style={{ fontSize: 24 }}>1RE CHEZ APPLE</span></div>
        </div>
      )}
      <div style={{ position: "absolute", left: 300, right: 130, top: 760, display: "flex", justifyContent: "center", gap: 30 }}>
        {card(cAt, "CPU")}
        {card(gAt, "GPU")}
      </div>
      <Footnote frame={frame} at={nAt + 6} top={1262} text="Selon Apple" />
    </SceneShell>
  );
};

/** 12.75-18.0 s up to 4x faster AI than the Mac mini M4: work, video editing, design. */
export const MMAi: React.FC = () => {
  const frame = useSceneFrame("ai");
  const xAt = mmev("ai.x4"), mAt = mmev("ai.m4"), wAt = mmev("ai.work"), eAt = mmev("ai.edit"), dAt = mmev("ai.design");
  const x = (1 + 3 * easeOut(ramp(frame, xAt, xAt + 16))).toFixed(1).replace(".0", "");
  const sk = shake(frame, xAt + 16, 12, 8);
  const bar = (label: string, frac: number, at: number, hi: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: frame >= at - 1 ? 1 : 0 }}>
      <div style={{ width: 150, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", textAlign: "right" }}>{label}</div>
      <div style={{ width: 540 * frac * easeOut(ramp(frame, at, at + 14)), height: 64, borderRadius: 18, background: hi ? "linear-gradient(90deg,#6CF3FF,#fff)" : "rgba(255,255,255,0.35)", border: "4px solid #fff" }} />
    </div>
  );
  const TILES: { at: number; icon: IconName; text: string }[] = [
    { at: wAt, icon: "briefcase", text: "Travail" },
    { at: eAt, icon: "play", text: "Montage" },
    { at: dAt, icon: "palette", text: "Design" },
  ];
  return (
    <SceneShell id="ai" shakeX={sk.x} shakeY={sk.y}>
      {frame >= xAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, ...slam(frame, xAt, 2.2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: 3 }}>JUSQU'À</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 1, color: COLORS.blue, background: "#fff", padding: "0 34px 10px", borderRadius: 30, boxShadow: "0 18px 44px rgba(6,14,90,0.45)" }}>×{x}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", textShadow }}>plus rapide en IA</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 60, top: 620, display: "flex", flexDirection: "column", gap: 20 }}>
        {bar("M4", 0.25, mAt, false)}
        {bar("M6", 1, mAt + 4, true)}
      </div>
      <div style={{ position: "absolute", left: 300, right: 130, top: 840, display: "flex", justifyContent: "center", gap: 20 }}>
        {TILES.map((tl) => frame < tl.at - 1 ? null : (
          <div key={tl.text} style={{ transform: `scale(${pop(frame, tl.at)})`, width: 170, height: 170, borderRadius: 34, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff" }}>
            <LineIcon name={tl.icon} size={74} stroke={7} progress={ramp(frame, tl.at, tl.at + 10)} />
            {tl.text}
          </div>
        ))}
      </div>
      <Footnote frame={frame} at={mAt + 6} top={1262} text="Jusqu'à 4×, tâches d'IA vs Mac mini M4, selon Apple" />
    </SceneShell>
  );
};

/** 18.0-22.75 s 3 Thunderbolt ports, HDMI and 2 USB-C, only 12 cm wide. */
export const MMPorts: React.FC = () => {
  const frame = useSceneFrame("ports");
  const tAt = mmev("po.tb"), hAt = mmev("po.hdmi"), uAt = mmev("po.usbc"), sAt = mmev("po.size");
  const enter = sp(frame, mmscene("ports").from, { damping: 13, stiffness: 120 });
  const BW = 860, BH = BW * OFFICIAL.back.aspect, BX = 505 - BW / 2 + 20, BY = 250;
  const FW = 640, FH = FW * OFFICIAL.front.aspect, FX = 505 - FW / 2 + 60, FY = 680;
  const measure = ramp(frame, sAt, sAt + 10);
  return (
    <SceneShell id="ports">
      <div style={{ position: "absolute", left: BX, top: BY, transform: `translateX(${(1 - enter) * -900}px)` }}>
        <Img k="back" w={BW}>
          {PORTS.tb.map((p, i) => <PortRing key={i} frame={frame} at={tAt + i * 3} x={p.x * BW} y={p.y * BH} w={46} h={96} />)}
          <PortRing frame={frame} at={hAt} x={PORTS.hdmi.x * BW} y={PORTS.hdmi.y * BH} w={115} h={64} />
        </Img>
      </div>
      <div style={{ position: "absolute", left: FX, top: FY, transform: `translateX(${(1 - enter) * 900}px)` }}>
        <Img k="front" w={FW}>
          {PORTS.usbc.map((p, i) => <PortRing key={i} frame={frame} at={uAt + i * 3} x={p.x * FW} y={p.y * FH} w={44} h={90} />)}
        </Img>
        {measure > 0 && (
          <div style={{ position: "absolute", left: 0, top: FH + 22, width: FW, opacity: measure }}>
            <svg width={FW} height={40} style={{ overflow: "visible" }}>
              <path d={`M 4 20 H ${FW - 4} M 4 6 V 34 M ${FW - 4} 6 V 34`} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", ...slam(frame, sAt, 2) }}>
              <div style={{ background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "2px 22px 6px", borderRadius: 14 }}>12 cm</div>
            </div>
          </div>
        )}
      </div>
      <Row top={1140}>
        <Chip frame={frame} at={tAt} text="3 Thunderbolt" icon="bolt" size={34} solid />
        <Chip frame={frame} at={hAt} text="HDMI" icon="tv" size={34} />
        <Chip frame={frame} at={uAt} text="2 USB-C" icon="cable" size={34} />
      </Row>
    </SceneShell>
  );
};
