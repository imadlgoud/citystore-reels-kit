import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { pop, ramp, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { ProductHook } from "../../components/ProductHook";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, tbev, tbscene } from "./timeline";

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

/** soft sound waves on one side (dir -1 = left, 1 = right) */
const Waves: React.FC<{ x: number; y: number; dir: number; t: number; o: number }> = ({ x, y, dir, t, o }) => (
  <svg width={240} height={360} style={{ position: "absolute", left: dir < 0 ? x - 240 : x, top: y - 180, overflow: "visible", opacity: o }}>
    {[0, 1, 2].map((i) => {
      const r = 60 + ((t * 70 + i * 55) % 165);
      const cx = dir < 0 ? 240 : 0;
      return <path key={i} d={`M${cx + dir * r * 0.55} ${180 - r} A${r} ${r} 0 0 ${dir < 0 ? 0 : 1} ${cx + dir * r * 0.55} ${180 + r}`} fill="none" stroke={CYAN} strokeWidth={8} strokeLinecap="round" opacity={Math.max(0, 1 - (r - 60) / 165)} />;
    })}
  </svg>
);

/*
 * 0.0-2.75 s HOOK ("don't buy a tablet for the kids or for studying before you see this!")
 * product-first: the tablet (back + front) and the hook pill from frame 0; "Pour les enfants" / "Pour les études"
 * chips pop on their words; "حتى تشوف هادي!" punches in.
 */
export const TBHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const kAt = tbev("hook.kids"), sAt = tbev("hook.study"), pAt = tbev("hook.see");
  return (
    <ProductHook src={OFFICIAL.full.src} aspect={OFFICIAL.full.aspect} width={500} top={420} cx={560} hook="ما تشريش تابليت للدراري ولا للقراية" punch={{ at: pAt, text: "حتى تشوف هادي!" }}>
      <div style={{ position: "absolute", left: 60, top: 520, display: "flex", flexDirection: "column", gap: 18, zIndex: 6 }}>
        <Chip frame={frame} at={kAt} text="Enfants" icon="controller" size={34} solid />
        <Chip frame={frame} at={sAt} text="Études" icon="book" size={34} solid />
      </div>
    </ProductHook>
  );
};

/** 2.75-7.5 s INTRO: Samsung Galaxy Tab A7 Lite, Silver, 32 GB, DISPONIBLE. */
export const TBIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = tbev("intro.name"), mAt = tbev("intro.model"), sAt = tbev("intro.silver"), gAt = tbev("intro.gb"), dAt = tbev("intro.dispo");
  const from = tbscene("intro").from;
  return (
    <SceneShell id="intro">
      <Burst x={540} y={700} r={950} rot={frame * 0.5} opacity={0.2 * ramp(frame, nAt, nAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 222, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 20 }}>
        {frame >= nAt - 1 && <div style={{ ...slam(frame, nAt, 1.8), fontFamily: FONT, fontWeight: 900, fontSize: 46, color: "#fff", letterSpacing: 6, textShadow }}>SAMSUNG</div>}
        {frame >= mAt - 1 && <div style={{ ...slam(frame, mAt, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "#fff", whiteSpace: "nowrap", textShadow }}>Galaxy Tab A7 Lite</div>}
      </div>
      <div style={{ position: "absolute", left: 545 - 210, top: 410, ...slam(frame, from + 2, 2.2) }}>
        <Img k="full" w={420} sweep={interpolate(frame, [mAt + 2, mAt + 20], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={960} left={340}>
        <Chip frame={frame} at={sAt} text="Silver" icon="spark" size={36} solid />
        <Chip frame={frame} at={gAt} text="32 GB" icon="chip" size={36} solid />
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

/** 7.5-11.0 s SCREEN: 8.7" screen; light, compact, easy to hold. */
export const TBScreen: React.FC = () => {
  const frame = useSceneFrame("screen");
  const nAt = tbev("sc.name"), zAt = tbev("sc.size"), lAt = tbev("sc.light"), sAt = tbev("sc.small"), hAt = tbev("sc.hand");
  const enter = sp(frame, tbscene("screen").from, { damping: 13, stiffness: 120 });
  const w = 330, h = w * OFFICIAL.front.aspect, x = 545 - w / 2, y = 340;
  const p = ramp(frame, zAt, zAt + 14);
  const float = Math.sin((frame / 30) * Math.PI * 0.9) * 8 * ramp(frame, lAt, lAt + 6);
  return (
    <SceneShell id="screen">
      <Title frame={frame} at={nAt}>
        <LineIcon name="display" size={60} stroke={8} color={COLORS.blue} />Écran 8,7"
      </Title>
      <div style={{ position: "absolute", left: x, top: y + float, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="front" w={w} />
      </div>
      {frame >= zAt - 1 && (
        <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line x1={x + 34} y1={y + h - 40 + float} x2={x + 34 + (w - 68) * p} y2={y + h - 40 + float - (h - 80) * p} stroke="#fff" strokeWidth={7} strokeDasharray="16 10" strokeLinecap="round" />
        </svg>
      )}
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: x + w - 20, top: y + 30, transform: `scale(${pop(frame, zAt)})`, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: "4px 22px 8px", borderRadius: 18, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>8,7"</div>
      )}
      <Row top={1000} left={60}>
        <Chip frame={frame} at={lAt} text="Légère" icon="feather" size={32} solid />
        <Chip frame={frame} at={sAt} text="Compacte" icon="ruler" size={32} solid />
        <Chip frame={frame} at={hAt} text="Facile à tenir" icon="check" size={32} solid />
      </Row>
    </SceneShell>
  );
};

/** 11.0-14.0 s BATTERY: big battery to read, watch videos and play all day. */
export const TBBatt: React.FC = () => {
  const frame = useSceneFrame("batt");
  const nAt = tbev("bt.name"), rAt = tbev("bt.read"), vAt = tbev("bt.video"), pAt = tbev("bt.play"), dAt = tbev("bt.day");
  const fill = easeOut(ramp(frame, nAt + 4, nAt + 30));
  const acts = [
    { at: rAt, icon: "book" as IconName, t: "Lecture" },
    { at: vAt, icon: "play" as IconName, t: "Vidéos" },
    { at: pAt, icon: "controller" as IconName, t: "Jeux" },
  ];
  return (
    <SceneShell id="batt">
      <Title frame={frame} at={nAt}>
        <LineIcon name="battery" size={62} stroke={8} color={COLORS.blue} />Grande batterie
      </Title>
      <div style={{ position: "absolute", left: 545 - 230, top: 380, transform: `scale(${pop(frame, nAt)})` }}>
        <div style={{ position: "relative", width: 440, height: 220, border: "12px solid #fff", borderRadius: 40, padding: 14, boxShadow: "0 18px 40px rgba(6,14,90,0.35)" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 22, background: `linear-gradient(90deg, ${GREEN}, #7CF29E)` }} />
          <div style={{ position: "absolute", right: -34, top: 66, width: 22, height: 64, borderRadius: "0 10px 10px 0", background: "#fff" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><LineIcon name="bolt" size={110} stroke={8} color="#fff" /></div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 70, top: 690, display: "flex", justifyContent: "center", gap: 40 }}>
        {acts.map((a, i) =>
          frame < a.at - 1 ? <div key={i} style={{ width: 150 }} /> : (
            <div key={i} style={{ width: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transform: `scale(${pop(frame, a.at)})` }}>
              <div style={{ width: 130, height: 130, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}><LineIcon name={a.icon} size={80} stroke={8} color={COLORS.blue} /></div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 32, color: "#fff", textShadow }}>{a.t}</div>
            </div>
          ),
        )}
      </div>
      <Row top={960}>
        <Chip frame={frame} at={dAt} text="Toute la journée" icon="sun" size={36} solid />
      </Row>
      <Footnote frame={frame} at={dAt} top={1060} text="Autonomie variable selon l'usage." />
    </SceneShell>
  );
};

/** 14.0-18.0 s SOUND + STORAGE: Dolby Atmos speakers; add memory with a microSD card. */
export const TBSound: React.FC = () => {
  const frame = useSceneFrame("sound");
  const nAt = tbev("so.name"), dAt = tbev("so.dolby"), aAt = tbev("so.add"), sAt = tbev("so.sd");
  const enter = sp(frame, tbscene("sound").from, { damping: 13, stiffness: 120 });
  const t = frame / 30;
  const w = 300, h = w * OFFICIAL.front.aspect, x = 545 - w / 2, y = 360;
  const sdIn = easeOut(ramp(frame, aAt, aAt + 14));
  return (
    <SceneShell id="sound">
      <Title frame={frame} at={nAt}>
        <LineIcon name="note" size={60} stroke={8} color={COLORS.blue} />Dolby Atmos
      </Title>
      <Waves x={x - 10} y={y + h / 2} dir={-1} t={t} o={ramp(frame, dAt, dAt + 8)} />
      <Waves x={x + w + 10} y={y + h / 2} dir={1} t={t} o={ramp(frame, dAt, dAt + 8)} />
      <div style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="front" w={w} />
      </div>
      {/* microSD card sliding in from the right */}
      {frame >= aAt - 1 && (
        <div style={{ position: "absolute", left: x + w + 30 + (1 - sdIn) * 300, top: y + h - 230, transform: "rotate(-10deg)", opacity: sdIn }}>
          <svg width={150} height={190} viewBox="0 0 150 190">
            <path d="M20 10 H110 L140 40 V175 A10 10 0 0 1 130 185 H20 A10 10 0 0 1 10 175 V20 A10 10 0 0 1 20 10 Z" fill="#1C2333" stroke="#fff" strokeWidth={6} />
            {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={28 + i * 18} y={22} width={10} height={30} rx={3} fill="#E8C35A" />)}
            <text x={75} y={130} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#fff">micro</text>
            <text x={75} y={162} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#fff">SD</text>
          </svg>
        </div>
      )}
      <Row top={1000} left={60}>
        <Chip frame={frame} at={dAt} text="Haut-parleurs Dolby Atmos" icon="note" size={32} solid />
      </Row>
      <Row top={1080} left={60}>
        <Chip frame={frame} at={sAt} text="+ Mémoire microSD" icon="sim" size={32} solid />
      </Row>
      <Footnote frame={frame} at={sAt} top={1165} text="Carte microSD vendue séparément." />
    </SceneShell>
  );
};
