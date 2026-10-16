import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { useLayout } from "../../layout";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { FRONT_SCREEN, hev, hscene, LENS, OFFICIAL } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const HERO = OFFICIAL.hero;
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";

const Heading: React.FC<{ frame: number; at: number; title: string; P: boolean }> = ({ frame, at, title, P }) => {
  const h = sp(frame, at);
  return (
    <div style={{ position: "absolute", left: 0, right: P ? 70 : 0, top: P ? 232 : 40, textAlign: P ? "center" : "left", paddingLeft: P ? 0 : 40, fontFamily: FONT, fontWeight: 900, fontSize: P ? 60 : 44, color: "#fff", opacity: h, transform: `translateY(${(1 - h) * -40}px)`, textShadow: "0 4px 18px rgba(8,20,110,0.35)", whiteSpace: "nowrap" }}>
      {title}
    </div>
  );
};

const Chip: React.FC<{ frame: number; at: number; text: string; icon?: IconName; size: number; solid?: boolean }> = ({ frame, at, text, icon, size, solid }) => {
  if (frame < at - 1) return null;
  const p = sp(frame, at, { damping: 11, stiffness: 220, mass: 0.6 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.22}px ${size * 0.7}px`, borderRadius: 999, background: solid ? "#fff" : "rgba(255,255,255,0.18)", border: solid ? "none" : "3px solid rgba(255,255,255,0.75)", color: solid ? COLORS.blue : "#fff", fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", transform: `scale(${p})`, boxShadow: "0 12px 30px rgba(6,14,90,0.3)" }}>
      {icon ? <LineIcon name={icon} size={size * 1.2} stroke={7} color={solid ? COLORS.blue : "#fff"} progress={ramp(frame, at, at + 10)} /> : null}
      {text}
    </div>
  );
};

/** product-only cut-out of the HERO10 Black (City Store's own photo) with a light sweep */
const Cam: React.FC<{ w: number; sweep?: number; flash?: number }> = ({ w, sweep = -1, flash = 0 }) => (
  <div style={{ position: "relative", width: w, height: w * HERO.aspect, filter: "drop-shadow(0 30px 40px rgba(6,14,90,0.5))" }}>
    <ProductImage src={HERO.src} aspect={HERO.aspect} width={w} sweep={sweep} />
    {flash > 0 && <div style={{ position: "absolute", left: LENS.x * w - w * 0.5, top: LENS.y * w * HERO.aspect - w * 0.5, width: w, height: w, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 60%)", opacity: flash }} />}
  </div>
);

/** 6.5-10.25 s video in 5.3K, photos at 23 MP. */
export const HRes: React.FC = () => {
  const frame = useSceneFrame("res");
  const L = useLayout();
  const P = L.portrait;
  const vAt = hev("res.video"), kAt = hev("res.k"), pAt = hev("res.photo"), mAt = hev("res.mp");
  const G = P ? { cam: { x: 270, y: 300, w: 480 }, cards: { x: 90, y: 800, w: 380, h: 330, gap: 50 } } : { cam: { x: 60, y: 200, w: 440 }, cards: { x: 560, y: 120, w: 400, h: 250, gap: 40 } };
  const k = (5.3 * easeOut(ramp(frame, kAt, kAt + 14))).toFixed(1);
  const mp = Math.round(23 * easeOut(ramp(frame, mAt, mAt + 14)));
  const t = frame / 30;
  const card = (at: number, big: React.ReactNode, label: string, icon: IconName, solid: boolean, i: number) => {
    if (frame < at - 1) return null;
    const p = sp(frame, at, { damping: 11, stiffness: 200 });
    const left = P ? G.cards.x + i * (G.cards.w + G.cards.gap) : G.cards.x;
    const top = P ? G.cards.y : G.cards.y + i * (G.cards.h + G.cards.gap);
    return (
      <div style={{ position: "absolute", left, top, width: G.cards.w, height: G.cards.h, borderRadius: 40, background: solid ? "#fff" : "rgba(255,255,255,0.18)", border: solid ? "none" : "4px solid rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: solid ? COLORS.blue : "#fff", fontFamily: FONT, transform: `scale(${p}) rotate(${(i ? 3 : -3) * (1 - p)}deg)`, boxShadow: "0 20px 46px rgba(6,14,90,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 900, fontSize: G.cards.h * 0.12, letterSpacing: 3 }}>
          <LineIcon name={icon} size={G.cards.h * 0.16} stroke={7} color={solid ? COLORS.blue : "#fff"} />
          {label}
        </div>
        {big}
      </div>
    );
  };
  return (
    <SceneShell id="res">
      <div style={{ position: "absolute", left: G.cam.x, top: G.cam.y, transform: `translateY(${Math.sin(t * Math.PI) * 8}px) scale(${lerp(0.8, 1, sp(frame, hscene("res").from))})` }}>
        <Cam w={G.cam.w} sweep={interpolate(frame, [kAt, kAt + 16], [-0.3, 1.3], clamp)} flash={interpolate(frame, [pAt, pAt + 1, pAt + 10], [0, 1, 0], clamp)} />
      </div>
      {frame >= vAt - 1 && frame < pAt + 4 && (
        <div style={{ position: "absolute", left: G.cam.x + G.cam.w * 0.05, top: G.cam.y - 10, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: P ? 30 : 24, color: "#fff", background: "#FF3B5C", padding: "4px 16px", borderRadius: 999, transform: `scale(${pop(frame, vAt)})`, opacity: Math.floor(frame / 8) % 2 ? 1 : 0.75 }}>
          ● REC
        </div>
      )}
      {card(kAt, <div style={{ fontWeight: 900, fontSize: G.cards.h * 0.42, lineHeight: 1 }}>{k}<span style={{ fontSize: "0.55em" }}>K</span></div>, "VIDÉO", "camera", true, 0)}
      {card(mAt, <div style={{ fontWeight: 900, fontSize: G.cards.h * 0.42, lineHeight: 1 }}>{mp}<span style={{ fontSize: "0.45em" }}> MP</span></div>, "PHOTO", "lens", false, 1)}
    </SceneShell>
  );
};

/** drawn landscape inside a viewfinder: stays level (HyperSmooth) while the camera shakes */
const Viewfinder: React.FC<{ w: number; frame: number; jitter: number; steady: number }> = ({ w, frame, jitter, steady }) => {
  const h = w * 0.5625;
  const j = jitter * (1 - steady);
  const dx = Math.sin(frame * 1.7) * 26 * j, dy = Math.cos(frame * 2.3) * 20 * j, rot = Math.sin(frame * 1.1) * 7 * j;
  return (
    <div style={{ width: w, height: h, borderRadius: 30, overflow: "hidden", border: "6px solid #fff", background: "linear-gradient(180deg, #7fd3ff, #c9f0ff)", position: "relative", boxShadow: "0 24px 50px rgba(6,14,90,0.45)" }}>
      <svg viewBox="0 0 320 180" width={w} height={h} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(1.12)` }}>
        <circle cx={250} cy={45} r={18} fill="#FFE07A" />
        <path d="M0 130 L70 60 L110 100 L160 40 L230 120 L270 90 L320 130 V180 H0 Z" fill="#2f6fd6" />
        <path d="M150 52 L160 40 L170 52 L163 50 L157 55 Z" fill="#fff" />
        <path d="M0 150 Q 80 136 160 150 T 320 148 V180 H0 Z" fill="#1e4fb0" />
        <path d="M150 180 L170 150 L190 180" fill="none" stroke="#fff" strokeWidth={3} opacity={0.6} />
      </svg>
      <div style={{ position: "absolute", left: 16, top: 12, fontFamily: FONT, fontWeight: 900, fontSize: w * 0.045, color: "#fff", background: "#FF3B5C", padding: "2px 12px", borderRadius: 999 }}>● 00:13</div>
      <svg viewBox="0 0 320 180" width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M150 90 H170 M160 80 V100" stroke="#fff" strokeWidth={2.5} opacity={0.9} />
        <path d="M8 30 V8 H30 M290 8 H312 V30 M312 150 V172 H290 M30 172 H8 V150" stroke="#fff" strokeWidth={3} fill="none" />
      </svg>
    </div>
  );
};

/** 10.25-14.25 s HyperSmooth: the footage stays steady while you run, jump or fall. */
export const HSmooth: React.FC = () => {
  const frame = useSceneFrame("smooth");
  const L = useLayout();
  const P = L.portrait;
  const tAt = hev("sm.title"), sAt = hev("sm.steady"), rAt = hev("sm.run"), jAt = hev("sm.jump"), fAt = hev("sm.fall");
  const G = P ? { cam: { x: 330, y: 320, w: 400 }, vf: { x: 140, y: 730, w: 760 }, chips: 1205 } : { cam: { x: 60, y: 170, w: 360 }, vf: { x: 470, y: 160, w: 560 }, chips: 520 };
  // camera bumps around: harder on run / jump / fall
  const amp = frame < rAt ? 10 : frame < jAt ? 22 : frame < fAt ? 36 : 44;
  const bx = Math.sin(frame * 1.3) * amp, by = -Math.abs(Math.sin(frame * 0.9)) * amp * 1.4 + (frame >= fAt ? interpolate(frame, [fAt, fAt + 5, fAt + 12], [0, 80, 30], clamp) : 0);
  const br = Math.sin(frame * 0.8) * amp * 0.4 + (frame >= fAt ? interpolate(frame, [fAt, fAt + 6], [0, 30], clamp) : 0);
  const steady = ramp(frame, sAt - 2, sAt + 6);
  const enter = sp(frame, tAt, { damping: 13, stiffness: 120 });
  return (
    <SceneShell id="smooth">
      <Heading frame={frame} at={tAt} title="HyperSmooth" P={P} />
      <div style={{ position: "absolute", left: G.cam.x, top: G.cam.y, transform: `translate(${bx}px, ${by}px) rotate(${br}deg) scale(${enter})` }}>
        <Cam w={G.cam.w} />
      </div>
      <div style={{ position: "absolute", left: G.vf.x, top: G.vf.y, transform: `translateY(${(1 - enter) * 700}px)` }}>
        <Viewfinder w={G.vf.w} frame={frame} jitter={1} steady={steady} />
        {frame >= sAt - 1 && (
          <div style={{ position: "absolute", right: -10, top: -34, ...slam(frame, sAt, 2.2) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, transform: "rotate(-6deg)", fontFamily: FONT, fontWeight: 900, fontSize: P ? 40 : 32, color: COLORS.blue, background: "#fff", padding: "4px 22px 8px", borderRadius: 16, boxShadow: "0 12px 30px rgba(6,14,90,0.4)" }}>
              <LineIcon name="check" size={P ? 44 : 34} stroke={10} color="#2BD27A" />
              STABLE
            </div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: P ? 340 : 470, right: P ? 70 : 40, top: G.chips, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        <Chip frame={frame} at={rAt} text="Course" icon="run" size={P ? 38 : 30} />
        <Chip frame={frame} at={jAt} text="Sauts" icon="spark" size={P ? 38 : 30} />
        <Chip frame={frame} at={fAt} text="Chutes" icon="bolt" size={P ? 38 : 30} solid />
      </div>
    </SceneShell>
  );
};


/** small honest footnote under a claim (kept clear of Citybot and the subtitles) */
const Footnote: React.FC<{ frame: number; at: number; text: string; top: number }> = ({ frame, at, text, top }) =>
  frame < at ? null : (
    <div style={{ position: "absolute", left: 340, right: 130, top, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, lineHeight: 1.25, color: "#fff", opacity: 0.88 * ramp(frame, at, at + 8), textShadow: "0 4px 14px rgba(8,20,110,0.45)" }}>
      {text}
    </div>
  );

/*
 * 0.0-3.0 s HOOK ("want a powerful GoPro without paying the price of a new one?")
 * visual: the camera slams in, "PUISSANTE" stamp; a "PRIX DU NEUF" price tag swings in and gets crossed out.
 */
export const HHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const gAt = hev("hook.gopro"), sAt = hev("hook.strong"), pAt = hev("hook.price"), xAt = hev("hook.cross");
  const sk = shake(frame, gAt, 18, 12);
  const sk2 = shake(frame, xAt, 12, 9);
  const cam = slam(frame, gAt, 2.6);
  const tag = sp(frame, pAt, { damping: 9, stiffness: 160 });
  const cross = ramp(frame, xAt, xAt + 6);
  return (
    <SceneShell id="hook" shakeX={sk.x + sk2.x} shakeY={sk.y + sk2.y}>
      <Burst x={505} y={430} r={900} rot={frame * 0.8} opacity={0.22 * ramp(frame, gAt, gAt + 6)} rays={20} />
      {frame >= gAt - 1 && (
        <div style={{ position: "absolute", left: 505 - 210 - 90, top: 300, ...cam }}>
          <Cam w={420} sweep={interpolate(frame, [gAt + 4, gAt + 20], [-0.3, 1.3], clamp)} />
        </div>
      )}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, sAt, 2.2), display: "flex", alignItems: "center", gap: 14, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 54, padding: "4px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="bolt" size={58} stroke={8} color={COLORS.blue} />
            PUISSANTE
          </div>
        </div>
      )}
      {/* price tag of a new one, swinging on its string, then crossed out */}
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 360, transformOrigin: "30px 0px", transform: `scale(${tag}) rotate(${Math.sin((frame - pAt) * 0.35) * 12 * Math.exp(-(frame - pAt) / 30) + 8}deg)` }}>
          <svg width={300} height={240} viewBox="0 0 300 240" style={{ overflow: "visible" }}>
            <path d="M30 0 L60 60" stroke="#fff" strokeWidth={5} />
            <path d="M60 60 L260 60 Q290 60 290 90 L290 200 Q290 230 260 230 L60 230 L20 145 Z" fill="#fff" stroke={COLORS.navy} strokeWidth={4} />
            <circle cx={62} cy={145} r={12} fill="none" stroke={COLORS.navy} strokeWidth={5} />
            <text x={175} y={128} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill={COLORS.navy}>PRIX</text>
            <text x={175} y={172} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill={COLORS.navy}>DU NEUF</text>
            {cross > 0 && <path d={`M 50 80 L ${50 + 230 * cross} ${80 + 140 * cross}`} stroke="#FF3B5C" strokeWidth={16} strokeLinecap="round" />}
            {cross > 0.5 && <path d={`M 280 80 L ${280 - 230 * (cross - 0.5) * 2} ${80 + 140 * (cross - 0.5) * 2}`} stroke="#FF3B5C" strokeWidth={16} strokeLinecap="round" />}
          </svg>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - gAt, [0, 1, 7], [0, 0.6, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.0-6.5 s INTRO: GoPro HERO10 Black, OCCASION, DISPONIBLE. */
export const HIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = hev("intro.name"), uAt = hev("intro.used"), dAt = hev("intro.dispo");
  const enter = sp(frame, hscene("intro").from, { damping: 12, stiffness: 120, mass: 0.8 });
  const sk = shake(frame, nAt, 14, 9);
  const t = frame / 30;
  const W = 640;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={760} r={900} rot={frame * 0.6} opacity={0.18 * sp(frame, nAt)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow: "0 10px 30px rgba(8,20,110,0.4)" }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 50, letterSpacing: 6 }}>GoPro</div>
        <div style={{ ...slam(frame, nAt + 5, 2.2), fontSize: 96, lineHeight: 1 }}>HERO10</div>
        <div style={{ ...slam(frame, nAt + 9, 2), fontSize: 46, letterSpacing: 14, background: "#fff", color: "#111", padding: "0 18px 6px 32px", borderRadius: 10, textShadow: "none", marginTop: 8 }}>BLACK</div>
      </div>
      <div style={{ position: "absolute", left: 505 - W / 2, top: 600, transform: `translateX(${(1 - enter) * -1000}px) translateY(${Math.sin(t * Math.PI) * 10}px) rotate(${lerp(-14, 0, enter) + Math.sin(t * 2) * 1.5}deg)` }}>
        <Cam w={W} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= uAt - 1 && (
        <div style={{ position: "absolute", right: 120, top: 560, ...slam(frame, uAt, 2.4) }}>
          <div style={{ transform: "rotate(-8deg)", background: "linear-gradient(90deg,#FFB020,#FF7A1A)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "4px 26px 10px", borderRadius: 16, boxShadow: "0 16px 40px rgba(80,30,0,0.45)", letterSpacing: 2 }}>OCCASION</div>
        </div>
      )}
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 340, right: 130, top: 1130, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: "#2BD96B", padding: "8px 26px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={48} stroke={7} color="#fff" />
            DISPONIBLE
          </div>
        </div>
      )}
    </SceneShell>
  );
};

/** 14.25-18.75 s waterproof to 10 m, + a front screen to see yourself while filming. */
export const HWater: React.FC = () => {
  const frame = useSceneFrame("water");
  const L = useLayout();
  const dAt = hev("wt.dive"), mAt = hev("wt.m"), scAt = hev("wt.screen"), selfAt = hev("wt.self"), fAt = hev("wt.film");
  const from = hscene("water").from;
  const G = { surf: 640, cam: { x: 230, y: 470, w: 560 }, depth: 250 };
  const up = ramp(frame, scAt - 4, scAt + 10); // camera comes out of the water for the front screen
  const surf = interpolate(frame, [from, dAt + 10], [L.h + 40, G.surf], { ...clamp, easing: easeOut }) + up * 1400;
  const meters = Math.round(10 * easeOut(ramp(frame, mAt, mAt + 14)));
  const sink = interpolate(frame, [dAt, dAt + 14], [-140, 120], { ...clamp, easing: easeOut }) * (1 - up);
  const t = frame / 30;
  const wave = Array.from({ length: 13 }, (_, i) => `${i === 0 ? "M" : "L"} ${i * (L.w / 12)} ${Math.sin(i * 0.9 + t * 3) * 12}`).join(" ");
  const bubbles = Array.from({ length: 12 }).map((_, k) => {
    const life = ((frame * 2 + k * 37) % 260) / 260;
    const bx = G.cam.x + 60 + ((k * 83) % (G.cam.w - 60));
    const by = G.cam.y + sink + G.cam.w * HERO.aspect - life * 420;
    if (by < surf + 20) return null;
    return <div key={k} style={{ position: "absolute", left: bx + Math.sin(life * 12 + k) * 10, top: by, width: 10 + (k % 3) * 6, height: 10 + (k % 3) * 6, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.8)", opacity: ramp(frame, dAt, dAt + 8) * (1 - up) }} />;
  });
  const camW = lerp(G.cam.w, 680, up);
  const camX = lerp(G.cam.x, 505 - 340 + 40, up), camY = lerp(G.cam.y + sink, 380, up);
  const [x0, y0, x1, y1] = FRONT_SCREEN;
  const camH = camW * HERO.aspect;
  const selfP = pop(frame, selfAt);
  const rec = frame >= fAt && Math.floor(frame / 8) % 2 === 0;
  return (
    <SceneShell id="water">
      <div style={{ position: "absolute", left: camX, top: camY, transform: `rotate(${Math.sin(t * 2) * 3 * (1 - up)}deg)` }}>
        <Cam w={camW} sweep={interpolate(frame, [mAt, mAt + 16], [-0.3, 1.3], clamp)} />
        {/* the front screen lights up and shows the person filming (drawn) */}
        {frame >= scAt - 1 && (
          <div style={{ position: "absolute", left: x0 * camW, top: y0 * camH, width: (x1 - x0) * camW, height: (y1 - y0) * camH, borderRadius: 12, overflow: "hidden", background: "linear-gradient(180deg,#7fd3ff,#c9f0ff)", opacity: ramp(frame, scAt, scAt + 6), boxShadow: "0 0 0 4px #6CF3FF, 0 0 30px rgba(108,243,255,0.8)" }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ transform: `scale(${frame >= selfAt ? selfP : 0.001})`, transformOrigin: "50% 80%" }}>
              <circle cx={50} cy={42} r={18} fill="#fff" />
              <path d="M24 100 C24 74 76 74 76 100 Z" fill="#fff" />
              <circle cx={43} cy={40} r={2.6} fill={COLORS.navy} /><circle cx={57} cy={40} r={2.6} fill={COLORS.navy} />
              <path d="M42 49 Q50 56 58 49" stroke={COLORS.navy} strokeWidth={3} fill="none" strokeLinecap="round" />
            </svg>
            {rec && <div style={{ position: "absolute", left: 8, top: 8, width: 16, height: 16, borderRadius: "50%", background: "#FF3B5C" }} />}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, top: surf, width: L.w, height: L.h, background: "linear-gradient(180deg, rgba(40,200,255,0.55), rgba(10,60,190,0.75))" }}>
        <svg width={L.w} height={40} style={{ position: "absolute", left: 0, top: -12, overflow: "visible" }}>
          <path d={wave} stroke="#fff" strokeWidth={6} fill="none" opacity={0.85} />
        </svg>
      </div>
      {bubbles}
      {frame >= mAt - 1 && up < 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: G.depth, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, color: "#fff", ...slam(frame, mAt, 2), opacity: (1 - up) * slam(frame, mAt, 2).opacity }}>
          <div style={{ fontWeight: 900, fontSize: 160, lineHeight: 1, textShadow: "0 10px 30px rgba(8,20,110,0.45)" }}>{meters}<span style={{ fontSize: "0.42em" }}> m</span></div>
          <div style={{ fontWeight: 800, fontSize: 36 }}>étanche</div>
        </div>
      )}
      {frame >= scAt - 1 && <Heading frame={frame} at={scAt} title="Écran avant" P />}
      <div style={{ position: "absolute", left: 340, right: 130, top: 1090, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        <Chip frame={frame} at={mAt} text="Étanche 10 m" icon="dive" size={34} solid />
        <Chip frame={frame} at={selfAt} text="Tu te vois en filmant" icon="camera" size={32} />
      </div>
      <Footnote frame={frame} at={mAt + 6} top={1250} text="10 m : spécification d'origine" />
    </SceneShell>
  );
};

/** 18.75-22.5 s comes with the case and the batteries: ready to go out and film. */
export const HKit: React.FC = () => {
  const frame = useSceneFrame("kit");
  const cAt = hev("kit.case"), bAt = hev("kit.bat"), rAt = hev("kit.ready");
  const caseP = sp(frame, hscene("kit").from, { damping: 12, stiffness: 130 });
  const open = sp(frame, rAt, { damping: 13, stiffness: 120 });
  const batP = sp(frame, bAt, { damping: 11, stiffness: 180 });
  const t = frame / 30;
  const CW = 600, KW = 820;
  return (
    <SceneShell id="kit">
      <Burst x={505} y={620} r={900} rot={frame * 0.5} opacity={0.16 * caseP} rays={20} />
      <Heading frame={frame} at={hscene("kit").from + 2} title="Avec la caméra" P />
      {/* closed case, then the open case with the camera, battery and mount inside */}
      {open < 0.99 && (
        <div style={{ position: "absolute", left: 505 - CW / 2 - 60, top: 360, opacity: 1 - open, transform: `translateX(${(1 - caseP) * -900}px) rotate(${-6 + Math.sin(t * 1.5) * 1.5}deg) scale(${lerp(1, 0.8, open)})`, filter: SHADOW }}>
          <ProductImage src={OFFICIAL.case.src} aspect={OFFICIAL.case.aspect} width={CW} />
        </div>
      )}
      {open > 0.01 && (
        <div style={{ position: "absolute", left: 505 - KW / 2, top: 330, opacity: Math.min(1, open * 1.5), transform: `scale(${lerp(0.8, 1, open)}) rotate(${-2 + Math.sin(t * 1.5)}deg)`, filter: SHADOW }}>
          <ProductImage src={OFFICIAL.kit.src} aspect={OFFICIAL.kit.aspect} width={KW} sweep={interpolate(frame, [rAt + 6, rAt + 22], [-0.3, 1.3], clamp)} />
        </div>
      )}
      {frame >= bAt - 1 && open < 0.99 && (
        <div style={{ position: "absolute", left: 700, top: 690, opacity: 1 - open, transform: `scale(${batP}) rotate(${lerp(30, 8, batP)}deg)`, filter: SHADOW }}>
          <ProductImage src={OFFICIAL.battery.src} aspect={OFFICIAL.battery.aspect} width={200} />
        </div>
      )}
      <div style={{ position: "absolute", left: 340, right: 130, top: 1080, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        <Chip frame={frame} at={cAt} text="Étui" icon="briefcase" size={38} />
        <Chip frame={frame} at={bAt} text="Batteries" icon="battery" size={38} />
        <Chip frame={frame} at={rAt} text="Prête à filmer" icon="check" size={38} solid />
      </div>
    </SceneShell>
  );
};

/** overlay on the shared trust scene: "first come, first served" (single used unit) */
export const HFirstServed: React.FC = () => {
  const frame = useSceneFrame("trust");
  const at = hev("trust.first");
  if (frame < at - 1) return null;
  return (
    <SceneShell id="trust">
      <div style={{ position: "absolute", left: 340, right: 130, top: 1140, display: "flex", justifyContent: "center" }}>
        <div style={{ ...slam(frame, at, 2.4) }}>
          <div style={{ transform: "rotate(-4deg)", background: "linear-gradient(90deg,#FFB020,#FF7A1A)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 38, lineHeight: 1.1, textAlign: "center", padding: "8px 26px 12px", borderRadius: 18, boxShadow: "0 16px 40px rgba(80,30,0,0.45)" }}>
            PREMIER ARRIVÉ,<br />PREMIER SERVI !
          </div>
        </div>
      </div>
    </SceneShell>
  );
};
