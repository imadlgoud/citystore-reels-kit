import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { pop, ramp, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { ProductHook } from "../../components/ProductHook";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, txev, txscene } from "./timeline";

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

/*
 * 0.0-4.0 s HOOK ("your PC's Wi-Fi still keeps dropping? don't buy a USB Wi-Fi dongle before you see this!")
 * product-first: the card + antenna base from frame 0 with the hook pill; a Wi-Fi sign flickers and gets slashed at
 * "كيقطع"; at "ما تشريش" the pill punches and a USB dongle gets a red cross.
 */
export const TXHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const cAt = txev("hook.cut"), dAt = txev("hook.dont"), uAt = txev("hook.usb");
  const flicker = frame < cAt ? (Math.floor(frame / 4) % 3 === 0 ? 1 : 2) : 0;
  return (
    <ProductHook src={OFFICIAL.full.src} aspect={OFFICIAL.full.aspect} width={540} top={430} cx={545} hook="الـ Wi-Fi ديال الـ PC كيقطع؟" punch={{ at: dAt, text: "ما تشريش clé USB Wi-Fi!" }}>
      {/* weak / dropping Wi-Fi sign, slashed at "كيقطع" */}
      <div style={{ position: "absolute", left: 120, top: 430, width: 170, height: 170, borderRadius: "50%", background: "rgba(255,255,255,0.16)", border: "4px solid rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6 }}>
        <WifiGlyph size={120} level={flicker} />
        {frame >= cAt - 1 && (
          <svg width={170} height={170} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={34} y1={34} x2={34 + 102 * ramp(frame, cAt, cAt + 6)} y2={34 + 102 * ramp(frame, cAt, cAt + 6)} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          </svg>
        )}
      </div>
      {/* USB Wi-Fi dongle crossed out */}
      {frame >= uAt - 1 && (
        <div style={{ position: "absolute", left: 80, top: 660, transform: `scale(${1.45 * pop(frame, uAt)}) rotate(-12deg)`, transformOrigin: "left top", zIndex: 6 }}>
          <svg width={190} height={120} viewBox="0 0 190 120">
            <rect x={10} y={30} width={120} height={60} rx={14} fill="#1C2333" stroke="#fff" strokeWidth={5} />
            <rect x={130} y={42} width={46} height={36} rx={4} fill="#C9CED8" stroke="#fff" strokeWidth={4} />
            <rect x={146} y={52} width={10} height={8} fill="#6B7280" /><rect x={160} y={52} width={10} height={8} fill="#6B7280" />
            <text x={70} y={68} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={22} fill="#fff">USB</text>
          </svg>
          <svg width={190} height={120} viewBox="0 0 190 120" style={{ position: "absolute", left: 0, top: 0 }}>
            <path d="M40 10 L150 110 M150 10 L40 110" stroke={RED} strokeWidth={14} strokeLinecap="round" opacity={ramp(frame, uAt + 3, uAt + 7)} />
          </svg>
        </div>
      )}
    </ProductHook>
  );
};

/** 4.0-8.75 s INTRO: TP-Link Archer TX3000E, PCIe card · Wi-Fi 6 · Bluetooth 5.0, DISPONIBLE. */
export const TXIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = txev("intro.name"), mAt = txev("intro.model"), pAt = txev("intro.pcie"), wAt = txev("intro.wifi"), bAt = txev("intro.bt"), dAt = txev("intro.dispo");
  const from = txscene("intro").from;
  return (
    <SceneShell id="intro">
      <Burst x={540} y={720} r={950} rot={frame * 0.5} opacity={0.2 * ramp(frame, nAt, nAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 222, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 20 }}>
        {frame >= nAt - 1 && <div style={{ ...slam(frame, nAt, 1.8), fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 6, textShadow }}>TP-LINK</div>}
        {frame >= mAt - 1 && <div style={{ ...slam(frame, mAt, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#fff", whiteSpace: "nowrap", textShadow }}>Archer TX3000E</div>}
      </div>
      <div style={{ position: "absolute", left: 545 - 230, top: 430, ...slam(frame, from + 2, 2.2) }}>
        <Img k="full" w={460} sweep={interpolate(frame, [mAt + 2, mAt + 20], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1000} left={60}>
        <Chip frame={frame} at={pAt} text="Carte PCIe" icon="chip" size={34} solid />
        <Chip frame={frame} at={wAt} text="Wi-Fi 6" glyph={<WifiGlyph size={40} color={COLORS.blue} />} size={34} solid />
        <Chip frame={frame} at={bAt} text="Bluetooth 5.0" glyph={<BtGlyph size={40} color={COLORS.blue} />} size={34} solid />
      </Row>
      <Row top={1110}>
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

/** 8.75-15.5 s Wi-Fi 6 AX3000: up to 2400 Mbps, fast downloads, stable connection for gaming. */
export const TXWifi: React.FC = () => {
  const frame = useSceneFrame("wifi");
  const nAt = txev("wf.name"), aAt = txev("wf.ax"), sAt = txev("wf.speed"), dAt = txev("wf.dl"), cAt = txev("wf.stable"), gAt = txev("wf.gaming");
  const enter = sp(frame, txscene("wifi").from, { damping: 13, stiffness: 120 });
  const count = Math.round(2400 * easeOut(ramp(frame, sAt, sAt + 22)));
  const t = frame / 30;
  return (
    <SceneShell id="wifi">
      <Title frame={frame} at={nAt}>
        <WifiGlyph size={64} color={COLORS.blue} />Wi-Fi 6{frame >= aAt - 1 && <span style={{ display: "inline-block", transform: `scale(${pop(frame, aAt)})` }}>· AX3000</span>}
      </Title>
      <div style={{ position: "absolute", left: 545 - 215, top: 340, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="card" w={430} />
      </div>
      {/* speed streaks behind the counter */}
      {frame >= sAt - 1 && (
        <svg width={1080} height={300} style={{ position: "absolute", left: 0, top: 740 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = ((t * 900 + i * 230) % 1300) - 200;
            return <line key={i} x1={x} y1={40 + i * 50} x2={x + 160} y2={40 + i * 50} stroke={CYAN} strokeWidth={6} strokeLinecap="round" opacity={0.55 * ramp(frame, sAt, sAt + 6)} />;
          })}
        </svg>
      )}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 715, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${pop(frame, sAt)})` }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#fff", textShadow }}>jusqu'à</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow, lineHeight: 1 }}>
            <span style={{ fontSize: 150 }}>{count}</span><span style={{ fontSize: 56 }}>Mbps</span>
          </div>
        </div>
      )}
      <Row top={955} left={60}>
        <Chip frame={frame} at={dAt} text="Téléchargement rapide" icon="bolt" size={30} solid />
      </Row>
      <Row top={1030} left={60}>
        <Chip frame={frame} at={cAt} text="Connexion stable" glyph={<WifiGlyph size={36} color={COLORS.blue} />} size={30} solid />
        <Chip frame={frame} at={gAt} text="Gaming" icon="controller" size={30} solid />
      </Row>
      <Footnote frame={frame} at={sAt + 6} top={1130} text="Jusqu'à 2402 Mbps (5 GHz). Débit réel selon le routeur ; Wi-Fi 6 avec un routeur Wi-Fi 6." />
    </SceneShell>
  );
};

/** 15.5-19.0 s Bluetooth 5.0: headset, controller, mouse, wireless. */
export const TXBt: React.FC = () => {
  const frame = useSceneFrame("bt");
  const nAt = txev("bt.name"), hAt = txev("bt.head"), pAt = txev("bt.pad"), mAt = txev("bt.mouse"), fAt = txev("bt.free");
  const hub = { x: 545, y: 560 };
  const devices = [
    { at: hAt, x: 260, y: 860, label: "Casque", node: <LineIcon name="headphones" size={84} stroke={8} color={COLORS.blue} /> },
    { at: pAt, x: 545, y: 930, label: "Manette", node: <LineIcon name="controller" size={84} stroke={8} color={COLORS.blue} /> },
    { at: mAt, x: 830, y: 860, label: "Souris", node: <MouseGlyph size={84} color={COLORS.blue} /> },
  ];
  const t = frame / 30;
  return (
    <SceneShell id="bt">
      <Title frame={frame} at={nAt}>
        <BtGlyph size={64} color={COLORS.blue} stroke={9} />Bluetooth 5.0
      </Title>
      <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {devices.map((d, i) => {
          if (frame < d.at - 1) return null;
          const p = ramp(frame, d.at, d.at + 8);
          return <line key={i} x1={hub.x} y1={hub.y} x2={hub.x + (d.x - hub.x) * p} y2={hub.y + (d.y - hub.y) * p} stroke="#fff" strokeWidth={6} strokeDasharray="14 12" strokeDashoffset={-t * 60} opacity={0.85} />;
        })}
        {[0, 1].map((i) => {
          const r = 120 + ((t * 70 + i * 60) % 120);
          return <circle key={i} cx={hub.x} cy={hub.y} r={r} fill="none" stroke={CYAN} strokeWidth={5} opacity={Math.max(0, 1 - (r - 120) / 120) * ramp(frame, nAt, nAt + 8)} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: hub.x - 110, top: hub.y - 110, width: 220, height: 220, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 40px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, nAt)})` }}>
        <BtGlyph size={150} color={COLORS.blue} stroke={8} />
      </div>
      {devices.map((d, i) =>
        frame < d.at - 1 ? null : (
          <div key={i} style={{ position: "absolute", left: d.x - 80, top: d.y - 80, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${pop(frame, d.at)})` }}>
            <div style={{ width: 160, height: 160, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(6,14,90,0.35)" }}>{d.node}</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: "#fff", textShadow }}>{d.label}</div>
          </div>
        ),
      )}
      <Row top={1130}>
        <Chip frame={frame} at={fAt} text="Sans fil" glyph={<BtGlyph size={40} color={COLORS.blue} />} size={36} solid />
      </Row>
      <Footnote frame={frame} at={fAt} top={1225} text="Bluetooth : câble USB fourni à brancher sur la carte mère." />
    </SceneShell>
  );
};

/** 19.0-22.5 s two antennas on a magnetic base; put them where you want for the best signal. */
export const TXAnt: React.FC = () => {
  const frame = useSceneFrame("ant");
  const nAt = txev("an.name"), gAt = txev("an.mag"), mAt = txev("an.move"), bAt = txev("an.best");
  const enter = sp(frame, txscene("ant").from, { damping: 13, stiffness: 120 });
  // "put them wherever you want": the base glides left, right, then settles
  const slide = interpolate(frame, [mAt, mAt + 10, mAt + 22, mAt + 32], [0, -170, 150, 0], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 2) });
  const t = frame / 30;
  const w = 290, x = 545 - w / 2 + slide, top = 360;
  return (
    <SceneShell id="ant">
      <Title frame={frame} at={nAt}>
        <LineIcon name="signal" size={62} stroke={8} color={COLORS.blue} />2 antennes
      </Title>
      {frame >= bAt - 1 && (
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[0, 1, 2].map((i) => {
            const r = 60 + ((t * 120 + i * 70) % 210);
            return <circle key={i} cx={545 + slide} cy={top + 40} r={r} fill="none" stroke={CYAN} strokeWidth={6} opacity={Math.max(0, 1 - (r - 60) / 210) * ramp(frame, bAt, bAt + 6)} />;
          })}
        </svg>
      )}
      <div style={{ position: "absolute", left: x, top, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="base" w={w} />
      </div>
      {frame >= mAt - 1 && frame < bAt && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 1010, display: "flex", justifyContent: "center", gap: 360, opacity: ramp(frame, mAt, mAt + 6) * (1 - ramp(frame, bAt - 6, bAt)) }}>
          {["M60 20 L20 50 L60 80", "M20 20 L60 50 L20 80"].map((d, i) => (
            <svg key={i} width={80} height={100} viewBox="0 0 80 100"><path d={d} fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></svg>
          ))}
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={gAt} text="Base magnétique" icon="magnet" size={34} solid />
        <Chip frame={frame} at={bAt} text="Meilleur signal" glyph={<WifiGlyph size={40} color={COLORS.blue} />} size={34} solid />
      </Row>
    </SceneShell>
  );
};
