import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, r2ev, r2scene } from "./timeline";

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
const GREEN = "#2BD96B", RED = "#FF3B5C", KINDLE_GREEN = "#8fb79e";

const Swatch: React.FC<{ frame: number; at: number; color: string; label: string }> = ({ frame, at, color, label }) =>
  frame < at - 1 ? null : (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 22px", borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.75)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", transform: `scale(${pop(frame, at)})` }}>
      <div style={{ width: 30, height: 30, borderRadius: "50%", background: color, border: "3px solid #fff" }} />{label}
    </div>
  );

/*
 * 0.0-3.25 s HOOK ("if you read on your phone and your eyes get tired, this video is for you!")
 * visual: a glaring phone and a strained eye (red strain lines), then a Kindle slams in: "هاد الفيديو ليك!"
 */
export const R2Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const pAt = r2ev("hook.phone"), tAt = r2ev("hook.tired"), eAt = r2ev("hook.eyes"), yAt = r2ev("hook.you");
  const out = ramp(frame, yAt - 2, yAt + 5);
  const sk = shake(frame, yAt, 12, 8);
  const glare = 0.6 + 0.4 * Math.sin(frame * 0.9);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={560} r={900} rot={frame * 0.6} opacity={0.2 * ramp(frame, yAt, yAt + 6)} rays={20} />
      {out < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
          {frame >= pAt - 1 && (
            <div style={{ position: "absolute", left: 330, top: 400, transform: `scale(${pop(frame, pAt)}) rotate(-8deg)` }}>
              <div style={{ position: "absolute", left: 30, top: 40, width: 160, height: 250, borderRadius: 20, background: `radial-gradient(circle, rgba(255,255,255,${0.9 * glare}), rgba(255,255,255,0) 70%)` }} />
              <LineIcon name="phone" size={300} stroke={6} />
            </div>
          )}
          {frame >= tAt - 1 && (
            <div style={{ position: "absolute", left: 650, top: 440, width: 220, height: 160, transform: `scale(${pop(frame, tAt)})` }}>
              <LineIcon name="eye" size={200} stroke={8} color="#fff" />
              {frame >= eAt - 1 && (
                <svg width={220} height={160} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                  {[[-10, 20, -40, -10], [100, -10, 100, -45], [210, 20, 245, -10]].map(([x1, y1, x2, y2], i) => (
                    <path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={RED} strokeWidth={9} strokeLinecap="round" opacity={ramp(frame, eAt + i * 2, eAt + i * 2 + 4)} />
                  ))}
                </svg>
              )}
            </div>
          )}
        </div>
      )}
      {frame >= yAt - 1 && (
        <div style={{ position: "absolute", left: 560 - 140, top: 360, ...slam(frame, yAt, 2.4) }}>
          <Img k="black" w={280} sweep={interpolate(frame, [yAt + 4, yAt + 20], [-0.3, 1.3], clamp)} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < yAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", textShadow, whiteSpace: "nowrap" }}>كيعياو ليك عينيك فالتيليفون؟</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, yAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 60, padding: "2px 36px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>هاد الفيديو ليك!</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - yAt, [0, 1, 6], [0, 0.45, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.25-5.0 s INTRO: some of the best e-readers we have: DISPONIBLES. */
export const R2Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const bAt = r2ev("intro.best"), rAt = r2ev("intro.readers"), dAt = r2ev("intro.dispo");
  const from = r2scene("intro").from;
  const FAN: { k: keyof typeof OFFICIAL; x: number; r: number; w: number }[] = [
    { k: "green_pair", x: 290, r: -8, w: 300 },
    { k: "kobo", x: 470, r: 0, w: 230 },
    { k: "black", x: 680, r: 8, w: 210 },
  ];
  return (
    <SceneShell id="intro">
      <Burst x={560} y={700} r={900} rot={frame * 0.5} opacity={0.16} rays={20} />
      <Title frame={frame} at={rAt} pill size={60}><LineIcon name="book" size={64} stroke={8} color={COLORS.blue} />Les liseuses</Title>
      {FAN.map((f, i) => (
        <div key={f.k} style={{ position: "absolute", left: f.x, top: 440, transform: `translateY(${(1 - sp(frame, from + i * 3, { damping: 12, stiffness: 150 })) * 900}px) rotate(${f.r}deg)` }}>
          <Img k={f.k} w={f.w} />
        </div>
      ))}
      {frame >= bAt - 1 && (
        <div style={{ position: "absolute", left: 300, top: 360, transform: `scale(${pop(frame, bAt)}) rotate(-8deg)`, background: "#FFE07A", color: COLORS.navy, fontFamily: FONT, fontWeight: 900, fontSize: 34, padding: "4px 18px 8px", borderRadius: 12, whiteSpace: "nowrap" }}>LES MEILLEURES</div>
      )}
      <Row top={1000} left={300}>
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: GREEN, padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={46} stroke={7} color="#fff" />DISPONIBLES
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 5.0-12.0 s Amazon Kindle 11th gen, 16GB, Vert + Noir: small, light, fits in a pocket, battery up to 6 weeks. */
export const R2Kindle: React.FC = () => {
  const frame = useSceneFrame("kindle");
  const nAt = r2ev("kd.name"), gAt = r2ev("kd.gen"), bAt = r2ev("kd.gb"), vAt = r2ev("kd.green"), kAt = r2ev("kd.black"), lAt = r2ev("kd.light"), pAt = r2ev("kd.pocket"), wAt = r2ev("kd.weeks");
  const enter = sp(frame, r2scene("kindle").from, { damping: 13, stiffness: 120 });
  const weeks = Math.round(6 * easeOut(ramp(frame, wAt, wAt + 12)));
  const float = frame >= lAt ? Math.sin((frame - lAt) * 0.15) * 10 : 0;
  return (
    <SceneShell id="kindle">
      {frame >= nAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, zIndex: 20 }}>
          <div style={{ ...slam(frame, nAt, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#fff", textShadow, whiteSpace: "nowrap" }}>Kindle</div>
          {frame >= gAt - 1 && <div style={{ ...slam(frame, gAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COLORS.blue, background: "#fff", padding: "2px 20px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>11e génération</div>}
        </div>
      )}
      <div style={{ position: "absolute", left: 300, top: 380 + float, transform: `translateX(${(1 - enter) * -900}px) scale(${frame >= vAt && frame < kAt ? 1.05 : 1})` }}>
        <Img k="green_pair" w={330} sweep={interpolate(frame, [vAt, vAt + 16], [-0.3, 1.3], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 630, top: 400 - float, transform: `translateX(${(1 - enter) * 900}px) scale(${frame >= kAt ? 1.05 : 1})` }}>
        <Img k="black_pair" w={300} sweep={interpolate(frame, [kAt, kAt + 16], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 740, display: "flex", justifyContent: "center", ...slam(frame, wAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow }}>
            <LineIcon name="battery" size={80} stroke={7} />
            <span style={{ fontSize: 120 }}>{weeks}</span><span style={{ fontSize: 50 }}>semaines</span>
          </div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={bAt} text="16GB" icon="box" size={32} solid />
        <Swatch frame={frame} at={vAt} color={KINDLE_GREEN} label="Vert" />
        <Swatch frame={frame} at={kAt} color="#1d2230" label="Noir" />
        <Chip frame={frame} at={lAt} text="Léger" icon="feather" size={32} />
        <Chip frame={frame} at={pAt} text="Tient dans la poche" icon="check" size={32} solid />
      </Row>
      <Footnote frame={frame} at={wAt + 4} top={1250} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};

/** 12.0-17.0 s Kobo Libra Colour, Noir: 7" colour screen, page-turn buttons, water resistant. */
export const R2Kobo: React.FC = () => {
  const frame = useSceneFrame("kobo");
  const nAt = r2ev("kb.name"), kAt = r2ev("kb.black"), zAt = r2ev("kb.size"), cAt = r2ev("kb.colour"), bAt = r2ev("kb.buttons"), pAt = r2ev("kb.page"), wAt = r2ev("kb.water");
  const enter = sp(frame, r2scene("kobo").from, { damping: 13, stiffness: 120 });
  const W = 360, H = W * OFFICIAL.kobo.aspect;
  const t = frame / 30;
  const wave = Array.from({ length: 13 }, (_, i) => `${i === 0 ? "M" : "L"} ${i * 90} ${Math.sin(i * 0.9 + t * 3) * 12}`).join(" ");
  const surf = interpolate(frame, [wAt - 2, wAt + 12], [1980, 920], { ...clamp, easing: easeOut });
  const flip = frame >= pAt ? ramp(frame, pAt, pAt + 10) : 0;
  return (
    <SceneShell id="kobo">
      <Title frame={frame} at={nAt} pill size={56}>Kobo Libra Colour</Title>
      <div style={{ position: "absolute", left: 320, top: 380, transform: `translateX(${(1 - enter) * 900}px) rotate(-3deg)` }}>
        <Img k="kobo" w={W} sweep={interpolate(frame, [cAt, cAt + 16], [-0.3, 1.3], clamp)} />
        {/* page turn: a white page sweeps across the screen */}
        {flip > 0 && flip < 1 && <div style={{ position: "absolute", left: W * 0.12 + (1 - flip) * W * 0.7, top: H * 0.08, width: W * 0.72 * flip, height: H * 0.84, background: "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(220,226,240,0.9))", borderRadius: 4 }} />}
        {frame >= bAt - 1 &&
          [0.38, 0.55].map((v, i) => (
            <div key={i} style={{ position: "absolute", left: W * 0.97 - 22, top: H * v - 22, width: 44, height: 44, borderRadius: "50%", border: "5px solid #6CF3FF", opacity: 1 - ((frame - bAt + i * 6) % 18) / 18, transform: `scale(${1 + ((frame - bAt + i * 6) % 18) / 18})` }} />
          ))}
      </div>
      {frame >= zAt - 1 && (
        <div style={{ position: "absolute", left: 720, top: 430, display: "flex", flexDirection: "column", alignItems: "center", ...slam(frame, zAt, 2.2), fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow }}>
          <div style={{ fontSize: 110, lineHeight: 1 }}>7<span style={{ fontSize: "0.5em" }}>″</span></div>
          <div style={{ fontSize: 28, letterSpacing: 2 }}>COULEUR</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {["#FF3B5C", "#FFB020", "#2BD96B", "#6CF3FF", "#7A5CFF"].map((c, i) => <div key={c} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: "3px solid #fff", transform: `scale(${pop(frame, cAt + i * 2)})` }} />)}
          </div>
        </div>
      )}
      {frame >= wAt - 2 && (
        <div style={{ position: "absolute", left: 0, top: surf, width: 1080, height: 1920, background: "linear-gradient(180deg, rgba(40,200,255,0.45), rgba(10,60,190,0.7))" }}>
          <svg width={1080} height={40} style={{ position: "absolute", left: 0, top: -12, overflow: "visible" }}><path d={wave} stroke="#fff" strokeWidth={6} fill="none" opacity={0.85} /></svg>
        </div>
      )}
      <Row top={1060}>
        <Swatch frame={frame} at={kAt} color="#1d2230" label="Noir" />
        <Chip frame={frame} at={bAt} text="Boutons pour tourner les pages" icon="book" size={30} solid />
        <Chip frame={frame} at={wAt} text="Résiste à l'eau" icon="drop" size={30} />
      </Row>
      <Footnote frame={frame} at={wAt + 4} top={1270} text="IPX8 : jusqu'à 2 m, 60 min (eau douce)" />
    </SceneShell>
  );
};

/** 17.0-21.75 s all of them: E Ink screen that does not tire the eyes + built-in light to read even at night. */
export const R2Eink: React.FC = () => {
  const frame = useSceneFrame("eink");
  const aAt = r2ev("ei.all"), eAt = r2ev("ei.eink"), yAt = r2ev("ei.eyes"), lAt = r2ev("ei.light"), nAt = r2ev("ei.night");
  const night = ramp(frame, nAt - 6, nAt + 6);
  const glow = ramp(frame, lAt, lAt + 10);
  const ROW: { k: keyof typeof OFFICIAL; w: number; x: number; y: number }[] = [
    { k: "green_pair", w: 260, x: 300, y: 430 },
    { k: "kobo", w: 220, x: 560, y: 420 },
    { k: "black", w: 190, x: 780, y: 440 },
  ];
  return (
    <SceneShell id="eink">
      <div style={{ position: "absolute", inset: 0, background: "#030820", opacity: night * 0.55 }} />
      <Title frame={frame} at={eAt} pill size={56}>Écran E Ink</Title>
      {ROW.map((r, i) => (
        <div key={r.k} style={{ position: "absolute", left: r.x, top: r.y, transform: `scale(${pop(frame, aAt + i * 3)})`, filter: glow > 0 ? `drop-shadow(0 0 ${30 * glow}px rgba(255,236,170,${0.6 * glow}))` : undefined }}>
          <Img k={r.k} w={r.w} />
        </div>
      ))}
      {frame >= yAt - 1 && (
        <div style={{ position: "absolute", left: 480, top: 780, width: 120, height: 120, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, yAt)})`, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
          <LineIcon name="eye" size={80} stroke={8} color={COLORS.blue} />
        </div>
      )}
      {frame >= nAt - 1 && (
        <div style={{ position: "absolute", left: 800, top: 330, transform: `scale(${pop(frame, nAt)})` }}>
          <LineIcon name="moon" size={110} stroke={7} color="#FFE07A" />
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={aAt} text="Les 3 liseuses" icon="check" size={32} />
        <Chip frame={frame} at={yAt} text="Repose les yeux" icon="eye" size={32} solid />
        <Chip frame={frame} at={lAt} text="Lumière intégrée" icon="bright" size={32} />
        <Chip frame={frame} at={nAt} text="Même la nuit" icon="moon" size={32} solid />
      </Row>
    </SceneShell>
  );
};
