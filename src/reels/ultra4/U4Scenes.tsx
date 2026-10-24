import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, u4ev, u4scene } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";
const TITANIUM = "linear-gradient(135deg,#d8d3c8,#a59f92)";

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

const Img: React.FC<{ k: keyof typeof OFFICIAL; w: number; sweep?: number }> = ({ k, w, sweep = -1 }) => (
  <div style={{ filter: SHADOW }}>
    <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
  </div>
);

/*
 * 0.0-5.0 s HOOK ("a smartwatch that lasts two days... and helps you even where there is no network!")
 * visual: the watch drops in; a day card flips JOUR 1 -> JOUR 2 while the battery stays green; then a "no signal" card
 *         turns into a satellite beaming down to the watch.
 */
export const U4Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const dAt = u4ev("hook.days"), hAt = u4ev("hook.help"), nAt = u4ev("hook.nonet");
  const enter = sp(frame, 0, { damping: 12, stiffness: 140 });
  const day = frame >= dAt ? 2 : 1;
  const cardP = sp(frame, 8, { damping: 12, stiffness: 180 });
  const netP = sp(frame, hAt, { damping: 12, stiffness: 180 });
  const sat = ramp(frame, nAt, nAt + 10);
  const sk = shake(frame, dAt, 10, 7);
  const W = 330;
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={480} r={900} rot={frame * 0.6} opacity={0.2 * enter} rays={20} />
      <div style={{ position: "absolute", left: 505 - W / 2, top: 290, transform: `translateY(${(1 - enter) * -900}px) rotate(${Math.sin(frame * 0.08) * 2}deg)` }}>
        <Img k="angle" w={W} sweep={interpolate(frame, [dAt, dAt + 16], [-0.3, 1.3], clamp)} />
      </div>
      {/* day card with a battery that stays full */}
      <div style={{ position: "absolute", left: 50, top: 300, width: 250, transform: `scale(${cardP}) rotate(-6deg)`, borderRadius: 28, background: "#fff", boxShadow: "0 18px 44px rgba(6,14,90,0.4)", overflow: "hidden", fontFamily: FONT }}>
        <div style={{ background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})`, color: "#fff", fontWeight: 900, fontSize: 30, textAlign: "center", padding: "8px 0", letterSpacing: 2 }}>JOUR {day}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "20px 0" }}>
          <div style={{ position: "relative", width: 120, height: 54, borderRadius: 12, border: `6px solid ${COLORS.navy}`, padding: 5 }}>
            <div style={{ width: `${frame >= dAt ? 55 : 100}%`, height: "100%", borderRadius: 5, background: "#2BD96B" }} />
          </div>
        </div>
        {frame >= dAt - 1 && <div style={{ ...slam(frame, dAt, 2), textAlign: "center", fontWeight: 900, fontSize: 34, color: COLORS.blue, paddingBottom: 14 }}>2 JOURS</div>}
      </div>
      {/* no network -> satellite */}
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 760, top: 300, width: 200, height: 200, borderRadius: 34, background: "#fff", boxShadow: "0 18px 44px rgba(6,14,90,0.4)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${netP}) rotate(6deg)` }}>
          <div style={{ position: "absolute", opacity: 1 - sat }}><LineIcon name="nosignal" size={130} stroke={8} color="#FF3B5C" /></div>
          <div style={{ position: "absolute", opacity: sat, transform: `scale(${0.6 + 0.4 * sat})` }}><LineIcon name="satellite" size={140} stroke={7} color={COLORS.blue} progress={sat} /></div>
        </div>
      )}
      {sat > 0 && (
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M 790 480 L 600 560" stroke="#6CF3FF" strokeWidth={8} strokeDasharray="6 14" strokeDashoffset={-frame * 3} strokeLinecap="round" opacity={sat} />
        </svg>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp) }} />
    </SceneShell>
  );
};

/** 5.0-9.5 s INTRO: Apple Watch Ultra 4, 49 mm, Titanium, DISPONIBLE. */
export const U4Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = u4ev("intro.name"), mAt = u4ev("intro.mm"), tAt = u4ev("intro.ti"), dAt = u4ev("intro.dispo");
  const enter = sp(frame, u4scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const t = frame / 30;
  const W = 400;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={720} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 64, letterSpacing: -1 }}>Apple Watch</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...slam(frame, nAt + 5, 2.2) }}>
          <span style={{ fontSize: 80 }}>Ultra</span>
          <span style={{ fontSize: 84, color: COLORS.blue, background: "#fff", padding: "0 22px 4px", borderRadius: 18, textShadow: "none" }}>4</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 505 - W / 2, top: 450, transform: `translateY(${(1 - enter) * 1100 + Math.sin(t * Math.PI) * 8}px) rotate(${lerp(-10, 0, enter)}deg)` }}>
        <Img k="front" w={W} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1110} left={300}>
        <Chip frame={frame} at={mAt} text="49 mm" icon="ruler" size={36} solid />
        {frame >= tAt - 1 && (
          <div style={{ ...slam(frame, tAt, 1.8), display: "flex", alignItems: "center", gap: 10, padding: "6px 22px", borderRadius: 999, border: "3px solid #fff", background: "rgba(255,255,255,0.18)", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", whiteSpace: "nowrap" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: TITANIUM, border: "3px solid #fff" }} />Titanium
          </div>
        )}
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: "#2BD96B", padding: "8px 22px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={42} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 9.5-14.0 s titanium case + sapphire screen: strong, made for adventure. */
export const U4Titan: React.FC = () => {
  const frame = useSceneFrame("titan");
  const cAt = u4ev("ti.case"), sAt = u4ev("ti.saph"), gAt = u4ev("ti.strong"), aAt = u4ev("ti.adv");
  const zoom = sp(frame, u4scene("titan").from, { damping: 16, stiffness: 90 });
  const sk = shake(frame, gAt, 14, 9);
  const W = 900;
  const H = W * OFFICIAL.side.aspect;
  const glint = ramp(frame, sAt, sAt + 16, (x) => x);
  const stamp = (at: number, text: string, icon: IconName, top: number, left: number) =>
    frame < at - 1 ? null : (
      <div style={{ position: "absolute", left, top, ...slam(frame, at, 2.2) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, transform: "rotate(-5deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 42, padding: "6px 24px 10px", borderRadius: 16, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
          <LineIcon name={icon} size={50} stroke={8} color={COLORS.blue} />{text}
        </div>
      </div>
    );
  return (
    <SceneShell id="titan" shakeX={sk.x} shakeY={sk.y}>
      {frame >= aAt - 1 && <div style={{ position: "absolute", left: 60, right: 130, top: 760, opacity: ramp(frame, aAt, aAt + 10) * 0.5 }}><LineIcon name="mountain" size={300} stroke={5} /></div>}
      <div style={{ position: "absolute", left: 505 - W / 2 + 20, top: 470, transform: `scale(${lerp(0.75, 1, zoom)})` }}>
        <Img k="side" w={W} />
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H * 0.4, overflow: "hidden", opacity: glint > 0 && glint < 1 ? 1 : 0 }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${lerp(-30, 110, glint)}%`, width: "18%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0))", transform: "skewX(-20deg)" }} />
        </div>
      </div>
      {stamp(cAt, "Boîtier en titane", "bezel", 270, 90)}
      {stamp(sAt, "Écran saphir", "sapphire", 360, 470)}
      <Row top={1090}>
        <Chip frame={frame} at={gAt} text="Robuste" icon="seal" size={38} solid />
        <Chip frame={frame} at={aAt} text="Aventure" icon="mountain" size={38} />
      </Row>
    </SceneShell>
  );
};

/** 14.0-18.25 s battery up to 50 h, up to 84 h in low-power mode. */
export const U4Battery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const s0 = u4scene("battery").from;
  const fAt = u4ev("bat.50"), eAt = u4ev("bat.84"), mAt = u4ev("bat.eco");
  const h50 = Math.round(50 * easeOut(ramp(frame, fAt, fAt + 14)));
  const h84 = Math.round(84 * easeOut(ramp(frame, eAt, eAt + 14)));
  const sk = shake(frame, eAt, 14, 9);
  const enter = sp(frame, s0, { damping: 13, stiffness: 120 });
  return (
    <SceneShell id="battery" shakeX={sk.x} shakeY={sk.y}>
      <div style={{ position: "absolute", left: 80, top: 260, display: "flex", flexDirection: "column", gap: 10, fontFamily: FONT, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: enter }}>
          <LineIcon name="battery" size={90} stroke={6} progress={ramp(frame, s0, s0 + 12)} />
          <span style={{ fontWeight: 900, fontSize: 44, letterSpacing: 2 }}>BATTERIE</span>
        </div>
        {frame >= fAt - 1 && (
          <div style={{ ...slam(frame, fAt, 2), display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontWeight: 900, fontSize: 30 }}>jusqu'à</span>
            <span style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.95, textShadow }}>{h50}</span>
            <span style={{ fontWeight: 900, fontSize: 60 }}>h</span>
          </div>
        )}
        {frame >= eAt - 1 && (
          <div style={{ ...slam(frame, eAt, 2.4), display: "flex", alignItems: "baseline", gap: 12, marginTop: 16 }}>
            <span style={{ fontWeight: 900, fontSize: 30 }}>jusqu'à</span>
            <span style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: COLORS.blue, background: "#fff", padding: "0 22px 8px", borderRadius: 24 }}>{h84}</span>
            <span style={{ fontWeight: 900, fontSize: 60 }}>h</span>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 640, top: 330, transform: `translateX(${(1 - enter) * 700}px) rotate(5deg)` }}>
        <Img k="front" w={300} />
      </div>
      <Row top={1090}>
        <Chip frame={frame} at={fAt} text="50 h" icon="battery" size={38} solid />
        <Chip frame={frame} at={mAt} text="84 h en mode économie" icon="moon" size={34} />
      </Row>
      <Footnote frame={frame} at={fAt + 6} top={1262} text="Jusqu'à, selon l'usage" />
    </SceneShell>
  );
};

/** 18.25-23.5 s very precise GPS, SOS via satellite where there is no network (not available in Morocco: footnote). */
export const U4Gps: React.FC = () => {
  const frame = useSceneFrame("gps");
  const gAt = u4ev("gps.gps"), pAt = u4ev("gps.precise"), sAt = u4ev("gps.sos"), tAt = u4ev("gps.sat"), nAt = u4ev("gps.nonet");
  const mapP = sp(frame, gAt, { damping: 13, stiffness: 140 });
  const M = { x: 70, y: 300, w: 520, h: 420 };
  const route = [[0.1, 0.85], [0.25, 0.6], [0.42, 0.7], [0.55, 0.42], [0.72, 0.5], [0.88, 0.2]];
  const pr = ramp(frame, pAt, pAt + 24, (x) => x);
  const n = Math.max(2, Math.round(route.length * pr));
  const d = route.slice(0, n).map(([u, v], i) => `${i ? "L" : "M"} ${u * M.w} ${v * M.h}`).join(" ");
  const end = route[n - 1];
  const sosP = pop(frame, sAt);
  const sat = ramp(frame, tAt, tAt + 10);
  return (
    <SceneShell id="gps">
      <div style={{ position: "absolute", left: M.x, top: M.y, width: M.w, height: M.h, borderRadius: 36, background: "rgba(8,30,110,0.82)", border: "5px solid rgba(255,255,255,0.9)", overflow: "hidden", transform: `scale(${mapP})`, boxShadow: "0 24px 50px rgba(6,14,90,0.45)" }}>
        <svg width={M.w} height={M.h} style={{ position: "absolute", left: 0, top: 0 }}>
          {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M ${(i + 1) * M.w / 7} 0 V ${M.h} M 0 ${(i + 1) * M.h / 7} H ${M.w}`} stroke="rgba(255,255,255,0.12)" strokeWidth={2} />)}
          <path d={d} stroke="#6CF3FF" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", left: end[0] * M.w - 32, top: end[1] * M.h - 64 }}><LineIcon name="pin" size={64} stroke={7} /></div>
        <div style={{ position: "absolute", left: 20, top: 16, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff" }}>
          <LineIcon name="satellite" size={46} stroke={7} /> GPS
        </div>
      </div>
      {/* SOS + satellite beam */}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 660, top: 560, width: 180, height: 180, borderRadius: "50%", background: "#FF3B5C", border: "8px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", transform: `scale(${sosP * (1 + 0.05 * Math.sin(frame * 0.5))})`, boxShadow: "0 16px 40px rgba(80,0,20,0.45)" }}>SOS</div>
      )}
      {frame >= tAt - 1 && (
        <>
          <div style={{ position: "absolute", left: 790, top: 260, opacity: sat, transform: `translateY(${(1 - sat) * -100}px) rotate(-15deg)` }}>
            <LineIcon name="satellite" size={150} stroke={6} progress={sat} />
          </div>
          <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d="M 850 400 L 760 570" stroke="#6CF3FF" strokeWidth={8} strokeDasharray="6 14" strokeDashoffset={-frame * 3} strokeLinecap="round" opacity={sat} />
          </svg>
        </>
      )}
      <Row top={900}>
        <Chip frame={frame} at={pAt} text="GPS précis" icon="pin" size={36} solid />
        <Chip frame={frame} at={tAt} text="SOS par satellite" icon="satellite" size={36} />
        <Chip frame={frame} at={nAt} text="Sans réseau" icon="nosignal" size={36} />
      </Row>
      <Footnote frame={frame} at={tAt + 4} top={1262} text="SOS par satellite : service non disponible au Maroc" />
    </SceneShell>
  );
};

/** 23.5-26.0 s tracks heart, sleep and sport, day and night. */
export const U4Health: React.FC = () => {
  const frame = useSceneFrame("health");
  const TILES: { at: number; icon: IconName; text: string }[] = [
    { at: u4ev("hl.heart"), icon: "heart", text: "Cœur" },
    { at: u4ev("hl.sleep"), icon: "moon", text: "Sommeil" },
    { at: u4ev("hl.sport"), icon: "run", text: "Sport" },
  ];
  const enter = sp(frame, u4scene("health").from, { damping: 13, stiffness: 130 });
  return (
    <SceneShell id="health">
      {TILES.map((tl, i) => {
        if (frame < tl.at - 1) return null;
        const p = sp(frame, tl.at, { damping: 12, stiffness: 200 });
        const beat = tl.icon === "heart" ? 1 + 0.12 * Math.max(0, Math.sin(((frame - tl.at) / 30) * Math.PI * 2.6)) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 70, top: 300 + i * 190, width: 480, height: 160, borderRadius: 34, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 22, padding: "0 26px", transform: `scale(${p})`, fontFamily: FONT, color: "#fff", boxShadow: "0 16px 40px rgba(6,14,90,0.3)" }}>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${beat})` }}>
              <LineIcon name={tl.icon} size={74} stroke={7} color={tl.icon === "heart" ? "#FF3B5C" : COLORS.blue} progress={ramp(frame, tl.at, tl.at + 12)} />
            </div>
            <div style={{ fontWeight: 900, fontSize: 52 }}>{tl.text}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 600, top: 330, transform: `translateX(${(1 - enter) * 600}px) rotate(-4deg)` }}>
        <Img k="angle" w={330} />
      </div>
      <Row top={1060}>
        <Chip frame={frame} at={u4ev("hl.night")} text="Jour et nuit" icon="sun" size={38} solid />
      </Row>
    </SceneShell>
  );
};
