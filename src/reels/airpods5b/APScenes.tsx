import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { ProductHook } from "../../components/ProductHook";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, apev, apscene } from "./timeline";

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

/** "experience" bar: fill 0..1, red at half, green when full */
const XpBar: React.FC<{ fill: number; label: string }> = ({ fill, label }) => (
  <div style={{ width: 520, fontFamily: FONT, fontWeight: 900, color: "#fff" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, marginBottom: 8, textShadow }}><span>{label}</span><span>{Math.round(fill * 100)} %</span></div>
    <div style={{ height: 34, borderRadius: 17, background: "rgba(255,255,255,0.25)", border: "4px solid #fff", overflow: "hidden" }}>
      <div style={{ width: `${fill * 100}%`, height: "100%", background: fill < 0.99 ? RED : GREEN }} />
    </div>
  </div>
);

/*
 * 0.0-3.75 s HOOK ("you have an iPhone and still no AirPods? you're missing half the experience!")
 * product-first: the AirPods are on screen from frame 0 with the hook pill; at "half" the pill punches to
 * "ناقصاك نص التجربة!" and an "EXPÉRIENCE 50 %" bar drops in under the product.
 */
export const APHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const hAt = apev("hook.half");
  const fill = 0.5 * easeOut(ramp(frame, hAt, hAt + 12));
  return (
    <ProductHook src={OFFICIAL.open.src} aspect={OFFICIAL.open.aspect} width={470} top={400} hook="عندك iPhone وما عندكش AirPods؟" punch={{ at: hAt, text: "ناقصاك نص التجربة!" }}>
      {frame >= hAt - 1 && (
        <div style={{ position: "absolute", left: 360, top: 1060, transform: `scale(${pop(frame, hAt)})`, transformOrigin: "left center", zIndex: 10 }}>
          <XpBar fill={fill} label="EXPÉRIENCE" />
        </div>
      )}
    </ProductHook>
  );
};

/** 3.75-6.0 s INTRO: AirPods 5, DISPONIBLES (the experience bar fills to 100 %). */
export const APIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = apev("intro.name"), fAt = apev("intro.five"), dAt = apev("intro.dispo");
  const from = apscene("intro").from;
  const fill = 0.5 + 0.5 * easeOut(ramp(frame, nAt, nAt + 14));
  const sk = shake(frame, nAt, 14, 10);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={560} y={620} r={950} rot={frame * 0.5} opacity={0.2 * ramp(frame, nAt, nAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, zIndex: 20 }}>
        <div style={{ ...slam(frame, nAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 100, color: "#fff", textShadow, whiteSpace: "nowrap" }}>AirPods</div>
        {frame >= fAt - 1 && <div style={{ ...slam(frame, fAt, 2.4), fontFamily: FONT, fontWeight: 900, fontSize: 100, color: COLORS.blue, background: "#fff", padding: "0 30px 6px", borderRadius: 22 }}>5</div>}
      </div>
      <div style={{ position: "absolute", left: 560 - 170, top: 380, ...slam(frame, from + 2, 2.4) }}>
        <Img k="open" w={340} sweep={interpolate(frame, [nAt + 4, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 860 }}>
        <XpBar fill={fill} label={fill > 0.99 ? "EXPÉRIENCE COMPLÈTE" : "EXPÉRIENCE"} />
      </div>
      <Row top={1030} left={300}>
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: GREEN, padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={46} stroke={7} color="#fff" />DISPONIBLES
          </div>
        )}
      </Row>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame - from - 2, [0, 1, 6], [0, 0.45, 0], clamp) }} />
    </SceneShell>
  );
};

/** 6.0-12.75 s noise cancellation up to 50 % stronger than AirPods 4; switches to transparency when someone talks to you. */
export const APAnc: React.FC = () => {
  const frame = useSceneFrame("anc");
  const nAt = apev("anc.name"), pAt = apev("anc.pct"), vAt = apev("anc.vs"), aAt = apev("anc.auto"), tAt = apev("anc.transp"), kAt = apev("anc.talk");
  const enter = sp(frame, apscene("anc").from, { damping: 13, stiffness: 120 });
  const transp = ramp(frame, tAt - 2, tAt + 8);
  const quiet = ramp(frame, nAt, pAt + 10) * (1 - 0.7 * transp);
  const t = frame / 30;
  // noise rings around the earbuds shrink as ANC kicks in, come back softly in transparency
  const rings = [0, 1, 2].map((i) => 150 + i * 70 + Math.sin(t * 4 + i) * 10 * (1 - quiet));
  return (
    <SceneShell id="anc">
      <Title frame={frame} at={nAt} pill size={56}><LineIcon name="headphones" size={60} stroke={8} color={COLORS.blue} />Réduction de bruit</Title>
      <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {rings.map((r, i) => <circle key={i} cx={470} cy={560} r={r} fill="none" stroke={transp > 0.5 ? "#6CF3FF" : RED} strokeWidth={8} strokeDasharray="18 16" opacity={(1 - quiet) * 0.8 + 0.1} />)}
      </svg>
      <div style={{ position: "absolute", left: 470 - 150, top: 400, transform: `scale(${enter})` }}>
        <Img k="open" w={300} />
      </div>
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 680, top: 400, ...slam(frame, pAt, 2.2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, lineHeight: 1, color: "#fff", textShadow }}>+50<span style={{ fontSize: 56 }}> %</span></div>
          {frame >= vAt - 1 && <div style={{ marginTop: 10, transform: `scale(${pop(frame, vAt)})`, transformOrigin: "left", fontFamily: FONT, fontWeight: 900, fontSize: 28, color: COLORS.blue, background: "#fff", padding: "4px 16px 6px", borderRadius: 999, whiteSpace: "nowrap", width: "fit-content" }}>vs AirPods 4</div>}
        </div>
      )}
      {/* ANC <-> transparency switch + a speech bubble when someone talks */}
      {frame >= aAt - 1 && (
        <div style={{ position: "absolute", left: 340, top: 820, display: "flex", alignItems: "center", gap: 16, transform: `scale(${pop(frame, aAt)})`, transformOrigin: "left center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff" }}>
          <span style={{ opacity: 1 - 0.6 * transp }}>Réduction</span>
          <div style={{ position: "relative", width: 110, height: 54, borderRadius: 27, background: transp > 0.5 ? "#6CF3FF" : "rgba(255,255,255,0.3)", border: "4px solid #fff" }}>
            <div style={{ position: "absolute", top: 5, left: 5 + transp * 54, width: 36, height: 36, borderRadius: "50%", background: "#fff" }} />
          </div>
          <span style={{ opacity: 0.4 + 0.6 * transp }}>Transparence</span>
        </div>
      )}
      {frame >= kAt - 1 && (
        <div style={{ position: "absolute", left: 700, top: 620, transform: `scale(${pop(frame, kAt)})`, background: "#fff", borderRadius: "26px 26px 26px 4px", padding: "12px 20px", boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
          <LineIcon name="chat" size={60} stroke={8} color={COLORS.blue} />
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={tAt} text="Mode transparence auto" icon="eye" size={32} solid />
      </Row>
      <Footnote frame={frame} at={vAt + 4} top={1180} text="Jusqu'à 50 % de bruit en moins vs AirPods 4 (réduction de bruit)" />
    </SceneShell>
  );
};

/** 12.75-17.0 s live translation when you talk with someone in another language. */
export const APTrans: React.FC = () => {
  const frame = useSceneFrame("trans");
  const nAt = apev("tr.name"), lAt = apev("tr.live"), yAt = apev("tr.you"), gAt = apev("tr.lang");
  const enter = sp(frame, apscene("trans").from, { damping: 13, stiffness: 120 });
  const flip = ramp(frame, lAt + 6, lAt + 14);
  const bubble = (text: string, sub: string, color: string) => (
    <div style={{ background: "#fff", borderRadius: 26, padding: "14px 24px 16px", boxShadow: "0 14px 34px rgba(6,14,90,0.4)", fontFamily: FONT, color: COLORS.navy, whiteSpace: "nowrap" }}>
      <div style={{ fontWeight: 900, fontSize: 24, color, letterSpacing: 2 }}>{sub}</div>
      <div style={{ fontWeight: 900, fontSize: 40 }}>{text}</div>
    </div>
  );
  return (
    <SceneShell id="trans">
      <Title frame={frame} at={nAt} pill size={56}><LineIcon name="chat" size={60} stroke={8} color={COLORS.blue} />Traduction en direct</Title>
      <div style={{ position: "absolute", left: 560 - 150, top: 620, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="open" w={300} />
      </div>
      {frame >= lAt - 1 && (
        <div style={{ position: "absolute", left: 330, top: 380, transform: `scale(${pop(frame, lAt)})`, transformOrigin: "left top" }}>
          {flip < 0.5 ? bubble("¿Cómo estás?", "ESPAGNOL", "#FF7A1A") : <div style={{ transform: `scaleY(${(flip - 0.5) * 2})` }}>{bubble("Comment ça va ?", "FRANÇAIS", GREEN)}</div>}
        </div>
      )}
      {frame >= yAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 500, transform: `scale(${pop(frame, yAt)})`, transformOrigin: "right top" }}>
          {bubble("Très bien !", "TOI", COLORS.blue)}
        </div>
      )}
      <Row top={1030}>
        <Chip frame={frame} at={gAt} text="Autre langue → français" icon="spark" size={32} solid />
      </Row>
      <Footnote frame={frame} at={lAt + 4} top={1180} text="* Avec Apple Intelligence sur iPhone compatible, langues prises en charge uniquement." />
    </SceneShell>
  );
};

/** 17.0-21.5 s hands-free Siri, personalised spatial audio, resistant to sweat, dust and water. */
export const APFeat: React.FC = () => {
  const frame = useSceneFrame("feat");
  const sAt = apev("ft.siri"), pAt = apev("ft.spatial"), wAt = apev("ft.sweat"), dAt = apev("ft.dust"), aAt = apev("ft.water");
  const enter = sp(frame, apscene("feat").from, { damping: 13, stiffness: 120 });
  const t = frame / 30;
  return (
    <SceneShell id="feat">
      <div style={{ position: "absolute", left: 560 - 170, top: 420, transform: `translateY(${(1 - enter) * 900}px)` }}>
        <Img k="case" w={340} />
      </div>
      {frame >= pAt - 1 && (
        <svg width={1080} height={1000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          {[0, 1, 2].map((i) => {
            const r = 200 + ((t * 80 + i * 60) % 180);
            return <circle key={i} cx={560} cy={600} r={r} fill="none" stroke="#6CF3FF" strokeWidth={5} opacity={Math.max(0, 1 - (r - 200) / 180) * ramp(frame, pAt, pAt + 8)} />;
          })}
        </svg>
      )}
      {frame >= sAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, sAt, 2), display: "flex", alignItems: "center", gap: 12, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 54, padding: "2px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="chat" size={58} stroke={8} color={COLORS.blue} />Siri sans les mains
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: 330, right: 130, top: 830, display: "flex", justifyContent: "center", gap: 30 }}>
        {[{ at: wAt, icon: "drop" as IconName, t: "Sueur" }, { at: dAt, icon: "spark" as IconName, t: "Poussière" }, { at: aAt, icon: "dive" as IconName, t: "Eau" }].map((x, i) =>
          frame < x.at - 1 ? null : (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${pop(frame, x.at)})` }}>
              <div style={{ width: 110, height: 110, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}><LineIcon name={x.icon} size={70} stroke={8} color={COLORS.blue} /></div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", textShadow }}>{x.t}</div>
            </div>
          ),
        )}
      </div>
      <Row top={1060}>
        <Chip frame={frame} at={pAt} text="Son spatial personnalisé" icon="headphones" size={32} solid />
      </Row>
      <Footnote frame={frame} at={aAt} top={1200} text="Résistance à la sueur, la poussière et l'eau : IP57" />
    </SceneShell>
  );
};
