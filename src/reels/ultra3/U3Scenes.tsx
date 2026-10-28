import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, u3ev, u3scene } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";
const BLACK_TI = "linear-gradient(135deg,#4a4b50,#16171b)";

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
 * 0.0-3.5 s HOOK ("made for the mountains, the sea and the desert... and classy even at work!")
 * visual: three terrain badges pop around the watch (mountain, sea, desert), then a briefcase badge: "CLASSE AU BUREAU".
 */
export const U3Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const mAt = u3ev("hook.mountain"), sAt = u3ev("hook.sea"), dAt = u3ev("hook.desert"), cAt = u3ev("hook.classe"), wAt = u3ev("hook.work");
  const enter = sp(frame, 0, { damping: 12, stiffness: 140 });
  const sk = shake(frame, cAt, 12, 8);
  const W = 330;
  const BADGES: { at: number; icon: IconName; text: string; x: number; y: number; bg: string }[] = [
    { at: mAt, icon: "mountain", text: "Montagne", x: 90, y: 330, bg: "#6B8F71" },
    { at: sAt, icon: "wave", text: "Mer", x: 760, y: 360, bg: "#1FA3D9" },
    { at: dAt, icon: "sun", text: "Désert", x: 110, y: 640, bg: "#E0A24A" },
  ];
  const away = ramp(frame, cAt - 2, cAt + 6);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={480} r={900} rot={frame * 0.6} opacity={0.2 * enter} rays={20} />
      <div style={{ position: "absolute", left: 505 - W / 2, top: 300, transform: `translateY(${(1 - enter) * -900}px) rotate(${Math.sin(frame * 0.08) * 2}deg)` }}>
        <Img k="angle" w={W} sweep={interpolate(frame, [cAt, cAt + 16], [-0.3, 1.3], clamp)} />
      </div>
      {BADGES.map((bd, i) =>
        frame < bd.at - 1 ? null : (
          <div key={i} style={{ position: "absolute", left: bd.x + (bd.x < 505 ? -1 : 1) * away * 500, top: bd.y, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${pop(frame, bd.at)})`, opacity: 1 - away }}>
            <div style={{ width: 150, height: 150, borderRadius: "50%", background: bd.bg, border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>
              <LineIcon name={bd.icon} size={96} stroke={7} color="#fff" progress={ramp(frame, bd.at, bd.at + 10)} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", textShadow }}>{bd.text}</div>
          </div>
        ),
      )}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, cAt, 2.4), display: "flex", alignItems: "center", gap: 14, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 56, padding: "4px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="briefcase" size={62} stroke={8} color={COLORS.blue} progress={ramp(frame, wAt, wAt + 10)} />Classe au bureau
          </div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - cAt, [0, 1, 6], [0, 0.45, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.5-7.25 s INTRO: Apple Watch Ultra 3, 49 mm, Noir, DISPONIBLE. */
export const U3Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = u3ev("intro.name"), mAt = u3ev("intro.mm"), tAt = u3ev("intro.noir"), dAt = u3ev("intro.dispo");
  const enter = sp(frame, u3scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
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
          <span style={{ fontSize: 84, color: COLORS.blue, background: "#fff", padding: "0 22px 4px", borderRadius: 18, textShadow: "none" }}>3</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 505 - W / 2, top: 450, transform: `translateY(${(1 - enter) * 1100 + Math.sin(t * Math.PI) * 8}px) rotate(${lerp(-10, 0, enter)}deg)` }}>
        <Img k="front" w={W} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1110} left={300}>
        <Chip frame={frame} at={mAt} text="49 mm" icon="ruler" size={36} solid />
        {frame >= tAt - 1 && (
          <div style={{ ...slam(frame, tAt, 1.8), display: "flex", alignItems: "center", gap: 10, padding: "6px 22px", borderRadius: 999, border: "3px solid #fff", background: "rgba(255,255,255,0.18)", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", whiteSpace: "nowrap" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: BLACK_TI, border: "3px solid #fff" }} />Noir
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

/** 7.25-9.5 s black titanium case + sapphire screen: strong, resists knocks. */
export const U3Titan: React.FC = () => {
  const frame = useSceneFrame("titan");
  const cAt = u3ev("ti.case"), sAt = u3ev("ti.saph"), gAt = u3ev("ti.strong"), aAt = u3ev("ti.shock");
  const zoom = sp(frame, u3scene("titan").from, { damping: 16, stiffness: 90 });
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
            <div style={{ position: "absolute", left: 505 - W / 2 + 20, top: 470, transform: `scale(${lerp(0.75, 1, zoom)})` }}>
        <Img k="side" w={W} />
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H * 0.4, overflow: "hidden", opacity: glint > 0 && glint < 1 ? 1 : 0 }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${lerp(-30, 110, glint)}%`, width: "18%", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0))", transform: "skewX(-20deg)" }} />
        </div>
      </div>
      {stamp(cAt, "Titane noir", "bezel", 270, 120)}
      {stamp(sAt, "Écran saphir", "sapphire", 360, 470)}
      <Row top={1090}>
        <Chip frame={frame} at={gAt} text="Robuste" icon="seal" size={38} solid />
        <Chip frame={frame} at={aAt} text="Résiste aux chocs" icon="bolt" size={38} />
      </Row>
    </SceneShell>
  );
};

/** 12.75-17.5 s battery up to 42 h, up to 72 h in low-power mode. */
export const U3Battery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const s0 = u3scene("battery").from;
  const fAt = u3ev("bat.42"), eAt = u3ev("bat.72"), mAt = u3ev("bat.eco");
  const h42 = Math.round(42 * easeOut(ramp(frame, fAt, fAt + 14)));
  const h72 = Math.round(72 * easeOut(ramp(frame, eAt, eAt + 14)));
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
            <span style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.95, textShadow }}>{h42}</span>
            <span style={{ fontWeight: 900, fontSize: 60 }}>h</span>
          </div>
        )}
        {frame >= eAt - 1 && (
          <div style={{ ...slam(frame, eAt, 2.4), display: "flex", alignItems: "baseline", gap: 12, marginTop: 16 }}>
            <span style={{ fontWeight: 900, fontSize: 30 }}>jusqu'à</span>
            <span style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.95, color: COLORS.blue, background: "#fff", padding: "0 22px 8px", borderRadius: 24 }}>{h72}</span>
            <span style={{ fontWeight: 900, fontSize: 60 }}>h</span>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 640, top: 330, transform: `translateX(${(1 - enter) * 700}px) rotate(5deg)` }}>
        <Img k="front" w={300} />
      </div>
      <Row top={1090}>
        <Chip frame={frame} at={fAt} text="42 h" icon="battery" size={38} solid />
        <Chip frame={frame} at={mAt} text="72 h en mode économie" icon="moon" size={34} />
      </Row>
      <Footnote frame={frame} at={fAt + 6} top={1262} text="Jusqu'à, selon l'usage" />
    </SceneShell>
  );
};

/** 17.5-22.0 s very precise GPS, SOS via satellite where there is no network (not available in Morocco: footnote). */
export const U3Gps: React.FC = () => {
  const frame = useSceneFrame("gps");
  const gAt = u3ev("gps.gps"), pAt = u3ev("gps.precise"), sAt = u3ev("gps.sos"), tAt = u3ev("gps.sat"), nAt = u3ev("gps.nonet");
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

/** 9.5-12.75 s Black Ocean Band: comfortable, stays in place while swimming or running. */
export const U3Band: React.FC = () => {
  const frame = useSceneFrame("band");
  const bAt = u3ev("bd.band"), cAt = u3ev("bd.comfy"), sAt = u3ev("bd.stay"), wAt = u3ev("bd.swim"), rAt = u3ev("bd.run");
  const enter = sp(frame, u3scene("band").from, { damping: 13, stiffness: 120 });
  const lock = sAt <= frame ? 1 - 0.06 * Math.max(0, Math.sin(((frame - sAt) / 8) * Math.PI)) * Math.exp(-(frame - sAt) / 12) : 1;
  const t = frame / 30;
  const wave = (y: number, ph: number) => Array.from({ length: 14 }, (_, i) => `${i === 0 ? "M" : "L"} ${i * 80} ${y + Math.sin(i * 0.9 + t * 4 + ph) * 14}`).join(" ");
  const sea = ramp(frame, wAt - 2, wAt + 8);
  return (
    <SceneShell id="band">
      <Title frame={frame} at={bAt} pill size={52}>Bracelet Océan noir</Title>
      {sea > 0 && (
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, opacity: 0.8 * sea }}>
          <path d={wave(820, 0)} stroke="#BFF3FF" strokeWidth={8} fill="none" />
          <path d={wave(880, 1.6)} stroke="#6CF3FF" strokeWidth={6} fill="none" opacity={0.7} />
        </svg>
      )}
      <div style={{ position: "absolute", left: 505 - 170, top: 340, transform: `translateY(${(1 - enter) * 900}px) scale(${lock})` }}>
        <Img k="front" w={340} />
      </div>
      {frame >= rAt - 1 && (
        <div style={{ position: "absolute", left: 760, top: 520, transform: `scale(${pop(frame, rAt)}) translateX(${Math.sin(frame * 0.5) * 8}px)` }}>
          <LineIcon name="run" size={140} stroke={7} />
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={cAt} text="Confortable" icon="feather" size={36} />
        <Chip frame={frame} at={sAt} text="Reste en place" icon="lock" size={36} solid />
        <Chip frame={frame} at={wAt} text="Natation" icon="dive" size={36} />
        <Chip frame={frame} at={rAt} text="Course" icon="run" size={36} />
      </Row>
    </SceneShell>
  );
};
