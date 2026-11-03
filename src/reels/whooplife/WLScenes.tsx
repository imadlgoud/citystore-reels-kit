import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { wlev, wlscene, OFFICIAL } from "./timeline";

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

const RED = "#FF3B5C", GREEN = "#2BD96B", AMBER = "#FFB020";

/** red cross drawn over a box of the given size */
const Cross: React.FC<{ p: number; size: number }> = ({ p, size }) => (
  <svg viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, width: size, height: size, overflow: "visible" }}>
    {p > 0 && <path d={`M 14 14 L ${14 + 72 * Math.min(1, p * 2)} ${14 + 72 * Math.min(1, p * 2)}`} stroke={RED} strokeWidth={10} strokeLinecap="round" />}
    {p > 0.5 && <path d={`M 86 14 L ${86 - 72 * (p - 0.5) * 2} ${14 + 72 * (p - 0.5) * 2}`} stroke={RED} strokeWidth={10} strokeLinecap="round" />}
  </svg>
);

/** heartbeat trace drawn left to right */
const Pulse: React.FC<{ frame: number; at: number; top: number; o?: number }> = ({ frame, at, top, o = 1 }) => {
  const p = ramp(frame, at, at + 14);
  const d = "M0 60 H180 L210 60 L235 10 L265 110 L290 40 L310 60 H460 L490 60 L515 10 L545 110 L570 40 L590 60 H760";
  return (
    <svg width={760} height={120} viewBox="0 0 760 120" style={{ position: "absolute", left: 505 - 380 + 60, top, overflow: "visible", opacity: o }}>
      <path d={d} fill="none" stroke="#fff" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.85} />
    </svg>
  );
};

/*
 * 0.0-4.0 s HOOK ("no screen... but it knows your heart and health better than any watch!")
 * visual: a screen icon gets crossed out; the WHOOP Life band slams in on a heartbeat; a generic smartwatch icon is crossed
 *         and pushed aside: "MIEUX QU'UNE MONTRE".
 */
export const WLHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const sAt = wlev("hook.screen"), kAt = wlev("hook.know"), hAt = wlev("hook.heart"), wAt = wlev("hook.watch");
  const out = ramp(frame, kAt - 2, kAt + 5);
  const band = sp(frame, kAt, { damping: 11, stiffness: 160 });
  const sk = shake(frame, kAt, 12, 8);
  const beat = frame >= hAt ? 1 + 0.07 * Math.max(0, Math.sin(((frame - hAt) / 15) * Math.PI * 2)) : 1;
  const push = ramp(frame, wAt + 4, wAt + 12);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={600} r={900} rot={frame * 0.6} opacity={0.18 * ramp(frame, kAt, kAt + 6)} rays={20} />
      {out < 1 && (
        <div style={{ position: "absolute", left: 430, top: 420, opacity: 1 - out, transform: `scale(${pop(frame, 2) * (1 - 0.4 * out)}) rotate(-6deg)` }}>
          <LineIcon name="display" size={260} stroke={6} />
          <Cross p={ramp(frame, sAt + 3, sAt + 9)} size={260} />
        </div>
      )}
      {frame >= kAt - 1 && (
        <>
          <Pulse frame={frame} at={kAt + 4} top={520} o={0.9} />
          <div style={{ position: "absolute", left: 560 - 170, top: 330 + (1 - band) * -500, transform: `scale(${lerp(1.5, 1, band) * beat})` }}>
            <Img k="life" w={340} />
          </div>
          {frame >= hAt - 1 && (
            <div style={{ position: "absolute", left: 250, top: 380, transform: `scale(${pop(frame, hAt) * beat})` }}>
              <LineIcon name="heart" size={110} stroke={9} color={RED} />
            </div>
          )}
        </>
      )}
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 770 + push * 120, top: 420, opacity: 1 - push * 0.6, transform: `scale(${pop(frame, wAt) * (1 - push * 0.3)}) rotate(${push * 20}deg)` }}>
          <div style={{ position: "relative", width: 130, height: 130, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LineIcon name="watch" size={90} stroke={8} color={COLORS.blue} />
            <Cross p={ramp(frame, wAt + 2, wAt + 8)} size={130} />
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < kAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, sAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", textShadow, whiteSpace: "nowrap" }}>بلا شاشة…</div>
        ) : frame < wAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, kAt, 2.2), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 54, padding: "2px 32px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>كيعرف على قلبك وصحتك</div>
        ) : (
          <div style={{ ...slam(frame, wAt, 2.2), background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "4px 30px 10px", borderRadius: 999, border: "4px solid #fff", boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>MIEUX QU'UNE MONTRE</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - kAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 4.0-7.75 s INTRO: WHOOP Life, 12-month membership, DISPONIBLE. */
export const WLIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = wlev("intro.name"), lAt = wlev("intro.life"), sAt = wlev("intro.sub"), mAt = wlev("intro.months"), dAt = wlev("intro.dispo");
  const enter = sp(frame, wlscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, lAt, 12, 8);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <span style={{ ...slam(frame, nAt, 2), fontSize: 104, letterSpacing: 6 }}>WHOOP</span>
        {frame >= lAt - 1 && <span style={{ ...slam(frame, lAt, 2.2), fontSize: 92, color: COLORS.blue, background: "#fff", padding: "0 24px 4px", borderRadius: 20, textShadow: "none" }}>Life</span>}
      </div>
      <div style={{ position: "absolute", left: 330, top: 430, transform: `translateY(${(1 - enter) * 1000}px)` }}>
        <Img k="life" w={400} sweep={interpolate(frame, [lAt + 2, lAt + 20], [-0.3, 1.3], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 470, transform: `translateX(${(1 - sp(frame, lAt + 4, { damping: 12, stiffness: 140 })) * 500}px) rotate(5deg)` }}>
        <Img k="box" w={150} />
      </div>
      <Row top={1000} left={320}>
        <Chip frame={frame} at={sAt} text="Abonnement inclus" icon="spark" size={36} solid />
        {frame >= mAt - 1 && (
          <div style={{ ...slam(frame, mAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 38, color: COLORS.blue, background: "#fff", padding: "6px 24px 10px", borderRadius: 999, boxShadow: "0 10px 26px rgba(6,14,90,0.3)", whiteSpace: "nowrap" }}>12 mois</div>
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

const Tile: React.FC<{ frame: number; at: number; icon: IconName; text: string; color: string }> = ({ frame, at, icon, text, color }) => {
  const p = frame < at - 1 ? 0 : sp(frame, at, { damping: 11, stiffness: 220, mass: 0.6 });
  return (
    <div style={{ width: 290, height: 160, borderRadius: 26, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, transform: `scale(${p})`, opacity: p > 0 ? 1 : 0, boxShadow: "0 14px 34px rgba(6,14,90,0.35)" }}>
      <LineIcon name={icon} size={66} stroke={8} color={color} progress={ramp(frame, at, at + 10)} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: COLORS.blue, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

/** 7.75-12.75 s band worn day and night; tracks heart, sleep, sport and recovery. */
export const WLBand: React.FC = () => {
  const frame = useSceneFrame("band");
  const bAt = wlev("bd.band"), dAt = wlev("bd.day");
  const enter = sp(frame, wlscene("band").from, { damping: 13, stiffness: 120 });
  const night = ramp(frame, dAt + 6, dAt + 16);
  return (
    <SceneShell id="band">
      <Title frame={frame} at={bAt} pill size={56}>Jour et nuit</Title>
      <div style={{ position: "absolute", left: 560 - 170, top: 360, transform: `translateY(${(1 - enter) * 900}px) rotate(${Math.sin(frame / 14) * 3}deg)` }}>
        <Img k="life" w={320} />
      </div>
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 790, top: 420, width: 130, height: 130, transform: `scale(${pop(frame, dAt)})` }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - night }}><LineIcon name="sun" size={130} stroke={7} color="#FFE07A" /></div>
          <div style={{ position: "absolute", inset: 0, opacity: night }}><LineIcon name="moon" size={130} stroke={7} color="#fff" /></div>
        </div>
      )}
      <Row top={780}>
        <Chip frame={frame} at={dAt} text="Jour & nuit" icon="moon" size={34} solid />
      </Row>
      <div style={{ position: "absolute", left: 340, right: 130, top: 900, display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        <Tile frame={frame} at={wlev("bd.heart")} icon="heart" text="Cœur" color={RED} />
        <Tile frame={frame} at={wlev("bd.sleep")} icon="moon" text="Sommeil" color="#5B6CFF" />
        <Tile frame={frame} at={wlev("bd.sport")} icon="run" text="Sport" color="#FF7A1A" />
        <Tile frame={frame} at={wlev("bd.reco")} icon="power" text="Récupération" color={GREEN} />
      </div>
    </SceneShell>
  );
};

/** 12.75-17.75 s WHOOP Life is the most complete: ECG to see your heart + blood-pressure trends. */
export const WLLife: React.FC = () => {
  const frame = useSceneFrame("life");
  const tAt = wlev("lf.top"), eAt = wlev("lf.ecg"), hAt = wlev("lf.heart"), rAt = wlev("lf.trend"), bAt = wlev("lf.bp");
  const ecg = ramp(frame, eAt, eAt + 26, (x) => x);
  const D = "M0 60 H50 L62 60 L70 52 L78 60 L92 60 L100 10 L110 108 L120 44 L130 60 H180 L192 60 L200 52 L208 60 L222 60 L230 10 L240 108 L250 44 L260 60 H310 L322 60 L330 52 L338 60 L352 60 L360 10 L370 108 L380 44 L390 60 H460";
  const PTS = [0.55, 0.62, 0.5, 0.58, 0.48, 0.45, 0.4];
  const bars = ramp(frame, rAt, rAt + 18, (x) => x);
  const beat = frame >= hAt ? 1 + 0.1 * Math.max(0, Math.sin(((frame - hAt) / 13) * Math.PI * 2)) : 1;
  return (
    <SceneShell id="life">
      <Title frame={frame} at={wlscene("life").from + 2} pill size={56}>WHOOP Life</Title>
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 330, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, tAt, 1.8), background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 34, padding: "4px 22px 8px", borderRadius: 999, border: "3px solid #fff", letterSpacing: 2, whiteSpace: "nowrap" }}>LE PLUS COMPLET</div>
        </div>
      )}
      {frame >= eAt - 1 && (
        <div style={{ position: "absolute", left: 330, top: 430, width: 600, height: 220, borderRadius: 30, background: "#fff", boxShadow: "0 18px 44px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, eAt)})`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 22, top: 14, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: RED }}>
            <div style={{ transform: `scale(${beat})` }}><LineIcon name="heart" size={44} stroke={8} color={RED} /></div>ECG
          </div>
          <svg width={600} height={160} viewBox="0 0 460 120" style={{ position: "absolute", left: 0, top: 60 }}>
            {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${i * 40} 0 V 120`} stroke="#ffd6dd" strokeWidth={1.5} />)}
            <path d={D} fill="none" stroke={RED} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ecg} />
          </svg>
        </div>
      )}
      {frame >= rAt - 1 && (
        <div style={{ position: "absolute", left: 330, top: 680, width: 600, height: 230, borderRadius: 30, background: "#fff", boxShadow: "0 18px 44px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, rAt)})`, fontFamily: FONT }}>
          <div style={{ position: "absolute", left: 22, top: 14, fontWeight: 900, fontSize: 30, color: COLORS.blue }}>Tendances de tension</div>
          <div style={{ position: "absolute", left: 30, right: 30, bottom: 24, height: 130, display: "flex", alignItems: "flex-end", gap: 18 }}>
            {PTS.map((v, i) => (
              <div key={i} style={{ flex: 1, height: `${v * 100 * Math.min(1, Math.max(0, bars * PTS.length - i))}%`, borderRadius: 10, background: i === PTS.length - 1 && frame >= bAt ? GREEN : "#9db2ff" }} />
            ))}
          </div>
        </div>
      )}
      <Footnote frame={frame} at={eAt + 8} top={1000} text="ECG et tension : indicatifs, pas un diagnostic médical ; disponibilité selon le pays" />
    </SceneShell>
  );
};

/** 23.25-27.0 s battery up to 14 days; charge it while wearing it. */
export const WLBattery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const bAt = wlev("bt.battery"), dAt = wlev("bt.days"), cAt = wlev("bt.charge"), wAt = wlev("bt.wrist");
  const enter = sp(frame, wlscene("battery").from, { damping: 13, stiffness: 120 });
  const n = Math.round(14 * ramp(frame, dAt, dAt + 14));
  const dock = interpolate(frame, [cAt - 2, cAt + 10], [0, 1], { ...clamp, easing: easeOut });
  const glow = frame >= wAt ? 0.6 + 0.4 * Math.sin((frame - wAt) / 4) : 0;
  return (
    <SceneShell id="battery">
      <Title frame={frame} at={bAt} pill size={56}><LineIcon name="battery" size={64} stroke={8} color={COLORS.blue} />Batterie</Title>
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 350, display: "flex", justifyContent: "center", ...slam(frame, dAt, 2.2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, lineHeight: 1, color: "#fff", textShadow, whiteSpace: "nowrap" }}>{n}<span style={{ fontSize: "0.42em" }}> jours</span></div>
        </div>
      )}
      <div style={{ position: "absolute", left: 340, top: 560, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="life" w={320} />
      </div>
      {frame >= cAt - 3 && (
        <div style={{ position: "absolute", left: lerp(1100, 600, dock), top: lerp(560, 690, dock), transform: `rotate(${lerp(20, 0, dock)}deg)` }}>
          <Img k="battery" w={240} />
        </div>
      )}
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 800, top: 560, transform: `scale(${pop(frame, wAt)})`, opacity: glow, filter: "drop-shadow(0 0 18px #FFE07A)" }}>
          <LineIcon name="bolt" size={110} stroke={8} color="#FFE07A" />
        </div>
      )}
      <Row top={1100}>
        <Chip frame={frame} at={dAt} text="Jusqu'à 14 jours" icon="battery" size={34} solid />
        <Chip frame={frame} at={wAt} text="Recharge au poignet" icon="bolt" size={34} />
      </Row>
      <Footnote frame={frame} at={dAt + 6} top={1262} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};

/** 17.75-23.25 s Healthspan & WHOOP Age: your body's age + advice to improve your health. Drawn dial (the app
 * screenshots supplied are in English, so they are not used). */
export const WLAge: React.FC = () => {
  const frame = useSceneFrame("age");
  const sAt = wlev("ag.span"), aAt = wlev("ag.age"), bAt = wlev("ag.body"), tAt = wlev("ag.tips"), hAt = wlev("ag.better");
  const ring = sp(frame, wlscene("age").from + 2, { damping: 14, stiffness: 90 });
  const dots = React.useMemo(
    () =>
      Array.from({ length: 170 }, (_, i) => {
        const h = (k: number) => {
          const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
          return x - Math.floor(x);
        };
        const a = h(1) * Math.PI * 2, r = 150 + Math.pow(h(2), 0.6) * 75;
        return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: 2 + h(3) * 6, o: 0.35 + h(4) * 0.65 };
      }),
    [],
  );
  return (
    <SceneShell id="age">
      <Title frame={frame} at={sAt} pill size={56}>Healthspan</Title>
      <svg width={520} height={520} viewBox="-260 -260 520 520" style={{ position: "absolute", left: 560 - 260, top: 370, transform: `scale(${ring}) rotate(${frame * 0.3}deg)` }}>
        <defs>
          <radialGradient id="whageglow">
            <stop offset="0.45" stopColor="#0b1a3a" />
            <stop offset="0.85" stopColor="#13804f" />
            <stop offset="1" stopColor="#2BD96B" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle r={240} fill="url(#whageglow)" />
        {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.s} fill="#5CFFA6" opacity={d.o} />)}
        <circle r={232} fill="none" stroke="#5CFFA6" strokeWidth={4} opacity={0.7} />
      </svg>
      <div style={{ position: "absolute", left: 560 - 200, top: 370 + 260 - 90, width: 400, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap" }}>
        {frame >= aAt - 1 && <div style={{ ...slam(frame, aAt, 2), fontSize: 58, letterSpacing: 3 }}>WHOOP Age</div>}
        {frame >= bAt - 1 && <div style={{ ...slam(frame, bAt, 1.6), fontSize: 32, color: "#5CFFA6" }}>L'âge de ton corps</div>}
      </div>
      <Row top={1000}>
        <Chip frame={frame} at={tAt} text="Conseils personnalisés" icon="check" size={34} solid />
        <Chip frame={frame} at={hAt} text="Améliore ta santé" icon="heart" size={34} />
      </Row>
      <Footnote frame={frame} at={aAt + 4} top={1170} text="Dans l'app WHOOP, avec l'abonnement" />
    </SceneShell>
  );
};
