import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { guev, guscene, OFFICIAL } from "./timeline";

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

/** drawn person (torso + head) used for the clip-on scenes */
const Person: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <svg width={360 * s} height={520 * s} viewBox="0 0 360 520" style={{ position: "absolute", left: x, top: y, opacity: o, overflow: "visible" }}>
    <circle cx={180} cy={90} r={70} fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth={9} />
    <path d="M40 520 V 300 Q 40 200 180 200 Q 320 200 320 300 V 520" fill="rgba(255,255,255,0.18)" stroke="#fff" strokeWidth={9} />
    <path d="M150 200 L 180 250 L 210 200" fill="none" stroke="#fff" strokeWidth={7} />
  </svg>
);

/*
 * 0.0-2.75 s HOOK ("filming or living the moment? now you can do both!")
 * visual: a phone held up in front of the face (crossed out), then the tiny camera clips onto the chest: "LES DEUX !"
 */
export const GUHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const fAt = guev("hook.film"), lAt = guev("hook.live"), bAt = guev("hook.both");
  const phoneP = pop(frame, fAt + 2);
  const x = ramp(frame, lAt, lAt + 6);
  const phoneOut = ramp(frame, bAt - 2, bAt + 6);
  const clip = sp(frame, bAt, { damping: 11, stiffness: 160 });
  const sk = shake(frame, bAt, 12, 8);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={520} r={900} rot={frame * 0.6} opacity={0.18 * ramp(frame, bAt, bAt + 6)} rays={20} />
      <Person x={325} y={390} />
      {phoneOut < 1 && (
        <div style={{ position: "absolute", left: 410, top: 390, transform: `scale(${phoneP * (1 - phoneOut)}) rotate(-6deg)`, opacity: 1 - phoneOut }}>
          <LineIcon name="phone" size={200} stroke={7} />
          <svg viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0, width: 200, height: 200, overflow: "visible" }}>
            {x > 0 && <path d={`M 18 18 L ${18 + 64 * x} ${18 + 64 * x}`} stroke="#FF3B5C" strokeWidth={10} strokeLinecap="round" />}
            {x > 0.5 && <path d={`M 82 18 L ${82 - 64 * (x - 0.5) * 2} ${18 + 64 * (x - 0.5) * 2}`} stroke="#FF3B5C" strokeWidth={10} strokeLinecap="round" />}
          </svg>
        </div>
      )}
      {frame >= bAt - 1 && (
        <div style={{ position: "absolute", left: 460, top: 690 + (1 - clip) * -300, transform: `scale(${lerp(1.6, 1, clip)})` }}>
          <Img k="camera" w={110} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < bAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, fAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", textShadow, whiteSpace: "nowrap" }}>كتصوّر ولا كتعيش؟</div>
        ) : (
          <div style={{ ...slam(frame, bAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "4px 34px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>LES DEUX !</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - bAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 2.75-8.0 s INTRO: Insta360 GO Ultra, Creator Bundle, with the Mini Tripod 2-in-1, DISPONIBLE. */
export const GUIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = guev("intro.name"), bAt = guev("intro.bundle"), tAt = guev("intro.tripod"), dAt = guev("intro.dispo");
  const enter = sp(frame, guscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 36, letterSpacing: 10 }}>INSTA360</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, ...slam(frame, nAt + 5, 2.2) }}>
          <span style={{ fontSize: 88 }}>GO</span>
          <span style={{ fontSize: 88, color: COLORS.blue, background: "#fff", padding: "0 22px 4px", borderRadius: 18, textShadow: "none" }}>Ultra</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 505 - 270, top: 430, transform: `translateY(${(1 - enter) * 1000}px)` }}>
        <Img k="kit" w={540} sweep={interpolate(frame, [bAt, bAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 760, top: 520, transform: `translateX(${(1 - sp(frame, tAt, { damping: 12, stiffness: 140 })) * 400}px)` }}>
          <Img k="tripod" w={200} />
        </div>
      )}
      <Row top={1090} left={300}>
        <Chip frame={frame} at={bAt} text="Creator Bundle" icon="box" size={36} solid />
        <Chip frame={frame} at={tAt} text="Mini Tripod 2 en 1" icon="camera" size={34} />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: "#2BD96B", padding: "8px 22px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={42} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 8.0-13.0 s small and very light, clips magnetically to your clothes, films what you see hands-free. */
export const GUMagnet: React.FC = () => {
  const frame = useSceneFrame("magnet");
  const sAt = guev("mg.small"), cAt = guev("mg.clip"), pAt = guev("mg.pov"), hAt = guev("mg.hands");
  const fly = ramp(frame, cAt - 4, cAt + 6, easeOut);
  const snap = frame >= cAt + 6 ? interpolate(frame, [cAt + 6, cAt + 8, cAt + 18], [0, 1, 0], clamp) : 0;
  const pov = sp(frame, pAt, { damping: 13, stiffness: 140 });
  return (
    <SceneShell id="magnet">
      <Person x={90} y={330} s={1.05} />
      <div style={{ position: "absolute", left: lerp(640, 230, fly), top: lerp(300, 610, fly), transform: `scale(${lerp(1.5, 0.75, fly)})` }}>
        <Img k="camera" w={150} />
      </div>
      {snap > 0 && <div style={{ position: "absolute", left: 200, top: 580, width: 170, height: 170, borderRadius: "50%", border: "8px solid #6CF3FF", opacity: snap, transform: `scale(${1 + (1 - snap)})` }} />}
      {frame >= cAt + 6 && (
        <div style={{ position: "absolute", left: 90, top: 870, ...slam(frame, cAt + 6, 2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "4px 20px 8px", borderRadius: 14 }}>
            <LineIcon name="magnet" size={44} stroke={8} color={COLORS.blue} />CLIC !
          </div>
        </div>
      )}
      {/* point-of-view frame */}
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 520, top: 380, width: 420, height: 560, borderRadius: 30, border: "6px solid #fff", background: "linear-gradient(180deg,#7fd3ff,#c9f0ff)", overflow: "hidden", transform: `scale(${pov})`, boxShadow: "0 20px 50px rgba(6,14,90,0.45)" }}>
          <svg viewBox="0 0 210 280" width={420} height={560} style={{ position: "absolute", inset: 0 }}>
            <circle cx={160} cy={50} r={16} fill="#FFE07A" />
            <path d="M0 170 L50 110 L90 150 L130 90 L210 160 V280 H0 Z" fill="#2f6fd6" />
            <path d="M0 210 Q 60 196 105 210 T 210 205 V280 H0 Z" fill="#1e4fb0" />
          </svg>
          <div style={{ position: "absolute", left: 14, top: 12, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "#fff", background: "#FF3B5C", padding: "2px 12px", borderRadius: 999 }}>● POV</div>
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={sAt} text="Mini & légère" icon="feather" size={34} />
        <Chip frame={frame} at={cAt} text="Fixation magnétique" icon="magnet" size={34} solid />
        <Chip frame={frame} at={hAt} text="Mains libres" icon="check" size={34} />
      </Row>
    </SceneShell>
  );
};

/** 13.0-17.0 s 4K video + stabilization: steady even when you run or move. */
export const GUVideo: React.FC = () => {
  const frame = useSceneFrame("video");
  const kAt = guev("vd.4k"), sAt = guev("vd.stab"), tAt = guev("vd.steady"), rAt = guev("vd.run");
  const steady = ramp(frame, tAt - 2, tAt + 6);
  const amp = frame < rAt ? 14 : 26;
  const bx = Math.sin(frame * 1.3) * amp, by = -Math.abs(Math.sin(frame * 0.9)) * amp;
  const j = 1 - steady;
  const W = 760, H = 428;
  return (
    <SceneShell id="video">
      {frame >= kAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center", ...slam(frame, kAt, 2.4) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, lineHeight: 1, color: COLORS.blue, background: "#fff", padding: "0 30px 8px", borderRadius: 28, boxShadow: "0 18px 44px rgba(6,14,90,0.45)" }}>4K</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 110, top: 480, transform: `translate(${bx}px, ${by}px) rotate(${Math.sin(frame * 0.8) * 8}deg)` }}>
        <Img k="camera" w={150} />
      </div>
      <div style={{ position: "absolute", left: 505 - W / 2 + 60, top: 660, width: W, height: H, borderRadius: 30, overflow: "hidden", border: "6px solid #fff", background: "linear-gradient(180deg,#7fd3ff,#c9f0ff)", boxShadow: "0 24px 50px rgba(6,14,90,0.45)" }}>
        <svg viewBox="0 0 320 180" width={W} height={H} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${Math.sin(frame * 1.7) * 26 * j}px, ${Math.cos(frame * 2.3) * 20 * j}px) rotate(${Math.sin(frame * 1.1) * 7 * j}deg) scale(1.12)` }}>
          <circle cx={250} cy={45} r={18} fill="#FFE07A" />
          <path d="M0 130 L70 60 L110 100 L160 40 L230 120 L270 90 L320 130 V180 H0 Z" fill="#2f6fd6" />
          <path d="M0 150 Q 80 136 160 150 T 320 148 V180 H0 Z" fill="#1e4fb0" />
        </svg>
        {frame >= tAt - 1 && (
          <div style={{ position: "absolute", right: 16, top: 14, ...slam(frame, tAt, 2.2) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: COLORS.blue, background: "#fff", padding: "4px 18px 8px", borderRadius: 14 }}>
              <LineIcon name="check" size={40} stroke={10} color="#2BD27A" />STABLE
            </div>
          </div>
        )}
      </div>
      <Row top={1130}>
        <Chip frame={frame} at={sAt} text="Stabilisation" icon="spark" size={36} solid />
        <Chip frame={frame} at={rAt} text="Même en courant" icon="run" size={36} />
      </Row>
    </SceneShell>
  );
};

/** 17.0-21.5 s Action Pod with a flip screen to see yourself while filming; camera waterproof to 10 m. */
export const GUPod: React.FC = () => {
  const frame = useSceneFrame("pod");
  const pAt = guev("pd.pod"), fAt = guev("pd.flip"), sAt = guev("pd.self"), wAt = guev("pd.water");
  const enter = sp(frame, guscene("pod").from, { damping: 13, stiffness: 120 });
  const flipped = frame >= fAt;
  const turn = ramp(frame, fAt - 3, fAt + 6);
  const surf = interpolate(frame, [wAt - 4, wAt + 12], [1980, 860], { ...clamp, easing: easeOut });
  const t = frame / 30;
  const wave = Array.from({ length: 13 }, (_, i) => `${i === 0 ? "M" : "L"} ${i * 90} ${Math.sin(i * 0.9 + t * 3) * 12}`).join(" ");
  const m = Math.round(10 * easeOut(ramp(frame, wAt, wAt + 12)));
  return (
    <SceneShell id="pod">
      <Title frame={frame} at={pAt} pill size={56}>Action Pod</Title>
      <div style={{ position: "absolute", left: 505 - 250 + 40, top: 360, transform: `translateX(${(1 - enter) * 900}px) rotateY(${(1 - Math.abs(turn * 2 - 1)) * 70}deg)` }}>
        <Img k={flipped ? "kit" : "pod"} w={flipped ? 420 : 500} />
      </div>
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 80, top: 420, transform: `scale(${pop(frame, sAt)})`, display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 36, padding: "6px 22px 10px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
          <LineIcon name="eye" size={42} stroke={8} color={COLORS.blue} />Tu te vois
        </div>
      )}
      {frame >= wAt - 4 && (
        <div style={{ position: "absolute", left: 0, top: surf, width: 1080, height: 1920, background: "linear-gradient(180deg, rgba(40,200,255,0.5), rgba(10,60,190,0.72))" }}>
          <svg width={1080} height={40} style={{ position: "absolute", left: 0, top: -12, overflow: "visible" }}><path d={wave} stroke="#fff" strokeWidth={6} fill="none" opacity={0.85} /></svg>
        </div>
      )}
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 80, top: 880, ...slam(frame, wAt, 2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, lineHeight: 1, color: "#fff", textShadow }}>{m}<span style={{ fontSize: "0.4em" }}> m</span></div>
        </div>
      )}
      <Row top={1100}>
        <Chip frame={frame} at={fAt} text="Écran orientable" icon="display" size={34} solid />
        <Chip frame={frame} at={wAt} text="Caméra étanche 10 m" icon="dive" size={34} />
      </Row>
      <Footnote frame={frame} at={wAt + 4} top={1262} text="Étanchéité : la caméra seule (hors Action Pod)" />
    </SceneShell>
  );
};

/** 21.5-25.5 s Mini Tripod: selfie stick and tripod in one, with a remote to shoot from afar. */
export const GUTripod: React.FC = () => {
  const frame = useSceneFrame("tripod");
  const tAt = guev("tp.tripod"), sAt = guev("tp.stick"), lAt = guev("tp.legs"), rAt = guev("tp.remote");
  const enter = sp(frame, guscene("tripod").from, { damping: 13, stiffness: 120 });
  const remP = pop(frame, rAt);
  const beam = ramp(frame, rAt + 4, rAt + 12);
  return (
    <SceneShell id="tripod">
      <Title frame={frame} at={tAt} pill size={56}>Mini Tripod 2 en 1</Title>
      <div style={{ position: "absolute", left: 505 - 190 - 60, top: 360, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="tripod" w={380} />
      </div>
      {frame >= rAt - 1 && (
        <>
          <div style={{ position: "absolute", left: 760, top: 520, width: 110, height: 110, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${remP})`, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#FF3B5C" }} />
          </div>
          <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {[0, 1, 2].map((i) => <path key={i} d={`M ${740 - i * 30} ${560 - i * 30} A ${40 + i * 30} ${40 + i * 30} 0 0 0 ${740 - i * 30} ${600 + i * 30}`} stroke="#fff" strokeWidth={7} fill="none" opacity={beam * (1 - i * 0.25)} />)}
          </svg>
        </>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={sAt} text="Perche selfie" icon="camera" size={34} />
        <Chip frame={frame} at={lAt} text="Trépied" icon="mountain" size={34} />
        <Chip frame={frame} at={rAt} text="Télécommande" icon="signal" size={34} solid />
      </Row>
    </SceneShell>
  );
};
