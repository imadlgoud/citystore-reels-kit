import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { d2ev, d2scene, OFFICIAL } from "./timeline";

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

const GREEN = "#2BD96B";

/** big screen-size readout: 5,4″ / 7,6″ */
const Size: React.FC<{ frame: number; at: number; value: string; label: string; left: number; top: number; size?: number }> = ({ frame, at, value, label, left, top, size = 130 }) =>
  frame < at - 1 ? null : (
    <div style={{ position: "absolute", left, top, display: "flex", flexDirection: "column", alignItems: "center", ...slam(frame, at, 2.2), fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow, whiteSpace: "nowrap" }}>
      <div style={{ fontSize: size, lineHeight: 1 }}>{value}<span style={{ fontSize: "0.55em" }}>″</span></div>
      <div style={{ fontSize: size * 0.27, letterSpacing: 2 }}>{label}</div>
    </div>
  );

/** drawn fingerprint (Touch ID) */
const Fingerprint: React.FC<{ size: number; p: number; color: string }> = ({ size, p, color }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    {[12, 20, 28, 36].map((r, i) => (
      <path key={r} d={`M ${50 - r} ${62} A ${r} ${r + 6} 0 0 1 ${50 + r} ${62} V ${70 + i * 4}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, p * 1.4 - i * 0.12))} />
    ))}
    <path d="M50 52 V 86" stroke={color} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>
);

/*
 * 0.0-3.5 s HOOK ("the first iPhone that folds... now in two colours at City Store!")
 * visual: the folded phone (back) turns, the Star White phone unfolds, then the Night Sky one slides in beside it.
 */
export const D2Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const fAt = d2ev("hook.fold"), tAt = d2ev("hook.two"), hAt = d2ev("hook.here");
  const two = interpolate(frame, [tAt - 2, tAt + 8], [0, 1], { ...clamp, easing: easeOut });
  const turn = ramp(frame, fAt - 2, fAt + 8);
  const opened = frame >= fAt + 8;
  const o = sp(frame, fAt + 8, { damping: 11, stiffness: 160 });
  const sk = shake(frame, fAt + 8, 12, 8);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={600} r={900} rot={frame * 0.6} opacity={0.18 * ramp(frame, fAt + 8, fAt + 14)} rays={20} />
      {!opened ? (
        <div style={{ position: "absolute", left: 560 - 130, top: 390, transform: `scale(${pop(frame, 1)}) rotateY(${turn * 80}deg)` }}>
          <Img k="back" w={260} />
        </div>
      ) : (
        <div style={{ position: "absolute", left: lerp(560 - 310, 120, two), top: lerp(400, 450, two), transform: `scale(${lerp(0.5, 1, o)}) rotateY(${(1 - o) * -60}deg)` }}>
          <Img k="open" w={lerp(620, 420, two)} sweep={interpolate(frame, [fAt + 10, fAt + 28], [-0.3, 1.3], clamp)} />
        </div>
      )}
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 540, top: 450, transform: `translateX(${(1 - sp(frame, tAt, { damping: 12, stiffness: 150 })) * 600}px)` }}>
          <Img k="night" w={410} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < hAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", textShadow, whiteSpace: "nowrap" }}>أول iPhone كيتطوى!</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, hAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "2px 34px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>دابا عند CITY STORE!</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - fAt - 8, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.5-6.75 s INTRO: iPhone Duo, 256GB, DISPONIBLE, Night Sky and Star White. */
export const D2Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = d2ev("intro.name"), sAt = d2ev("intro.storage"), dAt = d2ev("intro.dispo"), kAt = d2ev("intro.night"), cAt = d2ev("intro.color");
  const enter = sp(frame, d2scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const swatch = (at: number, label: string, bg: string) =>
    frame < at - 1 ? null : (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 24px", borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.75)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 34, whiteSpace: "nowrap", transform: `scale(${pop(frame, at)})` }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: bg, border: "3px solid #fff", boxShadow: "0 0 0 2px rgba(6,14,90,0.25)" }} />{label}
      </div>
    );
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <Title frame={frame} at={nAt} size={110}>iPhone Duo</Title>
      <div style={{ position: "absolute", left: 250, top: 440, transform: `translateX(${(1 - enter) * -900}px) rotate(-3deg) scale(${frame >= kAt && frame < cAt ? 1.04 : 1})` }}>
        <Img k="flat_night" w={300} sweep={interpolate(frame, [kAt, kAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 470, transform: `translateX(${(1 - enter) * 900}px) rotate(3deg) scale(${frame >= cAt ? 1.04 : 1})` }}>
        <Img k="flat_white" w={300} sweep={interpolate(frame, [cAt, cAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1000} left={300}>
        <Chip frame={frame} at={sAt} text="256GB" icon="chip" size={36} solid />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: GREEN, padding: "8px 22px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={42} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
        {swatch(kAt, "Night Sky", "#2b3447")}
        {swatch(cAt, "Star White", "#F4F2EC")}
      </Row>
    </SceneShell>
  );
};

/** 6.75-10.5 s folded: 5.4" screen, like a regular iPhone, in one hand. */
export const D2Folded: React.FC = () => {
  const frame = useSceneFrame("folded");
  const fAt = d2ev("fd.fold"), sAt = d2ev("fd.size"), hAt = d2ev("fd.hand");
  const enter = sp(frame, d2scene("folded").from, { damping: 13, stiffness: 120 });
  return (
    <SceneShell id="folded">
      <Title frame={frame} at={fAt} pill size={56}>Plié</Title>
      <div style={{ position: "absolute", left: 360, top: 340, transform: `translateX(${(1 - enter) * -900}px) rotate(${Math.sin(frame / 16) * 2}deg)` }}>
        <Img k="front" w={250} />
      </div>
      <Size frame={frame} at={sAt} value="5,4" label="POUCES" left={640} top={470} />
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 650, top: 760, transform: `scale(${pop(frame, hAt)})`, display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 34, padding: "6px 22px 10px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>
          <LineIcon name="phone" size={40} stroke={8} color={COLORS.blue} />Une seule main
        </div>
      )}
      <Footnote frame={frame} at={sAt + 6} top={1120} text="Écran extérieur · diagonale mesurée en rectangle" />
    </SceneShell>
  );
};

/** 10.5-15.75 s open: 7.6" screen, the biggest iPhone screen ever, for films, work and games. */
export const D2Open: React.FC = () => {
  const frame = useSceneFrame("open");
  const oAt = d2ev("op.open"), sAt = d2ev("op.size"), bAt = d2ev("op.big");
  const unfold = sp(frame, oAt, { damping: 13, stiffness: 110 });
  return (
    <SceneShell id="open">
      <Title frame={frame} at={oAt} pill size={56}>Ouvert</Title>
      <div style={{ position: "absolute", left: 560 - 320, top: 360, transform: `perspective(1400px) rotateY(${(1 - unfold) * 70}deg) scale(${lerp(0.7, 1, unfold)})` }}>
        <Img k="night" w={640} sweep={interpolate(frame, [bAt, bAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      <Size frame={frame} at={sAt} value="7,6" label="POUCES" left={560 - 120} top={790} size={110} />
      {frame >= bAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 975, display: "flex", justifyContent: "center", paddingLeft: 200 }}>
          <div style={{ ...slam(frame, bAt, 1.8), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 36, padding: "4px 26px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>Le plus grand écran d'iPhone</div>
        </div>
      )}
      <Row top={1080}>
        <Chip frame={frame} at={d2ev("op.films")} text="Films" icon="play" size={34} />
        <Chip frame={frame} at={d2ev("op.work")} text="Travail" icon="briefcase" size={34} />
        <Chip frame={frame} at={d2ev("op.games")} text="Jeux" icon="controller" size={34} />
      </Row>
      <Footnote frame={frame} at={sAt + 6} top={1200} text="Écran intérieur · diagonale mesurée en rectangle" />
    </SceneShell>
  );
};

/** 15.75-20.0 s A20 Pro chip, two 48 MP cameras, titanium design. */
export const D2Specs: React.FC = () => {
  const frame = useSceneFrame("specs");
  const cAt = d2ev("sp.chip"), mAt = d2ev("sp.cams"), tAt = d2ev("sp.ti");
  const enter = sp(frame, d2scene("specs").from, { damping: 13, stiffness: 120 });
  const flash = interpolate(frame - mAt, [0, 2, 10], [0, 1, 0], clamp);
  return (
    <SceneShell id="specs">
      <div style={{ position: "absolute", left: 560 - 165, top: 330, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="back" w={330} sweep={interpolate(frame, [tAt, tAt + 20], [-0.3, 1.3], clamp)} />
        {/* camera flash over the two lenses */}
        <div style={{ position: "absolute", left: 20, top: 20, width: 200, height: 110, borderRadius: 60, background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)", opacity: flash }} />
      </div>
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", paddingLeft: 200 }}>
          <div style={{ ...slam(frame, cAt, 2), display: "flex", alignItems: "center", gap: 12, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 56, padding: "2px 30px 8px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="chip" size={64} stroke={8} color={COLORS.blue} />A20 Pro
          </div>
        </div>
      )}
      <Row top={860}>
        <Chip frame={frame} at={mAt} text="2 caméras 48 MP" icon="camera" size={36} solid />
        <Chip frame={frame} at={tAt} text="Design en titane" icon="spark" size={36} />
      </Row>
    </SceneShell>
  );
};

/** 20.0-22.25 s eSIM, unlock with Touch ID. */
export const D2Secure: React.FC = () => {
  const frame = useSceneFrame("secure");
  const eAt = d2ev("sc.esim"), tAt = d2ev("sc.touch");
  const enter = sp(frame, d2scene("secure").from, { damping: 13, stiffness: 120 });
  const ok = frame >= tAt + 14;
  const card = (at: number, children: React.ReactNode, top: number) =>
    frame < at - 1 ? null : (
      <div style={{ position: "absolute", left: 580, top, width: 330, height: 220, borderRadius: 30, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${pop(frame, at)})`, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COLORS.blue }}>
        {children}
      </div>
    );
  return (
    <SceneShell id="secure">
      <div style={{ position: "absolute", left: 400, top: 330, transform: `translateX(${(1 - enter) * -900}px)` }}>
        <Img k="side" w={96} />
      </div>
      {card(eAt, <><LineIcon name="sim" size={100} stroke={7} color={COLORS.blue} progress={ramp(frame, eAt, eAt + 10)} />eSIM</>, 360)}
      {card(tAt, <><Fingerprint size={110} p={ramp(frame, tAt, tAt + 14)} color={ok ? GREEN : COLORS.blue} />Touch ID</>, 620)}
      <Footnote frame={frame} at={eAt + 6} top={1120} text="eSIM : vérifiez la compatibilité avec votre opérateur" />
    </SceneShell>
  );
};
