import React from "react";
import { interpolate, staticFile } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, rrev, rrscene } from "./timeline";

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
type GK = "w3_angle" | "aviator" | "w2" | "headliner";
const MODELS: { k: GK; name: string; gen: string }[] = [
  { k: "w3_angle", name: "Wayfarer", gen: "Gen 3" },
  { k: "aviator", name: "Aviator", gen: "Gen 3" },
  { k: "w2", name: "Wayfarer", gen: "Gen 2" },
  { k: "headliner", name: "Headliner", gen: "Gen 2" },
];

/** Wayfarer Gen 3 front view with the Transitions tint (0 clear .. 1 dark), masked to the lenses */
const Glasses: React.FC<{ w: number; tint: number }> = ({ w, tint }) => (
  <div style={{ position: "relative", width: w, height: w * OFFICIAL.w3.aspect, filter: SHADOW }}>
    <ProductImage src={OFFICIAL.w3.src} aspect={OFFICIAL.w3.aspect} width={w} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#2a2622,#4a4038)", opacity: 0.88 * tint, WebkitMaskImage: `url(${staticFile(OFFICIAL.w3_lens.src)})`, WebkitMaskSize: "100% 100%", maskImage: `url(${staticFile(OFFICIAL.w3_lens.src)})`, maskSize: "100% 100%" }} />
  </div>
);

const GenTitle: React.FC<{ frame: number; at: number; genAt: number; name: string; gen: string; size?: number }> = ({ frame, at, genAt, name, gen, size = 80 }) =>
  frame < at - 1 ? null : (
    <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, zIndex: 20 }}>
      <div style={{ ...slam(frame, at, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: size, color: "#fff", textShadow, whiteSpace: "nowrap" }}>{name}</div>
      {frame >= genAt - 1 && <div style={{ ...slam(frame, genAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: size * 0.55, color: COLORS.blue, background: "#fff", padding: "2px 20px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>{gen}</div>}
    </div>
  );

/*
 * 0.0-5.0 s HOOK ("looking for smart glasses? don't buy before watching this video!")
 * visual: smart glasses with a "?" -> a red "ATTENDS !" stop badge -> a play button.
 */
export const RRHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const lAt = rrev("hook.look"), mAt = rrev("hook.smart"), sAt = rrev("hook.stop"), vAt = rrev("hook.video");
  const sk = shake(frame, sAt, 14, 10);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={560} r={900} rot={frame * 0.6} opacity={0.2 * ramp(frame, sAt, sAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 560 - 260, top: 380, transform: `scale(${pop(frame, lAt)}) rotate(${Math.sin(frame * 0.1) * 3}deg)` }}>
        <Img k="w3_angle" w={520} />
      </div>
      {frame >= mAt - 1 && frame < sAt && (
        <div style={{ position: "absolute", left: 780, top: 360, width: 110, height: 110, borderRadius: "50%", background: COLORS.blue, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 80, lineHeight: "110px", textAlign: "center", border: "5px solid #fff", transform: `scale(${pop(frame, mAt)})` }}>?</div>
      )}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 560, ...slam(frame, sAt, 2.4), transform: `${slam(frame, sAt, 2.4).transform ?? ""} rotate(-10deg)` }}>
          <div style={{ background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: "6px 26px 12px", borderRadius: 18, border: "5px solid #fff", boxShadow: "0 14px 34px rgba(80,0,20,0.4)", whiteSpace: "nowrap" }}>ATTENDS !</div>
        </div>
      )}
      {frame >= vAt - 1 && (
        <div style={{ position: "absolute", left: 300, top: 560, width: 130, height: 130, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, vAt)})`, boxShadow: "0 12px 30px rgba(6,14,90,0.4)" }}>
          <LineIcon name="play" size={100} stroke={7} color={COLORS.blue} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < sAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, lAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#fff", textShadow, whiteSpace: "nowrap" }}>كتقلّب على نضاضر smart؟</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, sAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 46, padding: "2px 30px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>ما تشريش حتى تشوف هاد الفيديو!</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - sAt, [0, 1, 6], [0, 0.45, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 5.0-7.0 s LINEUP: Ray-Ban Meta x4, DISPONIBLES. */
export const RRLineup: React.FC = () => {
  const frame = useSceneFrame("lineup");
  const nAt = rrev("ln.name"), fAt = rrev("ln.four"), dAt = rrev("ln.dispo");
  return (
    <SceneShell id="lineup">
      <Burst x={560} y={700} r={900} rot={frame * 0.5} opacity={0.16} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, zIndex: 20 }}>
        <div style={{ ...slam(frame, nAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 80, color: "#fff", textShadow, whiteSpace: "nowrap" }}>Ray-Ban Meta</div>
        {frame >= fAt - 1 && <div style={{ ...slam(frame, fAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COLORS.blue, background: "#fff", padding: "0 20px 6px", borderRadius: 16 }}>x4</div>}
      </div>
      <div style={{ position: "absolute", left: 320, top: 380, width: 620, display: "flex", flexWrap: "wrap", gap: 20 }}>
        {MODELS.map((m, i) => {
          const at = fAt + i * 3;
          const p = frame < at - 1 ? 0 : sp(frame, at, { damping: 12, stiffness: 180 });
          return (
            <div key={i} style={{ width: 300, height: 230, borderRadius: 26, background: "rgba(255,255,255,0.16)", border: "3px solid rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transform: `scale(${p})`, opacity: p > 0 ? 1 : 0 }}>
              <Img k={m.k} w={250} />
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: "#fff", whiteSpace: "nowrap" }}>{m.name} · {m.gen}</div>
            </div>
          );
        })}
      </div>
      <Row top={900} left={300}>
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: GREEN, padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={46} stroke={7} color="#fff" />DISPONIBLES
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 7.0-13.75 s Wayfarer Gen 3, Matte Black, Transitions lenses (tint by themselves with the light), Meta AI button. */
export const RRW3: React.FC = () => {
  const frame = useSceneFrame("w3");
  const nAt = rrev("w3.name"), gAt = rrev("w3.gen"), bAt = rrev("w3.black"), tAt = rrev("w3.trans"), aAt = rrev("w3.auto"), lAt = rrev("w3.light"), uAt = rrev("w3.button"), mAt = rrev("w3.ai");
  const enter = sp(frame, rrscene("w3").from, { damping: 13, stiffness: 120 });
  const level = frame < aAt ? 0 : 0.5 - 0.5 * Math.cos(((frame - aAt) / 30) * Math.PI);
  const W = 660;
  return (
    <SceneShell id="w3">
      <GenTitle frame={frame} at={nAt} genAt={gAt} name="Wayfarer" gen="Gen 3" />
      <div style={{ position: "absolute", inset: 0, background: "#FFE07A", opacity: 0.12 * level }} />
      <div style={{ position: "absolute", left: 560 - W / 2, top: 470, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Glasses w={W} tint={level} />
      </div>
      {frame >= aAt - 1 && (
        <div style={{ position: "absolute", left: 360, top: 380, width: 540, display: "flex", justifyContent: "space-between", transform: `scale(${pop(frame, aAt)})` }}>
          <div style={{ opacity: 0.35 + 0.65 * (1 - level) }}><LineIcon name="home" size={64} stroke={8} /></div>
          <div style={{ opacity: 0.35 + 0.65 * level }}><LineIcon name="sun" size={64} stroke={8} color="#FFE07A" /></div>
        </div>
      )}
      {frame >= uAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 700, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, uAt, 2), display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "4px 24px 10px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>
            <LineIcon name="power" size={46} stroke={8} color={COLORS.blue} />Bouton Meta AI
          </div>
        </div>
      )}
      <Row top={1000}>
        {frame >= bAt - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 22px", borderRadius: 999, background: "rgba(255,255,255,0.18)", border: "3px solid rgba(255,255,255,0.75)", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 32, whiteSpace: "nowrap", transform: `scale(${pop(frame, bAt)})` }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1b1c20", border: "3px solid #fff" }} />Matte Black
          </div>
        )}
        <Chip frame={frame} at={tAt} text="Verres Transitions" icon="sun" size={32} solid />
        <Chip frame={frame} at={lAt} text="S'adaptent à la lumière" icon="bright" size={32} />
      </Row>
      <Footnote frame={frame} at={mAt} top={1250} text="Teinte selon l'intensité des UV · Meta AI : selon le pays et la langue" />
    </SceneShell>
  );
};

/** 13.75-20.5 s Aviator Gen 3: classic aviator style, the same Gen 3 upgrades, battery up to 9 h. */
export const RRAviator: React.FC = () => {
  const frame = useSceneFrame("aviator");
  const nAt = rrev("av.name"), gAt = rrev("av.gen"), sAt = rrev("av.style"), cAt = rrev("av.classic"), uAt = rrev("av.up"), hAt = rrev("av.h9");
  const enter = sp(frame, rrscene("aviator").from, { damping: 13, stiffness: 120 });
  const h = Math.round(9 * easeOut(ramp(frame, hAt, hAt + 12)));
  return (
    <SceneShell id="aviator">
      <GenTitle frame={frame} at={nAt} genAt={gAt} name="Aviator" gen="Gen 3" />
      <div style={{ position: "absolute", left: 560 - 320, top: 400, transform: `translateX(${(1 - enter) * 900}px) rotate(-3deg)` }}>
        <Img k="aviator" w={640} sweep={interpolate(frame, [cAt, cAt + 18], [-0.3, 1.3], clamp)} />
      </div>
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 720, display: "flex", justifyContent: "center", ...slam(frame, hAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, color: "#fff", textShadow }}>
            <LineIcon name="battery" size={90} stroke={7} />
            <span style={{ fontSize: 120 }}>{h}</span><span style={{ fontSize: 56 }}>h</span>
          </div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={sAt} text="Style aviateur classique" icon="spark" size={32} solid />
        <Chip frame={frame} at={uAt} text="Upgrades Gen 3" icon="check" size={32} />
        <Chip frame={frame} at={hAt} text="Jusqu'à 9 h" icon="battery" size={32} solid />
      </Row>
      <Footnote frame={frame} at={hAt + 4} top={1250} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};

/** 20.5-24.5 s Wayfarer + Headliner Gen 2: same camera, battery up to 8 h, lower price. */
export const RRGen2: React.FC = () => {
  const frame = useSceneFrame("gen2");
  const nAt = rrev("g2.name"), hAt = rrev("g2.head"), cAt = rrev("g2.cam"), bAt = rrev("g2.h8"), pAt = rrev("g2.price");
  const enter = sp(frame, rrscene("gen2").from, { damping: 13, stiffness: 120 });
  return (
    <SceneShell id="gen2">
      <GenTitle frame={frame} at={nAt} genAt={nAt + 4} name="Wayfarer + Headliner" gen="Gen 2" size={58} />
      <div style={{ position: "absolute", left: 300, top: 380, transform: `translateX(${(1 - enter) * -900}px) rotate(-4deg)` }}>
        <Img k="w2" w={420} />
      </div>
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 520, top: 600, transform: `translateX(${(1 - sp(frame, hAt, { damping: 12, stiffness: 150 })) * 800}px) rotate(4deg)` }}>
          <Img k="headliner" w={420} />
        </div>
      )}
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 660, top: 400, ...slam(frame, pAt, 2), transform: `${slam(frame, pAt, 2).transform ?? ""} rotate(8deg)` }}>
          <div style={{ background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "4px 22px 8px", borderRadius: 14, border: "4px solid #fff", whiteSpace: "nowrap" }}>PRIX PLUS DOUX</div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={cAt} text="Même caméra" icon="camera" size={32} solid />
        <Chip frame={frame} at={bAt} text="Jusqu'à 8 h" icon="battery" size={32} />
      </Row>
      <Footnote frame={frame} at={bAt + 4} top={1250} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};

/** 24.5-31.25 s all four: 12 MP camera, 3K video, music and calls. */
export const RRAll: React.FC = () => {
  const frame = useSceneFrame("all");
  const aAt = rrev("al.all"), mAt = rrev("al.mp"), vAt = rrev("al.vid"), uAt = rrev("al.music"), cAt = rrev("al.calls");
  const t = frame / 30;
  return (
    <SceneShell id="all">
      <Title frame={frame} at={aAt} pill size={54}>Les 4 modèles</Title>
      <div style={{ position: "absolute", left: 320, top: 360, width: 620, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
        {MODELS.map((m, i) => (
          <div key={i} style={{ transform: `scale(${pop(frame, aAt + i * 3)}) translateY(${Math.sin(t * 2 + i) * 6}px)` }}><Img k={m.k} w={290} /></div>
        ))}
      </div>
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: 340, top: 720, ...slam(frame, mAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "2px 22px 8px", borderRadius: 20, boxShadow: "0 16px 40px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="camera" size={64} stroke={8} color={COLORS.blue} />12 <span style={{ fontSize: 32 }}>MP</span>
          </div>
        </div>
      )}
      {frame >= vAt - 1 && (
        <div style={{ position: "absolute", left: 690, top: 720, ...slam(frame, vAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "2px 22px 8px", borderRadius: 20, border: "4px solid #fff", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 30, opacity: frame % 20 < 12 ? 1 : 0.3 }}>●</span>3K
          </div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={uAt} text="Musique" icon="note" size={36} solid />
        <Chip frame={frame} at={cAt} text="Appels" icon="call" size={36} />
      </Row>
    </SceneShell>
  );
};
