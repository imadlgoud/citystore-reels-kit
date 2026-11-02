import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, kdev, kdscene } from "./timeline";

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
const INK = "#1d2230";

/** cursive-looking scribble lines drawn on with progress p (no words: generic handwriting) */
const Scribble: React.FC<{ w: number; h: number; p: number; lines?: number }> = ({ w, h, p, lines = 2 }) => {
  const paths = Array.from({ length: lines }, (_, li) => {
    const y = h * (0.32 + li * 0.36), x0 = w * 0.06, x1 = w * (li === lines - 1 ? 0.7 : 0.94);
    const n = 9;
    return Array.from({ length: n + 1 }, (_, i) => {
      const x = x0 + ((x1 - x0) * i) / n;
      return `${i === 0 ? "M" : "Q"} ${i === 0 ? `${x} ${y}` : `${x - (x1 - x0) / n / 2} ${y - h * (i % 2 ? 0.16 : -0.1)} ${x} ${y}`}`;
    }).join(" ");
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {paths.map((d, i) => {
        const q = Math.max(0, Math.min(1, p * lines - i));
        return <path key={i} d={d} fill="none" stroke={INK} strokeWidth={Math.max(2, w * 0.012)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} />;
      })}
    </svg>
  );
};

/*
 * 0.0-4.0 s HOOK ("read or write? here are two Kindles, each one great at something!")
 * visual: "LIRE" (book) and "ÉCRIRE" (pen) badges pop, then the two Kindles slam in side by side with DISPONIBLES.
 */
export const KDHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const rAt = kdev("hook.read"), wAt = kdev("hook.write"), tAt = kdev("hook.two"), bAt = kdev("hook.best");
  const sk = shake(frame, tAt, 14, 10);
  const badge = (at: number, icon: IconName, text: string, x: number) =>
    frame < at - 1 ? null : (
      <div style={{ position: "absolute", left: x, top: 380, display: "flex", alignItems: "center", gap: 12, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "8px 26px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, at) * (1 - ramp(frame, tAt - 2, tAt + 4))})` }}>
        <LineIcon name={icon} size={54} stroke={8} color={COLORS.blue} />{text}
      </div>
    );
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={540} y={560} r={900} rot={frame * 0.6} opacity={0.2 * ramp(frame, tAt, tAt + 6)} rays={20} />
      {badge(rAt, "book", "LIRE", 230)}
      {badge(wAt, "pen", "ÉCRIRE", 580)}
      {frame >= tAt - 1 && (
        <>
          <div style={{ position: "absolute", left: 220, top: 350, ...slam(frame, tAt, 2.4) }}>
            <Img k="colorsoft" w={290} sweep={interpolate(frame, [tAt + 4, tAt + 20], [-0.3, 1.3], clamp)} />
          </div>
          <div style={{ position: "absolute", left: 570, top: 365, ...slam(frame, tAt + 3, 2.4) }}>
            <Img k="scribe" w={300} sweep={interpolate(frame, [tAt + 8, tAt + 24], [-0.3, 1.3], clamp)} />
          </div>
        </>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, zIndex: 20 }}>
        {frame < tAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#fff", textShadow, whiteSpace: "nowrap" }}>باغي تقرا ولا تكتب؟</div>
        ) : (
          <>
            <div style={{ ...slam(frame, tAt, 2.2), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: "2px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>2 Kindle</div>
            {frame >= bAt - 1 && (
              <div style={{ ...slam(frame, bAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: GREEN, padding: "8px 22px", borderRadius: 999, letterSpacing: 2, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
                <LineIcon name="store" size={42} stroke={7} color="#fff" />DISPONIBLES
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - tAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 4.0-10.5 s Kindle Colorsoft 16GB: 7" colour screen for books, comics and magazines; water resistant. */
export const KDColorsoft: React.FC = () => {
  const frame = useSceneFrame("colorsoft");
  const nAt = kdev("cs.name"), gAt = kdev("cs.gb"), zAt = kdev("cs.size"), bAt = kdev("cs.books"), cAt = kdev("cs.comics"), mAt = kdev("cs.mags"), wAt = kdev("cs.water");
  const enter = sp(frame, kdscene("colorsoft").from, { damping: 13, stiffness: 120 });
  const t = frame / 30;
  const wave = Array.from({ length: 13 }, (_, i) => `${i === 0 ? "M" : "L"} ${i * 90} ${Math.sin(i * 0.9 + t * 3) * 12}`).join(" ");
  const surf = interpolate(frame, [wAt - 2, wAt + 14], [1980, 900], { ...clamp, easing: easeOut });
  return (
    <SceneShell id="colorsoft">
      <Title frame={frame} at={nAt} pill size={56}>Kindle Colorsoft</Title>
      <div style={{ position: "absolute", left: 300, top: 360, transform: `translateX(${(1 - enter) * -900}px) rotate(-3deg)` }}>
        <Img k="colorsoft" w={400} sweep={interpolate(frame, [zAt, zAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 730, top: 420, display: "flex", flexDirection: "column", alignItems: "center", ...slam(frame, zAt, 2.2), fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow }}>
          <div style={{ fontSize: 110, lineHeight: 1 }}>7<span style={{ fontSize: "0.5em" }}>″</span></div>
          <div style={{ fontSize: 30, letterSpacing: 2 }}>COULEUR</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {["#FF3B5C", "#FFB020", "#2BD96B", "#6CF3FF", "#7A5CFF"].map((c, i) => <div key={c} style={{ width: 26, height: 26, borderRadius: "50%", background: c, border: "3px solid #fff", transform: `scale(${pop(frame, zAt + 4 + i * 2)})` }} />)}
          </div>
        </div>
      )}
      {frame >= gAt - 1 && (
        <div style={{ position: "absolute", left: 740, top: 680, transform: `scale(${pop(frame, gAt)})`, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "4px 22px 8px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>16GB</div>
      )}
      {frame >= wAt - 3 && (
        <div style={{ position: "absolute", left: 0, top: surf, width: 1080, height: 1920, background: "linear-gradient(180deg, rgba(40,200,255,0.45), rgba(10,60,190,0.7))" }}>
          <svg width={1080} height={40} style={{ position: "absolute", left: 0, top: -12, overflow: "visible" }}><path d={wave} stroke="#fff" strokeWidth={6} fill="none" opacity={0.85} /></svg>
        </div>
      )}
      <Row top={1060}>
        <Chip frame={frame} at={bAt} text="Livres" icon="book" size={34} solid />
        <Chip frame={frame} at={cAt} text="BD" icon="comic" size={34} />
        <Chip frame={frame} at={mAt} text="Magazines" icon="magazine" size={34} solid />
        <Chip frame={frame} at={wAt} text="Résiste à l'eau" icon="drop" size={34} />
      </Row>
      <Footnote frame={frame} at={wAt + 6} top={1270} text="IPX8 : jusqu'à 2 m, 60 min (eau douce)" />
    </SceneShell>
  );
};

/** 10.5-16.5 s Kindle Scribe 16GB with Premium Pen: 10.2" screen, read and write on it like on paper. */
export const KDScribe: React.FC = () => {
  const frame = useSceneFrame("scribe");
  const nAt = kdev("sc.name"), gAt = kdev("sc.gb"), pAt = kdev("sc.pen"), zAt = kdev("sc.size"), rAt = kdev("sc.read"), wAt = kdev("sc.write"), aAt = kdev("sc.paper");
  const enter = sp(frame, kdscene("scribe").from, { damping: 13, stiffness: 120 });
  const W = 460, H = W * OFFICIAL.scribe.aspect;
  const [x0, y0, x1, y1] = OFFICIAL.scribe.note;
  const inch = (10.2 * easeOut(ramp(frame, zAt, zAt + 14))).toFixed(1).replace(".", ",");
  return (
    <SceneShell id="scribe">
      <Title frame={frame} at={nAt} pill size={56}>Kindle Scribe</Title>
      <div style={{ position: "absolute", left: 300, top: 380, transform: `translateX(${(1 - enter) * 900}px)` }}>
        <Img k="scribe" w={W} sweep={interpolate(frame, [pAt, pAt + 18], [-0.3, 1.3], clamp)} />
        <div style={{ position: "absolute", left: x0 * W, top: y0 * H, width: (x1 - x0) * W, height: (y1 - y0) * H }}>
          <Scribble w={(x1 - x0) * W} h={(y1 - y0) * H} p={ramp(frame, wAt, aAt + 6, (x) => x)} />
        </div>
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 780, top: 400, display: "flex", flexDirection: "column", alignItems: "center", ...slam(frame, zAt, 2.2), fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow }}>
          <div style={{ fontSize: 76, lineHeight: 1 }}>{inch}<span style={{ fontSize: "0.5em" }}>″</span></div>
          <div style={{ fontSize: 26, letterSpacing: 2 }}>POUCES</div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={gAt} text="16GB" icon="box" size={32} solid />
        <Chip frame={frame} at={pAt} text="Premium Pen incluse" icon="pen" size={32} />
        <Chip frame={frame} at={rAt} text="Lire" icon="book" size={32} solid />
        <Chip frame={frame} at={wAt} text="Écrire comme sur papier" icon="note" size={32} />
      </Row>
    </SceneShell>
  );
};

/** 16.5-21.25 s handwritten notes next to the books; the Scribe turns handwriting into text to share. */
export const KDNotes: React.FC = () => {
  const frame = useSceneFrame("notes");
  const nAt = kdev("nt.notes"), sAt = kdev("nt.side"), cAt = kdev("nt.convert"), tAt = kdev("nt.text"), hAt = kdev("nt.share");
  const enter = sp(frame, kdscene("notes").from, { damping: 13, stiffness: 120 });
  const W = 400, H = W * OFFICIAL.scribe.aspect;
  const [x0, y0, x1, y1] = OFFICIAL.scribe.note;
  const conv = ramp(frame, cAt, tAt + 4);
  return (
    <SceneShell id="notes">
      <Title frame={frame} at={nAt} pill size={56}><LineIcon name="pen" size={60} stroke={8} color={COLORS.blue} />Notes manuscrites</Title>
      <div style={{ position: "absolute", left: 300, top: 400, transform: `translateX(${(1 - enter) * -900}px)` }}>
        <Img k="scribe" w={W} />
        <div style={{ position: "absolute", left: x0 * W, top: y0 * H, width: (x1 - x0) * W, height: (y1 - y0) * H }}>
          <Scribble w={(x1 - x0) * W} h={(y1 - y0) * H} p={ramp(frame, nAt, sAt + 14, (x) => x)} />
        </div>
      </div>
      {/* handwriting -> typed text card */}
      {frame >= cAt - 1 && (
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d="M 640 620 C 690 600, 700 560, 740 540" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray="12 14" strokeDashoffset={-frame * 2} opacity={conv} />
        </svg>
      )}
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 380, width: 290, borderRadius: 24, background: "#fff", padding: "18px 20px", boxShadow: "0 16px 40px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, tAt)})`, fontFamily: FONT, color: INK }}>
          <div style={{ fontWeight: 900, fontSize: 26, color: COLORS.blue, marginBottom: 10 }}>Aa  TEXTE</div>
          {[0.95, 0.85, 0.6].map((wf, i) => <div key={i} style={{ height: 10, borderRadius: 5, background: "#c9d1e6", width: `${wf * 100}%`, marginBottom: 12 }} />)}
          {frame >= hAt - 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, transform: `scale(${pop(frame, hAt)})`, transformOrigin: "left", fontWeight: 900, fontSize: 26, color: "#fff", background: GREEN, padding: "4px 14px 6px", borderRadius: 999, width: "fit-content" }}>
              <LineIcon name="chat" size={30} stroke={8} color="#fff" />Partager
            </div>
          )}
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={sAt} text="À côté de tes livres" icon="book" size={32} />
        <Chip frame={frame} at={tAt} text="Écriture → texte" icon="spark" size={32} solid />
        <Chip frame={frame} at={hAt} text="À partager" icon="chat" size={32} />
      </Row>
    </SceneShell>
  );
};

/** 21.25-26.0 s both: E Ink screen easy on the eyes; front light adjusts by itself to the ambient light. */
export const KDEink: React.FC = () => {
  const frame = useSceneFrame("eink");
  const bAt = kdev("ei.both"), eAt = kdev("ei.eink"), yAt = kdev("ei.eyes"), lAt = kdev("ei.light"), aAt = kdev("ei.auto");
  const enter = sp(frame, kdscene("eink").from, { damping: 13, stiffness: 120 });
  // ambient light: day -> evening, the screens follow it (auto light)
  const dusk = frame >= aAt ? 0.5 + 0.5 * Math.sin((frame - aAt) / 14) : 0;
  return (
    <SceneShell id="eink">
      <Title frame={frame} at={eAt} pill size={56}>Écran E Ink</Title>
      <div style={{ position: "absolute", inset: 0, background: "#050a30", opacity: dusk * 0.35 }} />
      <div style={{ position: "absolute", left: 290, top: 400, transform: `translateY(${(1 - enter) * 900}px) rotate(-4deg)`, filter: `brightness(${1 - dusk * 0.12})` }}>
        <Img k="colorsoft" w={300} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 420, transform: `translateY(${(1 - sp(frame, kdscene("eink").from + 4, { damping: 13, stiffness: 120 })) * 900}px) rotate(4deg)`, filter: `brightness(${1 - dusk * 0.12})` }}>
        <Img k="scribe" w={320} />
      </div>
      {frame >= yAt - 1 && (
        <div style={{ position: "absolute", left: 470, top: 790, width: 140, height: 140, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, yAt)})`, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
          <LineIcon name="eye" size={92} stroke={8} color={COLORS.blue} />
        </div>
      )}
      {frame >= lAt - 1 && (
        <div style={{ position: "absolute", left: 800, top: 320, transform: `scale(${pop(frame, lAt)})` }}>
          <LineIcon name={dusk > 0.5 ? "moon" : "sun"} size={110} stroke={7} color="#FFE07A" />
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={bAt} text="Les 2 Kindle" icon="check" size={32} />
        <Chip frame={frame} at={yAt} text="Repose les yeux" icon="eye" size={32} solid />
        <Chip frame={frame} at={aAt} text="Éclairage auto" icon="bright" size={32} />
      </Row>
      <Footnote frame={frame} at={aAt + 4} top={1200} text="Éclairage automatique : selon le modèle" />
    </SceneShell>
  );
};
