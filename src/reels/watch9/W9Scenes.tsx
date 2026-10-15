import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, w9ev, w9scene } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";

const Chip: React.FC<{ frame: number; at: number; text: string; icon?: IconName; size: number; solid?: boolean; swatch?: string }> = ({ frame, at, text, icon, size, solid, swatch }) => {
  if (frame < at - 1) return null;
  const p = sp(frame, at, { damping: 11, stiffness: 220, mass: 0.6 });
  const fg = solid ? COLORS.blue : "#fff";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.22}px ${size * 0.62}px`, borderRadius: 999, background: solid ? "#fff" : "rgba(255,255,255,0.18)", border: solid ? "none" : "3px solid rgba(255,255,255,0.75)", color: fg, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", transform: `scale(${p})`, boxShadow: "0 12px 30px rgba(6,14,90,0.3)" }}>
      {swatch ? <div style={{ width: size * 0.9, height: size * 0.9, borderRadius: "50%", background: swatch, border: "4px solid #fff", boxShadow: "0 0 0 2px rgba(6,14,90,0.25)" }} /> : null}
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

const Title: React.FC<{ frame: number; at: number; children: React.ReactNode; pill?: boolean; size?: number; top?: number }> = ({ frame, at, children, pill, size = 76, top = 236 }) =>
  frame < at - 1 ? null : (
    <div style={{ position: "absolute", left: 0, right: 70, top, display: "flex", justifyContent: "center", zIndex: 20 }}>
      <div style={{ ...slam(frame, at, 2.2), display: "flex", alignItems: "center", gap: size * 0.22, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", ...(pill ? { background: "#fff", color: COLORS.blue, padding: `${size * 0.06}px ${size * 0.45}px ${size * 0.14}px`, borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" } : { color: "#fff", textShadow }) }}>
        {children}
      </div>
    </div>
  );

/*
 * 0.0-3.0 s HOOK ("the latest Galaxy Watch is out, now at City Store!")
 * visual: a drawn gift box shakes, its lid pops off on "خرجات" and the new watch rises out of it with rays;
 *         "NOUVEAU" pill, then "دابا عند CITY STORE".
 */
export const W9Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const oAt = w9ev("hook.open"), sAt = w9ev("hook.store");
  const sk = shake(frame, oAt, 16, 12);
  const opened = frame >= oAt;
  const wobble = opened ? 0 : Math.sin(frame * 1.3) * 5 * ramp(frame, 4, 14);
  const lid = ramp(frame, oAt, oAt + 14, (t) => t);
  const rise = sp(frame, oAt + 2, { damping: 12, stiffness: 110, mass: 0.8 });
  const boxOut = ramp(frame, oAt + 8, oAt + 22);
  const B = { cx: 505, top: 470, w: 330, h: 230 };
  const img = OFFICIAL.angle;
  const ww = 250;
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={460} r={900} rot={frame * 0.8} opacity={0.24 * rise} rays={20} />
      <Title frame={frame} at={oAt} pill size={66}>
        <span style={{ color: "#FF3B5C" }}>●</span> NOUVEAU
      </Title>
      {/* the watch rising out of the box */}
      <div style={{ position: "absolute", left: B.cx - ww / 2, top: 352, transform: `translateY(${(1 - rise) * 330}px) scale(${lerp(0.5, 1, rise)}) rotate(${lerp(-10, -4, rise) + Math.sin(frame * 0.12) * 2}deg)`, opacity: opened ? 1 : 0, filter: SHADOW }}>
        <ProductImage src={img.src} aspect={img.aspect} width={ww} sweep={interpolate(frame, [oAt + 10, oAt + 28], [-0.3, 1.3], clamp)} />
      </div>
      {/* drawn gift box */}
      <div style={{ position: "absolute", left: B.cx - B.w / 2, top: B.top, width: B.w, height: B.h, transform: `rotate(${wobble}deg) translateY(${boxOut * 420}px)`, opacity: 1 - boxOut }}>
        <div style={{ position: "absolute", inset: 0, top: 50, borderRadius: 20, background: "rgba(255,255,255,0.16)", border: "8px solid #fff", boxShadow: "0 20px 50px rgba(6,14,90,0.4)" }} />
        <div style={{ position: "absolute", left: B.w / 2 - 22, width: 44, top: 50, bottom: 0, background: "#FF3B5C" }} />
        {/* lid */}
        <div style={{ position: "absolute", left: -16, right: -16, top: 0, height: 64, transform: `translate(${lid * 260}px, ${-lid * 360}px) rotate(${lid * 70}deg)`, opacity: 1 - ramp(frame, oAt + 10, oAt + 16) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, background: "#fff", boxShadow: "0 10px 26px rgba(6,14,90,0.35)" }} />
          <div style={{ position: "absolute", left: (B.w + 32) / 2 - 22, width: 44, top: 0, bottom: 0, background: "#FF3B5C" }} />
          <svg width={140} height={70} viewBox="0 0 140 70" style={{ position: "absolute", left: (B.w + 32) / 2 - 70, top: -58 }}>
            <path d="M70 66 C40 20 8 30 22 52 C30 62 56 64 70 66 C84 64 110 62 118 52 C132 30 100 20 70 66 Z" fill="none" stroke="#FF3B5C" strokeWidth={12} strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 640, display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div dir="rtl" style={{ ...slam(frame, sAt, 2.2), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "2px 30px 10px", borderRadius: 18, transform: `${slam(frame, sAt, 2.2).transform ?? ""} rotate(-3deg)`, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            دابا عند CITY STORE
          </div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - oAt, [0, 1, 6], [0, 0.6, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.0-6.5 s INTRO: Galaxy Watch9, DISPONIBLE, 40 mm, LTE, Black. */
export const W9Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = w9ev("intro.name");
  const enter = sp(frame, w9scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const img = OFFICIAL.front;
  const w = 360;
  const t = frame / 30;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={740} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, ...slam(frame, nAt, 2) }}>
          <span style={{ fontSize: 84, letterSpacing: -1 }}>Galaxy Watch</span>
          <span style={{ fontSize: 92, color: COLORS.blue, background: "#fff", padding: "0 24px 4px", borderRadius: 18, textShadow: "none" }}>9</span>
        </div>
        {frame >= nAt + 5 && (
          <div style={{ ...slam(frame, nAt + 6, 1.8), display: "flex", alignItems: "center", gap: 12, background: "#2BD96B", fontSize: 34, padding: "4px 24px 6px", borderRadius: 999, letterSpacing: 3, textShadow: "none" }}>
            <LineIcon name="store" size={42} stroke={8} color="#fff" />
            DISPONIBLE
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 505 - w / 2, top: 430, transform: `translateY(${(1 - enter) * 1200 + Math.sin(t * Math.PI * 1.1) * 8}px) rotate(${lerp(-20, -2, enter) + Math.sin(t * Math.PI * 0.6) * 1.5}deg)`, filter: SHADOW }}>
        <ProductImage src={img.src} aspect={img.aspect} width={w} sweep={interpolate(frame, [nAt + 6, nAt + 24], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1080} left={300}>
        <Chip frame={frame} at={w9ev("intro.mm")} text="40 mm" icon="ruler" size={40} solid />
        <Chip frame={frame} at={w9ev("intro.lte")} text="LTE" icon="signal" size={40} solid />
        <Chip frame={frame} at={w9ev("intro.black")} text="Black" swatch="#16171b" size={40} />
      </Row>
    </SceneShell>
  );
};

/** 6.5-12.25 s LTE: call, answer, messages anywhere, even with the phone left at home. */
export const W9Lte: React.FC = () => {
  const frame = useSceneFrame("lte");
  const lAt = w9ev("lte.lte"), cAt = w9ev("lte.call"), aAt = w9ev("lte.answer"), mAt = w9ev("lte.msgs"), pAt = w9ev("lte.anywhere"), hAt = w9ev("lte.home");
  const enter = sp(frame, w9scene("lte").from, { damping: 13, stiffness: 120 });
  const img = OFFICIAL.front;
  const W = { x: 70, y: 330, w: 300 };
  const wh = W.w * img.aspect;
  const t = frame / 30;
  const ringing = frame >= cAt && frame < aAt;
  const callP = sp(frame, cAt, { damping: 12, stiffness: 200 });
  const secs = Math.max(0, Math.floor((frame - aAt) / 30));
  const houseP = sp(frame, hAt, { damping: 12, stiffness: 170 });
  return (
    <SceneShell id="lte">
      <Title frame={frame} at={lAt} pill size={70}>
        <LineIcon name="signal" size={74} stroke={9} color={COLORS.blue} progress={ramp(frame, lAt, lAt + 12)} />
        LTE
      </Title>
      {/* the watch with signal waves */}
      <div style={{ position: "absolute", left: W.x, top: W.y, transform: `translateX(${(1 - enter) * -700}px) translateY(${Math.sin(t * Math.PI) * 6}px) rotate(-4deg)`, filter: SHADOW }}>
        <ProductImage src={img.src} aspect={img.aspect} width={W.w} />
      </div>
      {frame >= lAt && (
        <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[0, 1, 2].map((i) => {
            const k = (((frame - lAt) / 30 + i / 3) % 1 + 1) % 1;
            const r = 60 + k * 140;
            return <path key={i} d={`M ${W.x + W.w / 2 + r * Math.cos(-0.7)} ${W.y + wh * 0.5 + r * Math.sin(-0.7)} A ${r} ${r} 0 0 1 ${W.x + W.w / 2 + r * Math.cos(0.7)} ${W.y + wh * 0.5 + r * Math.sin(0.7)}`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={(1 - k) * 0.8} transform={`translate(${W.w * 0.2} 0)`} />;
          })}
        </svg>
      )}
      {/* incoming call card -> in call */}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 470, top: 340, width: 470, padding: "22px 26px", borderRadius: 34, background: "#fff", boxShadow: "0 22px 50px rgba(6,14,90,0.4)", transform: `scale(${callP}) rotate(${ringing ? Math.sin(frame * 2.2) * 3 : 0}deg)`, display: "flex", alignItems: "center", gap: 20, fontFamily: FONT }}>
          <div style={{ width: 92, height: 92, borderRadius: "50%", background: frame >= aAt ? "#2BD96B" : COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LineIcon name="call" size={56} stroke={7} color="#fff" />
          </div>
          <div style={{ lineHeight: 1.1, color: COLORS.navy }}>
            <div style={{ fontWeight: 900, fontSize: 40 }}>{frame >= aAt ? "En appel" : "Appel entrant"}</div>
            <div style={{ fontWeight: 700, fontSize: 30, color: frame >= aAt ? "#16a35f" : COLORS.blue }}>{frame >= aAt ? `00:0${Math.min(9, secs)}` : "depuis la montre"}</div>
          </div>
        </div>
      )}
      {/* message bubbles */}
      {(["Salam ! Fin nta ?", "Ana jay daba"] as const).map((m, i) => {
        const at = mAt + i * 8;
        if (frame < at - 1) return null;
        const p = pop(frame, at);
        return (
          <div key={m} style={{ position: "absolute", left: i ? 560 : 470, top: 540 + i * 110, padding: "16px 28px", borderRadius: 30, borderBottomLeftRadius: i ? 30 : 6, borderBottomRightRadius: i ? 6 : 30, background: i ? `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})` : "rgba(255,255,255,0.95)", border: i ? "3px solid #fff" : "none", color: i ? "#fff" : COLORS.navy, fontFamily: FONT, fontWeight: 800, fontSize: 36, whiteSpace: "nowrap", transform: `scale(${p})`, transformOrigin: i ? "right bottom" : "left bottom", boxShadow: "0 14px 34px rgba(6,14,90,0.3)" }}>
            {m}
          </div>
        );
      })}
      {/* phone left at home */}
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 790, width: 240, height: 230, transform: `scale(${houseP}) rotate(${lerp(-12, 3, houseP)}deg)` }}>
          <LineIcon name="home" size={240} stroke={6} color="#fff" style={{ position: "absolute", left: 0, top: 0 }} />
          <div style={{ position: "absolute", left: 92, top: 120, width: 56, height: 90, borderRadius: 12, background: "#fff", border: `5px solid ${COLORS.navy}` }} />
        </div>
      )}
      <Row top={1080} left={300}>
        <Chip frame={frame} at={cAt} text="Appels" icon="call" size={32} />
        <Chip frame={frame} at={mAt} text="Messages" icon="chat" size={32} />
        <Chip frame={frame} at={pAt} text="Partout" icon="pin" size={32} solid />
        <Chip frame={frame} at={hAt} text="Sans téléphone" icon="home" size={32} solid />
      </Row>
      <Footnote frame={frame} at={hAt} top={1232} text="Nécessite une eSIM / un forfait compatible" />
    </SceneShell>
  );
};

/** 12.25-16.25 s new Snapdragon Wear Elite processor: fast, and light on the wrist. */
export const W9Chip: React.FC = () => {
  const frame = useSceneFrame("chip");
  const pAt = w9ev("chip.proc"), nAt = w9ev("chip.name"), newAt = w9ev("chip.new"), fAt = w9ev("chip.fast"), lAt = w9ev("chip.light");
  const chipP = sp(frame, pAt, { damping: 12, stiffness: 160 });
  const C = { x: 505 - 190, y: 330, s: 380 };
  const pulse = frame >= fAt ? 0.5 + 0.5 * Math.sin((frame - fAt) * 0.9) : 0;
  const name = "Snapdragon";
  const typed = Math.max(0, Math.min(name.length, Math.floor((frame - nAt) / 1.5)));
  const watchP = sp(frame, lAt, { damping: 11, stiffness: 120 });
  const img = OFFICIAL.angle;
  return (
    <SceneShell id="chip">
      <Burst x={505} y={C.y + C.s / 2} r={900} rot={frame * 0.6} opacity={0.18 * chipP} rays={20} />
      <Title frame={frame} at={pAt} size={56} top={236}>PROCESSEUR</Title>
      {/* drawn chip */}
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
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#fff", lineHeight: 1.05 }}>
          <div style={{ fontWeight: 900, fontSize: 38 }}>{name.slice(0, typed)}</div>
          <div style={{ fontWeight: 800, fontSize: 34, color: COLORS.tongue, opacity: ramp(frame, nAt + 14, nAt + 20) }}>Wear Elite</div>
        </div>
      </div>
      {frame >= newAt - 1 && (
        <div style={{ position: "absolute", left: C.x + C.s - 70, top: C.y + 40, ...slam(frame, newAt, 2.4) }}>
          <div style={{ transform: "rotate(10deg)", background: "#FF3B5C", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "4px 20px 8px", borderRadius: 14, boxShadow: "0 14px 34px rgba(80,0,20,0.45)" }}>NOUVEAU</div>
        </div>
      )}
      {/* speed streaks on "fast" */}
      {frame >= fAt && frame < fAt + 24 && (
        <svg width={1080} height={800} style={{ position: "absolute", left: 0, top: 0, opacity: interpolate(frame, [fAt, fAt + 3, fAt + 18, fAt + 24], [0, 1, 1, 0], clamp) }}>
          {[0.25, 0.42, 0.58, 0.75].map((y, i) => {
            const x = C.x - 30 - (((frame - fAt) * 20 + i * 40) % 160);
            return <line key={i} x1={x} y1={C.y + y * C.s} x2={x - 140} y2={C.y + y * C.s} stroke="#fff" strokeWidth={10} strokeLinecap="round" />;
          })}
        </svg>
      )}
      {/* the light watch floats in like a feather */}
      {frame >= lAt - 1 && (
        <div style={{ position: "absolute", left: 505 - 130, top: 735, transform: `translate(${Math.sin((frame - lAt) * 0.15) * 20}px, ${(1 - watchP) * -160 + Math.sin(frame * 0.1) * 8}px) rotate(${Math.sin((frame - lAt) * 0.15) * 6 - 4}deg)`, opacity: Math.min(1, watchP * 2), filter: SHADOW }}>
          <ProductImage src={img.src} aspect={img.aspect} width={260} />
        </div>
      )}
      <Row top={1080} left={300}>
        <Chip frame={frame} at={fAt} text="Rapide" icon="bolt" size={40} solid />
        <Chip frame={frame} at={lAt} text="Légère au poignet" icon="feather" size={40} />
      </Row>
    </SceneShell>
  );
};

/** drawn watch silhouette (same size for both, the size comparison) */
const WatchOutline: React.FC<{ x: number; y: number; label: string; p: number; hi?: boolean }> = ({ x, y, label, p, hi }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 170, transform: `scale(${p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
    <svg width={170} height={230} viewBox="0 0 170 230">
      <rect x={50} y={0} width={70} height={60} rx={10} fill="none" stroke="#fff" strokeWidth={7} opacity={0.75} />
      <rect x={50} y={170} width={70} height={60} rx={10} fill="none" stroke="#fff" strokeWidth={7} opacity={0.75} />
      <circle cx={85} cy={115} r={70} fill={hi ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"} stroke="#fff" strokeWidth={8} />
      <text x={85} y={126} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#fff">40 mm</text>
    </svg>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: hi ? COLORS.blue : "#fff", background: hi ? "#fff" : "transparent", border: hi ? "none" : "3px solid rgba(255,255,255,0.75)", padding: "2px 18px 4px", borderRadius: 999, whiteSpace: "nowrap" }}>{label}</div>
  </div>
);

/** 16.25-19.5 s battery 20% bigger than the Galaxy Watch8, in the same size. */
export const W9Battery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const s0 = w9scene("battery").from;
  const mAt = w9ev("bat.more"), pAt = w9ev("bat.pct"), w8At = w9ev("bat.w8"), zAt = w9ev("bat.size");
  const pct = Math.round(20 * easeOut(ramp(frame, pAt, pAt + 14)));
  const sk = shake(frame, pAt, 14, 9);
  const B = { x: 90, w8: 430, w9: 516, h: 84 }; // +20 %
  const g9 = easeOut(ramp(frame, mAt, mAt + 16));
  const g8 = easeOut(ramp(frame, w8At, w8At + 12));
  const chg = sp(frame, s0, { damping: 13, stiffness: 120 });
  const bar = (y: number, len: number, grow: number, label: string, hi: boolean) => (
    <div style={{ position: "absolute", left: B.x, top: y, display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, grow * 3) }}>
      <div style={{ position: "relative", width: len, height: B.h, borderRadius: 22, border: "7px solid #fff", padding: 7, boxShadow: "0 14px 34px rgba(6,14,90,0.35)", background: "rgba(6,14,90,0.2)" }}>
        <div style={{ width: `${grow * 100}%`, height: "100%", borderRadius: 12, background: hi ? "linear-gradient(90deg,#2BD96B,#9CFFB8)" : "rgba(255,255,255,0.55)" }} />
        <div style={{ position: "absolute", right: -22, top: B.h * 0.3 - 7, width: 12, height: B.h * 0.4, borderRadius: 4, background: "#fff" }} />
        <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: hi ? "#0b4a2a" : COLORS.navy }}>{label}</div>
      </div>
    </div>
  );
  return (
    <SceneShell id="battery" shakeX={sk.x} shakeY={sk.y}>
      <Title frame={frame} at={s0 + 2} size={58}>
        <LineIcon name="battery" size={72} stroke={8} color="#fff" progress={ramp(frame, s0 + 2, s0 + 14)} />
        BATTERIE
      </Title>
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 320, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, pAt, 2.4), fontFamily: FONT, fontWeight: 900, fontSize: 140, lineHeight: 1, color: COLORS.blue, background: "#fff", padding: "0 30px 10px", borderRadius: 30, boxShadow: "0 18px 44px rgba(6,14,90,0.45)" }}>+{pct}%</div>
        </div>
      )}
      {bar(520, B.w9, g9, "Watch9", true)}
      {bar(640, B.w8, g8, "Watch8", false)}
      <div style={{ position: "absolute", left: 790, top: 470, transform: `translateY(${(1 - chg) * 600}px) rotate(6deg)`, filter: "drop-shadow(0 20px 30px rgba(6,14,90,0.45))" }}>
        <ProductImage src={OFFICIAL.charger.src} aspect={OFFICIAL.charger.aspect} width={110} />
      </div>
      {frame >= w8At - 1 && (
        <>
          <WatchOutline x={215} y={780} label="Watch8" p={pop(frame, w8At)} />
          <div style={{ position: "absolute", left: 410, top: 840, fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#fff", transform: `scale(${frame >= zAt ? pop(frame, zAt) : 0})`, textShadow }}>=</div>
          <WatchOutline x={500} y={780} label="Watch9" p={pop(frame, w8At + 4)} hi />
        </>
      )}
      <Row top={1100}>
        <Chip frame={frame} at={zAt} text="Même taille" icon="ruler" size={38} solid />
      </Row>
      <Footnote frame={frame} at={zAt} top={1190} text="Capacité vs Galaxy Watch8 40 mm" />
    </SceneShell>
  );
};

/** 19.5-22.25 s Gemini, and tracks heart, sleep and sport. */
export const W9Gemini: React.FC = () => {
  const frame = useSceneFrame("gemini");
  const gAt = w9ev("gem.gemini");
  const TILES: { at: number; icon: IconName; text: string; sub: string }[] = [
    { at: w9ev("gem.heart"), icon: "heart", text: "Cœur", sub: "fréquence cardiaque" },
    { at: w9ev("gem.sleep"), icon: "moon", text: "Sommeil", sub: "suivi des nuits" },
    { at: w9ev("gem.sport"), icon: "run", text: "Sport", sub: "suivi des séances" },
  ];
  const backP = sp(frame, w9ev("gem.heart"), { damping: 13, stiffness: 130 });
  return (
    <SceneShell id="gemini">
      {frame >= gAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, gAt, 2.4), display: "flex", alignItems: "center", gap: 20, background: "#fff", padding: "8px 40px 14px", borderRadius: 999, boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>
            <div style={{ transform: `rotate(${frame * 3}deg) scale(${1 + 0.1 * Math.sin(frame * 0.4)})` }}>
              <LineIcon name="spark" size={78} stroke={8} color={COLORS.blue} progress={ramp(frame, gAt, gAt + 10)} />
            </div>
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 84, color: COLORS.blue }}>Gemini</span>
          </div>
        </div>
      )}
      {TILES.map((tl, i) => {
        if (frame < tl.at - 1) return null;
        const p = sp(frame, tl.at, { damping: 12, stiffness: 200 });
        const beat = tl.icon === "heart" ? 1 + 0.12 * Math.max(0, Math.sin(((frame - tl.at) / 30) * Math.PI * 2.6)) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 70, top: 440 + i * 170, width: 560, height: 144, borderRadius: 34, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.7)", boxShadow: "0 16px 40px rgba(6,14,90,0.3)", display: "flex", alignItems: "center", gap: 22, padding: "0 26px", transform: `scale(${p})`, fontFamily: FONT, color: "#fff" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transform: `scale(${beat})` }}>
              <LineIcon name={tl.icon} size={70} stroke={7} color={tl.icon === "heart" ? "#FF3B5C" : COLORS.blue} progress={ramp(frame, tl.at, tl.at + 12)} />
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 900, fontSize: 46 }}>{tl.text}</div>
              <div style={{ fontWeight: 600, fontSize: 28, opacity: 0.9 }}>{tl.sub}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 660, top: 520, transform: `translateX(${(1 - backP) * 500}px) rotate(${-6 + Math.sin(frame * 0.08) * 2}deg)`, filter: SHADOW }}>
        <ProductImage src={OFFICIAL.back.src} aspect={OFFICIAL.back.aspect} width={290} />
      </div>
      <Footnote frame={frame} at={gAt + 6} top={1000} text="Gemini : connexion internet requise" />
    </SceneShell>
  );
};
