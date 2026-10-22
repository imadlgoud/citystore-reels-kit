import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { a7ev, a7scene, LENS, OFFICIAL } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";
const SWATCH = { noir: "#2a2c31", vert: "#1f6b56", rose: "linear-gradient(135deg,#f3c9b8,#d9a07f)" };

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

/** official pair render (back + front) */
const Pair: React.FC<{ k: "black" | "green"; w: number; sweep?: number }> = ({ k, w, sweep = -1 }) => (
  <div style={{ filter: SHADOW }}>
    <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
  </div>
);

/*
 * 0.0-2.5 s HOOK ("want a new Samsung at a good price? here it is!")
 * visual: a price tag with "€€€" flips to a green "BON PRIX", then the Galaxy A07 slams in under a burst.
 */
export const A7Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const nAt = a7ev("hook.new"), pAt = a7ev("hook.price"), hAt = a7ev("hook.here");
  const sk = shake(frame, hAt, 16, 12);
  const tag = sp(frame, 2, { damping: 10, stiffness: 160 });
  const flip = ramp(frame, pAt - 2, pAt + 6);
  const phone = slam(frame, hAt, 2.6);
  const tagOut = ramp(frame, hAt, hAt + 8);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={520} r={900} rot={frame * 0.8} opacity={0.22 * ramp(frame, hAt, hAt + 6)} rays={20} />
      {frame >= nAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 230, display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, nAt, 2), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#fff", textShadow, whiteSpace: "nowrap" }}>
            SAMSUNG <span style={{ background: "#fff", color: COLORS.blue, padding: "0 18px 6px", borderRadius: 16, textShadow: "none", fontSize: 54 }}>NEUF</span>
          </div>
        </div>
      )}
      {/* price tag: €€€ -> BON PRIX */}
      {tagOut < 1 && (
        <div style={{ position: "absolute", left: 505 - 190, top: 420, transformOrigin: "50% 0%", transform: `scale(${tag * (1 - tagOut)}) rotate(${Math.sin(frame * 0.3) * 6 * Math.exp(-frame / 40)}deg) rotateY(${flip * 180}deg)` }}>
          <div style={{ width: 380, height: 200, borderRadius: 28, border: "6px solid #fff", background: flip < 0.5 ? "#FF3B5C" : "linear-gradient(90deg,#2BD96B,#1FB85A)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: flip < 0.5 ? 96 : 66, color: "#fff", boxShadow: "0 18px 44px rgba(6,14,90,0.45)", transform: flip >= 0.5 ? "scaleX(-1)" : undefined }}>
            {flip < 0.5 ? "€€€" : "BON PRIX"}
          </div>
        </div>
      )}
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 505 - 145, top: 315, ...phone }}>
          <Pair k="black" w={290} sweep={interpolate(frame, [hAt + 4, hAt + 20], [-0.3, 1.3], clamp)} />
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - hAt, [0, 1, 6], [0, 0.6, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 2.5-8.0 s INTRO: Samsung Galaxy A07, 4GB RAM, 64GB, DISPONIBLE. */
export const A7Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = a7ev("intro.name"), rAt = a7ev("intro.ram"), sAt = a7ev("intro.sto"), dAt = a7ev("intro.dispo");
  const enter = sp(frame, a7scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const t = frame / 30;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={760} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 36, letterSpacing: 10 }}>SAMSUNG</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...slam(frame, nAt + 4, 2.2) }}>
          <span style={{ fontSize: 88 }}>Galaxy</span>
          <span style={{ fontSize: 92, color: COLORS.blue, background: "#fff", padding: "0 22px 4px", borderRadius: 18, textShadow: "none" }}>A07</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 505 - 270, top: 450, transform: `translateX(${(1 - enter) * -1000}px) translateY(${Math.sin(t * Math.PI) * 8}px) rotate(${lerp(-12, 0, enter)}deg)` }}>
        <Pair k="black" w={540} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1100} left={300}>
        <Chip frame={frame} at={rAt} text="4GB RAM" icon="chip" size={40} solid />
        <Chip frame={frame} at={sAt} text="64GB" icon="box" size={40} solid />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", background: "#2BD96B", padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={44} stroke={7} color="#fff" />
            DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 8.0-12.0 s big 6.7" screen: videos and social media. */
export const A7Screen: React.FC = () => {
  const frame = useSceneFrame("screen");
  const zAt = a7ev("sc.size"), vAt = a7ev("sc.video"), sAt = a7ev("sc.social");
  const enter = sp(frame, a7scene("screen").from, { damping: 13, stiffness: 120 });
  const inch = (6.7 * easeOut(ramp(frame, zAt, zAt + 14))).toFixed(1);
  const BUBBLES: { icon: IconName; x: number; y: number; d: number }[] = [
    { icon: "heart", x: 140, y: 430, d: 0 }, { icon: "chat", x: 120, y: 640, d: 4 }, { icon: "camera", x: 190, y: 840, d: 8 },
  ];
  return (
    <SceneShell id="screen">
      <div style={{ position: "absolute", left: 430, top: 400, transform: `translateX(${(1 - enter) * 800}px) rotate(3deg)` }}>
        <Pair k="black" w={480} sweep={interpolate(frame, [zAt, zAt + 16], [-0.3, 1.3], clamp)} />
        {frame >= vAt - 1 && (
          <div style={{ position: "absolute", left: 480 * 0.73 - 70, top: 480 * OFFICIAL.black.aspect * 0.45 - 70, transform: `scale(${pop(frame, vAt)})` }}>
            <div style={{ width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(6,14,90,0.4)" }}>
              <LineIcon name="play" size={100} stroke={7} color={COLORS.blue} />
            </div>
          </div>
        )}
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 70, top: 250, display: "flex", flexDirection: "column", alignItems: "flex-start", fontFamily: FONT, color: "#fff", ...slam(frame, zAt, 2) }}>
          <div style={{ fontWeight: 900, fontSize: 150, lineHeight: 1, textShadow }}>{inch}<span style={{ fontSize: "0.4em" }}>"</span></div>
          <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: 3 }}>GRAND ÉCRAN</div>
        </div>
      )}
      {frame >= sAt - 1 && BUBBLES.map((b, i) => (
        <div key={i} style={{ position: "absolute", left: b.x, top: b.y + Math.sin(frame * 0.12 + i) * 10, width: 110, height: 110, borderRadius: "50%", background: i === 0 ? "#FF3B5C" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, sAt + b.d)})`, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
          <LineIcon name={b.icon} size={64} stroke={8} color={i === 0 ? "#fff" : COLORS.blue} />
        </div>
      ))}
      <Row top={1100}>
        <Chip frame={frame} at={vAt} text="Vidéos" icon="play" size={38} />
        <Chip frame={frame} at={sAt} text="Réseaux sociaux" icon="chat" size={38} solid />
      </Row>
    </SceneShell>
  );
};

/** 12.0-16.25 s 50 MP camera + 5000 mAh battery that lasts all day. */
export const A7CamBat: React.FC = () => {
  const frame = useSceneFrame("cambat");
  const cAt = a7ev("cb.cam"), bAt = a7ev("cb.bat"), dAt = a7ev("cb.day");
  const enter = sp(frame, a7scene("cambat").from, { damping: 13, stiffness: 120 });
  const W = 460, H = W * OFFICIAL.black.aspect, X = 70, Y = 320;
  const mp = Math.round(50 * easeOut(ramp(frame, cAt, cAt + 12)));
  const mah = Math.round((5000 * easeOut(ramp(frame, bAt, bAt + 14))) / 50) * 50;
  const fill = easeOut(ramp(frame, bAt, bAt + 18));
  const flash = interpolate(frame, [cAt + 2, cAt + 3, cAt + 10], [0, 1, 0], clamp);
  const ring = ramp(frame, cAt, cAt + 12);
  const sun = ramp(frame, dAt, dAt + 20);
  return (
    <SceneShell id="cambat">
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateX(${(1 - enter) * -800}px) rotate(-3deg)` }}>
        <Pair k="black" w={W} />
        {/* lens ring + flash */}
        <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <circle cx={LENS.x * W} cy={LENS.y * H} r={70} fill="none" stroke="#6CF3FF" strokeWidth={8} strokeDasharray={`${440 * ring} 440`} transform={`rotate(-90 ${LENS.x * W} ${LENS.y * H})`} />
          <circle cx={LENS.x * W} cy={LENS.y * H} r={90} fill="#fff" opacity={flash * 0.9} />
        </svg>
      </div>
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 590, top: 300, ...slam(frame, cAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 80, padding: "4px 28px 10px", borderRadius: 24, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="camera" size={80} stroke={8} color={COLORS.blue} />
            {mp} <span style={{ fontSize: 40 }}>MP</span>
          </div>
        </div>
      )}
      {frame >= bAt - 1 && (
        <div style={{ position: "absolute", left: 580, top: 520, transform: `scale(${pop(frame, bAt)})`, transformOrigin: "left center" }}>
          <div style={{ position: "relative", width: 340, height: 150, borderRadius: 30, border: "10px solid #fff", padding: 10, background: "rgba(6,14,90,0.2)", boxShadow: "0 18px 44px rgba(6,14,90,0.35)" }}>
            <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 16, background: "linear-gradient(90deg,#2BD96B,#9CFFB8)" }} />
            <div style={{ position: "absolute", right: -32, top: 44, width: 20, height: 52, borderRadius: 6, background: "#fff" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, color: COLORS.navy }}>
              <span style={{ fontWeight: 900, fontSize: 64 }}>{mah}</span><span style={{ fontWeight: 900, fontSize: 30 }}>mAh</span>
            </div>
          </div>
        </div>
      )}
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 600, top: 730, width: 320, height: 160, opacity: ramp(frame, dAt, dAt + 6) }}>
          <svg width={320} height={160} viewBox="0 0 320 160" style={{ overflow: "visible" }}>
            <path d="M20 140 A 140 120 0 0 1 300 140" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={5} strokeDasharray="6 12" />
          </svg>
          <div style={{ position: "absolute", left: 160 + Math.cos(Math.PI * (1 - sun)) * 140 - 30, top: 140 - Math.sin(Math.PI * (1 - sun)) * 120 - 30 }}>
            <LineIcon name={sun < 0.85 ? "sun" : "moon"} size={60} stroke={7} color="#FFE9A0" />
          </div>
        </div>
      )}
      <Row top={1100}>
        <Chip frame={frame} at={cAt} text="50 MP" icon="camera" size={38} />
        <Chip frame={frame} at={bAt} text="5000 mAh" icon="battery" size={38} solid />
        <Chip frame={frame} at={dAt} text="Toute la journée" icon="sun" size={38} />
      </Row>
      <Footnote frame={frame} at={dAt + 4} top={1262} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};

/** 16.25-20.0 s Android updates for many years: the phone stays like new over time. */
export const A7Updates: React.FC = () => {
  const frame = useSceneFrame("updates");
  const uAt = a7ev("up.updates"), yAt = a7ev("up.years"), nAt = a7ev("up.new");
  const enter = sp(frame, a7scene("updates").from, { damping: 13, stiffness: 120 });
  const prog = ramp(frame, uAt, uAt + 24, (x) => x);
  const spin = frame * 6;
  return (
    <SceneShell id="updates">
      <Title frame={frame} at={uAt} pill size={56}>
        <LineIcon name="power" size={60} stroke={8} color={COLORS.blue} />
        Mises à jour Android
      </Title>
      <div style={{ position: "absolute", left: 505 - 230, top: 400, transform: `scale(${enter})` }}>
        <div style={{ width: 460, height: 360, borderRadius: 44, background: "#fff", boxShadow: "0 24px 60px rgba(6,14,90,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, fontFamily: FONT, color: COLORS.navy }}>
          <svg width={130} height={130} viewBox="0 0 100 100" style={{ transform: `rotate(${prog < 1 ? spin : 0}deg)` }}>
            <circle cx={50} cy={50} r={40} fill="none" stroke="#e4e7f2" strokeWidth={10} />
            <circle cx={50} cy={50} r={40} fill="none" stroke={prog < 1 ? COLORS.blue : "#2BD96B"} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${251 * Math.max(0.05, prog)} 251`} transform="rotate(-90 50 50)" />
            {prog >= 1 && <path d="M 32 52 L 45 65 L 70 38" stroke="#2BD96B" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
          <div style={{ width: 340, height: 18, borderRadius: 9, background: "#e4e7f2", overflow: "hidden" }}>
            <div style={{ width: `${prog * 100}%`, height: "100%", background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})` }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: 34 }}>{prog < 1 ? "Mise à jour…" : "À jour ✓"}</div>
        </div>
      </div>
      <Row top={1100}>
        <Chip frame={frame} at={yAt} text="Pendant des années" icon="stopwatch" size={38} />
        <Chip frame={frame} at={nAt} text="Reste comme neuf" icon="spark" size={38} solid />
      </Row>
    </SceneShell>
  );
};

/** 20.0-23.0 s three colours: Noir, Vert, Rose doré (only black and green official images were supplied). */
export const A7Colors: React.FC = () => {
  const frame = useSceneFrame("colors");
  const tAt = a7ev("co.three"), nAt = a7ev("co.noir"), vAt = a7ev("co.vert"), rAt = a7ev("co.rose");
  const enter = sp(frame, a7scene("colors").from, { damping: 13, stiffness: 120 });
  const greenIn = sp(frame, tAt, { damping: 12, stiffness: 140 });
  const sw = (at: number, c: string, label: string, i: number) => {
    if (frame < at - 1) return null;
    const p = pop(frame, at);
    return (
      <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${p})` }}>
        <div style={{ width: 120, height: 120, borderRadius: "50%", background: c, border: "8px solid #fff", boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }} />
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", textShadow, whiteSpace: "nowrap" }}>{label}</div>
      </div>
    );
  };
  return (
    <SceneShell id="colors">
      <Title frame={frame} at={tAt} pill size={58}>3 COULEURS</Title>
      <div style={{ position: "absolute", left: 100, top: 380, transform: `translateX(${(1 - enter) * -800}px) rotate(-6deg) scale(${frame >= nAt ? 1 + 0.04 * Math.sin((frame - nAt) * 0.3) * Math.exp(-(frame - nAt) / 10) : 1})` }}>
        <Pair k="black" w={400} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 410, transform: `translateX(${(1 - greenIn) * 800}px) rotate(6deg)` }}>
        <Pair k="green" w={400} />
      </div>
      <div style={{ position: "absolute", left: 300, right: 120, top: 920, display: "flex", justifyContent: "space-around" }}>
        {sw(nAt, SWATCH.noir, "Noir", 0)}
        {sw(vAt, SWATCH.vert, "Vert", 1)}
        {sw(rAt, SWATCH.rose, "Rose doré", 2)}
      </div>
    </SceneShell>
  );
};
