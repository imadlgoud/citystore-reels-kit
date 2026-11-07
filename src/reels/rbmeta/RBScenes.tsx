import React from "react";
import { interpolate, staticFile } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { CAM, OFFICIAL, rbev, rbscene } from "./timeline";

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
const GREEN = "#2BD96B", RED = "#FF3B5C";

/** front view with Transitions tint: tint 0 = clear, 1 = dark sunglass grey (masked to the lenses only) */
const Glasses: React.FC<{ w: number; tint: number; sweep?: number }> = ({ w, tint, sweep = -1 }) => {
  const h = w * OFFICIAL.front.aspect;
  return (
    <div style={{ position: "relative", width: w, height: h, filter: SHADOW }}>
      <ProductImage src={OFFICIAL.front.src} aspect={OFFICIAL.front.aspect} width={w} sweep={sweep} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#2a2622,#4a4038)", opacity: 0.88 * tint, WebkitMaskImage: `url(${staticFile(OFFICIAL.front_lens.src)})`, WebkitMaskSize: "100% 100%", maskImage: `url(${staticFile(OFFICIAL.front_lens.src)})`, maskSize: "100% 100%" }} />
    </div>
  );
};

/*
 * 0.0-3.75 s HOOK ("in the sun they turn into sunglasses, indoors they're normal again... and they have a camera!")
 * visual: sun -> the lenses tint dark; house -> clear again; then a ring pulses on the frame camera: "+ CAMÉRA".
 */
export const RBHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const sAt = rbev("hook.sun"), dAt = rbev("hook.shades"), iAt = rbev("hook.inside"), nAt = rbev("hook.normal"), cAt = rbev("hook.cam");
  const tint = frame < iAt ? ramp(frame, dAt - 4, dAt + 8) : 1 - ramp(frame, iAt, nAt + 4);
  const W = 640, H = W * OFFICIAL.front.aspect, X = 560 - W / 2, Y = 470;
  const ring = ramp(frame, cAt, cAt + 12, (x) => x);
  const sk = shake(frame, cAt, 12, 8);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={560} r={900} rot={frame * 0.6} opacity={0.2 * ramp(frame, cAt, cAt + 6)} rays={20} />
      <div style={{ position: "absolute", inset: 0, background: "#FFE07A", opacity: 0.12 * (frame < iAt ? ramp(frame, sAt, dAt) : 1 - ramp(frame, iAt, iAt + 8)) }} />
      <div style={{ position: "absolute", left: 300, top: 360, transform: `scale(${frame < iAt ? pop(frame, sAt) : 1 - ramp(frame, iAt, iAt + 6)}) rotate(${frame * 0.6}deg)` }}>
        <LineIcon name="sun" size={120} stroke={8} color="#FFE07A" />
      </div>
      {frame >= iAt - 1 && (
        <div style={{ position: "absolute", left: 300, top: 360, transform: `scale(${pop(frame, iAt) * (1 - ramp(frame, cAt - 2, cAt + 4))})` }}>
          <LineIcon name="home" size={120} stroke={8} color="#fff" />
        </div>
      )}
      <div style={{ position: "absolute", left: X, top: Y, transform: `scale(${pop(frame, 2)})` }}>
        <Glasses w={W} tint={tint} sweep={interpolate(frame, [cAt + 2, cAt + 20], [-0.3, 1.3], clamp)} />
        {frame >= cAt - 1 && (
          <>
            {[0, 1].map((k) => {
              const p = (ring + k * 0.5) % 1;
              return <div key={k} style={{ position: "absolute", left: CAM.x * W - 20 - p * 60, top: CAM.y * H - 20 - p * 60, width: 40 + p * 120, height: 40 + p * 120, borderRadius: "50%", border: "6px solid #6CF3FF", opacity: 1 - p }} />;
            })}
          </>
        )}
      </div>
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 180, top: 640, ...slam(frame, cAt, 2), display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "4px 22px 8px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
          <LineIcon name="camera" size={48} stroke={8} color={COLORS.blue} />+ CAMÉRA
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < cAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", textShadow, whiteSpace: "nowrap" }}>{frame < iAt ? "فالشمس… نضاضر شمس" : "فالداخل… عاديين"}</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, cAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 60, padding: "2px 36px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>وفيهم كاميرا!</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - cAt, [0, 1, 6], [0, 0.45, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.75-8.5 s INTRO: Ray-Ban Meta 3rd gen, Wayfarer Matte Black, Transitions lenses, DISPONIBLE. */
export const RBIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = rbev("intro.name"), gAt = rbev("intro.gen"), wAt = rbev("intro.way"), bAt = rbev("intro.black"), tAt = rbev("intro.trans"), dAt = rbev("intro.dispo");
  const enter = sp(frame, rbscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt + 2, 12, 8);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt + 2, 2), fontSize: 88 }}>Ray-Ban Meta</div>
        {frame >= gAt - 1 && <div style={{ ...slam(frame, gAt, 2), fontSize: 40, color: COLORS.blue, background: "#fff", padding: "2px 22px 8px", borderRadius: 999, textShadow: "none" }}>3e génération</div>}
      </div>
      <div style={{ position: "absolute", left: 560 - 320, top: 470, transform: `translateX(${(1 - enter) * -1000}px) rotate(${lerp(-10, 0, enter)}deg)` }}>
        <Img k="angle" w={640} sweep={interpolate(frame, [wAt, wAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1000} left={300}>
        <Chip frame={frame} at={wAt} text="Wayfarer" icon="eye" size={34} solid />
        {frame >= bAt - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 22px", borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.75)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", transform: `scale(${pop(frame, bAt)})` }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1b1c20", border: "3px solid #fff" }} />Matte Black
          </div>
        )}
        <Chip frame={frame} at={tAt} text="Verres Transitions" icon="sun" size={32} solid />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff", background: GREEN, padding: "8px 22px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={42} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 8.5-12.25 s Transitions lenses tint by themselves with the light: one pair for everywhere. */
export const RBTrans: React.FC = () => {
  const frame = useSceneFrame("trans");
  const nAt = rbev("tr.name"), aAt = rbev("tr.auto"), lAt = rbev("tr.light"), oAt = rbev("tr.one"), eAt = rbev("tr.every");
  const enter = sp(frame, rbscene("trans").from, { damping: 13, stiffness: 120 });
  // light level cycles outdoor (1) <-> indoor (0) once the lens "adapts"
  const level = frame < aAt ? 0 : 0.5 - 0.5 * Math.cos(((frame - aAt) / 36) * Math.PI);
  const W = 680;
  return (
    <SceneShell id="trans">
      <Title frame={frame} at={nAt} pill size={56}><LineIcon name="sun" size={60} stroke={8} color={COLORS.blue} />Verres Transitions</Title>
      <div style={{ position: "absolute", inset: 0, background: "#FFE07A", opacity: 0.14 * level }} />
      <div style={{ position: "absolute", left: 560 - W / 2, top: 560, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Glasses w={W} tint={level} />
      </div>
      {frame >= aAt - 1 && (
        <div style={{ position: "absolute", left: 340, top: 400, width: 580, display: "flex", justifyContent: "space-between", alignItems: "center", transform: `scale(${pop(frame, aAt)})` }}>
          <div style={{ opacity: 0.35 + 0.65 * (1 - level), display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff" }}><LineIcon name="home" size={70} stroke={8} />Intérieur</div>
          <div style={{ width: 200, height: 16, borderRadius: 8, background: "rgba(255,255,255,0.3)", overflow: "hidden" }}><div style={{ width: `${level * 100}%`, height: "100%", background: "#FFE07A" }} /></div>
          <div style={{ opacity: 0.35 + 0.65 * level, display: "flex", alignItems: "center", gap: 8, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff" }}>Soleil<LineIcon name="sun" size={70} stroke={8} color="#FFE07A" /></div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={lAt} text="S'adaptent à la lumière" icon="bright" size={34} solid />
        <Chip frame={frame} at={oAt} text="Une paire pour tout" icon="check" size={34} />
      </Row>
      <Footnote frame={frame} at={eAt} top={1180} text="Teinte selon l'intensité des UV" />
    </SceneShell>
  );
};

/** 12.25-15.75 s 12 MP camera, 3K video: film without taking out the phone. */
export const RBCamera: React.FC = () => {
  const frame = useSceneFrame("camera");
  const mAt = rbev("cm.mp"), vAt = rbev("cm.vid"), fAt = rbev("cm.free");
  const enter = sp(frame, rbscene("camera").from, { damping: 13, stiffness: 120 });
  const W = 620, H = W * OFFICIAL.front.aspect;
  const flash = interpolate(frame, [mAt, mAt + 2, mAt + 10], [0, 1, 0], clamp);
  return (
    <SceneShell id="camera">
      <div style={{ position: "absolute", left: 560 - W / 2, top: 380, transform: `scale(${lerp(0.8, 1, enter)})` }}>
        <Glasses w={W} tint={0} />
        <div style={{ position: "absolute", left: CAM.x * W - 70, top: CAM.y * H - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%)", opacity: flash }} />
        <div style={{ position: "absolute", left: CAM.x * W - 34, top: CAM.y * H - 34, width: 68, height: 68, borderRadius: "50%", border: "6px solid #6CF3FF", opacity: ramp(frame, rbscene("camera").from + 4, rbscene("camera").from + 12) }} />
      </div>
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: 340, top: 640, ...slam(frame, mAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "2px 24px 8px", borderRadius: 22, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="camera" size={70} stroke={8} color={COLORS.blue} />12 <span style={{ fontSize: 36 }}>MP</span>
          </div>
        </div>
      )}
      {frame >= vAt - 1 && (
        <div style={{ position: "absolute", left: 660, top: 640, ...slam(frame, vAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "2px 24px 8px", borderRadius: 22, border: "4px solid #fff", boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 34, opacity: frame % 20 < 12 ? 1 : 0.3 }}>●</span>3K
          </div>
        </div>
      )}
      {frame >= fAt - 1 && (
        <div style={{ position: "absolute", left: 470, top: 820, width: 140, height: 140, transform: `scale(${pop(frame, fAt)})` }}>
          <LineIcon name="phone" size={140} stroke={7} />
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: 140, height: 140 }}><path d="M14 14 L86 86 M86 14 L14 86" stroke={RED} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(frame, fAt + 2, fAt + 10)} /></svg>
        </div>
      )}
      <Row top={1060}>
        <Chip frame={frame} at={fAt} text="Filme sans sortir ton téléphone" icon="eye" size={32} solid />
      </Row>
    </SceneShell>
  );
};

/** 15.75-19.5 s action button for Meta AI; 6 microphones so you are heard clearly on calls. */
export const RBAi: React.FC = () => {
  const frame = useSceneFrame("ai");
  const bAt = rbev("ai.button"), mAt = rbev("ai.meta"), cAt = rbev("ai.mics"), hAt = rbev("ai.hear");
  const enter = sp(frame, rbscene("ai").from, { damping: 13, stiffness: 120 });
  const W = 680, H = W * OFFICIAL.side.aspect;
  const MICS = [[0.06, 0.2], [0.2, 0.34], [0.35, 0.47], [0.62, 0.64], [0.78, 0.52], [0.9, 0.32]];
  return (
    <SceneShell id="ai">
      <div style={{ position: "absolute", left: 560 - W / 2, top: 420, transform: `translateX(${(1 - enter) * 900}px)` }}>
        <Img k="side" w={W} />
        {frame >= bAt - 1 &&
          [0, 1].map((k) => {
            const p = ((frame - bAt) / 24 + k * 0.5) % 1;
            return <div key={k} style={{ position: "absolute", left: 0.8 * W - 30 - p * 50, top: 0.6 * H - 30 - p * 50, width: 60 + p * 100, height: 60 + p * 100, borderRadius: "50%", border: "5px solid #fff", opacity: 1 - p }} />;
          })}
        {frame >= cAt - 1 &&
          MICS.map(([u, v], i) => (
            <div key={i} style={{ position: "absolute", left: u * W - 13, top: v * H - 13, width: 26, height: 26, borderRadius: "50%", background: "#6CF3FF", border: "4px solid #fff", transform: `scale(${pop(frame, cAt + i * 2)})`, boxShadow: "0 0 18px #6CF3FF" }} />
          ))}
      </div>
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, mAt, 2), display: "flex", alignItems: "center", gap: 12, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 56, padding: "2px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="chat" size={60} stroke={8} color={COLORS.blue} />Meta AI
          </div>
        </div>
      )}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 340, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, cAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#fff", textShadow, whiteSpace: "nowrap" }}>6 micros</div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={bAt} text="Bouton d'action" icon="power" size={32} solid />
        <Chip frame={frame} at={hAt} text="Appels clairs" icon="call" size={32} />
      </Row>
      <Footnote frame={frame} at={mAt + 6} top={1180} text="Meta AI : disponibilité selon le pays et la langue" />
    </SceneShell>
  );
};

/** 19.5-22.75 s battery up to 9 h; the charging case adds up to 50 h. */
export const RBBattery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const h9At = rbev("bt.h9"), cAt = rbev("bt.case"), h50At = rbev("bt.h50");
  const enter = sp(frame, rbscene("battery").from, { damping: 13, stiffness: 120 });
  const h9 = Math.round(9 * easeOut(ramp(frame, h9At, h9At + 12)));
  const h50 = Math.round(50 * easeOut(ramp(frame, h50At, h50At + 14)));
  return (
    <SceneShell id="battery">
      <Title frame={frame} at={rbscene("battery").from + 2} pill size={56}><LineIcon name="battery" size={64} stroke={8} color={COLORS.blue} />Batterie</Title>
      <div style={{ position: "absolute", left: 330, top: 400, transform: `translateX(${(1 - enter) * -900}px)` }}>
        <Glasses w={360} tint={0} />
      </div>
      {frame >= h9At - 1 && (
        <div style={{ position: "absolute", left: 740, top: 380, ...slam(frame, h9At, 2), fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 110 }}>{h9}</span><span style={{ fontSize: 50 }}> h</span>
        </div>
      )}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 330, top: 640, transform: `translateY(${(1 - sp(frame, cAt, { damping: 12, stiffness: 140 })) * 600}px)` }}>
          <Img k="case" w={360} />
        </div>
      )}
      {frame >= h50At - 1 && (
        <div style={{ position: "absolute", left: 720, top: 640, ...slam(frame, h50At, 2.2), fontFamily: FONT, fontWeight: 900, color: COLORS.blue, background: "#fff", padding: "0 22px 8px", borderRadius: 22, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 90 }}>+{h50}</span><span style={{ fontSize: 44 }}> h</span>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={h9At} text="Jusqu'à 9 h" icon="battery" size={34} solid />
        <Chip frame={frame} at={cAt} text="+50 h avec l'étui de charge" icon="bolt" size={32} />
      </Row>
      <Footnote frame={frame} at={h50At + 4} top={1180} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};
