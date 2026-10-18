import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, rsev, rsscene } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type Img = { src: string; aspect: number };
type Key = "note15" | "proplus" | "note14";
const KEYS: Key[] = ["note15", "proplus", "note14"];

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

const SPECS: Record<Key, { idx: number; brand: string; model: string }> = {
  note15: { idx: 1, brand: "REDMI", model: "Note 15 5G" },
  proplus: { idx: 2, brand: "REDMI", model: "Note 14 Pro+ 5G" },
  note14: { idx: 3, brand: "REDMI", model: "Note 14 5G" },
};

/** condition chip: green for new & sealed, orange for open box */
const Cond: React.FC<{ frame: number; at: number; text: string; open?: boolean }> = ({ frame, at, text, open }) => {
  if (frame < at - 1) return null;
  const p = sp(frame, at, { damping: 11, stiffness: 220, mass: 0.6 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 22px", borderRadius: 999, background: open ? "linear-gradient(90deg,#FFB020,#FF7A1A)" : "#2BD96B", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 34, whiteSpace: "nowrap", transform: `scale(${p})`, boxShadow: "0 12px 30px rgba(6,14,90,0.3)" }}>
      <svg width={34} height={34} viewBox="0 0 100 100"><path d="M 20 52 L 42 74 L 82 28" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {text}
    </div>
  );
};

/** stamp badge over the top-right of the hero */
const Stamp: React.FC<{ frame: number; at: number; children: React.ReactNode; bg?: string; color?: string; size?: number; top?: number; right?: number }> = ({ frame, at, children, bg = "#fff", color = COLORS.blue, size = 46, top = 430, right = 120 }) => {
  if (frame < at - 1) return null;
  return (
    <div style={{ position: "absolute", right, top, ...slam(frame, at, 2.4) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, transform: "rotate(-8deg)", background: bg, color, fontFamily: FONT, fontWeight: 900, fontSize: size, padding: `${size * 0.08}px ${size * 0.4}px ${size * 0.14}px`, borderRadius: size * 0.3, boxShadow: "0 16px 40px rgba(6,14,90,0.45)", whiteSpace: "nowrap" }}>
        {children}
      </div>
    </div>
  );
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
  const nAt = Math.min(rsev(`${id}.name`), rsscene(id).from + 2);
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

/** the three phones fanned out (hook + cover) */
export const RedmiFan: React.FC<{ cx: number; cy: number; w: number; dx: number; enter?: (i: number) => { x: number; y: number; r: number; s: number } }> = ({ cx, cy, w, dx, enter }) => (
  <>
    {KEYS.map((k, i) => {
      const img = OFFICIAL[k];
      const ww = Math.min(w, (w * 1.0) / img.aspect);
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
 * 0.0-4.75 s HOOK ("three Redmi 5G... which one will you pick? here they are, available now")
 * visual: "3 REDMI 5G" title, the three phones flip past like cards under a big "?", then freeze in a fan
 *         and a DISPONIBLES pill slams in.
 */
export const RSHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const gAt = rsev("hook.g5"), wAt = rsev("hook.which"), cAt = rsev("hook.choose"), fAt = rsev("hook.fan"), dAt = rsev("hook.dispo");
  const sk = shake(frame, fAt, 16, 12);
  const fan = sp(frame, fAt, { damping: 13, stiffness: 150 });
  const qP = pop(frame, cAt);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={520} r={900} rot={frame * 0.6} opacity={0.22 * ramp(frame, fAt - 2, fAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center", zIndex: 20 }}>
        <div style={{ ...slam(frame, 2, 2), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 900, fontSize: 72, color: "#fff", whiteSpace: "nowrap", textShadow: "0 10px 34px rgba(8,20,110,0.45)" }}>
          3 REDMI
          {frame >= gAt - 1 && <span style={{ ...slam(frame, gAt, 2.4), background: "#fff", color: COLORS.blue, padding: "0 20px 6px", borderRadius: 16, textShadow: "none" }}>5G</span>}
        </div>
      </div>
      {/* flipping cards, then the fan */}
      {frame < fAt + 1 && frame >= wAt - 2 && KEYS.map((k, i) => {
        const img = OFFICIAL[k];
        const w = 360;
        const local = frame - wAt + 2 - i * 8;
        const cyc = ((local % 24) + 24) % 24;
        const x = interpolate(cyc, [0, 6, 10, 16], [900, 0, 0, -900], clamp);
        return (
          <div key={k} style={{ position: "absolute", left: 505 - w / 2, top: 560 - (w * img.aspect) / 2, transform: `translateX(${x}px) rotate(${x / 60}deg)`, filter: "drop-shadow(0 24px 30px rgba(6,14,90,0.45))", zIndex: i }}>
            <ProductImage src={img.src} aspect={img.aspect} width={w} />
          </div>
        );
      })}
      {frame >= fAt && <RedmiFan cx={505} cy={560} w={320} dx={230} enter={(i) => ({ x: (1 - fan) * (i - 1) * 300, y: 0, r: (1 - fan) * (i - 1) * -9, s: lerp(0.7, 1, fan) })} />}
      {frame >= cAt - 1 && frame < fAt + 4 && (
        <div style={{ position: "absolute", left: 505 - 70, top: 320, width: 140, height: 140, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 110, color: COLORS.blue, transform: `scale(${qP * (1 - ramp(frame, fAt, fAt + 4))}) rotate(${Math.sin(frame * 0.4) * 8}deg)`, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", zIndex: 10 }}>?</div>
      )}
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 690, display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, dAt, 2.2), display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", background: "#2BD96B", padding: "6px 30px 10px", borderRadius: 999, letterSpacing: 3, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="store" size={52} stroke={8} color="#fff" />
            DISPONIBLES
          </div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - fAt, [0, 1, 6], [0, 0.6, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 4.75-13.25 s Redmi Note 15 5G 8GB/256GB: the newest one; never opened, never activated, sealed box. */
export const RSNote15: React.FC = () => (
  <ProductScene
    id="note15"
    sweeps={[rsev("note15.ram"), rsev("note15.new")]}
    extra={(frame) => (
      <Stamp frame={frame} at={rsev("note15.new")} bg="#FF3B5C" color="#fff">NOUVEAU</Stamp>
    )}
    specs={(frame, size) => (
      <>
        <Chip frame={frame} at={rsev("note15.ram")} text="8GB RAM" icon="chip" size={size} solid />
        <Chip frame={frame} at={rsev("note15.sto")} text="256GB" icon="box" size={size} solid />
      </>
    )}
    features={(frame) => (
      <>
        <Cond frame={frame} at={rsev("note15.c1")} text="Jamais ouverte" />
        <Cond frame={frame} at={rsev("note15.c2")} text="Jamais activée" />
        <Cond frame={frame} at={rsev("note15.c3")} text="Boîte fermée" />
      </>
    )}
  />
);

/** 13.25-23.25 s Redmi Note 14 Pro+ 5G 12GB/512GB: 200 MP camera, very fast charging; open box, never activated. */
export const RSProPlus: React.FC = () => (
  <ProductScene
    id="proplus"
    from={1}
    sweeps={[rsev("proplus.ram"), rsev("proplus.cam")]}
    extra={(frame) => {
      const at = rsev("proplus.cam");
      const mp = Math.round(200 * (1 - Math.pow(1 - ramp(frame, at, at + 14), 3)));
      return (
        <Stamp frame={frame} at={at} size={52}>
          <LineIcon name="camera" size={58} stroke={8} color={COLORS.blue} progress={ramp(frame, at, at + 12)} />
          {mp} MP
        </Stamp>
      );
    }}
    specs={(frame, size) => (
      <>
        <Chip frame={frame} at={rsev("proplus.ram")} text="12GB RAM" icon="chip" size={size} solid />
        <Chip frame={frame} at={rsev("proplus.sto")} text="512GB" icon="box" size={size} solid />
      </>
    )}
    features={(frame, size) => (
      <>
        <Chip frame={frame} at={rsev("proplus.fast")} text="Charge rapide" icon="bolt" size={size * 0.9} />
        <Cond frame={frame} at={rsev("proplus.c1")} text="Boîte ouverte" open />
        <Cond frame={frame} at={rsev("proplus.c2")} text="Jamais activé" />
      </>
    )}
  />
);

/** 23.25-32.0 s Redmi Note 14 5G 8GB/256GB: lots of storage at a good price; open box, never activated. */
export const RSNote14: React.FC = () => (
  <ProductScene
    id="note14"
    sweeps={[rsev("note14.ram"), rsev("note14.space")]}
    extra={(frame) => (
      <Stamp frame={frame} at={rsev("note14.price")} bg="linear-gradient(90deg,#2BD96B,#1FB85A)" color="#fff">BON PRIX</Stamp>
    )}
    specs={(frame, size) => (
      <>
        <Chip frame={frame} at={rsev("note14.ram")} text="8GB RAM" icon="chip" size={size} solid />
        <Chip frame={frame} at={rsev("note14.sto")} text="256GB" icon="box" size={size} solid />
      </>
    )}
    features={(frame, size) => (
      <>
        <Chip frame={frame} at={rsev("note14.space")} text="Grand stockage" icon="box" size={size * 0.9} />
        <Cond frame={frame} at={rsev("note14.c1")} text="Boîte ouverte" open />
        <Cond frame={frame} at={rsev("note14.c2")} text="Jamais activé" />
      </>
    )}
  />
);
