import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { pop, ramp, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { ProductHook } from "../../components/ProductHook";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, nev, nscene } from "./timeline";

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

/** frozen phone with a spinning loader (hook gag) */
const FrozenPhone: React.FC<{ frame: number; size: number; frozen: boolean }> = ({ frame, size, frozen }) => (
  <svg viewBox="0 0 100 170" width={size} height={size * 1.7}>
    <rect x={6} y={4} width={88} height={162} rx={16} fill="#1C2333" stroke="#fff" strokeWidth={6} />
    <rect x={15} y={18} width={70} height={134} rx={8} fill={frozen ? "#3B4256" : "#2E3EFE"} />
    <g transform={`translate(50 85) rotate(${frozen ? 40 : frame * 18})`}>
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-3} y={-24} width={6} height={12} rx={3} fill="#fff" opacity={0.25 + (i / 8) * 0.75} transform={`rotate(${i * 45})`} />)}
    </g>
  </svg>
);

/*
 * 0.0-4.0 s HOOK ("your phone got slow and keeps freezing? it's not your fault... time to change it!")
 * product-first: the four Note 15 5G from frame 0 with the hook pill; a phone with a spinning loader freezes on
 * "كيتبلوكا" (red "!"), and "وقت تبدال!" punches in.
 */
export const NHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const sAt = nev("hook.slow"), fAt = nev("hook.freeze"), cAt = nev("hook.change");
  const frozen = frame >= fAt;
  return (
    <ProductHook src={OFFICIAL.full.src} aspect={OFFICIAL.full.aspect} width={640} top={470} cx={560} hook="التيليفون ديالك كيتقال؟" punch={{ at: cAt, text: "وقت تبدال!" }}>
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 740, top: 900, transform: `scale(${pop(frame, sAt)}) rotate(8deg)`, zIndex: 6 }}>
          <FrozenPhone frame={frame} size={150} frozen={frozen} />
          {frozen && (
            <div style={{ position: "absolute", right: -26, top: -22, width: 66, height: 66, borderRadius: "50%", background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 46, lineHeight: "66px", textAlign: "center", border: "5px solid #fff", transform: `scale(${pop(frame, fAt)})` }}>!</div>
          )}
        </div>
      )}
    </ProductHook>
  );
};

/** 4.0-8.25 s INTRO: Redmi Note 15 5G, the new Redmi, DISPONIBLE. */
export const NIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = nev("intro.name"), gAt = nev("intro.g5"), wAt = nev("intro.new"), dAt = nev("intro.dispo");
  const from = nscene("intro").from;
  return (
    <SceneShell id="intro">
      <Burst x={540} y={700} r={950} rot={frame * 0.5} opacity={0.2 * ramp(frame, nAt, nAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 222, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 20 }}>
        {frame >= nAt - 1 && <div style={{ ...slam(frame, nAt, 1.8), fontFamily: FONT, fontWeight: 900, fontSize: 50, color: "#fff", letterSpacing: 8, textShadow }}>REDMI</div>}
        {frame >= nAt + 4 && <div style={{ ...slam(frame, nAt + 5, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: 96, color: "#fff", whiteSpace: "nowrap", textShadow }}>Note 15 <span style={{ background: "#fff", color: COLORS.blue, padding: "0 18px 4px", borderRadius: 18, textShadow: "none", opacity: frame >= gAt - 1 ? 1 : 0 }}>5G</span></div>}
      </div>
      <div style={{ position: "absolute", left: 545 - 290, top: 450, ...slam(frame, from + 2, 2.2) }}>
        <Img k="full" w={580} sweep={interpolate(frame, [nAt + 2, nAt + 20], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={960} left={340}>
        <Chip frame={frame} at={wAt} text="Nouveau" icon="spark" size={36} solid />
      </Row>
      <Row top={1060}>
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

/** 8.25-13.0 s RAM: 8 Go, apps open fast, switch between them without freezing. */
const APP_COLORS = ["#FF5A5F", "#22C55E", "#FFB020", "#2E3EFE", "#A855F7", "#06B6D4", "#F97316", "#EC4899", "#14B8A6"];
export const NRam: React.FC = () => {
  const frame = useSceneFrame("ram");
  const nAt = nev("ram.name"), aAt = nev("ram.apps"), fAt = nev("ram.fast"), sAt = nev("ram.switch"), bAt = nev("ram.nofreeze");
  const enter = sp(frame, nscene("ram").from, { damping: 13, stiffness: 120 });
  const w = 300, x = 160, y = 380;
  // app tiles pop in quickly, one after another, then a fast app switcher slides
  const slide = frame >= sAt ? ((frame - sAt) * 9) % 330 : 0;
  return (
    <SceneShell id="ram">
      <Title frame={frame} at={nAt}>
        <LineIcon name="chip" size={60} stroke={8} color={COLORS.blue} />8 Go de RAM
      </Title>
      <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="front" w={w} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 430, width: 360, display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: 20 }}>
        {APP_COLORS.map((c, i) => {
          const at = aAt + i * 2;
          return frame < at - 1 ? <div key={i} style={{ width: 100, height: 100 }} /> : (
            <div key={i} style={{ width: 100, height: 100, borderRadius: 26, background: c, transform: `scale(${pop(frame, at)}) translateX(${frame >= sAt ? -Math.sin((frame - sAt + i * 3) / 4) * 6 : 0}px)`, boxShadow: "0 10px 24px rgba(6,14,90,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.85)" }} />
            </div>
          );
        })}
      </div>
      {frame >= sAt - 1 && (
        <svg width={360} height={40} style={{ position: "absolute", left: 540, top: 820 }}>
          <rect x={0} y={14} width={360} height={12} rx={6} fill="rgba(255,255,255,0.25)" />
          <rect x={slide} y={10} width={30} height={20} rx={10} fill="#fff" />
        </svg>
      )}
      <Row top={1000} left={60}>
        <Chip frame={frame} at={fAt} text="Apps rapides" icon="bolt" size={32} solid />
        <Chip frame={frame} at={bAt} text="Sans blocage" icon="check" size={32} solid />
      </Row>
    </SceneShell>
  );
};

/** 13.0-16.0 s 5G: fast internet, the video doesn't cut. */
export const NNet: React.FC = () => {
  const frame = useSceneFrame("net");
  const nAt = nev("net.name"), fAt = nev("net.fast"), vAt = nev("net.video");
  const t = frame / 30;
  const prog = ramp(frame, vAt, vAt + 60, (x) => x);
  return (
    <SceneShell id="net">
      <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[0, 1, 2].map((i) => {
          const r = 120 + ((t * 120 + i * 80) % 240);
          return <circle key={i} cx={545} cy={520} r={r} fill="none" stroke={CYAN} strokeWidth={6} opacity={Math.max(0, 1 - (r - 120) / 240) * ramp(frame, nAt, nAt + 8)} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 70, top: 380, display: "flex", justifyContent: "center", transform: `scale(${pop(frame, nAt)})` }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 260, color: "#fff", textShadow, lineHeight: 1 }}>5G</div>
      </div>
      {frame >= vAt - 1 && (
        <div style={{ position: "absolute", left: 200, right: 200, top: 720, transform: `scale(${pop(frame, vAt)})`, background: "#0B1236", borderRadius: 24, padding: 18, boxShadow: "0 16px 40px rgba(6,14,90,0.45)" }}>
          <div style={{ height: 300, borderRadius: 14, background: `linear-gradient(135deg, #2E3EFE, #06B6D4)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LineIcon name="play" size={110} stroke={7} color="#fff" />
          </div>
          <div style={{ marginTop: 16, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.2)" }}>
            <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 6, background: RED }} />
          </div>
        </div>
      )}
      <Row top={1080} left={300}>
        <Chip frame={frame} at={fAt} text="Internet rapide" icon="signal" size={32} solid />
        <Chip frame={frame} at={vAt} text="Vidéo sans coupure" icon="play" size={32} solid />
      </Row>
    </SceneShell>
  );
};

/** 16.0-21.25 s CAMERA: 108 MP, clear photos, even small details. */
export const NCam: React.FC = () => {
  const frame = useSceneFrame("cam");
  const nAt = nev("cam.name"), mAt = nev("cam.mp"), cAt = nev("cam.clear"), dAt = nev("cam.detail");
  const enter = sp(frame, nscene("cam").from, { damping: 13, stiffness: 120 });
  const count = Math.round(108 * easeOut(ramp(frame, mAt, mAt + 18)));
  const w = 320, x = 215, y = 350;
  const zoom = 1 + 0.18 * easeOut(ramp(frame, dAt, dAt + 20));
  return (
    <SceneShell id="cam">
      <Title frame={frame} at={nAt}>
        <LineIcon name="lens" size={60} stroke={8} color={COLORS.blue} />Caméra
      </Title>
      <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - enter) * 900}px) scale(${zoom})`, transformOrigin: "50% 15%" }}>
        <Img k="back" w={w} />
      </div>
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: x + w * 0.2, top: y + 10, width: w * 0.6, height: w * 0.6, border: "6px solid #fff", borderRadius: 20, opacity: ramp(frame, cAt, cAt + 6) * (1 - ramp(frame, dAt, dAt + 10)), boxShadow: `0 0 30px ${CYAN}` }} />
      )}
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: 610, top: 460, display: "flex", flexDirection: "column", alignItems: "flex-start", transform: `scale(${pop(frame, mAt)})` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, color: "#fff", textShadow, lineHeight: 1 }}>{count}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#fff", textShadow, marginTop: -6 }}>MP</div>
        </div>
      )}
      <Row top={800} left={590} right={40}>
        <Chip frame={frame} at={cAt} text="Photos nettes" icon="check" size={32} solid />
        <Chip frame={frame} at={dAt} text="Chaque détail" icon="eye" size={32} solid />
      </Row>
    </SceneShell>
  );
};
