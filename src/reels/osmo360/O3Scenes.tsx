import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { o3ev, o3scene, OFFICIAL } from "./timeline";

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

const Cam: React.FC<{ k: keyof typeof OFFICIAL; w: number; sweep?: number }> = ({ k, w, sweep = -1 }) => (
  <div style={{ filter: SHADOW }}>
    <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
  </div>
);

/** drawn mini scenes for the 360 ring */
const SCENE_ICONS: IconName[] = ["mountain", "run", "moto", "dive", "sun", "camera", "car", "heart"];
const Ring: React.FC<{ cx: number; cy: number; r: number; rot: number; o: number; pick?: number; pickP?: number }> = ({ cx, cy, r, rot, o, pick = -1, pickP = 0 }) => (
  <>
    <div style={{ position: "absolute", left: cx - r, top: cy - r * 0.42, width: r * 2, height: r * 0.84, borderRadius: "50%", border: "5px dashed rgba(255,255,255,0.6)", opacity: o }} />
    {SCENE_ICONS.map((ic, i) => {
      const a = rot + (i / SCENE_ICONS.length) * Math.PI * 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.42;
      const depth = (Math.sin(a) + 1) / 2;
      const s = lerp(0.65, 1.05, depth) * (i === pick ? 1 + 0.35 * pickP : 1);
      return (
        <div key={i} style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 28, background: i === pick && pickP > 0 ? "#fff" : "rgba(255,255,255,0.2)", border: `4px solid ${i === pick && pickP > 0 ? "#FFD25A" : "rgba(255,255,255,0.8)"}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})`, opacity: o * lerp(0.55, 1, depth), zIndex: Math.round(depth * 10) }}>
          <LineIcon name={ic} size={70} stroke={7} color={i === pick && pickP > 0 ? COLORS.blue : "#fff"} />
        </div>
      );
    })}
  </>
);

/*
 * 0.0-3.25 s HOOK ("film everything at once... and pick the angle later!")
 * visual: the Osmo 360 in the middle of a spinning ring of scenes (all around it); on "واختار" the ring freezes and a
 *         yellow frame picks one scene.
 */
export const O3Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const aAt = o3ev("hook.all"), pAt = o3ev("hook.pick"), gAt = o3ev("hook.angle");
  const enter = sp(frame, 0, { damping: 12, stiffness: 140 });
  const ringO = ramp(frame, aAt - 4, aAt + 6);
  const spin = Math.min(frame, pAt) * 0.07;
  const pickP = ramp(frame, gAt, gAt + 8);
  const sk = shake(frame, gAt, 10, 7);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={540} r={900} rot={frame * 0.6} opacity={0.18 * enter} rays={20} />
      <Ring cx={505} cy={560} r={380} rot={spin} o={ringO} pick={2} pickP={pickP} />
      <div style={{ position: "absolute", left: 505 - 110, top: 400, transform: `scale(${enter}) rotate(${Math.sin(frame * 0.1) * 3}deg)`, zIndex: 6 }}>
        <Cam k="logo" w={220} />
      </div>
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, pAt, 2.2), display: "flex", alignItems: "center", gap: 12, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "4px 28px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="lens" size={56} stroke={8} color={COLORS.blue} />360° → ta vue
          </div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - gAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.25-8.25 s INTRO: DJI Osmo 360, Standard Combo, DISPONIBLE. */
export const O3Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = o3ev("intro.name"), cAt = o3ev("intro.combo"), dAt = o3ev("intro.dispo");
  const enter = sp(frame, o3scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const t = frame / 30;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 40, letterSpacing: 12 }}>DJI</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...slam(frame, nAt + 5, 2.2) }}>
          <span style={{ fontSize: 88 }}>Osmo</span>
          <span style={{ fontSize: 92, color: COLORS.blue, background: "#fff", padding: "0 22px 4px", borderRadius: 18, textShadow: "none" }}>360</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 140, top: 470, transform: `translateX(${(1 - enter) * -900}px) translateY(${Math.sin(t * Math.PI) * 8}px) rotate(-6deg)` }}>
        <Cam k="logo" w={330} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 520, top: 520, transform: `translateX(${(1 - enter) * 900}px) translateY(${Math.sin(t * Math.PI + 1) * 8}px) rotate(5deg)` }}>
        <Cam k="screen" w={330} />
      </div>
      <Row top={1080} left={300}>
        <Chip frame={frame} at={cAt} text="Standard Combo" icon="box" size={38} solid />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", background: "#2BD96B", padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={44} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 8.25-14.75 s 360° camera: films everything around you, then export a normal video at the angle you want. */
export const O3Sphere: React.FC = () => {
  const frame = useSceneFrame("sphere");
  const sAt = o3ev("sp.360"), aAt = o3ev("sp.around"), vAt = o3ev("sp.video"), gAt = o3ev("sp.angle");
  const spin = frame * 0.05;
  const crop = sp(frame, vAt, { damping: 13, stiffness: 140 });
  const deg = Math.round(360 * easeOut(ramp(frame, sAt, sAt + 16)));
  return (
    <SceneShell id="sphere">
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center", ...slam(frame, sAt, 2.2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 140, lineHeight: 1, color: "#fff", textShadow }}>{deg}°</div>
        </div>
      )}
      <Ring cx={505} cy={560} r={360} rot={spin} o={ramp(frame, aAt - 6, aAt + 4)} pick={vAt <= frame ? 0 : -1} pickP={ramp(frame, gAt, gAt + 8)} />
      <div style={{ position: "absolute", left: 505 - 95, top: 440, zIndex: 6 }}>
        <Cam k="logo" w={190} />
      </div>
      {/* exported "normal" 16:9 video at the chosen angle */}
      {frame >= vAt - 1 && (
        <div style={{ position: "absolute", left: 300, top: 780, width: 520, height: 292, borderRadius: 26, border: "6px solid #fff", background: "linear-gradient(180deg,#7fd3ff,#c9f0ff)", overflow: "hidden", transform: `scale(${crop})`, boxShadow: "0 20px 50px rgba(6,14,90,0.45)", zIndex: 12 }}>
          <svg viewBox="0 0 320 180" width={520} height={292} style={{ position: "absolute", inset: 0 }}>
            <circle cx={250} cy={45} r={18} fill="#FFE07A" />
            <path d="M0 130 L70 60 L110 100 L160 40 L230 120 L270 90 L320 130 V180 H0 Z" fill="#2f6fd6" />
            <path d="M0 150 Q 80 136 160 150 T 320 148 V180 H0 Z" fill="#1e4fb0" />
          </svg>
          <div style={{ position: "absolute", left: 14, top: 10, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", background: "#FF3B5C", padding: "2px 12px", borderRadius: 999 }}>16:9</div>
        </div>
      )}
      <Row top={1110}>
        <Chip frame={frame} at={aAt} text="Tout autour" icon="lens" size={34} />
        <Chip frame={frame} at={gAt} text="Choisis l'angle après" icon="check" size={34} solid />
      </Row>
    </SceneShell>
  );
};

/** 14.75-18.75 s 1-inch sensor, 8K video, clear image even at night. */
export const O3Sensor: React.FC = () => {
  const frame = useSceneFrame("sensor");
  const iAt = o3ev("se.inch"), kAt = o3ev("se.8k"), cAt = o3ev("se.clear"), nAt = o3ev("se.night");
  const night = ramp(frame, nAt - 2, nAt + 8);
  const sk = shake(frame, kAt, 12, 8);
  return (
    <SceneShell id="sensor" shakeX={sk.x} shakeY={sk.y}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0a1240,#1b2a7a)", opacity: night * 0.8 }} />
      {night > 0 && Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 40 + ((i * 173) % 900), top: 230 + ((i * 97) % 600), width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: night * (0.4 + 0.6 * Math.abs(Math.sin(frame * 0.1 + i))) }} />
      ))}
      {/* 1-inch sensor */}
      {frame >= iAt - 1 && (
        <div style={{ position: "absolute", left: 90, top: 260, transform: `scale(${pop(frame, iAt)})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{ width: 280, height: 210, borderRadius: 18, background: "linear-gradient(135deg,#3b2a6b,#1c3f8a 50%,#2a7a6b)", border: "8px solid #fff", boxShadow: "0 16px 40px rgba(6,14,90,0.45), inset 0 0 40px rgba(255,255,255,0.25)" }} />
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", textShadow }}>Capteur 1"</div>
        </div>
      )}
      {frame >= kAt - 1 && (
        <div style={{ position: "absolute", left: 560, top: 280, ...slam(frame, kAt, 2.4) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, lineHeight: 1, color: COLORS.blue, background: "#fff", padding: "0 30px 10px", borderRadius: 30, boxShadow: "0 18px 44px rgba(6,14,90,0.45)" }}>8K</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 600, top: 560, transform: `scale(${sp(frame, o3scene("sensor").from, { damping: 13, stiffness: 120 })})` }}>
        <Cam k="screen" w={260} />
      </div>
      {night > 0 && <div style={{ position: "absolute", left: 200, top: 640, opacity: night }}><LineIcon name="moon" size={150} stroke={6} color="#FFE9A0" /></div>}
      <Row top={1090}>
        <Chip frame={frame} at={cAt} text="Image nette" icon="spark" size={36} />
        <Chip frame={frame} at={nAt} text="Même la nuit" icon="moon" size={36} solid />
      </Row>
    </SceneShell>
  );
};

/** 18.75-23.0 s 105 GB built-in storage, waterproof to 10 m. */
export const O3Storage: React.FC = () => {
  const frame = useSceneFrame("storage");
  const gAt = o3ev("st.gb"), wAt = o3ev("st.water"), mAt = o3ev("st.m");
  const s0 = o3scene("storage").from;
  const gb = Math.round(105 * easeOut(ramp(frame, gAt, gAt + 14)));
  const surf = interpolate(frame, [wAt - 4, wAt + 14], [1980, 760], { ...clamp, easing: easeOut });
  const m = Math.round(10 * easeOut(ramp(frame, mAt, mAt + 12)));
  const t = frame / 30;
  const wave = Array.from({ length: 13 }, (_, i) => `${i === 0 ? "M" : "L"} ${i * 90} ${Math.sin(i * 0.9 + t * 3) * 12}`).join(" ");
  return (
    <SceneShell id="storage">
      {frame >= gAt - 1 && (
        <div style={{ position: "absolute", left: 80, top: 250, ...slam(frame, gAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, fontFamily: FONT, fontWeight: 900, color: COLORS.blue, background: "#fff", padding: "0 30px 10px", borderRadius: 26, boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>
            <span style={{ fontSize: 120, lineHeight: 1 }}>{gb}</span><span style={{ fontSize: 50 }}>GB</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", marginTop: 10, textShadow }}>stockage intégré</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 600, top: 420, transform: `translateY(${(1 - sp(frame, s0, { damping: 13, stiffness: 120 })) * 700 + (frame >= wAt ? Math.sin(t * 2) * 8 + ramp(frame, wAt, wAt + 14) * 160 : 0)}px) rotate(4deg)` }}>
        <Cam k="logo" w={300} />
      </div>
      {frame >= wAt - 4 && (
        <div style={{ position: "absolute", left: 0, top: surf, width: 1080, height: 1920, background: "linear-gradient(180deg, rgba(40,200,255,0.55), rgba(10,60,190,0.75))" }}>
          <svg width={1080} height={40} style={{ position: "absolute", left: 0, top: -12, overflow: "visible" }}><path d={wave} stroke="#fff" strokeWidth={6} fill="none" opacity={0.85} /></svg>
        </div>
      )}
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: 80, top: 600, ...slam(frame, mAt, 2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, lineHeight: 1, color: "#fff", textShadow }}>{m}<span style={{ fontSize: "0.4em" }}> m</span></div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff" }}>étanche</div>
        </div>
      )}
      <Row top={1100}>
        <Chip frame={frame} at={gAt} text="105 GB intégrés" icon="box" size={36} solid />
        <Chip frame={frame} at={wAt} text="Étanche 10 m" icon="dive" size={36} />
      </Row>
    </SceneShell>
  );
};

/** 23.0-28.0 s with a selfie stick: the stick disappears from the video, like a drone filming you. */
export const O3Stick: React.FC = () => {
  const frame = useSceneFrame("stick");
  const kAt = o3ev("sk.stick"), vAt = o3ev("sk.vanish"), dAt = o3ev("sk.drone");
  const stickIn = sp(frame, kAt, { damping: 12, stiffness: 140 });
  const vanish = ramp(frame, vAt, vAt + 18);
  const bob = Math.sin(frame * 0.15) * 10;
  return (
    <SceneShell id="stick">
      <Title frame={frame} at={kAt} pill size={52}>Perche selfie invisible</Title>
      {/* drawn person + stick + camera */}
      <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <g transform="translate(330 680)" opacity={stickIn}>
          <circle cx={0} cy={0} r={46} fill="none" stroke="#fff" strokeWidth={9} />
          <path d="M 0 46 V 210 M 0 90 L 120 30 M 0 90 L -70 160 M 0 210 L -50 330 M 0 210 L 50 330" stroke="#fff" strokeWidth={10} strokeLinecap="round" fill="none" />
        </g>
        <line x1={450} y1={710} x2={660} y2={500 + bob} stroke="#1b1d26" strokeWidth={14} strokeLinecap="round" opacity={stickIn * (1 - vanish)} />
        <line x1={450} y1={710} x2={660} y2={500 + bob} stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeDasharray="8 14" opacity={stickIn * vanish * 0.7} />
      </svg>
      <div style={{ position: "absolute", left: 600, top: 410 + bob, transform: `scale(${stickIn}) rotate(-8deg)` }}>
        <Cam k="logo" w={130} />
      </div>
      {frame >= vAt + 6 && (
        <div style={{ position: "absolute", left: 540, top: 640, ...slam(frame, vAt + 6, 2.2) }}>
          <div style={{ transform: "rotate(-6deg)", background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "4px 22px 8px", borderRadius: 14, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>Perche effacée ✨</div>
        </div>
      )}
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 760, transform: `scale(${pop(frame, dAt)})`, display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(90deg,#FFD25A,#FFB020)", color: "#3a2500", fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "6px 22px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>
          <svg width={50} height={36} viewBox="0 0 100 70"><g stroke="#3a2500" strokeWidth={7} fill="none" strokeLinecap="round"><path d="M30 35 H70 M20 15 L40 35 M80 15 L60 35" /><ellipse cx={20} cy={12} rx={16} ry={5} /><ellipse cx={80} cy={12} rx={16} ry={5} /><rect x={38} y={30} width={24} height={18} rx={5} /></g></svg>
          Effet drone
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={kAt} text="Perche selfie" icon="camera" size={36} />
        <Chip frame={frame} at={vAt} text="Invisible à l'image" icon="spark" size={36} solid />
      </Row>
    </SceneShell>
  );
};
