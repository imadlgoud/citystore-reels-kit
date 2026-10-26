import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { whev, whscene, OFFICIAL } from "./timeline";

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
 * 0.0-3.25 s HOOK ("no screen, no notifications... and it knows your health better than you!")
 * visual: a phone, crossed out; alert bells pop around it and get crossed out too; then the band slams in on a heartbeat.
 */
export const WHHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const sAt = whev("hook.screen"), nAt = whev("hook.notif"), kAt = whev("hook.know"), hAt = whev("hook.health");
  const out = ramp(frame, kAt - 2, kAt + 5);
  const band = sp(frame, kAt, { damping: 11, stiffness: 160 });
  const sk = shake(frame, kAt, 12, 8);
  const beat = frame >= hAt ? 1 + 0.08 * Math.max(0, Math.sin(((frame - hAt) / 15) * Math.PI * 2)) : 1;
  const bells = [{ x: 250, y: 380 }, { x: 720, y: 430 }, { x: 760, y: 680 }];
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={640} r={900} rot={frame * 0.6} opacity={0.18 * ramp(frame, kAt, kAt + 6)} rays={20} />
      {out < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `scale(${1 - 0.4 * out})`, transformOrigin: "560px 640px" }}>
          <div style={{ position: "absolute", left: 430, top: 420, transform: `scale(${pop(frame, 2)}) rotate(-6deg)` }}>
            <LineIcon name="phone" size={280} stroke={6} />
            <Cross p={ramp(frame, sAt + 3, sAt + 9)} size={280} />
          </div>
          {bells.map((b, i) =>
            frame < nAt + i * 3 - 1 ? null : (
              <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: 130, height: 130, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, nAt + i * 3)})`, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
                <LineIcon name="bell" size={86} stroke={8} color={COLORS.blue} />
                <div style={{ position: "absolute", right: 6, top: 6, width: 34, height: 34, borderRadius: "50%", background: RED }} />
                <Cross p={ramp(frame, nAt + 12, nAt + 17)} size={130} />
              </div>
            ),
          )}
        </div>
      )}
      {frame >= kAt - 1 && (
        <>
          <Pulse frame={frame} at={kAt + 4} top={540} o={0.9} />
          <div style={{ position: "absolute", left: 560 - 180, top: 372 + (1 - band) * -500, transform: `scale(${lerp(1.5, 1, band) * beat})` }}>
            <Img k="band" w={360} />
          </div>
          {frame >= hAt - 1 && (
            <div style={{ position: "absolute", left: 780, top: 380, transform: `scale(${pop(frame, hAt) * beat})` }}>
              <LineIcon name="heart" size={120} stroke={9} color="#fff" />
            </div>
          )}
        </>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < hAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, sAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", textShadow, whiteSpace: "nowrap" }}>بلا شاشة، بلا نوتيفيكاسيون</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, hAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "2px 34px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>كيعرف صحتك كثر منك!</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - kAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.25-6.5 s INTRO: WHOOP 5.0, abonnement Peak, DISPONIBLE. */
export const WHIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = whev("intro.name"), pAt = whev("intro.peak"), dAt = whev("intro.dispo");
  const enter = sp(frame, whscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <span style={{ ...slam(frame, nAt, 2), fontSize: 110, letterSpacing: 6 }}>WHOOP</span>
        <span style={{ ...slam(frame, nAt + 5, 2.2), fontSize: 96, color: COLORS.blue, background: "#fff", padding: "0 24px 4px", borderRadius: 20, textShadow: "none" }}>5.0</span>
      </div>
      <div style={{ position: "absolute", left: 560 - 320, top: 500, transform: `translateY(${(1 - enter) * 1000}px)` }}>
        <Img k="duo" w={640} sweep={interpolate(frame, [nAt + 4, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1000} left={330}>
        <Chip frame={frame} at={pAt} text="Abonnement Peak" icon="spark" size={38} solid />
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

/** 6.5-11.0 s light band worn day and night; tracks heart, sleep, sport and recovery. */
export const WHBand: React.FC = () => {
  const frame = useSceneFrame("band");
  const bAt = whev("bd.band"), lAt = whev("bd.light"), dAt = whev("bd.day");
  const enter = sp(frame, whscene("band").from, { damping: 13, stiffness: 120 });
  const night = ramp(frame, dAt + 6, dAt + 16);
  return (
    <SceneShell id="band">
      <Title frame={frame} at={bAt} pill size={56}>Bracelet léger</Title>
      <div style={{ position: "absolute", left: 560 - 170, top: 360, transform: `translateY(${(1 - enter) * 900}px) rotate(${Math.sin(frame / 14) * 3}deg)` }}>
        <Img k="band" w={340} />
      </div>
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 790, top: 420, width: 130, height: 130, transform: `scale(${pop(frame, dAt)})` }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - night }}><LineIcon name="sun" size={130} stroke={7} color="#FFE07A" /></div>
          <div style={{ position: "absolute", inset: 0, opacity: night }}><LineIcon name="moon" size={130} stroke={7} color="#fff" /></div>
        </div>
      )}
      <Row top={780}>
        <Chip frame={frame} at={lAt} text="Léger" icon="feather" size={34} />
        <Chip frame={frame} at={dAt} text="Jour & nuit" icon="moon" size={34} solid />
      </Row>
      <div style={{ position: "absolute", left: 340, right: 130, top: 900, display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
        <Tile frame={frame} at={whev("bd.heart")} icon="heart" text="Cœur" color={RED} />
        <Tile frame={frame} at={whev("bd.sleep")} icon="moon" text="Sommeil" color="#5B6CFF" />
        <Tile frame={frame} at={whev("bd.sport")} icon="run" text="Sport" color="#FF7A1A" />
        <Tile frame={frame} at={whev("bd.reco")} icon="power" text="Récupération" color={GREEN} />
      </div>
    </SceneShell>
  );
};

/** 11.0-14.5 s every morning it tells you if your body is ready to push hard or needs rest. */
export const WHRecovery: React.FC = () => {
  const frame = useSceneFrame("recovery");
  const mAt = whev("rc.morning"), bAt = whev("rc.body"), pAt = whev("rc.push"), rAt = whev("rc.rest");
  const sun = sp(frame, mAt, { damping: 14, stiffness: 90 });
  const fill = frame < rAt ? 0.86 * ramp(frame, bAt, pAt + 4) : lerp(0.86, 0.34, ramp(frame, rAt - 2, rAt + 8));
  const color = frame < rAt - 2 ? GREEN : AMBER;
  const R = 190, C = 2 * Math.PI * R;
  return (
    <SceneShell id="recovery">
      <Title frame={frame} at={mAt} pill size={56}><LineIcon name="sun" size={64} stroke={9} color={COLORS.blue} />Chaque matin</Title>
      <Burst x={560} y={640} r={700} rot={frame * 0.4} opacity={0.14 * sun} rays={18} />
      <svg width={480} height={480} viewBox="-240 -240 480 480" style={{ position: "absolute", left: 560 - 240, top: 400, transform: `scale(${sun})` }}>
        <circle r={R} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth={36} />
        <circle r={R} fill="none" stroke={color} strokeWidth={36} strokeLinecap="round" strokeDasharray={`${C * fill} ${C}`} transform="rotate(-90)" />
      </svg>
      <div style={{ position: "absolute", left: 560 - 200, top: 400 + 240 - 80, width: 400, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow, transform: `scale(${sun})` }}>
        <LineIcon name={frame < rAt - 2 ? "run" : "moon"} size={96} stroke={8} color="#fff" />
        <div style={{ fontSize: 30, letterSpacing: 2 }}>RÉCUPÉRATION</div>
      </div>
      <Row top={1000}>
        <Chip frame={frame} at={pAt} text="Prêt pour l'effort" icon="bolt" size={34} solid />
        <Chip frame={frame} at={rAt} text="Besoin de repos" icon="moon" size={34} />
      </Row>
    </SceneShell>
  );
};

/** 14.5-17.5 s battery up to 14 days; charge it while wearing it. */
export const WHBattery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const bAt = whev("bt.battery"), dAt = whev("bt.days"), cAt = whev("bt.charge"), wAt = whev("bt.wrist");
  const enter = sp(frame, whscene("battery").from, { damping: 13, stiffness: 120 });
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
      <div style={{ position: "absolute", left: 360, top: 560, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="band" w={330} />
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

/** 17.5-22.5 s Healthspan & WHOOP Age: your body's age + advice to improve your health. Drawn dial (the app
 * screenshots supplied are in English, so they are not used). */
export const WHAge: React.FC = () => {
  const frame = useSceneFrame("age");
  const sAt = whev("ag.span"), aAt = whev("ag.age"), bAt = whev("ag.body"), tAt = whev("ag.tips"), hAt = whev("ag.better");
  const ring = sp(frame, whscene("age").from + 2, { damping: 14, stiffness: 90 });
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
      <Footnote frame={frame} at={aAt + 4} top={1170} text="Dans l'app WHOOP, avec l'abonnement Peak" />
    </SceneShell>
  );
};
