import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { wbev, wbscene, PHOTOS } from "./timeline";

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

/** City Store shop photo; fade = soften the left/right edges (the wrist photo's arm is cut by the frame) */
const Img: React.FC<{ k: keyof typeof PHOTOS; w: number; sweep?: number; fade?: boolean }> = ({ k, w, sweep = -1, fade }) => (
  <div style={{ filter: SHADOW, ...(fade ? { WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)", maskImage: "linear-gradient(90deg, transparent 0%, #000 22%, #000 78%, transparent 100%)" } : {}) }}>
    <ProductImage src={PHOTOS[k].src} aspect={PHOTOS[k].aspect} width={w} sweep={sweep} />
  </div>
);


const RED = "#FF3B5C", GREEN = "#2BD96B";

/** red cross drawn over a box */
const Cross: React.FC<{ p: number; w: number; h: number }> = ({ p, w, h }) => (
  <svg viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "visible" }}>
    {p > 0 && <path d={`M 10 10 L ${10 + (w - 20) * Math.min(1, p * 2)} ${10 + (h - 20) * Math.min(1, p * 2)}`} stroke={RED} strokeWidth={14} strokeLinecap="round" />}
    {p > 0.5 && <path d={`M ${w - 10} 10 L ${w - 10 - (w - 20) * (p - 0.5) * 2} ${10 + (h - 20) * (p - 0.5) * 2}`} stroke={RED} strokeWidth={14} strokeLinecap="round" />}
  </svg>
);

/** drawn generic smartwatch (silver aluminium case, dark band, black screen); children = screen content (240 x 290) */
const DrawnWatch: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 300, height: 560, transform: `scale(${s})`, transformOrigin: "50% 50%", filter: SHADOW }}>
    <div style={{ position: "absolute", left: 60, top: 0, width: 180, height: 140, borderRadius: "30px 30px 10px 10px", background: "linear-gradient(90deg,#1c1f2a,#2b2f3d,#1c1f2a)" }} />
    <div style={{ position: "absolute", left: 60, top: 420, width: 180, height: 140, borderRadius: "10px 10px 30px 30px", background: "linear-gradient(90deg,#1c1f2a,#2b2f3d,#1c1f2a)" }} />
    <div style={{ position: "absolute", left: 296, top: 200, width: 22, height: 64, borderRadius: 8, background: "linear-gradient(90deg,#b9bcc4,#eef0f4)" }} />
    <div style={{ position: "absolute", left: 0, top: 100, width: 300, height: 360, borderRadius: 74, background: "linear-gradient(135deg,#f2f3f6,#b8bcc6 55%,#e6e8ed)", boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.6)" }}>
      <div style={{ position: "absolute", left: 18, top: 18, width: 264, height: 324, borderRadius: 58, background: "#05060a" }}>
        <div style={{ position: "absolute", left: 12, top: 17, width: 240, height: 290, overflow: "hidden", borderRadius: 46, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, color: "#fff" }}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

/*
 * 0.0-3.5 s HOOK ("no need to buy the latest model to get a great Apple Watch!")
 * visual: a red "DERNIER MODÈLE / €€€€" tag gets crossed out, then the Series 11 units on the shop stand slam in.
 */
export const WBHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const lAt = wbev("hook.latest"), wAt = wbev("hook.watch"), gAt = wbev("hook.great");
  const tag = pop(frame, lAt);
  const out = ramp(frame, wAt - 2, wAt + 5);
  const sk = shake(frame, wAt, 14, 10);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={600} r={900} rot={frame * 0.6} opacity={0.2 * ramp(frame, wAt, wAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < gAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", textShadow, whiteSpace: "nowrap" }}>ماشي ضروري آخر موديل</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, gAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "2px 34px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>Apple Watch واعرة!</div>
        )}
      </div>
      {frame >= lAt - 1 && out < 1 && (
        <div style={{ position: "absolute", left: 560 - 210, top: 440, width: 420, height: 230, transform: `scale(${tag * (1 - out)}) rotate(-6deg)` }}>
          <div style={{ width: 420, height: 230, borderRadius: 30, border: "6px solid #fff", background: RED, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", boxShadow: "0 18px 44px rgba(6,14,90,0.45)" }}>
            <div style={{ fontSize: 40, letterSpacing: 2 }}>DERNIER MODÈLE</div>
            <div style={{ fontSize: 84, lineHeight: 1 }}>€€€€</div>
          </div>
          <Cross p={ramp(frame, lAt + 10, lAt + 18)} w={420} h={230} />
        </div>
      )}
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 560 - 240, top: 385, ...slam(frame, wAt, 2.4) }}>
          <Img k="trio" w={480} sweep={interpolate(frame, [wAt + 4, wAt + 22], [-0.3, 1.3], clamp)} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - wAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.5-7.75 s INTRO: Apple Watch Series 11, 46 mm, DISPONIBLE. */
export const WBIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = wbev("intro.name"), sAt = wbev("intro.series"), zAt = wbev("intro.size"), dAt = wbev("intro.dispo");
  const enter = sp(frame, wbscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, sAt, 12, 8);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 64 }}>Apple Watch</div>
        {frame >= sAt - 1 && <div style={{ ...slam(frame, sAt, 2.2), fontSize: 86, color: COLORS.blue, background: "#fff", padding: "0 30px 6px", borderRadius: 20, textShadow: "none" }}>Series 11</div>}
      </div>
      <div style={{ position: "absolute", left: 560 - 250, top: 500, transform: `translateY(${(1 - enter) * 1000}px)` }}>
        <Img k="setup" w={500} sweep={interpolate(frame, [sAt + 4, sAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1030} left={330}>
        <Chip frame={frame} at={zAt} text="46 mm" icon="ruler" size={40} solid />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: GREEN, padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={46} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 7.75-11.0 s battery up to 24 h, fast charging. */
export const WBBattery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const bAt = wbev("bt.battery"), hAt = wbev("bt.hours"), cAt = wbev("bt.charge"), fAt = wbev("bt.fast");
  const enter = sp(frame, wbscene("battery").from, { damping: 13, stiffness: 120 });
  const h = Math.round(24 * easeOut(ramp(frame, hAt, hAt + 16)));
  const fill = frame < cAt ? easeOut(ramp(frame, hAt, hAt + 16)) : interpolate(frame, [cAt, cAt + 8], [1, 0.35], clamp) + 0.65 * ramp(frame, cAt + 8, fAt + 10, (x) => x);
  const puck = sp(frame, cAt, { damping: 13, stiffness: 140 });
  const R = 96, C = 2 * Math.PI * R;
  return (
    <SceneShell id="battery">
      <Title frame={frame} at={bAt} pill size={56}><LineIcon name="battery" size={64} stroke={8} color={COLORS.blue} />Batterie</Title>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <DrawnWatch x={560 - 150} y={360}>
          <svg width={220} height={220} viewBox="-110 -110 220 220" style={{ position: "absolute" }}>
            <circle r={R} fill="none" stroke="#1d2a1d" strokeWidth={16} />
            <circle r={R} fill="none" stroke={GREEN} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${C * fill} ${C}`} transform="rotate(-90)" />
          </svg>
          {frame >= cAt ? (
            <LineIcon name="bolt" size={90} stroke={8} color={GREEN} />
          ) : frame < hAt ? (
            <LineIcon name="battery" size={100} stroke={7} color={GREEN} />
          ) : (
            <div style={{ fontWeight: 900, fontSize: 84, lineHeight: 1 }}>{h}<span style={{ fontSize: 40 }}> h</span></div>
          )}
        </DrawnWatch>
        {frame >= cAt - 1 && (
          <div style={{ position: "absolute", left: 560 - 80, top: 930 + (1 - puck) * 200, width: 160, height: 40, borderRadius: 999, background: "linear-gradient(180deg,#f4f5f8,#c4c8d0)", boxShadow: "0 10px 24px rgba(6,14,90,0.35)", opacity: puck }} />
        )}
      </div>
      <Row top={1060}>
        <Chip frame={frame} at={hAt} text="Jusqu'à 24 h" icon="stopwatch" size={36} solid />
        <Chip frame={frame} at={fAt} text="Charge rapide" icon="bolt" size={36} />
      </Row>
      <Footnote frame={frame} at={hAt + 6} top={1240} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};

/** 11.0-17.0 s Sleep Score every morning + alert when blood pressure is too high. */
export const WBSleep: React.FC = () => {
  const frame = useSceneFrame("sleep");
  const sAt = wbev("sl.score"), nAt = wbev("sl.note"), mAt = wbev("sl.morning"), aAt = wbev("sl.alert"), tAt = wbev("sl.tension"), hAt = wbev("sl.high");
  const ring = easeOut(ramp(frame, nAt, nAt + 20));
  const R = 96, C = 2 * Math.PI * R;
  const card = sp(frame, aAt, { damping: 13, stiffness: 140 });
  const watchX = interpolate(frame, [aAt - 2, aAt + 10], [560 - 150, 330], { ...clamp, easing: easeOut });
  const pulse = frame >= hAt ? 1 + 0.06 * Math.max(0, Math.sin(((frame - hAt) / 10) * Math.PI * 2)) : 1;
  return (
    <SceneShell id="sleep">
      <Title frame={frame} at={sAt} pill size={54}><LineIcon name="moon" size={60} stroke={8} color={COLORS.blue} />Score de sommeil</Title>
      <DrawnWatch x={watchX} y={360} s={frame >= aAt ? lerp(1, 0.86, ramp(frame, aAt - 2, aAt + 10)) : 1}>
        <svg width={220} height={220} viewBox="-110 -110 220 220" style={{ position: "absolute" }}>
          <circle r={R} fill="none" stroke="#1d1f3a" strokeWidth={16} />
          <circle r={R} fill="none" stroke="#7A8CFF" strokeWidth={16} strokeLinecap="round" strokeDasharray={`${C * 0.86 * ring} ${C}`} transform="rotate(-90)" />
        </svg>
        <LineIcon name={frame >= mAt ? "sun" : "moon"} size={96} stroke={8} color={frame >= mAt ? "#FFE07A" : "#B9C3FF"} />
      </DrawnWatch>
      {frame >= mAt - 1 && frame < aAt - 2 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 960, display: "flex", justifyContent: "center", paddingLeft: 200 }}>
          <Chip frame={frame} at={mAt} text="Chaque matin" icon="sun" size={36} solid />
        </div>
      )}
      {frame >= aAt - 1 && (
        <div style={{ position: "absolute", left: 620, top: 470, width: 320, transform: `translateX(${(1 - card) * 500}px) scale(${pulse})`, background: "#fff", borderRadius: 30, padding: "22px 20px", boxShadow: "0 18px 44px rgba(6,14,90,0.45)", fontFamily: FONT, color: COLORS.navy, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <div style={{ width: 92, height: 92, borderRadius: "50%", background: RED, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LineIcon name="heart" size={60} stroke={8} color="#fff" />
          </div>
          <div style={{ fontWeight: 900, fontSize: 34, color: RED }}>ALERTE</div>
          {frame >= tAt - 1 && <div style={{ ...slam(frame, tAt, 1.6), fontWeight: 900, fontSize: 34, lineHeight: 1.15 }}>Tension élevée</div>}
        </div>
      )}
      <Footnote frame={frame} at={aAt + 6} top={1120} text="Alertes de tension : pas un diagnostic médical ; disponibilité selon le pays" />
    </SceneShell>
  );
};

/** 17.0-21.0 s big, strong screen; water resistant; tracks heart and workouts. */
export const WBDisplay: React.FC = () => {
  const frame = useSceneFrame("display");
  const sAt = wbev("dp.screen"), gAt = wbev("dp.strong"), wAt = wbev("dp.water"), hAt = wbev("dp.heart"), pAt = wbev("dp.sport");
  const enter = sp(frame, wbscene("display").from, { damping: 13, stiffness: 120 });
  const W = 720, H = W * PHOTOS.wrist.aspect;
  const [x0, y0, x1, y1] = PHOTOS.wrist.screens[0];
  const beat = 1 + 0.12 * Math.max(0, Math.sin(((frame - hAt) / 13) * Math.PI * 2));
  const drops = Array.from({ length: 9 }, (_, i) => ({ x: 380 + ((i * 97) % 520), d: i * 3 }));
  return (
    <SceneShell id="display">
      <Title frame={frame} at={sAt} pill size={56}><LineIcon name="display" size={60} stroke={8} color={COLORS.blue} />Grand écran</Title>
      <div style={{ position: "absolute", left: 560 - W / 2 + 20, top: 400, transform: `translateX(${(1 - enter) * 900}px)` }}>
        <Img k="wrist" w={W} fade sweep={interpolate(frame, [gAt, gAt + 18], [-0.3, 1.3], clamp)} />
        {/* our own screen content, drawn over the blanked screen */}
        <div style={{ position: "absolute", left: x0 * W, top: y0 * H, width: (x1 - x0) * W, height: (y1 - y0) * H, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(4deg)", fontFamily: FONT, fontWeight: 900, color: "#fff" }}>
          {frame >= hAt - 1 ? (
            <div style={{ transform: `scale(${pop(frame, hAt) * beat})` }}><LineIcon name="heart" size={90} stroke={9} color={RED} /></div>
          ) : frame >= sAt ? (
            <svg width={150} height={60} viewBox="0 0 150 60"><path d="M0 30 H40 L52 8 L66 52 L78 22 L88 30 H150" fill="none" stroke={GREEN} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(frame, sAt, sAt + 14)} /></svg>
          ) : null}
          {frame >= pAt - 1 && <div style={{ transform: `scale(${pop(frame, pAt)})`, marginTop: 6 }}><LineIcon name="run" size={60} stroke={8} color={GREEN} /></div>}
        </div>
      </div>
      {frame >= wAt - 1 && drops.map((d, i) => {
        const t = frame - wAt - d.d;
        if (t < 0) return null;
        const y = 330 + t * 22;
        return y < 900 ? <div key={i} style={{ position: "absolute", left: d.x, top: y, opacity: 0.85 }}><LineIcon name="drop" size={46} stroke={7} color="#BFF3FF" /></div> : null;
      })}
      <Row top={1000}>
        <Chip frame={frame} at={gAt} text="Robuste" icon="seal" size={34} />
        <Chip frame={frame} at={wAt} text="Résiste à l'eau" icon="drop" size={34} solid />
        <Chip frame={frame} at={hAt} text="Cœur" icon="heart" size={34} />
        <Chip frame={frame} at={pAt} text="Sport" icon="run" size={34} />
      </Row>
      <Footnote frame={frame} at={wAt + 6} top={1200} text="Résistance à l'eau non permanente, selon l'usage" />
    </SceneShell>
  );
};
