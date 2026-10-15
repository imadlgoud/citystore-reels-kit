import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { useLayout } from "../../layout";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { KOBO_BUTTONS, OFFICIAL, rev, rscene, SCREEN } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type Img = { src: string; aspect: number };
type Key = "kobo" | "colorsoft" | "paperwhite";
const KEYS: Key[] = ["kobo", "colorsoft", "paperwhite"];
const RAINBOW = "linear-gradient(100deg, rgba(255,77,109,0) 0%, rgba(255,77,109,0.55) 18%, rgba(255,210,90,0.55) 36%, rgba(80,220,140,0.55) 54%, rgba(70,170,255,0.55) 72%, rgba(190,110,255,0.55) 88%, rgba(190,110,255,0) 100%)";

const Chip: React.FC<{ frame: number; at: number; text: string; icon?: IconName; size: number; solid?: boolean; swatch?: string; gold?: boolean }> = ({ frame, at, text, icon, size, solid, swatch, gold }) => {
  if (frame < at - 1) return null;
  const p = sp(frame, at, { damping: 11, stiffness: 220, mass: 0.6 });
  const fg = gold ? "#3a2500" : solid ? COLORS.blue : "#fff";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.35, padding: `${size * 0.22}px ${size * 0.62}px`, borderRadius: 999, background: gold ? "linear-gradient(90deg,#FFD25A,#FFB020)" : solid ? "#fff" : "rgba(255,255,255,0.18)", border: solid || gold ? "none" : "3px solid rgba(255,255,255,0.75)", color: fg, fontFamily: FONT, fontWeight: 900, fontSize: size, whiteSpace: "nowrap", transform: `scale(${p})`, boxShadow: "0 12px 30px rgba(6,14,90,0.3)" }}>
      {swatch ? <div style={{ width: size * 0.9, height: size * 0.9, borderRadius: "50%", background: swatch, border: "4px solid #fff", boxShadow: "0 0 0 2px rgba(6,14,90,0.25)" }} /> : null}
      {icon ? <LineIcon name={icon} size={size * 1.2} stroke={7} color={fg} progress={ramp(frame, at, at + 10)} /> : null}
      {text}
    </div>
  );
};

/** small honest footnote under a claim */
const Footnote: React.FC<{ frame: number; at: number; text: string; top: number; left?: number; right?: number; align?: "left" | "center" }> = ({ frame, at, text, top, left = 340, right = 130, align = "left" }) =>
  frame < at ? null : (
    <div style={{ position: "absolute", left, right, top, textAlign: align, fontFamily: FONT, fontWeight: 700, fontSize: 28, lineHeight: 1.25, color: "#fff", opacity: 0.88 * ramp(frame, at, at + 8), textShadow: "0 4px 14px rgba(8,20,110,0.45)" }}>
      {text}
    </div>
  );

/** product image that fits a box, slides in, bobs and gets a light sweep on each beat in `sweeps` */
const Hero: React.FC<{ img: Img; frame: number; at: number; box: { x: number; y: number; w: number; h: number }; sweeps: number[]; from?: -1 | 1; children?: React.ReactNode }> = ({ img, frame, at, box, sweeps, from = -1, children }) => {
  const w = Math.min(box.w, box.h / img.aspect);
  const h = w * img.aspect;
  const enter = sp(frame, at, { damping: 12, stiffness: 120, mass: 0.8 });
  const s = sweeps.filter((v) => frame >= v).pop() ?? -100;
  const t = frame / 30;
  return (
    <div style={{ position: "absolute", left: box.x + (box.w - w) / 2, top: box.y + (box.h - h) / 2, width: w, height: h, transform: `translateX(${(1 - enter) * 1000 * from}px) translateY(${Math.sin(t * Math.PI * 0.9) * 8}px) rotate(${lerp(12 * from, 0, enter) + Math.sin(t * Math.PI * 0.5) * 1.2}deg)`, filter: "drop-shadow(0 34px 44px rgba(6,14,90,0.5))" }}>
      <ProductImage src={img.src} aspect={img.aspect} width={w} sweep={interpolate(frame, [s, s + 16], [-0.3, 1.3], clamp)} />
      {children}
    </div>
  );
};

/** a colour wave sweeping across a screen rectangle (fractions of the image) */
const ColorWave: React.FC<{ frame: number; at: number; rect: readonly number[]; w: number; h: number }> = ({ frame, at, rect, w, h }) => {
  if (frame < at - 1 || frame > at + 26) return null;
  const [x0, y0, x1, y1] = rect;
  const x = interpolate(frame, [at, at + 24], [-1.2, 1.2], clamp);
  return (
    <div style={{ position: "absolute", left: x0 * w, top: y0 * h, width: (x1 - x0) * w, height: (y1 - y0) * h, overflow: "hidden", borderRadius: 6, mixBlendMode: "multiply" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${x * 100}%`, width: "100%", background: RAINBOW }} />
    </div>
  );
};

const SPECS: Record<Key, { idx: number; brand: string; model: string }> = {
  kobo: { idx: 1, brand: "KOBO", model: "Libra Colour" },
  colorsoft: { idx: 2, brand: "KINDLE", model: "Colorsoft" },
  paperwhite: { idx: 3, brand: "KINDLE", model: "Paperwhite" },
};

/** shared layout of the three product scenes: index badge + name + DISPONIBLE, hero, spec chips, feature chips */
const ProductScene: React.FC<{
  id: Key;
  sweeps: number[];
  specs: (frame: number, size: number) => React.ReactNode;
  features: (frame: number, size: number) => React.ReactNode;
  overlay?: (frame: number, w: number, h: number) => React.ReactNode;
  extra?: (frame: number) => React.ReactNode;
  sub?: { at: number; text: string };
  from?: -1 | 1;
}> = ({ id, sweeps, specs, features, overlay, extra, sub, from = -1 }) => {
  const frame = useSceneFrame(id);
  const S = SPECS[id];
  const img = OFFICIAL[id];
  const nAt = Math.min(rev(`${id}.name`), rscene(id).from + 2);
  const G = { head: 226, nsize: 80, box: { x: 70, y: 430, w: 880, h: 560 }, specs: { l: 60, y: 1030 }, feats: { l: 340, y: 1130 }, chip: 40, fchip: 38 };
  const name = slam(frame, nAt + 3, 2);
  const sk = shake(frame, nAt, 10, 8);
  const w = Math.min(G.box.w, G.box.h / img.aspect);
  return (
    <SceneShell id={id} shakeX={sk.x} shakeY={sk.y}>
      <Burst x={G.box.x + G.box.w / 2} y={G.box.y + G.box.h / 2} r={900} rot={frame * 0.5} opacity={0.16 * sp(frame, nAt)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: G.head, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow: "0 10px 30px rgba(8,20,110,0.4)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...slam(frame, nAt, 1.6) }}>
          <div style={{ background: "#fff", color: COLORS.blue, fontSize: G.nsize * 0.36, padding: "2px 18px 4px", borderRadius: 999, textShadow: "none" }}>{S.idx}/3</div>
          <div style={{ fontSize: G.nsize * 0.42, letterSpacing: 8 }}>{S.brand}</div>
          <div style={{ background: "#2BD96B", color: "#fff", fontSize: G.nsize * 0.3, padding: "4px 16px 6px", borderRadius: 999, letterSpacing: 2, textShadow: "none", transform: `scale(${pop(frame, nAt + 6)})` }}>DISPONIBLE</div>
        </div>
        <div style={{ ...name, fontSize: G.nsize, letterSpacing: -1 }}>{S.model}</div>
        {sub && frame >= sub.at - 1 ? (
          <div style={{ ...slam(frame, sub.at, 2), background: "#fff", color: COLORS.blue, fontSize: 34, padding: "2px 22px 6px", borderRadius: 999, textShadow: "none" }}>{sub.text}</div>
        ) : null}
      </div>
      <Hero img={img} frame={frame} at={nAt} box={G.box} sweeps={[nAt + 8, ...sweeps]} from={from}>
        {overlay?.(frame, w, w * img.aspect)}
      </Hero>
      {extra?.(frame)}
      <div style={{ position: "absolute", left: G.specs.l, right: 130, top: G.specs.y, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {specs(frame, G.chip)}
      </div>
      <div style={{ position: "absolute", left: G.feats.l, right: 130, top: G.feats.y, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        {features(frame, G.fchip)}
      </div>
    </SceneShell>
  );
};

/** the three e-readers fanned out (hook + cover) */
export const ReadersFan: React.FC<{ cx: number; cy: number; w: number; dx: number; enter?: (i: number) => { x: number; y: number; r: number; s: number } }> = ({ cx, cy, w, dx, enter }) => (
  <>
    {KEYS.map((k, i) => {
      const img = OFFICIAL[k];
      const ww = Math.min(w, (w * 1.05) / img.aspect);
      const e = enter?.(i) ?? { x: 0, y: 0, r: 0, s: 1 };
      return (
        <div key={k} style={{ position: "absolute", left: cx - ww / 2, top: cy - (ww * img.aspect) / 2, transform: `translate(${(i - 1) * dx + e.x}px, ${Math.abs(i - 1) * 34 + e.y}px) rotate(${(i - 1) * 9 + e.r}deg) scale(${e.s})`, filter: "drop-shadow(0 24px 30px rgba(6,14,90,0.45))", zIndex: i === 1 ? 3 : i }}>
          <ProductImage src={img.src} aspect={img.aspect} width={ww} />
        </div>
      );
    })}
  </>
);

/*
 * 0.0-4.75 s HOOK ("reading on your phone and your eyes get tired? here are the e-readers that will change your reading!")
 * visual: a drawn phone blasts harsh glare, Citybot gets tired eyes (face swap in direction.tsx) and a red
 * "FATIGUE DES YEUX" pill; then the phone is flung away and the three e-readers fly in as a fan.
 */
export const RHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const pAt = rev("hook.phone"), tAt = rev("hook.tired"), rAt = rev("hook.readers"), cAt = rev("hook.change"), kAt = rev("hook.reading");
  const sk = shake(frame, rAt, 16, 12);
  const phoneIn = sp(frame, pAt - 2, { damping: 12, stiffness: 170 });
  const fling = ramp(frame, rAt - 2, rAt + 8, (t) => t * t);
  const glare = frame < pAt ? 0 : (0.75 + 0.25 * Math.sin(frame * 1.7)) * (1 + 0.5 * ramp(frame, tAt, tAt + 6)) * (1 - fling);
  const PH = { cx: 505, cy: 560, w: 230, h: 380 };
  const fan = sp(frame, rAt, { damping: 13, stiffness: 150 });
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(255,60,90,0.3), rgba(255,60,90,0) 65%)", opacity: ramp(frame, tAt, tAt + 6) * (1 - ramp(frame, rAt - 2, rAt + 4)) }} />
      {/* title: phone question -> LES LISEUSES */}
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < rAt ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 68, color: "#fff", whiteSpace: "nowrap", textShadow: "0 10px 34px rgba(8,20,110,0.45)" }}>
            كتقرا <span style={{ background: "#fff", color: COLORS.blue, padding: "0 18px 8px", borderRadius: 18, opacity: ramp(frame, pAt, pAt + 4) }}>فالتيليفون</span>؟
          </div>
        ) : (
          <div style={{ ...slam(frame, rAt, 2.4), display: "flex", alignItems: "center", gap: 18, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "6px 36px 10px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>
            {frame >= kAt - 1 ? <LineIcon name="pages" size={70} stroke={9} color={COLORS.blue} progress={ramp(frame, kAt, kAt + 10)} /> : null}
            LES LISEUSES
          </div>
        )}
      </div>
      {/* drawn phone with harsh glare */}
      {frame < rAt + 10 && (
        <div style={{ position: "absolute", left: PH.cx - PH.w / 2, top: PH.cy - PH.h / 2, width: PH.w, height: PH.h, transform: `translate(${fling * 900}px, ${-fling * 200}px) rotate(${fling * 60 + Math.sin(frame * 0.4) * 2}deg) scale(${phoneIn})` }}>
          <svg width={PH.w * 3} height={PH.h * 2} viewBox={`${-PH.w} ${-PH.h / 2} ${PH.w * 3} ${PH.h * 2}`} style={{ position: "absolute", left: -PH.w, top: -PH.h / 2, opacity: glare }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2 + frame * 0.03;
              const r0 = 140, r1 = 250 + 30 * Math.sin(frame * 0.9 + i);
              const cx = PH.w / 2, cy = PH.h / 2;
              return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0 * 1.2} x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1 * 1.05} stroke="#FFF6B0" strokeWidth={12} strokeLinecap="round" />;
            })}
          </svg>
          <div style={{ position: "absolute", inset: 0, borderRadius: 40, border: "12px solid #fff", background: COLORS.navy, boxShadow: `0 0 ${60 + 60 * glare}px rgba(255,250,200,${0.5 * glare + 0.2})` }}>
            <div style={{ position: "absolute", inset: 14, borderRadius: 24, background: "#FFFFF2", overflow: "hidden", display: "flex", flexDirection: "column", gap: 16, padding: "40px 22px" }}>
              {[1, 0.9, 1, 0.7, 1, 0.85, 1, 0.6].map((k, i) => <div key={i} style={{ height: 12, width: `${k * 100}%`, borderRadius: 6, background: "#c9cbd6" }} />)}
            </div>
          </div>
        </div>
      )}
      {/* eye-strain pill */}
      {frame >= tAt - 1 && frame < rAt && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 690, display: "flex", justifyContent: "center", zIndex: 10 }}>
          <div style={{ ...slam(frame, tAt, 2.4), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff", background: "#FF3B5C", padding: "6px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(80,0,20,0.45)", whiteSpace: "nowrap" }}>
            <LineIcon name="eye" size={58} stroke={9} color="#fff" progress={ramp(frame, tAt, tAt + 10)} />
            FATIGUE DES YEUX
          </div>
        </div>
      )}
      {/* the three e-readers fly in */}
      {frame >= rAt - 1 && (
        <ReadersFan cx={505} cy={540} w={340} dx={250} enter={(i) => {
          const p = sp(frame, rAt + i * 2, { damping: 13, stiffness: 150 });
          return { x: (1 - p) * (i - 1) * 700, y: (1 - p) * 900, r: (1 - p) * (i - 1) * 40, s: lerp(0.4, 1, p) * (1 + 0.04 * Math.sin((frame - cAt) * 0.3) * ramp(frame, cAt, cAt + 4)) };
        }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - rAt, [0, 1, 6], [0, 0.6, 0], clamp)) * fan }} />
    </SceneShell>
  );
};

/** 4.75-10.5 s Kobo Libra Colour: colour screen, page-turn buttons, write on it with the stylus. */
export const RKobo: React.FC = () => (
  <ProductScene
    id="kobo"
    sweeps={[rev("kobo.color"), rev("kobo.buttons")]}
    overlay={(frame, w, h) => {
      const cAt = rev("kobo.color"), bAt = rev("kobo.buttons"), tAt = rev("kobo.turn"), wAt = rev("kobo.write");
      const [x0, y0, x1, y1] = SCREEN.kobo;
      const sw = (x1 - x0) * w, sh = (y1 - y0) * h;
      // page turn: a page lifts off the screen from the left edge
      const flip = interpolate(frame, [tAt, tAt + 12], [0, 180], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
      // handwriting scribble in ink
      const N = 70;
      const pts = Array.from({ length: N + 1 }, (_, i) => {
        const t = i / N;
        return [x0 * w + sw * (0.14 + 0.62 * t + 0.03 * Math.sin(t * Math.PI * 12)), y0 * h + sh * (0.72 - 0.06 * Math.abs(Math.sin(t * Math.PI * 6)))];
      });
      const pw = ramp(frame, wAt, wAt + 18, (t) => t);
      const n = Math.max(2, Math.round(pts.length * pw));
      const d = pts.slice(0, n).map((q, i) => `${i ? "L" : "M"} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" ");
      const tip = pts[n - 1];
      return (
        <>
          <ColorWave frame={frame} at={cAt} rect={SCREEN.kobo} w={w} h={h} />
          {frame >= bAt - 1 && KOBO_BUTTONS.map(([bx, by], i) => {
            const k = ((frame - bAt - i * 4) % 18) / 18;
            return frame - bAt - i * 4 < 0 || frame > tAt + 14 ? null : (
              <div key={i} style={{ position: "absolute", left: bx * w - 40, top: by * h - 40, width: 80, height: 80, borderRadius: "50%", border: "6px solid #FFD25A", transform: `scale(${0.5 + k})`, opacity: 1 - k }} />
            );
          })}
          {frame >= tAt - 1 && frame <= tAt + 13 && (
            <div style={{ position: "absolute", left: x0 * w, top: y0 * h, width: sw, height: sh, perspective: 1400 }}>
              <div style={{ position: "absolute", inset: 0, transformOrigin: "left center", transform: `rotateY(${-flip}deg)`, backfaceVisibility: "hidden", background: "linear-gradient(90deg,#f3f1ea,#e4e1d8)", boxShadow: `${-20 * Math.sin((flip * Math.PI) / 180)}px 0 40px rgba(0,0,0,0.25)`, display: "flex", flexDirection: "column", gap: sh * 0.035, padding: `${sh * 0.1}px ${sw * 0.1}px` }}>
                {[1, 0.95, 1, 0.6, 1, 0.9, 1, 0.8, 1, 0.5].map((k, i) => <div key={i} style={{ height: sh * 0.018, width: `${k * 100}%`, borderRadius: 4, background: i === 4 ? "#f2d27a" : "#a9a8a3" }} />)}
              </div>
            </div>
          )}
          {frame >= wAt - 1 && (
            <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <path d={d} fill="none" stroke="#2B4BDB" strokeWidth={w * 0.009} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {frame >= wAt - 1 && (
            <div style={{ position: "absolute", left: tip[0] - 4, top: tip[1] - w * 0.2 + 6, transform: "rotate(0deg)" }}>
              <LineIcon name="pen" size={w * 0.2} stroke={7} color={COLORS.navy} />
            </div>
          )}
        </>
      );
    }}
    specs={(frame, size) => <Chip frame={frame} at={rev("kobo.color")} text="Écran couleur" icon="palette" size={size} solid />}
    features={(frame, size) => (
      <>
        <Chip frame={frame} at={rev("kobo.buttons")} text="Boutons pour tourner les pages" icon="pages" size={size * 0.86} />
        <Chip frame={frame} at={rev("kobo.write")} text="Écrire au stylet" icon="pen" size={size} solid />
      </>
    )}
    extra={(frame) => <Footnote frame={frame} at={rev("kobo.stylus")} top={1272} text="Kobo Stylus 2 vendu séparément" align="center" />}
  />
);

/** 10.5-16.5 s Kindle Colorsoft 16GB Black: colour screen, great for books, comics and magazines. */
export const RColorsoft: React.FC = () => (
  <ProductScene
    id="colorsoft"
    from={1}
    sweeps={[rev("colorsoft.sto"), rev("colorsoft.color")]}
    overlay={(frame, w, h) => <ColorWave frame={frame} at={rev("colorsoft.color")} rect={SCREEN.colorsoft} w={w} h={h} />}
    extra={(frame) => (
      // content bubbles pop out of the screen: book, comic, magazine
      <>
        {([["colorsoft.books", "book", 470], ["colorsoft.comics", "comic", 640], ["colorsoft.mags", "magazine", 810]] as const).map(([k, icon, y], i) => {
          const at = rev(k);
          if (frame < at - 1) return null;
          const p = pop(frame, at);
          return (
            <div key={k} style={{ position: "absolute", left: 800, top: y, width: 128, height: 128, borderRadius: "50%", background: i === 1 ? "linear-gradient(135deg,#FFD25A,#FF8A3D)" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `translate(${(1 - p) * -200}px, ${Math.sin(frame * 0.12 + i) * 6}px) scale(${p})`, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>
              <LineIcon name={icon} size={78} stroke={8} color={i === 1 ? "#fff" : COLORS.blue} progress={ramp(frame, at, at + 10)} />
            </div>
          );
        })}
      </>
    )}
    specs={(frame, size) => (
      <>
        <Chip frame={frame} at={rev("colorsoft.sto")} text="16GB" icon="box" size={size} solid />
        <Chip frame={frame} at={rev("colorsoft.black")} text="Black" swatch="#16171b" size={size} />
        <Chip frame={frame} at={rev("colorsoft.color")} text="Écran couleur" icon="palette" size={size} solid />
      </>
    )}
    features={(frame, size) => (
      <>
        <Chip frame={frame} at={rev("colorsoft.books")} text="Livres" icon="book" size={size} />
        <Chip frame={frame} at={rev("colorsoft.comics")} text="BD" icon="comic" size={size} />
        <Chip frame={frame} at={rev("colorsoft.mags")} text="Magazines" icon="magazine" size={size} solid />
      </>
    )}
  />
);

/** 16.5-22.5 s Kindle Paperwhite 12th gen 16GB Black: fast, light, battery lasts weeks. */
export const RPaperwhite: React.FC = () => (
  <ProductScene
    id="paperwhite"
    sub={{ at: rev("paperwhite.gen"), text: "12e génération" }}
    sweeps={[rev("paperwhite.sto"), rev("paperwhite.fast")]}
    overlay={(frame, w, h) => {
      const fAt = rev("paperwhite.fast");
      if (frame < fAt - 1 || frame > fAt + 20) return null;
      // speed streaks
      const o = interpolate(frame, [fAt, fAt + 3, fAt + 14, fAt + 20], [0, 1, 1, 0], clamp);
      return (
        <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: o }}>
          {[0.3, 0.45, 0.6, 0.75].map((y, i) => {
            const x = -40 - ((frame - fAt) * 18 + i * 30) % 120;
            return <line key={i} x1={x} y1={y * h} x2={x - 120 - i * 20} y2={y * h} stroke="#fff" strokeWidth={10} strokeLinecap="round" />;
          })}
        </svg>
      );
    }}
    extra={(frame) => {
      const lAt = rev("paperwhite.light"), bAt = rev("paperwhite.battery"), wAt = rev("paperwhite.weeks");
      // one-hand photo card on "light" (left of the hero), then a battery gauge + "DES SEMAINES" label (right of it)
      const inP = sp(frame, lAt, { damping: 13, stiffness: 150 });
      const img = OFFICIAL.hand;
      const cw = 250;
      const fill = interpolate(frame, [bAt, wAt + 6], [0.15, 1], clamp);
      return (
        <>
          {frame >= lAt - 1 && (
            <div style={{ position: "absolute", left: 40, top: 640, width: cw, transform: `translate(${(1 - inP) * -500}px, 0) rotate(${-7 + 3 * inP}deg)`, background: "#fff", padding: 10, paddingBottom: 50, borderRadius: 18, boxShadow: "0 22px 50px rgba(6,14,90,0.45)" }}>
              <ProductImage src={img.src} aspect={img.aspect} width={cw - 20} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 6, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: COLORS.blue }}>Légère</div>
            </div>
          )}
          {frame >= bAt - 1 && (
            <div style={{ position: "absolute", left: 770, top: 520, transform: `scale(${pop(frame, bAt)}) rotate(-6deg)` }}>
              <div style={{ width: 150, height: 76, borderRadius: 18, border: "7px solid #fff", padding: 6, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", background: "rgba(6,14,90,0.25)" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 10, background: "linear-gradient(90deg,#2BD96B,#9CFFB8)" }} />
              </div>
              <div style={{ position: "absolute", right: -18, top: 24, width: 12, height: 28, borderRadius: 4, background: "#fff" }} />
            </div>
          )}
          {frame >= wAt - 1 && (
            <div style={{ position: "absolute", left: 762, top: 628, ...slam(frame, wAt, 2.4) }}>
              <div style={{ transform: "rotate(-6deg)", background: "linear-gradient(90deg,#FFD25A,#FFB020)", color: "#3a2500", fontFamily: FONT, fontWeight: 900, fontSize: 32, lineHeight: 1.05, textAlign: "center", padding: "8px 16px 10px", borderRadius: 14, boxShadow: "0 16px 40px rgba(6,14,90,0.45)" }}>
                DES<br />SEMAINES
              </div>
            </div>
          )}
          <Footnote frame={frame} at={wAt} top={1272} text="Autonomie variable selon l'usage" align="center" />
        </>
      );
    }}
    specs={(frame, size) => (
      <>
        <Chip frame={frame} at={rev("paperwhite.sto")} text="16GB" icon="box" size={size} solid />
        <Chip frame={frame} at={rev("paperwhite.black")} text="Black" swatch="#16171b" size={size} />
      </>
    )}
    features={(frame, size) => (
      <>
        <Chip frame={frame} at={rev("paperwhite.fast")} text="Rapide" icon="bolt" size={size} />
        <Chip frame={frame} at={rev("paperwhite.light")} text="Légère" icon="feather" size={size} />
        <Chip frame={frame} at={rev("paperwhite.battery")} text="Batterie" icon="battery" size={size} solid />
      </>
    )}
  />
);

/** 22.5-26.5 s E Ink screen that doesn't tire the eyes + water resistant (shown on all three). */
export const REink: React.FC = () => {
  const frame = useSceneFrame("eink");
  const s0 = rscene("eink").from;
  const eAt = rev("eink.eink"), yAt = rev("eink.eyes"), wAt = rev("eink.water");
  const H = 300, gap = 28;
  const ws = KEYS.map((k) => H / OFFICIAL[k].aspect);
  const total = ws.reduce((a, b) => a + b, 0) + gap * 2;
  let x = 505 - total / 2;
  const top = 470;
  return (
    <SceneShell id="eink">
      <Burst x={505} y={top + H / 2} r={900} rot={frame * 0.5} opacity={0.14} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 250, display: "flex", justifyContent: "center" }}>
        {frame >= eAt - 1 ? (
          <div style={{ ...slam(frame, eAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 84, padding: "4px 40px 10px", borderRadius: 26, whiteSpace: "nowrap", boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>ÉCRAN E INK</div>
        ) : (
          <div style={{ ...slam(frame, s0 + 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", letterSpacing: 4, whiteSpace: "nowrap", textShadow: "0 10px 30px rgba(8,20,110,0.4)" }}>LES 3 LISEUSES</div>
        )}
      </div>
      {KEYS.map((k, i) => {
        const img = OFFICIAL[k];
        const w = ws[i];
        const left = x;
        x += w + gap;
        const p = sp(frame, s0 + i * 3, { damping: 13, stiffness: 140 });
        return (
          <div key={k} style={{ position: "absolute", left, top: top + Math.sin(frame * 0.1 + i) * 6, width: w, transform: `translateY(${(1 - p) * 700}px)`, filter: "drop-shadow(0 24px 30px rgba(6,14,90,0.45))" }}>
            <ProductImage src={img.src} aspect={img.aspect} width={w} sweep={interpolate(frame, [eAt, eAt + 16], [-0.3, 1.3], clamp)} />
          </div>
        );
      })}
      {/* water drops falling onto the three devices */}
      {frame >= wAt - 1 && (
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {Array.from({ length: 14 }).map((_, i) => {
            const dx = 130 + ((i * 263) % 760);
            const t0 = wAt + (i % 7) * 3;
            const yy = interpolate(frame, [t0, t0 + 14], [300, top + 40 + ((i * 97) % 160)], clamp);
            const o = interpolate(frame, [t0, t0 + 2, t0 + 22, t0 + 30], [0, 1, 1, 0], clamp);
            return <path key={i} transform={`translate(${dx} ${yy}) scale(0.9)`} d="M0 -26 C0 -26 -16 -4 -16 6 A16 16 0 0 0 16 6 C16 -4 0 -26 0 -26 Z" fill="#BFF4FF" stroke="#fff" strokeWidth={4} opacity={o} />;
          })}
        </svg>
      )}
      <div style={{ position: "absolute", left: 60, right: 130, top: 860, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        <Chip frame={frame} at={yAt} text="Ne fatigue pas les yeux" icon="eye" size={42} solid />
      </div>
      <div style={{ position: "absolute", left: 340, right: 130, top: 970, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        <Chip frame={frame} at={wAt} text="Résistantes à l'eau" icon="drop" size={40} />
      </div>
      <Footnote frame={frame} at={wAt} top={1062} text="IPX8 : jusqu'à 2 m, 60 min (eau douce)" align="center" />
    </SceneShell>
  );
};
