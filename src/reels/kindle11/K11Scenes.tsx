import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { k11ev, k11scene, OFFICIAL, SCREEN } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";
const PAPER = "#f3f1ea";

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

/** the Kindle front render with an optional overlay clipped to its screen */
const Kindle: React.FC<{ w: number; sweep?: number; screen?: (sw: number, sh: number) => React.ReactNode; glow?: number }> = ({ w, sweep = -1, screen, glow = 0 }) => {
  const img = OFFICIAL.front;
  const h = w * img.aspect;
  const [x0, y0, x1, y1] = SCREEN;
  return (
    <div style={{ position: "relative", width: w, height: h, filter: SHADOW }}>
      <ProductImage src={img.src} aspect={img.aspect} width={w} sweep={sweep} />
      {screen || glow > 0 ? (
        <div style={{ position: "absolute", left: x0 * w, top: y0 * h, width: (x1 - x0) * w, height: (y1 - y0) * h, overflow: "hidden" }}>
          {screen?.((x1 - x0) * w, (y1 - y0) * h)}
          {glow > 0 && <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,236,180,0.75), rgba(255,236,180,0) 75%)", opacity: glow, mixBlendMode: "screen" }} />}
        </div>
      ) : null}
    </div>
  );
};

/** a drawn book page (text lines), light or dark mode */
const Page: React.FC<{ sw: number; sh: number; dark?: boolean; o?: number }> = ({ sw, sh, dark, o = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: dark ? "#0d0f14" : PAPER, opacity: o, padding: `${sh * 0.09}px ${sw * 0.11}px`, display: "flex", flexDirection: "column", gap: sh * 0.03 }}>
    <div style={{ alignSelf: "center", height: sh * 0.035, width: "46%", borderRadius: 4, background: dark ? "#e8e8e8" : "#2b2b2b", marginBottom: sh * 0.03 }} />
    {[1, 0.95, 1, 0.9, 1, 0.97, 0.6, 1, 0.93, 1, 0.88, 1, 0.7].map((k, i) => <div key={i} style={{ height: sh * 0.016, width: `${k * 100}%`, borderRadius: 3, background: dark ? "#9a9da6" : "#8d8b85" }} />)}
  </div>
);

/** drawn book for the hook stack / the falling books */
const Book: React.FC<{ w: number; color: string }> = ({ w, color }) => (
  <div style={{ width: w, height: w * 0.22, borderRadius: 8, background: color, border: "4px solid #fff", boxShadow: "0 8px 18px rgba(6,14,90,0.35)", position: "relative" }}>
    <div style={{ position: "absolute", left: w * 0.08, top: "30%", width: w * 0.5, height: "18%", borderRadius: 3, background: "rgba(255,255,255,0.8)" }} />
  </div>
);
const BOOK_COLORS = ["#FF6B8B", "#FFD25A", "#2BD96B", "#6CB8FF", "#B48CFF", "#FF9F43", "#3fd3c8"];

/*
 * 0.0-2.25 s HOOK ("thousands of books... in your pocket!")
 * visual: a tall stack of books drops in, gets sucked into the Kindle on "الكتب", then the Kindle slides into a
 *         drawn jeans pocket on "فجيبك".
 */
export const K11Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const sAt = k11ev("hook.shrink"), pAt = k11ev("hook.pocket");
  const suck = ramp(frame, sAt, sAt + 8, (t) => t * t);
  const kin = sp(frame, sAt + 4, { damping: 12, stiffness: 160 });
  const into = ramp(frame, pAt, pAt + 10, easeOut);
  const pocketIn = sp(frame, pAt - 6, { damping: 13, stiffness: 150 });
  const KW = 200;
  const cx = 505;
  const sk = shake(frame, pAt + 10, 12, 8);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={cx} y={470} r={900} rot={frame * 0.8} opacity={0.2} rays={20} />
      {/* book stack */}
      {suck < 1 && BOOK_COLORS.map((c, i) => {
        const drop = sp(frame, i * 1.5, { damping: 12, stiffness: 180 });
        const y = 500 - i * 56 - (1 - drop) * 900;
        const tx = (cx - 160) + ((i % 2) * 2 - 1) * 14;
        return (
          <div key={i} style={{ position: "absolute", left: lerp(tx, cx - 30, suck), top: lerp(y, 460, suck), transform: `scale(${lerp(1, 0.15, suck)}) rotate(${((i % 3) - 1) * 4}deg)`, opacity: 1 - suck * 0.7 }}>
            <Book w={320} color={c} />
          </div>
        );
      })}
      {/* jeans pocket (back layer) */}
      {frame >= pAt - 7 && (
        <div style={{ position: "absolute", left: cx - 190, top: 360, transform: `scale(${pocketIn})`, opacity: Math.min(1, pocketIn * 2), width: 380, height: 420, borderRadius: "30px 30px 120px 120px", background: "linear-gradient(180deg,#3a63b8,#24448f)", border: "5px dashed rgba(255,214,140,0.9)", boxShadow: "0 20px 50px rgba(6,14,90,0.45)" }} />
      )}
      {/* the Kindle */}
      {frame >= sAt + 3 && (
        <div style={{ position: "absolute", left: cx - KW / 2, top: lerp(300, 330, into) + into * 120, transform: `scale(${kin})` }}>
          <Kindle w={KW} />
        </div>
      )}
      {/* pocket front flap (occludes the Kindle's lower part once it is in) */}
      {frame >= pAt - 7 && (
        <svg width={380} height={300} viewBox="0 0 380 300" style={{ position: "absolute", left: cx - 190, top: 500, transform: `scale(${pocketIn})`, transformOrigin: "50% -50%", opacity: Math.min(1, pocketIn * 2), overflow: "visible", filter: "drop-shadow(0 -6px 14px rgba(6,14,90,0.35))" }}>
          <path d="M0 0 Q 190 70 380 0 L 380 160 Q 190 300 0 160 Z" fill="#2f57a8" stroke="#1d3a7a" strokeWidth={4} />
          <path d="M14 14 Q 190 80 366 14 M14 150 Q 190 278 366 150" fill="none" stroke="rgba(255,214,140,0.9)" strokeWidth={5} strokeDasharray="14 10" />
        </svg>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp) }} />
    </SceneShell>
  );
};

/** 2.25-5.75 s INTRO: Amazon Kindle, 11th generation, Black, DISPONIBLE. */
export const K11Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = k11ev("intro.name"), gAt = k11ev("intro.gen"), bAt = k11ev("intro.black"), dAt = k11ev("intro.dispo");
  const enter = sp(frame, k11scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const W = 470;
  const t = frame / 30;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={760} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 36, letterSpacing: 10 }}>AMAZON</div>
        <div style={{ ...slam(frame, nAt + 4, 2.2), fontSize: 100, lineHeight: 1, letterSpacing: -1 }}>Kindle</div>
        {frame >= gAt - 1 && <div style={{ ...slam(frame, gAt, 2), background: "#fff", color: COLORS.blue, fontSize: 36, padding: "2px 24px 6px", borderRadius: 999, textShadow: "none" }}>11e génération</div>}
      </div>
      <div style={{ position: "absolute", left: 505 - W / 2, top: 500, transform: `translateY(${(1 - enter) * 1100 + Math.sin(t * Math.PI) * 8}px) rotate(${lerp(-12, -2, enter)}deg)` }}>
        <Kindle w={W} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1140}>
        <Chip frame={frame} at={bAt} text="Noir" icon={undefined} size={38} />
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

/** 5.75-10.75 s 6" E Ink screen: clear like paper, easy on the eyes, even in the sun. */
export const K11Screen: React.FC = () => {
  const frame = useSceneFrame("screen");
  const zAt = k11ev("sc.size"), eAt = k11ev("sc.eink"), pAt = k11ev("sc.paper"), yAt = k11ev("sc.eyes"), sAt = k11ev("sc.sun");
  const enter = sp(frame, k11scene("screen").from, { damping: 13, stiffness: 120 });
  const inch = Math.round(6 * easeOut(ramp(frame, zAt, zAt + 12)));
  const sunP = sp(frame, sAt, { damping: 12, stiffness: 90 });
  const W = 440, H = W * OFFICIAL.front.aspect, X = 80, Y = 330;
  const diag = ramp(frame, zAt, zAt + 12);
  return (
    <SceneShell id="screen">
      {/* the sun rising top-right; the E Ink page stays readable */}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 820, top: 250 + (1 - sunP) * 300, width: 150, height: 150, opacity: sunP }}>
          <div style={{ position: "absolute", inset: -120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,160,0.6), rgba(255,236,160,0) 65%)" }} />
          <div style={{ position: "absolute", inset: 0, transform: `rotate(${frame * 2}deg)` }}><LineIcon name="sun" size={150} stroke={6} color="#FFE9A0" /></div>
        </div>
      )}
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateX(${(1 - enter) * -800}px) rotate(-3deg)` }}>
        <Kindle w={W} sweep={interpolate(frame, [eAt, eAt + 16], [-0.3, 1.3], clamp)} screen={(sw, sh) => frame >= pAt - 1 ? <Page sw={sw} sh={sh} o={ramp(frame, pAt, pAt + 8)} /> : null} />
        {diag > 0 && (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: diag * (1 - ramp(frame, pAt - 4, pAt + 4)) }}>
            <path d={`M ${SCREEN[0] * W + 10} ${SCREEN[3] * H - 10} L ${lerp(SCREEN[0] * W + 10, SCREEN[2] * W - 10, diag)} ${lerp(SCREEN[3] * H - 10, SCREEN[1] * H + 10, diag)}`} stroke="#3FA9FF" strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 590, top: 340, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, color: "#fff", ...slam(frame, zAt, 2) }}>
          <div style={{ fontWeight: 900, fontSize: 170, lineHeight: 1, textShadow }}>{inch}<span style={{ fontSize: "0.4em" }}>"</span></div>
          {frame >= eAt - 1 && <div style={{ ...slam(frame, eAt, 2.2), fontWeight: 900, fontSize: 48, background: "#fff", color: COLORS.blue, padding: "2px 24px 6px", borderRadius: 14 }}>E INK</div>}
        </div>
      )}
      <div style={{ position: "absolute", left: 560, top: 700, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <Chip frame={frame} at={pAt} text="Comme le papier" icon="book" size={36} />
        <Chip frame={frame} at={yAt} text="Confort des yeux" icon="eye" size={36} />
        <Chip frame={frame} at={sAt} text="Lisible au soleil" icon="sun" size={36} solid />
      </div>
    </SceneShell>
  );
};

/** 10.75-15.0 s 16GB: thousands of books, and very light in the hand. */
export const K11Storage: React.FC = () => {
  const frame = useSceneFrame("storage");
  const gAt = k11ev("st.gb"), bAt = k11ev("st.books"), lAt = k11ev("st.light"), hAt = k11ev("st.hand");
  const enter = sp(frame, k11scene("storage").from, { damping: 13, stiffness: 120 });
  const gb = Math.round(16 * easeOut(ramp(frame, gAt, gAt + 12)));
  const W = 360, X = 505 - W / 2 + 30, Y = 470;
  const float = frame >= lAt ? Math.sin((frame - lAt) * 0.15) * 18 : 0;
  return (
    <SceneShell id="storage">
      {frame >= gAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, gAt, 2.2), display: "flex", alignItems: "baseline", gap: 10, fontFamily: FONT, fontWeight: 900, color: COLORS.blue, background: "#fff", padding: "0 34px 10px", borderRadius: 28, boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>
            <span style={{ fontSize: 130, lineHeight: 1 }}>{gb}</span><span style={{ fontSize: 56 }}>GB</span>
          </div>
        </div>
      )}
      {/* books falling into the Kindle */}
      {frame >= bAt - 1 && BOOK_COLORS.concat(BOOK_COLORS).map((c, i) => {
        const t0 = bAt + i * 2;
        const p = ramp(frame, t0, t0 + 14, (x) => x * x);
        if (frame < t0 || p >= 1) return null;
        const sx = 120 + ((i * 137) % 780);
        return (
          <div key={i} style={{ position: "absolute", left: lerp(sx, 505, p), top: lerp(380, 760, p), transform: `scale(${lerp(0.7, 0.1, p)}) rotate(${(i * 47) % 90 - 45}deg)` }}>
            <Book w={200} color={c} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateY(${(1 - enter) * 800 + float}px) rotate(${3 + float * 0.15}deg)` }}>
        <Kindle w={W} screen={(sw, sh) => (
          frame >= bAt - 1 ? (
            <div style={{ position: "absolute", inset: 0, background: PAPER, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: sw * 0.05, padding: sw * 0.08 }}>
              {Array.from({ length: 9 }).map((_, i) => <div key={i} style={{ borderRadius: 4, background: BOOK_COLORS[i % BOOK_COLORS.length], opacity: 0.85, transform: `scale(${pop(frame, bAt + i)})` }} />)}
            </div>
          ) : null
        )} />
      </div>
      {frame >= lAt - 1 && (
        <div style={{ position: "absolute", left: 110, top: 560, opacity: ramp(frame, lAt, lAt + 6), transform: `translateY(${Math.sin(frame * 0.2) * 10}px) rotate(-20deg)` }}>
          <LineIcon name="feather" size={140} stroke={6} progress={ramp(frame, lAt, lAt + 12)} />
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={bAt} text="Des milliers de livres" icon="book" size={36} />
        <Chip frame={frame} at={lAt} text="Léger" icon="feather" size={36} solid />
        <Chip frame={frame} at={hAt} text="Dans la main" icon="check" size={36} />
      </Row>
    </SceneShell>
  );
};

/** 15.0-19.0 s built-in front light + dark mode: read at night without switching the light on. */
export const K11Light: React.FC = () => {
  const frame = useSceneFrame("light");
  const lAt = k11ev("li.light"), dAt = k11ev("li.dark"), nAt = k11ev("li.night"), oAt = k11ev("li.lamp");
  const enter = sp(frame, k11scene("light").from, { damping: 13, stiffness: 120 });
  const night = ramp(frame, nAt - 3, nAt + 8);
  const dark = ramp(frame, dAt, dAt + 6);
  const W = 400;
  const lampP = pop(frame, oAt);
  const slash = ramp(frame, oAt + 3, oAt + 9);
  return (
    <SceneShell id="light">
      {/* night sky */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0a1240,#1b2a7a)", opacity: night * 0.85 }} />
      {night > 0 && Array.from({ length: 22 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 40 + ((i * 173) % 900), top: 230 + ((i * 97) % 700), width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, borderRadius: "50%", background: "#fff", opacity: night * (0.4 + 0.6 * Math.abs(Math.sin(frame * 0.1 + i))) }} />
      ))}
      {night > 0 && <div style={{ position: "absolute", left: 800, top: 250, opacity: night }}><LineIcon name="moon" size={130} stroke={6} color="#FFE9A0" /></div>}
      <div style={{ position: "absolute", left: 505 - W / 2 + 30, top: 330, transform: `translateY(${(1 - enter) * 800}px)` }}>
        <Kindle w={W} glow={ramp(frame, lAt, lAt + 10) * (1 - dark * 0.6)} screen={(sw, sh) => (
          <>
            <Page sw={sw} sh={sh} />
            {dark > 0 && <Page sw={sw} sh={sh} dark o={dark} />}
          </>
        )} />
      </div>
      {/* "no need to switch the lamp on": crossed-out bulb */}
      {frame >= oAt - 1 && (
        <div style={{ position: "absolute", left: 100, top: 360, width: 150, height: 150, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${lampP})`, boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>
          <LineIcon name="bright" size={96} stroke={7} color={COLORS.blue} />
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
            <circle cx={50} cy={50} r={44} fill="none" stroke="#FF3B5C" strokeWidth={8} opacity={slash} />
            <path d={`M 20 20 L ${20 + 60 * slash} ${20 + 60 * slash}`} stroke="#FF3B5C" strokeWidth={9} strokeLinecap="round" />
          </svg>
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={lAt} text="Lumière intégrée" icon="bright" size={36} solid />
        <Chip frame={frame} at={dAt} text="Mode sombre" icon="moon" size={36} />
        <Chip frame={frame} at={nAt} text="Lecture la nuit" icon="book" size={36} />
      </Row>
    </SceneShell>
  );
};

/** 19.0-22.75 s battery up to 6 weeks, charges over USB-C. */
export const K11Battery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const s0 = k11scene("battery").from;
  const wAt = k11ev("bat.weeks"), uAt = k11ev("bat.usbc");
  const weeks = Math.round(6 * easeOut(ramp(frame, wAt, wAt + 14)));
  const sk = shake(frame, wAt, 10, 7);
  const W = 280, H = W * OFFICIAL.front.aspect, X = 610, Y = 440;
  const plug = interpolate(frame, [uAt - 4, uAt + 6], [90, 0], { ...clamp, easing: easeOut });
  return (
    <SceneShell id="battery" shakeX={sk.x} shakeY={sk.y}>
      <div style={{ position: "absolute", left: 80, top: 250, display: "flex", flexDirection: "column", gap: 18, fontFamily: FONT, color: "#fff", transform: `scale(${sp(frame, s0, { damping: 13, stiffness: 160 })})`, transformOrigin: "left top" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <LineIcon name="battery" size={110} stroke={6} progress={ramp(frame, s0, s0 + 12)} />
          <span style={{ fontWeight: 900, fontSize: 50, letterSpacing: 2 }}>BATTERIE</span>
        </div>
        {frame >= wAt - 1 && (
          <div style={{ ...slam(frame, wAt, 2), display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontWeight: 900, fontSize: 150, lineHeight: 0.9, color: COLORS.blue, background: "#fff", padding: "0 26px 10px", borderRadius: 24 }}>{weeks}</span>
            <span style={{ fontWeight: 900, fontSize: 56 }}>SEMAINES</span>
          </div>
        )}
        {/* 6 week tiles filling */}
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const on = ramp(frame, wAt + 2 + i * 3, wAt + 5 + i * 3);
            return <div key={i} style={{ width: 60, height: 60, borderRadius: 16, background: on > 0.5 ? "#2BD96B" : "rgba(255,255,255,0.15)", border: "3px solid rgba(255,255,255,0.85)", transform: `scale(${0.85 + 0.15 * on})` }} />;
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateX(${(1 - sp(frame, s0, { damping: 13, stiffness: 120 })) * 700}px)` }}>
        <Kindle w={W} />
      </div>
      {/* USB-C plug + cable into the bottom of the Kindle */}
      {frame >= uAt - 5 && (
        <svg width={300} height={420} viewBox="0 0 300 420" style={{ position: "absolute", left: X + W / 2 - 150, top: Y + H - 6 + plug, overflow: "visible" }}>
          <path d="M150 70 C 150 130, 220 150, 330 110" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" />
          <rect x={126} y={10} width={48} height={70} rx={14} fill="#fff" />
          <rect x={136} y={-6} width={28} height={22} rx={6} fill="#d9dbe3" />
        </svg>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={wAt} text="Jusqu'à 6 semaines" icon="battery" size={36} solid />
        <Chip frame={frame} at={uAt} text="USB-C" icon="cable" size={36} />
      </Row>
      <Footnote frame={frame} at={wAt + 6} top={1250} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};
