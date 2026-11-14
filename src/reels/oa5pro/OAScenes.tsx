import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { pop, ramp, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { ProductHook } from "../../components/ProductHook";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, oaev, oascene } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";
const GREEN = "#2BD96B", RED = "#FF3B5C", CYAN = "#6CF3FF";

/** Bluetooth rune (drawn) */
const BtGlyph: React.FC<{ size: number; color?: string; stroke?: number }> = ({ size, color = "#fff", stroke = 8 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <path d="M30 30 L70 68 L50 86 V14 L70 32 L30 70" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** computer mouse (drawn) */
const MouseGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <rect x={28} y={12} width={44} height={76} rx={22} fill="none" stroke={color} strokeWidth={8} />
    <path d="M50 14 V40 M28 40 H72" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

/** Wi-Fi arcs; `level` 0..3 arcs lit, the rest faded */
const WifiGlyph: React.FC<{ size: number; color?: string; level?: number }> = ({ size, color = "#fff", level = 3 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${50 - (16 + i * 16)} ${66 - (12 + i * 12)} A${22 + i * 22} ${22 + i * 22} 0 0 1 ${50 + 16 + i * 16} ${66 - (12 + i * 12)}`} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" opacity={i < level ? 1 : 0.25} />
    ))}
    <circle cx={50} cy={78} r={7} fill={color} />
  </svg>
);

const Chip: React.FC<{ frame: number; at: number; text: string; icon?: IconName; glyph?: React.ReactNode; size: number; solid?: boolean }> = ({ frame, at, text, icon, glyph, size, solid }) => {
  if (frame < at - 1) return null;
  const p = sp(frame, at, { damping: 11, stiffness: 220, mass: 0.6 });
  const fg = solid ? COLORS.blue : "#fff";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.22}px ${size * 0.62}px`, borderRadius: 999, background: solid ? "#fff" : "rgba(255,255,255,0.18)", border: solid ? "none" : "3px solid rgba(255,255,255,0.75)", color: fg, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", transform: `scale(${p})`, boxShadow: "0 12px 30px rgba(6,14,90,0.3)" }}>
      {glyph ?? (icon ? <LineIcon name={icon} size={size * 1.2} stroke={7} color={fg} progress={ramp(frame, at, at + 10)} /> : null)}
      {text}
    </div>
  );
};

const Row: React.FC<{ top: number; left?: number; right?: number; children: React.ReactNode }> = ({ top, left = 340, right = 130, children }) => (
  <div style={{ position: "absolute", left, right, top, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>{children}</div>
);

/** small honest footnote under a claim (kept clear of Citybot and the subtitles) */
const Footnote: React.FC<{ frame: number; at: number; text: string; top: number }> = ({ frame, at, text, top }) =>
  frame < at ? null : (
    <div style={{ position: "absolute", left: 340, right: 130, top, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 27, lineHeight: 1.25, color: "#fff", opacity: 0.88 * ramp(frame, at, at + 8), textShadow: "0 4px 14px rgba(8,20,110,0.45)" }}>
      {text}
    </div>
  );

const Title: React.FC<{ frame: number; at: number; children: React.ReactNode; size?: number; top?: number }> = ({ frame, at, children, size = 60, top = 236 }) =>
  frame < at - 1 ? null : (
    <div style={{ position: "absolute", left: 0, right: 70, top, display: "flex", justifyContent: "center", zIndex: 20 }}>
      <div style={{ ...slam(frame, at, 2.2), display: "flex", alignItems: "center", gap: size * 0.22, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", background: "#fff", color: COLORS.blue, padding: `${size * 0.06}px ${size * 0.45}px ${size * 0.14}px`, borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>
        {children}
      </div>
    </div>
  );

const Img: React.FC<{ k: keyof typeof OFFICIAL; w: number; sweep?: number }> = ({ k, w, sweep = -1 }) => (
  <div style={{ filter: SHADOW }}>
    <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
  </div>
);

/** clip-on microphone (drawn) */
const MicGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 140" width={size} height={size * 1.4}>
    <rect x={22} y={8} width={56} height={84} rx={28} fill="#1C2333" stroke="#fff" strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => <line key={i} x1={32} y1={30 + i * 14} x2={68} y2={30 + i * 14} stroke="#5A6378" strokeWidth={5} strokeLinecap="round" />)}
    <rect x={30} y={96} width={40} height={30} rx={8} fill="#1C2333" stroke="#fff" strokeWidth={6} />
  </svg>
);

/** phone (drawn, for "still filming with your phone?") */
const PhoneGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 170" width={size} height={size * 1.7}>
    <rect x={8} y={6} width={84} height={158} rx={16} fill="#1C2333" stroke="#fff" strokeWidth={6} />
    <rect x={18} y={20} width={64} height={128} rx={6} fill="#3A4A7A" />
    <circle cx={50} cy={84} r={14} fill="none" stroke="#fff" strokeWidth={5} />
  </svg>
);

/*
 * 0.0-4.25 s HOOK ("want to start vlogging, or still filming with your phone? this is what you need!")
 * product-first: the camera and "باغي تبدا الـ vlog؟" from frame 0; at "بالتيليفون" a phone gets a red cross; at
 * "هادي" the pill punches to "هادي هي اللي خاصاك!".
 */
export const OAHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const pAt = oaev("hook.phone"), tAt = oaev("hook.this");
  return (
    <ProductHook src={OFFICIAL.full.src} aspect={OFFICIAL.full.aspect} width={600} top={470} cx={570} hook="باغي تبدا الـ vlog؟" punch={{ at: tAt, text: "هادي هي اللي خاصاك!" }}>
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 60, top: 520, transform: `scale(${1.3 * pop(frame, pAt)}) rotate(-10deg)`, transformOrigin: "left top", zIndex: 6 }}>
          <PhoneGlyph size={110} />
          <svg width={110} height={187} viewBox="0 0 110 187" style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M12 30 L98 157 M98 30 L12 157" stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={ramp(frame, pAt + 3, pAt + 7)} />
          </svg>
        </div>
      )}
    </ProductHook>
  );
};

/** 4.25-7.25 s INTRO: DJI Osmo Action 5 Pro, Essential Combo, DISPONIBLE. */
export const OAIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = oaev("intro.name"), mAt = oaev("intro.model"), cAt = oaev("intro.combo"), dAt = oaev("intro.dispo");
  const from = oascene("intro").from;
  return (
    <SceneShell id="intro">
      <Burst x={545} y={640} r={950} rot={frame * 0.5} opacity={0.2 * ramp(frame, nAt, nAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 222, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 20 }}>
        {frame >= nAt - 1 && <div style={{ ...slam(frame, nAt, 1.8), fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff", letterSpacing: 8, textShadow }}>DJI</div>}
        {frame >= mAt - 1 && <div style={{ ...slam(frame, mAt, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#fff", whiteSpace: "nowrap", textShadow }}>Osmo Action 5 Pro</div>}
      </div>
      <div style={{ position: "absolute", left: 545 - 250, top: 430, ...slam(frame, from + 2, 2.2) }}>
        <Img k="full" w={500} sweep={interpolate(frame, [mAt + 2, mAt + 20], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={910} left={340}>
        <Chip frame={frame} at={cAt} text="Essential Combo" icon="box" size={36} solid />
      </Row>
      <Row top={1010}>
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: GREEN, padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={46} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame - nAt, [0, 1, 6], [0, 0.4, 0], clamp) }} />
    </SceneShell>
  );
};

/** 7.25-11.5 s FRONT SCREEN: front OLED screen, see yourself while you vlog, keep the framing. */
export const OAScreen: React.FC = () => {
  const frame = useSceneFrame("screen");
  const nAt = oaev("sc.name"), fAt = oaev("sc.front"), yAt = oaev("sc.you"), cAt = oaev("sc.frame");
  const enter = sp(frame, oascene("screen").from, { damping: 13, stiffness: 120 });
  const w = 560, x = 545 - w / 2, y = 380;
  // the front screen sits in the left ~40 % of the render
  const sx = x + w * 0.05, sy = y + w * 0.81 * 0.2, sw = w * 0.4, sh = w * 0.81 * 0.58;
  const rec = Math.floor(frame / 15) % 2 === 0;
  return (
    <SceneShell id="screen">
      <Title frame={frame} at={nAt}>
        <LineIcon name="display" size={58} stroke={8} color={COLORS.blue} />Écran OLED avant
      </Title>
      <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="full" w={w} />
      </div>
      {/* highlight frame around the front screen */}
      {frame >= fAt - 1 && (
        <div style={{ position: "absolute", left: sx - 12, top: sy - 12, width: sw + 24, height: sh + 24, border: `7px solid ${CYAN}`, borderRadius: 26, opacity: ramp(frame, fAt, fAt + 6), boxShadow: `0 0 30px ${CYAN}` }} />
      )}
      {frame >= yAt - 1 && (
        <div style={{ position: "absolute", left: sx - 30, top: sy - 76, transform: `scale(${pop(frame, yAt)})`, display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 32, padding: "4px 18px 6px", borderRadius: 999, boxShadow: "0 10px 26px rgba(6,14,90,0.35)" }}>
          <span style={{ width: 18, height: 18, borderRadius: "50%", background: RED, opacity: rec ? 1 : 0.25 }} />REC · Tu te vois
        </div>
      )}
      <Row top={960} left={60}>
        <Chip frame={frame} at={yAt} text="Vlog en selfie" icon="eye" size={32} solid />
        <Chip frame={frame} at={cAt} text="Cadrage parfait" icon="check" size={32} solid />
      </Row>
    </SceneShell>
  );
};

/** 11.5-17.0 s STABILISATION: walk, run, steady video; sharp 4K even at night. */
export const OAStab: React.FC = () => {
  const frame = useSceneFrame("stab");
  const nAt = oaev("st.name"), wAt = oaev("st.walk"), rAt = oaev("st.run"), sAt = oaev("st.steady"), kAt = oaev("st.k4"), tAt = oaev("st.night");
  const t = frame / 30;
  // a bumpy path (walking / running) and the camera's steady horizon line above it
  const amp = 26 * ramp(frame, wAt, wAt + 6) * (1 + ramp(frame, rAt, rAt + 6));
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = 100 + i * 22;
    return `${x},${980 + Math.sin(i * 0.9 + t * 9) * amp * (0.6 + 0.4 * Math.sin(i * 2.3))}`;
  }).join(" ");
  const steady = ramp(frame, sAt, sAt + 8);
  const shakeCam = (1 - steady) * Math.sin(t * 22) * amp * 0.5;
  const night = ramp(frame, tAt, tAt + 10);
  return (
    <SceneShell id="stab">
      <div style={{ position: "absolute", inset: 0, background: "#0A1240", opacity: 0.55 * night }} />
      <Title frame={frame} at={nAt}>
        <LineIcon name="bezel" size={58} stroke={8} color={COLORS.blue} />Stabilisation
      </Title>
      <div style={{ position: "absolute", left: 545 - 230, top: 400 + shakeCam, transform: `rotate(${shakeCam * 0.15}deg)` }}>
        <Img k="full" w={460} />
      </div>
      {frame >= sAt - 1 && (
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={150} y1={830} x2={150 + 790 * steady} y2={830} stroke={GREEN} strokeWidth={8} strokeDasharray="22 12" strokeLinecap="round" />
        </svg>
      )}
      {frame >= wAt - 1 && (
        <svg width={1080} height={1100} style={{ position: "absolute", left: 0, top: 0 }}>
          <polyline points={pts} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 780, top: 360, transform: `scale(${pop(frame, tAt)})` }}>
          <LineIcon name="moon" size={110} stroke={8} color="#FFE27A" />
        </div>
      )}
      {frame >= kAt - 1 && (
        <div style={{ position: "absolute", left: 110, top: 380, transform: `scale(${pop(frame, kAt)}) rotate(-6deg)`, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "2px 26px 8px", borderRadius: 22, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>4K</div>
      )}
      <Row top={1050} left={60}>
        <Chip frame={frame} at={wAt} text="Marche" icon="run" size={30} solid />
        <Chip frame={frame} at={rAt} text="Course" icon="run" size={30} solid />
        <Chip frame={frame} at={sAt} text="Vidéo stable" icon="check" size={30} solid />
      </Row>
      <Row top={1130} left={340}>
        <Chip frame={frame} at={tAt} text="Nette même la nuit" icon="moon" size={30} solid />
      </Row>
    </SceneShell>
  );
};

/** 17.0-22.0 s MIC + BATTERY: connects directly to the DJI Mic 2 for clean sound; battery up to 4 hours. */
export const OAMic: React.FC = () => {
  const frame = useSceneFrame("mic");
  const nAt = oaev("mc.name"), mAt = oaev("mc.mic"), cAt = oaev("mc.clean"), bAt = oaev("mc.batt"), hAt = oaev("mc.hours");
  const enter = sp(frame, oascene("mic").from, { damping: 13, stiffness: 120 });
  const t = frame / 30;
  const link = ramp(frame, mAt, mAt + 10);
  const fill = easeOut(ramp(frame, bAt, bAt + 20));
  return (
    <SceneShell id="mic">
      <Title frame={frame} at={nAt}>
        <LineIcon name="signal" size={58} stroke={8} color={COLORS.blue} />Connexion directe
      </Title>
      <div style={{ position: "absolute", left: 520, top: 400, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="full" w={400} />
      </div>
      {frame >= mAt - 1 && (
        <>
          <div style={{ position: "absolute", left: 130, top: 420, transform: `scale(${pop(frame, mAt)})` }}><MicGlyph size={120} /></div>
          <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={260} y1={510} x2={260 + 250 * link} y2={530} stroke="#fff" strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-t * 60} />
          </svg>
          <div style={{ position: "absolute", left: 90, top: 610, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", textShadow, transform: `scale(${pop(frame, mAt)})` }}>DJI Mic 2</div>
        </>
      )}
      {frame >= cAt - 1 && (
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
          {[0, 1, 2].map((i) => {
            const r = 40 + ((t * 70 + i * 40) % 120);
            return <circle key={i} cx={190} cy={490} r={r} fill="none" stroke={CYAN} strokeWidth={5} opacity={Math.max(0, 1 - (r - 40) / 120) * ramp(frame, cAt, cAt + 6)} />;
          })}
        </svg>
      )}
      {frame >= bAt - 1 && (
        <div style={{ position: "absolute", left: 300, top: 760, transform: `scale(${pop(frame, bAt)})`, display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ position: "relative", width: 230, height: 110, border: "9px solid #fff", borderRadius: 24, padding: 9 }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 12, background: `linear-gradient(90deg, ${GREEN}, #7CF29E)` }} />
            <div style={{ position: "absolute", right: -24, top: 30, width: 14, height: 32, borderRadius: "0 8px 8px 0", background: "#fff" }} />
          </div>
          {frame >= hAt - 1 && <div style={{ ...slam(frame, hAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", textShadow, whiteSpace: "nowrap" }}>4 h</div>}
        </div>
      )}
      <Row top={960} left={60}>
        <Chip frame={frame} at={cAt} text="Son clair" icon="note" size={30} solid />
        <Chip frame={frame} at={hAt} text="Jusqu'à 4 h" icon="battery" size={30} solid />
      </Row>
      <Footnote frame={frame} at={cAt} top={1060} text="DJI Mic 2 vendu séparément." />
      <Footnote frame={frame} at={hAt} top={1100} text="Jusqu'à 4 h en 1080p/24 ips ; autonomie selon le mode." />
    </SceneShell>
  );
};
