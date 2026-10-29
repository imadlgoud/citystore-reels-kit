import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, pnev, pnscene } from "./timeline";

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

const GREEN = "#2BD96B";
type PK = keyof typeof OFFICIAL;
const NAMES: Record<PK, string> = { pro: "Pro", gen2: "2e gén.", gen1: "1re gén.", usbc: "USB-C" };

/** official pencil render, drawn vertically (tip down) at height h; rot in degrees around its centre */
const Pencil: React.FC<{ k: PK; h: number; rot?: number; sweep?: number }> = ({ k, h, rot = 0, sweep = -1 }) => {
  const w = h / OFFICIAL[k].aspect;
  return (
    <div style={{ width: w, height: h, transform: `rotate(${rot}deg)`, filter: SHADOW }}>
      <ProductImage src={OFFICIAL[k].src} aspect={OFFICIAL[k].aspect} width={w} sweep={sweep} />
    </div>
  );
};

/** drawn generic tablet (no logo): landscape or portrait; home = round home button (older iPad); children on the screen */
const Tablet: React.FC<{ x: number; y: number; w: number; h: number; home?: boolean; o?: number; s?: number; children?: React.ReactNode }> = ({ x, y, w, h, home, o = 1, s = 1, children }) => {
  const bz = home ? Math.min(w, h) * 0.06 : 16;
  const top = home ? h * 0.09 : bz, bottom = home ? h * 0.12 : bz;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s})`, borderRadius: home ? 34 : 30, background: "linear-gradient(135deg,#2a2d38,#121319)", boxShadow: "0 24px 50px rgba(6,14,90,0.45), inset 0 0 0 3px #8d93a3" }}>
      <div style={{ position: "absolute", left: bz, right: bz, top, bottom, borderRadius: home ? 6 : 16, overflow: "hidden", background: "linear-gradient(160deg,#f7f9ff,#dfe7ff)" }}>{children}</div>
      {home && <div style={{ position: "absolute", left: w / 2 - 18, bottom: bottom / 2 - 18, width: 36, height: 36, borderRadius: "50%", border: "3px solid #8d93a3" }} />}
    </div>
  );
};

/** handwriting stroke that thickens (pressure sensitivity), drawn on with progress p */
const PressureStroke: React.FC<{ w: number; h: number; p: number }> = ({ w, h, p }) => {
  const N = 14;
  const pts = Array.from({ length: N + 1 }, (_, i) => [w * 0.08 + (w * 0.84 * i) / N, h * 0.55 + Math.sin(i * 0.9) * h * 0.18]);
  const shown = Math.floor(N * p);
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      {pts.slice(0, shown).map((pt, i) => {
        const nx = pts[i + 1];
        return <path key={i} d={`M ${pt[0]} ${pt[1]} L ${nx[0]} ${nx[1]}`} stroke={COLORS.blue} strokeWidth={3 + i * 1.6} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/*
 * 0.0-5.5 s HOOK ("an Apple Pencil, but which one fits your iPad? here are all four, available here:")
 * visual: a pencil hovers over a drawn tablet with a big "?", then the four official pencils line up (horizontal rows,
 *         kept above Citybot) with their names; "4 modèles" + DISPONIBLES.
 */
export const PNHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const pAt = pnev("hook.pencil"), uAt = pnev("hook.unsure"), iAt = pnev("hook.ipad"), hAt = pnev("hook.here"), fAt = pnev("hook.four"), dAt = pnev("hook.dispo");
  const out = ramp(frame, hAt - 2, hAt + 6);
  const tab = sp(frame, iAt, { damping: 12, stiffness: 140 });
  const q = pop(frame, uAt);
  const sk = shake(frame, fAt, 12, 8);
  const ORDER: PK[] = ["pro", "gen2", "gen1", "usbc"];
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={540} y={520} r={900} rot={frame * 0.6} opacity={0.18 * ramp(frame, fAt, fAt + 6)} rays={20} />
      {out < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateX(${-out * 300}px)` }}>
          {frame >= iAt - 1 && <Tablet x={560 - 230} y={400} w={460} h={320} s={tab} />}
          {frame >= uAt - 1 && (
            <div style={{ position: "absolute", left: 560 - 70, top: 470, width: 140, height: 140, borderRadius: "50%", background: COLORS.blue, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 110, lineHeight: "140px", textAlign: "center", transform: `scale(${q})`, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>?</div>
          )}
          {frame >= pAt - 1 && (
            <div style={{ position: "absolute", left: 800, top: 300 + Math.sin(frame * 0.12) * 12, transform: `scale(${pop(frame, pAt)})` }}>
              <Pencil k="pro" h={420} rot={28} />
            </div>
          )}
        </div>
      )}
      {frame >= hAt - 1 &&
        ORDER.map((k, i) => {
          const at = fAt + i * 4;
          if (frame < at - 1) return null;
          const p = sp(frame, at, { damping: 12, stiffness: 170 });
          const H = 560;
          const W = H / OFFICIAL[k].aspect;
          return (
            <div key={k} style={{ position: "absolute", left: 0, top: 360 + i * 100, width: 1080, height: 80, transform: `translateX(${(1 - p) * 900}px)` }}>
              <div style={{ position: "absolute", left: 110, top: 14, width: 190, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: COLORS.blue, background: "#fff", borderRadius: 999, padding: "2px 0 6px", boxShadow: "0 10px 24px rgba(6,14,90,0.3)" }}>{NAMES[k]}</div>
              <div style={{ position: "absolute", left: 340 + H / 2 - W / 2, top: 40 - H / 2, transform: "rotate(90deg)" }}>
                <Pencil k={k} h={H} />
              </div>
            </div>
          );
        })}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, zIndex: 20 }}>
        {frame < hAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", textShadow, whiteSpace: "nowrap" }}>شمن وحدة كتمشي مع الآيباد ديالك؟</div>
        ) : (
          <>
            <div style={{ ...slam(frame, hAt, 2.2), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: "2px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>4 modèles</div>
            {frame >= dAt - 1 && (
              <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: GREEN, padding: "8px 22px", borderRadius: 999, letterSpacing: 2, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
                <LineIcon name="store" size={42} stroke={7} color="#fff" />DISPONIBLES
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - fAt, [0, 1, 6], [0, 0.4, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 5.5-10.5 s Apple Pencil Pro: squeeze to switch tools, barrel roll like a real pen, magnetic charging. */
export const PNPro: React.FC = () => {
  const frame = useSceneFrame("pro");
  const nAt = pnev("pro.name"), sAt = pnev("pro.squeeze"), tAt = pnev("pro.tools"), rAt = pnev("pro.roll"), cAt = pnev("pro.charge");
  const enter = sp(frame, pnscene("pro").from, { damping: 13, stiffness: 120 });
  const squeeze = frame >= sAt ? Math.max(0, Math.sin(((frame - sAt) / 10) * Math.PI)) * Math.exp(-(frame - sAt) / 20) : 0;
  const roll = ramp(frame, rAt, rAt + 24, (x) => x);
  const TOOLS: IconName[] = ["pen", "palette", "note", "spark"];
  return (
    <SceneShell id="pro">
      <Title frame={frame} at={nAt} pill size={56}>Apple Pencil Pro</Title>
      <div style={{ position: "absolute", left: 400, top: 360, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Pencil k="pro" h={640} rot={14} sweep={interpolate(frame, [nAt + 4, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      {/* squeeze arrows around the barrel */}
      {frame >= sAt - 1 && frame < rAt && (
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={`M ${330 + squeeze * 20} 640 l 50 0 m -18 -18 l 18 18 l -18 18`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d={`M ${560 - squeeze * 20} 640 l -50 0 m 18 -18 l -18 18 l 18 18`} stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {/* tool palette */}
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 600, top: 440, display: "flex", gap: 14, padding: "16px 20px", borderRadius: 30, background: "#fff", boxShadow: "0 16px 40px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, tAt)})`, transformOrigin: "left center" }}>
          {TOOLS.map((ic, i) => (
            <div key={ic} style={{ width: 66, height: 66, borderRadius: 18, background: i === Math.floor((frame - tAt) / 8) % 4 ? COLORS.blue : "#eef1fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LineIcon name={ic} size={48} stroke={7} color={i === Math.floor((frame - tAt) / 8) % 4 ? "#fff" : COLORS.blue} />
            </div>
          ))}
        </div>
      )}
      {/* barrel roll: elliptical arrow around the pencil */}
      {frame >= rAt - 1 && (
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <ellipse cx={470} cy={650} rx={110} ry={34} fill="none" stroke="#6CF3FF" strokeWidth={9} strokeDasharray={`${560 * roll} 600`} transform="rotate(14 470 650)" />
          {roll >= 1 && <path d="M 568 690 l 22 -6 l -6 22" stroke="#6CF3FF" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      )}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 600, display: "flex", alignItems: "center", gap: 8, transform: `scale(${pop(frame, cAt)})` }}>
          <LineIcon name="magnet" size={90} stroke={8} />
          <LineIcon name="bolt" size={80} stroke={8} color="#FFE07A" />
        </div>
      )}
      <Row top={1060}>
        <Chip frame={frame} at={sAt} text="Pressez : changez d'outil" icon="palette" size={32} solid />
        <Chip frame={frame} at={rAt} text="Rotation comme un vrai stylo" icon="pen" size={32} />
        <Chip frame={frame} at={cAt} text="Charge magnétique" icon="magnet" size={32} solid />
      </Row>
      <Footnote frame={frame} at={nAt + 10} top={1262} text="Compatibilité selon le modèle d'iPad" />
    </SceneShell>
  );
};

/** 10.5-16.0 s Apple Pencil 2nd gen: pressure sensitive, double tap, attaches and charges on the side of the iPad. */
export const PNGen2: React.FC = () => {
  const frame = useSceneFrame("gen2");
  const nAt = pnev("g2.name"), pAt = pnev("g2.press"), tAt = pnev("g2.tap"), sAt = pnev("g2.stick"), dAt = pnev("g2.side");
  const enter = sp(frame, pnscene("gen2").from, { damping: 13, stiffness: 120 });
  const TW = 520, TH = 360, TX = 560 - TW / 2, TY = 520;
  const dock = interpolate(frame, [sAt, sAt + 14], [0, 1], { ...clamp, easing: easeOut });
  const PH = 420;
  const PW = PH / OFFICIAL.gen2.aspect;
  // pencil: hovers over the screen, then lies flat and snaps onto the top edge of the tablet
  const px = lerp(700, TX + TW / 2 - PH / 2 + PH / 2 - PW / 2, dock), py = lerp(330, TY - 20 - PH / 2, dock), prot = lerp(32, 90, dock);
  const ring = (k: number) => (frame >= tAt + k * 5 ? ramp(frame, tAt + k * 5, tAt + k * 5 + 12) : 0);
  return (
    <SceneShell id="gen2">
      <Title frame={frame} at={nAt} pill size={50}>Apple Pencil 2e génération</Title>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Tablet x={TX} y={TY} w={TW} h={TH}>
          <PressureStroke w={TW - 32} h={TH - 32} p={ramp(frame, pAt, pAt + 24, (x) => x)} />
        </Tablet>
        <div style={{ position: "absolute", left: px, top: py }}>
          <Pencil k="gen2" h={PH} rot={prot} />
        </div>
        {frame < sAt &&
          [0, 1].map((k) => ring(k) > 0 && ring(k) < 1 && (
            <div key={k} style={{ position: "absolute", left: 700 + PW / 2 + Math.sin((32 * Math.PI) / 180) * PH * 0.3 - 40 - ring(k) * 30, top: 330 + PH / 2 - Math.cos((32 * Math.PI) / 180) * PH * 0.3 - 40 - ring(k) * 30, width: 80 + ring(k) * 60, height: 80 + ring(k) * 60, borderRadius: "50%", border: "6px solid #6CF3FF", opacity: 1 - ring(k) }} />
          ))}
        {frame >= dAt - 1 && (
          <div style={{ position: "absolute", left: 560 - 40, top: TY - 140, transform: `scale(${pop(frame, dAt)})` }}>
            <LineIcon name="bolt" size={80} stroke={8} color="#FFE07A" />
          </div>
        )}
      </div>
      <Row top={1000}>
        <Chip frame={frame} at={pAt} text="Sensible à la pression" icon="pen" size={32} solid />
        <Chip frame={frame} at={tAt} text="Double tap" icon="spark" size={32} />
        <Chip frame={frame} at={sAt} text="Se fixe et charge sur le côté" icon="magnet" size={32} solid />
      </Row>
      <Footnote frame={frame} at={nAt + 10} top={1262} text="Compatibilité selon le modèle d'iPad" />
    </SceneShell>
  );
};

/** 16.0-20.5 s Apple Pencil 1st gen: pressure sensitive, made for older iPads. */
export const PNGen1: React.FC = () => {
  const frame = useSceneFrame("gen1");
  const nAt = pnev("g1.name"), pAt = pnev("g1.press"), oAt = pnev("g1.old");
  const enter = sp(frame, pnscene("gen1").from, { damping: 13, stiffness: 120 });
  const tab = sp(frame, oAt, { damping: 12, stiffness: 140 });
  return (
    <SceneShell id="gen1">
      <Title frame={frame} at={nAt} pill size={50}>Apple Pencil 1re génération</Title>
      <div style={{ position: "absolute", left: 360, top: 350, transform: `translateX(${(1 - enter) * -900}px)` }}>
        <Pencil k="gen1" h={640} rot={-6} sweep={interpolate(frame, [nAt + 4, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 500, top: 420, width: 400, height: 220, borderRadius: 26, background: "#fff", boxShadow: "0 16px 40px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, pAt)})`, overflow: "hidden" }}>
          <PressureStroke w={400} h={220} p={ramp(frame, pAt, pAt + 22, (x) => x)} />
        </div>
      )}
      {frame >= oAt - 1 && <Tablet x={640} y={680} w={230} h={310} home s={tab} />}
      <Row top={1060}>
        <Chip frame={frame} at={pAt} text="Sensible à la pression" icon="pen" size={34} solid />
        <Chip frame={frame} at={oAt} text="Pour les anciens iPad" icon="display" size={34} />
      </Row>
      <Footnote frame={frame} at={nAt + 10} top={1262} text="Compatibilité selon le modèle d'iPad" />
    </SceneShell>
  );
};

/** 20.5-25.75 s Apple Pencil USB-C: the cheapest, good for writing and notes, charges with a USB-C cable. */
export const PNUsbc: React.FC = () => {
  const frame = useSceneFrame("usbc");
  const nAt = pnev("uc.name"), cAt = pnev("uc.cheap"), wAt = pnev("uc.notes"), kAt = pnev("uc.cable");
  const enter = sp(frame, pnscene("usbc").from, { damping: 13, stiffness: 120 });
  const plug = interpolate(frame, [kAt, kAt + 12], [0, 1], { ...clamp, easing: easeOut });
  const lines = ramp(frame, wAt, wAt + 30, (x) => x);
  return (
    <SceneShell id="usbc">
      <Title frame={frame} at={nAt} pill size={56}>Apple Pencil USB-C</Title>
      <div style={{ position: "absolute", left: 380, top: 380, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Pencil k="usbc" h={600} sweep={interpolate(frame, [nAt + 4, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 560, top: 380, transform: `scale(${pop(frame, cAt)}) rotate(-8deg)`, background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "6px 24px 10px", borderRadius: 16, border: "4px solid #fff", boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>LE MOINS CHER</div>
      )}
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 560, top: 520, width: 360, height: 280, borderRadius: 26, background: "#fff", padding: "26px 26px", boxShadow: "0 16px 40px rgba(6,14,90,0.4)", transform: `scale(${pop(frame, wAt)})` }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 10, marginBottom: 42, borderRadius: 5, background: COLORS.blue, opacity: 0.85, width: `${Math.max(0, Math.min(1, lines * 4 - i)) * (i === 3 ? 55 : 92)}%` }} />
          ))}
        </div>
      )}
      {frame >= kAt - 1 && (
        <div style={{ position: "absolute", left: 380 - 10, top: lerp(160, 290, plug), opacity: plug, transform: "rotate(180deg)" }}>
          <LineIcon name="cable" size={90} stroke={8} />
        </div>
      )}
      <Row top={1060}>
        <Chip frame={frame} at={cAt} text="Le moins cher" icon="spark" size={34} solid />
        <Chip frame={frame} at={wAt} text="Écriture & notes" icon="note" size={34} />
        <Chip frame={frame} at={kAt} text="Charge par câble USB-C" icon="cable" size={34} solid />
      </Row>
      <Footnote frame={frame} at={nAt + 10} top={1262} text="Sans sensibilité à la pression · compatibilité selon le modèle d'iPad" />
    </SceneShell>
  );
};
