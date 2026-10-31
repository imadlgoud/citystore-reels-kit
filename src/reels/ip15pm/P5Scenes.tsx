import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, p5ev, p5scene } from "./timeline";

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

const Img: React.FC<{ k: keyof typeof OFFICIAL; w: number; sweep?: number }> = ({ k, w, sweep = -1 }) => (
  <div style={{ filter: SHADOW }}>
    <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
  </div>
);
const GREEN = "#2BD96B", RED = "#FF3B5C";
const BLUE_TI = "linear-gradient(135deg,#5b6a80,#2c3646)";

/*
 * 0.0-5.25 s HOOK ("a new iPhone 15 Pro Max, still sealed in its box... in 2026? yes, we have it!")
 * visual: a drawn sealed box gets a red "SCELLÉ" seal; a "2026 ?" card pops; a big green check; then the phone slams in.
 */
export const P5Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const nAt = p5ev("hook.name"), wAt = p5ev("hook.new"), sAt = p5ev("hook.sealed"), yAt = p5ev("hook.year"), kAt = p5ev("hook.yes"), hAt = p5ev("hook.have");
  const box = sp(frame, nAt, { damping: 12, stiffness: 140 });
  const out = ramp(frame, hAt - 2, hAt + 5);
  const sk = shake(frame, hAt, 14, 10);
  const check = ramp(frame, kAt, kAt + 10);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={540} y={560} r={900} rot={frame * 0.6} opacity={0.2 * ramp(frame, hAt, hAt + 6)} rays={20} />
      {out < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
          {/* sealed box (drawn): white lid with the official render on it, shrink-wrap glint, red seal */}
          <div style={{ position: "absolute", left: 540 - 150, top: 360, width: 300, height: 350, transform: `scale(${box}) rotate(-4deg)`, borderRadius: 26, background: "linear-gradient(160deg,#ffffff,#e4e8f2)", boxShadow: "0 24px 50px rgba(6,14,90,0.45)", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 45, top: 34 }}><ProductImage src={OFFICIAL.pair.src} aspect={OFFICIAL.pair.aspect} width={210} /></div>
            <div style={{ position: "absolute", top: 0, bottom: 0, width: "30%", left: `${lerp(-40, 120, ramp(frame, sAt, sAt + 16, (x) => x))}%`, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.8), rgba(255,255,255,0))", transform: "skewX(-20deg)" }} />
          </div>
          {frame >= sAt - 1 && (
            <div style={{ position: "absolute", left: 580, top: 630, transform: `scale(${pop(frame, sAt)}) rotate(-12deg)`, background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "4px 22px 8px", borderRadius: 14, border: "4px solid #fff", boxShadow: "0 12px 30px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>SCELLÉ</div>
          )}
          {frame >= wAt - 1 && (
            <div style={{ position: "absolute", left: 310, top: 370, transform: `scale(${pop(frame, wAt)}) rotate(-10deg)`, background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "4px 20px 8px", borderRadius: 14, letterSpacing: 3, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>NEUF</div>
          )}
          {frame >= yAt - 1 && (
            <div style={{ position: "absolute", left: 720, top: 400, width: 220, height: 200, borderRadius: 28, background: "#fff", overflow: "hidden", transform: `scale(${pop(frame, yAt)}) rotate(6deg)`, boxShadow: "0 18px 44px rgba(6,14,90,0.4)", fontFamily: FONT, textAlign: "center" }}>
              <div style={{ background: RED, color: "#fff", fontWeight: 900, fontSize: 28, padding: "6px 0" }}>ANNÉE</div>
              <div style={{ fontWeight: 900, fontSize: 64, color: COLORS.navy, lineHeight: 1.3 }}>2026</div>
              {check > 0 ? (
                <svg width={70} height={50} viewBox="0 0 70 50" style={{ margin: "0 auto", display: "block" }}><path d="M8 26 L28 44 L62 8" stroke={GREEN} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - check} /></svg>
              ) : (
                <div style={{ fontWeight: 900, fontSize: 44, color: RED, lineHeight: 1 }}>?</div>
              )}
            </div>
          )}
        </div>
      )}
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 540 - 190, top: 360, ...slam(frame, hAt, 2.4) }}>
          <Img k="pair" w={380} sweep={interpolate(frame, [hAt + 4, hAt + 22], [-0.3, 1.3], clamp)} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < hAt - 1 ? (
          <div style={{ ...slam(frame, nAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 72, color: "#fff", textShadow, whiteSpace: "nowrap" }}>iPhone 15 Pro Max</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, hAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 60, padding: "2px 36px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>إيه، كاين عندنا!</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - hAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 5.25-7.0 s INTRO: 1TB, Blue Titanium, DISPONIBLE. */
export const P5Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const tAt = p5ev("intro.tb"), bAt = p5ev("intro.blue"), dAt = p5ev("intro.dispo");
  const enter = sp(frame, p5scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  return (
    <SceneShell id="intro">
      <Burst x={540} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <Title frame={frame} at={p5scene("intro").from} size={72}>iPhone 15 Pro Max</Title>
      <div style={{ position: "absolute", left: 540 - 230, top: 380, transform: `scale(${lerp(0.85, 1, enter)})` }}>
        <Img k="pair" w={460} sweep={interpolate(frame, [bAt, bAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1000} left={300}>
        <Chip frame={frame} at={tAt} text="1 To" icon="box" size={40} solid />
        {frame >= bAt - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 24px", borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.75)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 36, whiteSpace: "nowrap", transform: `scale(${pop(frame, bAt)})` }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: BLUE_TI, border: "3px solid #fff" }} />Blue Titanium
          </div>
        )}
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", background: GREEN, padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={44} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 7.0-11.5 s titanium design, light and strong; 6.7" ProMotion screen. */
export const P5Titan: React.FC = () => {
  const frame = useSceneFrame("titan");
  const dAt = p5ev("ti.design"), lAt = p5ev("ti.light"), gAt = p5ev("ti.strong"), zAt = p5ev("ti.size"), pAt = p5ev("ti.promo");
  const enter = sp(frame, p5scene("titan").from, { damping: 13, stiffness: 120 });
  const inch = (6.7 * easeOut(ramp(frame, zAt, zAt + 14))).toFixed(1).replace(".", ",");
  const float = frame >= lAt ? Math.sin((frame - lAt) * 0.12) * 10 : 0;
  return (
    <SceneShell id="titan">
      <Title frame={frame} at={dAt} pill size={56}><LineIcon name="bezel" size={60} stroke={8} color={COLORS.blue} />Design en titane</Title>
      <div style={{ position: "absolute", left: 330, top: 380 + float, transform: `translateX(${(1 - enter) * -800}px) rotate(-4deg)` }}>
        <Img k="front" w={290} sweep={interpolate(frame, [dAt, dAt + 20], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 660, top: 480, display: "flex", flexDirection: "column", alignItems: "center", ...slam(frame, zAt, 2.2), fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow }}>
          <div style={{ fontSize: 120, lineHeight: 1 }}>{inch}<span style={{ fontSize: "0.5em" }}>″</span></div>
          <div style={{ fontSize: 32, letterSpacing: 3 }}>POUCES</div>
        </div>
      )}
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 660, top: 700, ...slam(frame, pAt, 1.8), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 36, padding: "4px 22px 8px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>ProMotion</div>
      )}
      <Row top={1080}>
        <Chip frame={frame} at={lAt} text="Léger" icon="feather" size={36} />
        <Chip frame={frame} at={gAt} text="Solide" icon="seal" size={36} solid />
      </Row>
      <Footnote frame={frame} at={zAt + 6} top={1262} text="Diagonale mesurée en rectangle" />
    </SceneShell>
  );
};

/** 11.5-14.75 s A17 Pro chip: fast for games, video editing and everything. */
export const P5Chip: React.FC = () => {
  const frame = useSceneFrame("chip");
  const cAt = p5ev("ch.chip"), gAt = p5ev("ch.games"), eAt = p5ev("ch.edit"), aAt = p5ev("ch.all");
  const p = sp(frame, cAt, { damping: 11, stiffness: 160 });
  const glow = frame >= cAt ? 0.5 + 0.5 * Math.sin((frame - cAt) / 5) : 0;
  return (
    <SceneShell id="chip">
      <Burst x={540} y={640} r={800} rot={frame * 0.8} opacity={0.18 * ramp(frame, cAt, cAt + 8)} rays={18} />
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 540 - 180, top: 420, width: 360, height: 360, transform: `scale(${p}) rotate(${lerp(-20, 0, p)}deg)` }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 60, background: "linear-gradient(145deg,#2b3347,#0e1220)", boxShadow: `0 0 ${40 + glow * 50}px rgba(108,243,255,${0.35 + glow * 0.35}), 0 24px 50px rgba(6,14,90,0.5)`, border: "4px solid #8fa1c4" }} />
          {Array.from({ length: 6 }).map((_, i) => (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: 60 + i * 48, top: -26, width: 14, height: 26, borderRadius: 4, background: "#c9d3ea" }} />
              <div style={{ position: "absolute", left: 60 + i * 48, bottom: -26, width: 14, height: 26, borderRadius: 4, background: "#c9d3ea" }} />
            </React.Fragment>
          ))}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", lineHeight: 1 }}>
            <div style={{ fontSize: 100 }}>A17</div>
            <div style={{ fontSize: 56, color: "#6CF3FF", letterSpacing: 6 }}>PRO</div>
          </div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={gAt} text="Jeux" icon="controller" size={38} solid />
        <Chip frame={frame} at={eAt} text="Montage vidéo" icon="play" size={38} />
        <Chip frame={frame} at={aAt} text="Et tout le reste" icon="spark" size={38} solid />
      </Row>
    </SceneShell>
  );
};

/** 14.75-19.5 s 48 MP camera, 5x optical zoom: sharp shots from afar. */
export const P5Camera: React.FC = () => {
  const frame = useSceneFrame("camera");
  const mAt = p5ev("cm.mp"), zAt = p5ev("cm.zoom"), xAt = p5ev("cm.x5"), fAt = p5ev("cm.far");
  const enter = sp(frame, p5scene("camera").from, { damping: 13, stiffness: 120 });
  const zoom = lerp(1, 5, interpolate(frame, [zAt, xAt + 10], [0, 1], { ...clamp, easing: easeOut }));
  const flash = interpolate(frame, [mAt, mAt + 2, mAt + 10], [0, 1, 0], clamp);
  const R = 200;
  return (
    <SceneShell id="camera">
      {/* round magnifier on the official camera module */}
      <div style={{ position: "absolute", left: 300, top: 360, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", border: "10px solid #fff", boxShadow: "0 24px 50px rgba(6,14,90,0.45)", transform: `scale(${enter})`, background: "#1d2533" }}>
        <div style={{ position: "absolute", left: -10, top: 0 }}><ProductImage src={OFFICIAL.cam.src} aspect={OFFICIAL.cam.aspect} width={430} /></div>
        <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash * 0.85 }} />
      </div>
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 340, ...slam(frame, mAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "2px 24px 8px", borderRadius: 22, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            48 <span style={{ fontSize: 36 }}>MP</span>
          </div>
        </div>
      )}
      {/* zoom viewfinder: a distant landmark grows from 1x to 5x */}
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 600, top: 600, width: 340, height: 240, borderRadius: 24, overflow: "hidden", border: "6px solid #fff", background: "linear-gradient(180deg,#7fd3ff,#c9f0ff)", transform: `scale(${pop(frame, zAt)})`, boxShadow: "0 18px 40px rgba(6,14,90,0.4)" }}>
          <svg viewBox="0 0 340 240" width={340} height={240} style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "236px 150px" }}>
            <path d="M0 190 Q 90 170 170 188 T 340 182 V240 H0 Z" fill="#1e4fb0" />
            <path d="M228 150 L236 120 L244 150 Z M231 150 h10 v22 h-10 Z" fill="#fff" />
            <circle cx={236} cy={118} r={3} fill="#FF3B5C" />
          </svg>
          <div style={{ position: "absolute", right: 12, top: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: "rgba(6,14,90,0.55)", padding: "0 12px 4px", borderRadius: 10 }}>{zoom.toFixed(1).replace(".", ",")}x</div>
        </div>
      )}
      <Row top={1060}>
        <Chip frame={frame} at={xAt} text="Zoom optique 5x" icon="lens" size={36} solid />
        <Chip frame={frame} at={fAt} text="Net même de loin" icon="eye" size={36} />
      </Row>
    </SceneShell>
  );
};

/** 19.5-21.5 s works with a SIM card; USB-C. */
export const P5Sim: React.FC = () => {
  const frame = useSceneFrame("sim");
  const sAt = Math.min(p5ev("sm.sim"), p5scene("sim").from + 4), uAt = p5ev("sm.usbc");
  const enter = sp(frame, p5scene("sim").from, { damping: 13, stiffness: 120 });
  const card = (at: number, children: React.ReactNode, left: number) =>
    frame < at - 1 ? null : (
      <div style={{ position: "absolute", left, top: 430, width: 280, height: 300, borderRadius: 34, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, transform: `scale(${pop(frame, at)})`, boxShadow: "0 18px 44px rgba(6,14,90,0.4)", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COLORS.blue }}>
        {children}
      </div>
    );
  return (
    <SceneShell id="sim">
      <div style={{ position: "absolute", inset: 0, opacity: enter }}>
        {card(sAt, <><LineIcon name="sim" size={140} stroke={7} color={COLORS.blue} progress={ramp(frame, sAt, sAt + 10)} />Carte SIM</>, 330)}
        {card(uAt, <><LineIcon name="cable" size={140} stroke={7} color={COLORS.blue} progress={ramp(frame, uAt, uAt + 10)} />USB-C</>, 650)}
      </div>
      <Footnote frame={frame} at={sAt + 6} top={1120} text="Nano-SIM + eSIM (version hors États-Unis)" />
    </SceneShell>
  );
};
