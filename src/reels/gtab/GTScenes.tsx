import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { FRONT_SCREEN, gtev, gtscene, OFFICIAL } from "./timeline";

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

/** the front render with an overlay clipped to its screen */
const FrontTablet: React.FC<{ w: number; sweep?: number; screen?: (sw: number, sh: number) => React.ReactNode }> = ({ w, sweep = -1, screen }) => {
  const img = OFFICIAL.front;
  const h = w * img.aspect;
  const [x0, y0, x1, y1] = FRONT_SCREEN;
  return (
    <div style={{ position: "relative", width: w, height: h, filter: SHADOW }}>
      <ProductImage src={img.src} aspect={img.aspect} width={w} sweep={sweep} />
      {screen ? (
        <div style={{ position: "absolute", left: x0 * w, top: y0 * h, width: (x1 - x0) * w, height: (y1 - y0) * h, borderRadius: w * 0.02, overflow: "hidden" }}>
          {screen((x1 - x0) * w, (y1 - y0) * h)}
        </div>
      ) : null}
    </div>
  );
};

/** drawn SIM card */
const Sim: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 1.3, borderRadius: w * 0.1, background: "#fff", clipPath: "polygon(0 0, 72% 0, 100% 22%, 100% 100%, 0 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(6,14,90,0.45)" }}>
    <div style={{ width: w * 0.56, height: w * 0.5, borderRadius: w * 0.08, background: "linear-gradient(135deg,#FFD25A,#E0A020)", border: `${w * 0.03}px solid #b07a10` }} />
  </div>
);

/*
 * 0.0-7.25 s HOOK ("a big tablet, with a SIM card, 12GB RAM and 128GB storage... at a good price!")
 * visual: the tablet slams in and grows on "big" (measuring arrows), a SIM card slides into it, RAM / storage
 *         chips pop on both sides, then a "BON PRIX" tag with a tick swings in.
 */
export const GTHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const bAt = gtev("hook.big"), sAt = gtev("hook.sim"), rAt = gtev("hook.ram"), oAt = gtev("hook.sto"), pAt = gtev("hook.price"), kAt = gtev("hook.ok");
  const sk = shake(frame, kAt, 14, 10);
  const enter = sp(frame, 0, { damping: 12, stiffness: 140 });
  const grow = sp(frame, bAt, { damping: 11, stiffness: 140 });
  const W = lerp(220, 290, grow);
  const H = W * OFFICIAL.front.aspect;
  const cx = 505, top = 250;
  const simX = interpolate(frame, [sAt, sAt + 12], [420, 0], { ...clamp, easing: easeOut });
  const simO = ramp(frame, sAt, sAt + 4) * (1 - ramp(frame, sAt + 22, sAt + 30));
  const tag = sp(frame, pAt, { damping: 9, stiffness: 160 });
  const tick = ramp(frame, kAt, kAt + 8);
  const arrows = ramp(frame, bAt, bAt + 8) * (1 - ramp(frame, sAt - 4, sAt + 2));
  const big = (at: number, text: string, sub: string, x: number, y: number) => {
    if (frame < at - 1) return null;
    const p = slam(frame, at, 2.2);
    return (
      <div style={{ position: "absolute", left: x, top: y, ...p, display: "flex", flexDirection: "column", alignItems: "center", background: "#fff", borderRadius: 28, padding: "10px 22px 12px", boxShadow: "0 16px 40px rgba(6,14,90,0.4)", fontFamily: FONT, color: COLORS.blue }}>
        <div style={{ fontWeight: 900, fontSize: 58, lineHeight: 1 }}>{text}</div>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 2 }}>{sub}</div>
      </div>
    );
  };
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={cx} y={top + H / 2} r={900} rot={frame * 0.6} opacity={0.2 * enter} rays={20} />
      <div style={{ position: "absolute", left: cx - W / 2, top, transform: `translateY(${(1 - enter) * -900}px) rotate(${Math.sin(frame * 0.08) * 2}deg)` }}>
        <FrontTablet w={W} sweep={interpolate(frame, [bAt + 4, bAt + 20], [-0.3, 1.3], clamp)} />
        {frame >= sAt - 1 && (
          <div style={{ position: "absolute", left: W - 10 + simX, top: H * 0.35, opacity: simO }}>
            <Sim w={70} />
          </div>
        )}
      </div>
      {/* "big": measuring arrows */}
      {arrows > 0 && (
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, opacity: arrows }}>
          <path d={`M ${cx - W / 2 - 40} ${top} V ${top + H} M ${cx - W / 2 - 56} ${top + 18} L ${cx - W / 2 - 40} ${top} L ${cx - W / 2 - 24} ${top + 18} M ${cx - W / 2 - 56} ${top + H - 18} L ${cx - W / 2 - 40} ${top + H} L ${cx - W / 2 - 24} ${top + H - 18}`} stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 236, ...slam(frame, sAt, 2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.2)", border: "3px solid #fff", borderRadius: 999, padding: "6px 22px", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#fff", whiteSpace: "nowrap" }}>
            <LineIcon name="sim" size={44} stroke={7} /> SIM
          </div>
        </div>
      )}
      {big(rAt, "12GB", "RAM", 70, 330)}
      {big(oAt, "128GB", "STOCKAGE", 680, 420)}
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 60, top: 560, transformOrigin: "50% 0%", transform: `scale(${tag}) rotate(${Math.sin((frame - pAt) * 0.35) * 10 * Math.exp(-(frame - pAt) / 30) - 6}deg)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(90deg,#2BD96B,#1FB85A)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 46, padding: "8px 26px 12px", borderRadius: 18, border: "5px solid #fff", boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <svg width={50} height={50} viewBox="0 0 100 100"><path d="M 20 52 L 42 74 L 82 28" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={120} strokeDashoffset={120 * (1 - tick)} /></svg>
            BON PRIX
          </div>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp) }} />
    </SceneShell>
  );
};

/** 7.25-10.25 s INTRO: G-Tab T13, DISPONIBLE. */
export const GTIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = gtev("intro.name"), dAt = gtev("intro.dispo");
  const enter = sp(frame, gtscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const img = OFFICIAL.pair;
  const w = 860;
  const t = frame / 30;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={760} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, ...slam(frame, nAt, 2) }}>
          <span style={{ fontSize: 88, letterSpacing: -1 }}>G-Tab</span>
          <span style={{ fontSize: 92, color: COLORS.blue, background: "#fff", padding: "0 24px 4px", borderRadius: 18, textShadow: "none" }}>T13</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 505 - w / 2, top: 420, transform: `translateX(${(1 - enter) * 1100}px) translateY(${Math.sin(t * Math.PI) * 8}px) rotate(${lerp(10, 0, enter)}deg)`, filter: SHADOW }}>
        <ProductImage src={img.src} aspect={img.aspect} width={w} sweep={interpolate(frame, [nAt + 6, nAt + 24], [-0.3, 1.3], clamp)} />
      </div>
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

/** 10.25-14.5 s 10.1-inch screen: reading, YouTube, movies. */
export const GTScreen: React.FC = () => {
  const frame = useSceneFrame("screen");
  const zAt = gtev("sc.size"), rAt = gtev("sc.read"), yAt = gtev("sc.yt"), mAt = gtev("sc.movies");
  const enter = sp(frame, gtscene("screen").from, { damping: 13, stiffness: 120 });
  const inch = (10.1 * easeOut(ramp(frame, zAt, zAt + 14))).toFixed(1);
  const W = 470;
  const H = W * OFFICIAL.front.aspect;
  const X = 80, Y = 300;
  const mode = frame >= mAt ? "movie" : frame >= yAt ? "video" : frame >= rAt ? "read" : "none";
  const diag = ramp(frame, zAt, zAt + 12);
  return (
    <SceneShell id="screen">
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateX(${(1 - enter) * -800}px) rotate(-3deg)` }}>
        <FrontTablet w={W} sweep={interpolate(frame, [zAt, zAt + 16], [-0.3, 1.3], clamp)} screen={(sw, sh) => (
          <>
            {mode !== "none" && <div style={{ position: "absolute", inset: 0, background: mode === "read" ? "#f4f2ec" : "#0b0f2a", opacity: 0.92 }} />}
            {mode === "read" && (
              <div style={{ position: "absolute", inset: 0, padding: `${sh * 0.08}px ${sw * 0.12}px`, display: "flex", flexDirection: "column", gap: sh * 0.025 }}>
                {[0.6, 1, 0.95, 1, 0.8, 1, 0.9, 1, 0.7, 1, 0.85].map((k, i) => <div key={i} style={{ height: sh * (i ? 0.014 : 0.03), width: `${k * 100}%`, borderRadius: 4, background: i ? "#a9a8a3" : COLORS.navy }} />)}
              </div>
            )}
            {mode !== "none" && mode !== "read" && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, mode === "video" ? yAt : mAt)})` }}>
                <LineIcon name={mode === "video" ? "play" : "tv"} size={sw * 0.42} stroke={6} color="#fff" glow />
              </div>
            )}
          </>
        )} />
        {diag > 0 && (
          <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: diag }}>
            <path d={`M ${FRONT_SCREEN[0] * W + 12} ${FRONT_SCREEN[3] * H - 12} L ${lerp(FRONT_SCREEN[0] * W + 12, FRONT_SCREEN[2] * W - 12, diag)} ${lerp(FRONT_SCREEN[3] * H - 12, FRONT_SCREEN[1] * H + 12, diag)}`} stroke="#6CF3FF" strokeWidth={8} strokeDasharray="4 16" strokeLinecap="round" />
          </svg>
        )}
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 590, top: 330, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT, color: "#fff", ...slam(frame, zAt, 2) }}>
          <div style={{ fontWeight: 900, fontSize: 150, lineHeight: 1, textShadow }}>{inch}<span style={{ fontSize: "0.4em" }}>"</span></div>
          <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: 3 }}>ÉCRAN</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 620, top: 620, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
        <Chip frame={frame} at={rAt} text="Lecture" icon="book" size={40} />
        <Chip frame={frame} at={yAt} text="YouTube" icon="play" size={40} />
        <Chip frame={frame} at={mAt} text="Films" icon="tv" size={40} solid />
      </div>
    </SceneShell>
  );
};

/** 14.5-18.75 s 4G: put your SIM card in and stay connected wherever you go. */
export const GTLte: React.FC = () => {
  const frame = useSceneFrame("lte");
  const gAt = gtev("lte.g4"), sAt = gtev("lte.sim"), cAt = gtev("lte.conn"), wAt = gtev("lte.where");
  const enter = sp(frame, gtscene("lte").from, { damping: 13, stiffness: 120 });
  const img = OFFICIAL.back;
  const W = 420, H = W * img.aspect, X = 300, Y = 330;
  const simX = interpolate(frame, [sAt, sAt + 14], [360, 0], { ...clamp, easing: easeOut });
  const simIn = frame >= sAt + 14 ? ramp(frame, sAt + 14, sAt + 22) : 0;
  return (
    <SceneShell id="lte">
      <Title frame={frame} at={gAt} pill size={78}>
        <LineIcon name="signal" size={80} stroke={9} color={COLORS.blue} progress={ramp(frame, gAt, gAt + 12)} />
        4G
      </Title>
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateY(${(1 - enter) * 800}px) rotate(4deg)`, filter: SHADOW }}>
        <ProductImage src={img.src} aspect={img.aspect} width={W} />
      </div>
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: X + W - 20 + simX, top: Y + H * 0.42, opacity: (1 - simIn) * ramp(frame, sAt, sAt + 4), transform: `scale(${1 - simIn * 0.4})` }}>
          <Sim w={90} />
        </div>
      )}
      {/* signal waves once connected */}
      {frame >= cAt && (
        <svg width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[0, 1, 2].map((i) => {
            const k = ((((frame - cAt) / 30 + i / 3) % 1) + 1) % 1;
            const r = 80 + k * 200;
            const cx = X + W / 2, cy = Y + 40;
            return <path key={i} d={`M ${cx + r * Math.cos(-2.4)} ${cy + r * Math.sin(-2.4)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(-0.74)} ${cy + r * Math.sin(-0.74)}`} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" opacity={(1 - k) * 0.85} />;
          })}
        </svg>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={sAt} text="Carte SIM" icon="sim" size={38} />
        <Chip frame={frame} at={cAt} text="Connecté" icon="signal" size={38} />
        <Chip frame={frame} at={wAt} text="Partout" icon="pin" size={38} solid />
      </Row>
      <Footnote frame={frame} at={cAt} top={1262} text="Nécessite une carte SIM et un forfait data" />
    </SceneShell>
  );
};

/** 18.75-24.5 s Android 15, kids mode, split screen to run two apps at once. */
export const GTAndroid: React.FC = () => {
  const frame = useSceneFrame("android");
  const oAt = gtev("and.os"), kAt = gtev("and.kids"), sAt = gtev("and.split"), tAt = gtev("and.two");
  const enter = sp(frame, gtscene("android").from, { damping: 13, stiffness: 120 });
  const W = 420;
  const split = ramp(frame, sAt, sAt + 10);
  const KIDS = ["#FF6B8B", "#FFD25A", "#2BD96B", "#6CB8FF", "#B48CFF", "#FF9F43"];
  return (
    <SceneShell id="android">
      <Title frame={frame} at={oAt} pill size={66}>
        <LineIcon name="phone" size={64} stroke={8} color={COLORS.blue} />
        Android 15
      </Title>
      <div style={{ position: "absolute", left: 505 - W / 2 + 30, top: 340, transform: `translateY(${(1 - enter) * 800}px) rotate(${Math.sin(frame * 0.08) * 1.5}deg)` }}>
        <FrontTablet w={W} screen={(sw, sh) => (
          <>
            {/* kids mode: big rounded colourful tiles + smiley */}
            {frame >= kAt - 1 && split < 1 && (
              <div style={{ position: "absolute", inset: 0, background: "#fff6d6", opacity: 1 - split, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: sh * 0.03, transform: `scale(${pop(frame, kAt)})` }}>
                <svg width={sw * 0.36} height={sw * 0.36} viewBox="0 0 100 100"><circle cx={50} cy={50} r={44} fill="#FFD25A" /><circle cx={36} cy={42} r={6} fill={COLORS.navy} /><circle cx={64} cy={42} r={6} fill={COLORS.navy} /><path d="M30 60 Q50 80 70 60" stroke={COLORS.navy} strokeWidth={7} fill="none" strokeLinecap="round" /></svg>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: sw * 0.05 }}>
                  {KIDS.map((c, i) => <div key={i} style={{ width: sw * 0.2, height: sw * 0.2, borderRadius: sw * 0.06, background: c, transform: `scale(${pop(frame, kAt + 3 + i * 2)})` }} />)}
                </div>
              </div>
            )}
            {/* split screen: two apps side by side */}
            {split > 0 && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", gap: 6, background: COLORS.navy, padding: 6 }}>
                <div style={{ flex: 1, borderRadius: 10, background: "#0b0f2a", display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - split) * -sh}px)` }}>
                  <LineIcon name="play" size={sw * 0.3} stroke={6} color="#fff" />
                </div>
                <div style={{ flex: 1, borderRadius: 10, background: "#f4f2ec", padding: sw * 0.08, display: "flex", flexDirection: "column", gap: sh * 0.02, transform: `translateY(${(1 - split) * sh}px)` }}>
                  {[0.5, 1, 0.9, 1, 0.7, 0.95].map((k, i) => <div key={i} style={{ height: sh * (i ? 0.014 : 0.026), width: `${k * 100}%`, borderRadius: 4, background: i ? "#a9a8a3" : COLORS.blue }} />)}
                </div>
              </div>
            )}
          </>
        )} />
      </div>
      <Row top={1080}>
        <Chip frame={frame} at={kAt} text="Mode enfant" icon="heart" size={36} />
        <Chip frame={frame} at={sAt} text="Écran partagé" icon="display" size={36} solid />
        <Chip frame={frame} at={tAt} text="2 applis à la fois" icon="check" size={36} />
      </Row>
    </SceneShell>
  );
};

/** 24.5-28.25 s 5000 mAh battery + memory card slot. */
export const GTBattery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const s0 = gtscene("battery").from;
  const bAt = gtev("bat.bat"), dAt = gtev("bat.sd");
  const mah = Math.round((5000 * easeOut(ramp(frame, bAt, bAt + 16))) / 50) * 50;
  const fill = easeOut(ramp(frame, s0 + 4, bAt + 16));
  const sk = shake(frame, bAt, 10, 7);
  const img = OFFICIAL.back;
  const W = 300, H = W * img.aspect, X = 560, Y = 600;
  const sdX = interpolate(frame, [dAt, dAt + 12], [-320, 0], { ...clamp, easing: easeOut });
  const sdIn = frame >= dAt + 12 ? ramp(frame, dAt + 12, dAt + 20) : 0;
  return (
    <SceneShell id="battery" shakeX={sk.x} shakeY={sk.y}>
      <div style={{ position: "absolute", left: 90, top: 260, transform: `scale(${sp(frame, s0, { damping: 13, stiffness: 160 })})`, transformOrigin: "left center" }}>
        <div style={{ position: "relative", width: 560, height: 220, borderRadius: 40, border: "12px solid #fff", padding: 14, boxShadow: "0 20px 50px rgba(6,14,90,0.35)", background: "rgba(6,14,90,0.2)" }}>
          <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 24, background: "linear-gradient(90deg,#2BD96B,#9CFFB8)" }} />
          <div style={{ position: "absolute", right: -40, top: 70, width: 26, height: 80, borderRadius: 8, background: "#fff" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, color: COLORS.navy }}>
            <span style={{ fontWeight: 900, fontSize: 104 }}>{mah.toLocaleString("fr-FR").replace(/ /g, " ")}</span>
            <span style={{ fontWeight: 900, fontSize: 44 }}>mAh</span>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateX(${(1 - sp(frame, s0, { damping: 13, stiffness: 120 })) * 700}px) rotate(6deg)`, filter: SHADOW }}>
        <ProductImage src={img.src} aspect={img.aspect} width={W} />
      </div>
      {/* memory card sliding into the tablet */}
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: X - 70 + sdX, top: Y + H * 0.45, opacity: 1 - sdIn, transform: `scale(${1 - sdIn * 0.4})` }}>
          <div style={{ width: 100, height: 132, borderRadius: 12, background: "linear-gradient(180deg,#2a2f45,#151827)", border: "4px solid #fff", clipPath: "polygon(0 0, 70% 0, 100% 18%, 100% 100%, 0 100%)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14, fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "#fff", boxShadow: "0 10px 24px rgba(6,14,90,0.45)" }}>
            SD
          </div>
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={bAt} text="5000 mAh" icon="battery" size={38} solid />
        <Chip frame={frame} at={dAt} text="Carte mémoire" icon="box" size={38} />
      </Row>
    </SceneShell>
  );
};
