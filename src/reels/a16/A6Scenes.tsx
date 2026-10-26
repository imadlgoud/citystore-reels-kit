import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { a6ev, a6scene, LENS, OFFICIAL } from "./timeline";

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

/** official pair render (back + front) */
const Pair: React.FC<{ k: "pair" | "back"; w: number; sweep?: number }> = ({ k, w, sweep = -1 }) => (
  <div style={{ filter: SHADOW }}>
    <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
  </div>
);

/*
 * 0.0-2.5 s HOOK ("buy a phone today... and it stays new for up to 6 years!")
 * visual: the Galaxy A16 slams in on "today", a NEUF tag on "new", then a big "6 ANS" seal with a year ring.
 */
export const A6Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const tAt = a6ev("hook.today"), nAt = a6ev("hook.new"), sAt = a6ev("hook.six");
  const sk = shake(frame, sAt, 16, 12);
  const phone = slam(frame, tAt, 2.4);
  const ring = ramp(frame, sAt, sAt + 14);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={560} r={900} rot={frame * 0.8} opacity={0.22 * ramp(frame, sAt, sAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < sAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 62, color: "#fff", textShadow, whiteSpace: "nowrap" }}>شري تيليفون اليوم…</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, sAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "2px 34px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>ويبقى جديد حتى لـ 6 ans!</div>
        )}
      </div>
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 300, top: 360, ...phone }}>
          <Pair k="pair" w={330} sweep={interpolate(frame, [nAt, nAt + 16], [-0.3, 1.3], clamp)} />
        </div>
      )}
      {frame >= nAt - 1 && (
        <div style={{ position: "absolute", left: 270, top: 420, transform: `scale(${pop(frame, nAt)}) rotate(-10deg)`, background: "#2BD96B", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "4px 22px 8px", borderRadius: 14, letterSpacing: 3, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>NEUF</div>
      )}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 650, top: 470, width: 280, height: 280, transform: `scale(${pop(frame, sAt)})` }}>
          <svg width={280} height={280} viewBox="-140 -140 280 280" style={{ position: "absolute", inset: 0 }}>
            <circle r={130} fill="#fff" />
            <circle r={112} fill="none" stroke="#e4e7f2" strokeWidth={14} />
            <circle r={112} fill="none" stroke={COLORS.blue} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${704 * ring} 704`} transform="rotate(-90)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: COLORS.blue, lineHeight: 1 }}>
            <div style={{ fontSize: 120 }}>{Math.max(1, Math.round(6 * ring))}</div>
            <div style={{ fontSize: 40, letterSpacing: 4 }}>ANS</div>
          </div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - tAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 2.5-8.5 s INTRO: Samsung Galaxy A16, 4GB RAM, 128GB, Noir, DISPONIBLE. */
export const A6Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = a6ev("intro.name"), rAt = a6ev("intro.ram"), sAt = a6ev("intro.sto"), cAt = a6ev("intro.noir"), dAt = a6ev("intro.dispo");
  const enter = sp(frame, a6scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const t = frame / 30;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={760} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 36, letterSpacing: 10 }}>SAMSUNG</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...slam(frame, nAt + 4, 2.2) }}>
          <span style={{ fontSize: 88 }}>Galaxy</span>
          <span style={{ fontSize: 92, color: COLORS.blue, background: "#fff", padding: "0 22px 4px", borderRadius: 18, textShadow: "none" }}>A16</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 560 - 230, top: 440, transform: `translateX(${(1 - enter) * -1000}px) translateY(${Math.sin(t * Math.PI) * 8}px) rotate(${lerp(-12, 0, enter)}deg)` }}>
        <Pair k="pair" w={460} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1080} left={300}>
        <Chip frame={frame} at={rAt} text="4GB RAM" icon="chip" size={38} solid />
        <Chip frame={frame} at={sAt} text="128GB" icon="box" size={38} solid />
        {frame >= cAt - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 24px", borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.75)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 36, whiteSpace: "nowrap", transform: `scale(${pop(frame, cAt)})` }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1d2230", border: "3px solid #fff" }} />Noir
          </div>
        )}
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", background: "#2BD96B", padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={44} stroke={7} color="#fff" />
            DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 8.5-12.0 s Super AMOLED 6.7" screen: vivid colours, great for videos. */
export const A6Screen: React.FC = () => {
  const frame = useSceneFrame("screen");
  const aAt = a6ev("sc.amoled"), zAt = a6ev("sc.size"), cAt = a6ev("sc.colors"), vAt = a6ev("sc.video");
  const enter = sp(frame, a6scene("screen").from, { damping: 13, stiffness: 120 });
  const inch = (6.7 * easeOut(ramp(frame, zAt, zAt + 14))).toFixed(1).replace(".", ",");
  const DOTS = ["#FF3B5C", "#FFB020", "#FFE07A", "#2BD96B", "#6CF3FF", "#7A5CFF"];
  const W = 400;
  return (
    <SceneShell id="screen">
      <Title frame={frame} at={aAt} pill size={54}>Super AMOLED</Title>
      <div style={{ position: "absolute", left: 550, top: 400, transform: `translateX(${(1 - enter) * 800}px) rotate(3deg)` }}>
        <Pair k="pair" w={W} sweep={interpolate(frame, [cAt, cAt + 16], [-0.3, 1.3], clamp)} />
        {frame >= vAt - 1 && (
          <div style={{ position: "absolute", left: W * 0.73 - 70, top: W * OFFICIAL.pair.aspect * 0.45 - 70, transform: `scale(${pop(frame, vAt)})` }}>
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(6,14,90,0.4)" }}>
              <LineIcon name="play" size={100} stroke={7} color={COLORS.blue} />
            </div>
          </div>
        )}
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 300, top: 430, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, color: "#fff", ...slam(frame, zAt, 2) }}>
          <div style={{ fontWeight: 900, fontSize: 116, lineHeight: 1, textShadow }}>{inch}<span style={{ fontSize: "0.45em" }}>″</span></div>
          <div style={{ fontWeight: 800, fontSize: 36, letterSpacing: 3 }}>POUCES</div>
        </div>
      )}
      {frame >= cAt - 1 && DOTS.map((c, i) => {
        const a = (i / DOTS.length) * Math.PI * 1.2 + Math.PI * 0.4;
        const p = pop(frame, cAt + i * 2);
        return <div key={c} style={{ position: "absolute", left: 420 + Math.cos(a) * 110 * p, top: 760 + Math.sin(a) * 90 * p, width: 56, height: 56, borderRadius: "50%", background: c, border: "5px solid #fff", transform: `scale(${p})`, boxShadow: "0 8px 20px rgba(6,14,90,0.35)" }} />;
      })}
      <Row top={1100}>
        <Chip frame={frame} at={cAt} text="Couleurs vives" icon="palette" size={38} solid />
        <Chip frame={frame} at={vAt} text="Vidéos" icon="play" size={38} />
      </Row>
    </SceneShell>
  );
};

/** 12.0-16.25 s 50 MP camera + 5000 mAh battery that lasts all day. */
export const A6CamBat: React.FC = () => {
  const frame = useSceneFrame("cambat");
  const cAt = a6ev("cb.cam"), bAt = a6ev("cb.bat"), dAt = a6ev("cb.day");
  const enter = sp(frame, a6scene("cambat").from, { damping: 13, stiffness: 120 });
  const W = 460, H = W * OFFICIAL.pair.aspect, X = 70, Y = 320;
  const mp = Math.round(50 * easeOut(ramp(frame, cAt, cAt + 12)));
  const mah = Math.round((5000 * easeOut(ramp(frame, bAt, bAt + 14))) / 50) * 50;
  const fill = easeOut(ramp(frame, bAt, bAt + 18));
  const flash = interpolate(frame, [cAt + 2, cAt + 3, cAt + 10], [0, 1, 0], clamp);
  const ring = ramp(frame, cAt, cAt + 12);
  const sun = ramp(frame, dAt, dAt + 20);
  return (
    <SceneShell id="cambat">
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateX(${(1 - enter) * -800}px) rotate(-3deg)` }}>
        <Pair k="pair" w={W} />
        {/* lens ring + flash */}
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <circle cx={LENS.x * W} cy={LENS.y * H} r={70} fill="none" stroke="#6CF3FF" strokeWidth={8} strokeDasharray={`${440 * ring} 440`} transform={`rotate(-90 ${LENS.x * W} ${LENS.y * H})`} />
          <circle cx={LENS.x * W} cy={LENS.y * H} r={90} fill="#fff" opacity={flash * 0.9} />
        </svg>
      </div>
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 590, top: 300, ...slam(frame, cAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 80, padding: "4px 28px 10px", borderRadius: 24, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="camera" size={80} stroke={8} color={COLORS.blue} />
            {mp} <span style={{ fontSize: 40 }}>MP</span>
          </div>
        </div>
      )}
      {frame >= bAt - 1 && (
        <div style={{ position: "absolute", left: 580, top: 520, transform: `scale(${pop(frame, bAt)})`, transformOrigin: "left center" }}>
          <div style={{ position: "relative", width: 340, height: 150, borderRadius: 30, border: "10px solid #fff", padding: 10, background: "rgba(6,14,90,0.2)", boxShadow: "0 18px 44px rgba(6,14,90,0.35)" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 16, background: "linear-gradient(90deg,#2BD96B,#9CFFB8)" }} />
            <div style={{ position: "absolute", right: -32, top: 44, width: 20, height: 52, borderRadius: 6, background: "#fff" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, color: COLORS.navy }}>
              <span style={{ fontWeight: 900, fontSize: 64 }}>{mah}</span><span style={{ fontWeight: 900, fontSize: 30 }}>mAh</span>
            </div>
          </div>
        </div>
      )}
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 600, top: 730, width: 320, height: 160, opacity: ramp(frame, dAt, dAt + 6) }}>
          <svg width={320} height={160} viewBox="0 0 320 160" style={{ overflow: "visible" }}>
            <path d="M20 140 A 140 120 0 0 1 300 140" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={5} strokeDasharray="6 12" />
          </svg>
          <div style={{ position: "absolute", left: 160 + Math.cos(Math.PI * (1 - sun)) * 140 - 30, top: 140 - Math.sin(Math.PI * (1 - sun)) * 120 - 30 }}>
            <LineIcon name={sun < 0.85 ? "sun" : "moon"} size={60} stroke={7} color="#FFE9A0" />
          </div>
        </div>
      )}
      <Row top={1100}>
        <Chip frame={frame} at={cAt} text="50 MP" icon="camera" size={38} />
        <Chip frame={frame} at={bAt} text="5000 mAh" icon="battery" size={38} solid />
        <Chip frame={frame} at={dAt} text="Toute la journée" icon="sun" size={38} />
      </Row>
      <Footnote frame={frame} at={dAt + 4} top={1262} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};

/** 16.25-22.0 s Samsung gives 6 years of Android updates: the phone stays fast and protected. */
export const A6Updates: React.FC = () => {
  const frame = useSceneFrame("updates");
  const sAt = a6ev("up.six"), uAt = a6ev("up.updates"), fAt = a6ev("up.fast"), pAt = a6ev("up.safe");
  const enter = sp(frame, a6scene("updates").from, { damping: 13, stiffness: 120 });
  const prog = ramp(frame, uAt, uAt + 40, (x) => x);
  const spin = frame * 6;
  return (
    <SceneShell id="updates">
      <Title frame={frame} at={sAt} pill size={60}>6 ANS</Title>
      <div style={{ position: "absolute", left: 560 - 230, top: 400, transform: `scale(${enter})` }}>
        <div style={{ width: 460, height: 380, borderRadius: 44, background: "#fff", boxShadow: "0 24px 60px rgba(6,14,90,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, fontFamily: FONT, color: COLORS.navy }}>
          <svg width={130} height={130} viewBox="0 0 100 100" style={{ transform: `rotate(${prog < 1 ? spin : 0}deg)` }}>
            <circle cx={50} cy={50} r={40} fill="none" stroke="#e4e7f2" strokeWidth={10} />
            <circle cx={50} cy={50} r={40} fill="none" stroke={prog < 1 ? COLORS.blue : "#2BD96B"} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${251 * Math.max(0.05, prog)} 251`} transform="rotate(-90 50 50)" />
            {prog >= 1 && <path d="M 32 52 L 45 65 L 70 38" stroke="#2BD96B" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
          <div style={{ fontWeight: 900, fontSize: 36 }}>Mises à jour Android</div>
          <div style={{ width: 340, height: 18, borderRadius: 9, background: "#e4e7f2", overflow: "hidden" }}>
            <div style={{ width: `${prog * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})` }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 32 }}>{prog < 1 ? "Mise à jour…" : "À jour ✓"}</div>
        </div>
      </div>
      <Row top={1000}>
        <Chip frame={frame} at={fAt} text="Rapide" icon="bolt" size={38} />
        <Chip frame={frame} at={pAt} text="Protégé" icon="lock" size={38} solid />
      </Row>
      <Footnote frame={frame} at={uAt + 6} top={1120} text="Mises à jour Android et de sécurité selon la politique de Samsung" />
    </SceneShell>
  );
};
