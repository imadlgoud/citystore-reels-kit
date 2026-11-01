import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, fcev, fcscene } from "./timeline";

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

const Box: React.FC<{ w: number; sweep?: number }> = ({ w, sweep = -1 }) => (
  <div style={{ filter: SHADOW }}>
    <ProductImage src={OFFICIAL.box.src} aspect={OFFICIAL.box.aspect} width={w} sweep={sweep} />
  </div>
);
const GREEN = "#2BD96B", RED = "#FF3B5C", PITCH = "#1f9d55";

/*
 * 0.0-3.5 s HOOK ("your friends play FC 27... and you're still on the old one?")
 * visual: two player cards: "TES AMIS" (lit up, FC 27, sparkle) vs "TOI" (grey, "ANCIENNE ÉDITION", dust + "?").
 */
export const FCHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const fAt = fcev("hook.friends"), cAt = fcev("hook.fc27"), yAt = fcev("hook.you"), oAt = fcev("hook.old");
  const card = (at: number, x: number, rot: number, hot: boolean) => {
    if (frame < at - 1) return null;
    const p = pop(frame, at);
    const shiver = !hot && frame >= oAt ? Math.sin(frame * 1.6) * 3 : 0;
    return (
      <div style={{ position: "absolute", left: x + shiver, top: 400, width: 300, height: 360, borderRadius: 30, transform: `scale(${p}) rotate(${rot}deg)`, background: hot ? "linear-gradient(160deg,#ffffff,#dfe7ff)" : "linear-gradient(160deg,#c9ccd6,#9aa0ad)", boxShadow: hot ? "0 0 40px rgba(108,243,255,0.6), 0 20px 44px rgba(6,14,90,0.45)" : "0 16px 36px rgba(6,14,90,0.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: FONT, fontWeight: 900, filter: hot ? undefined : "saturate(0.3)" }}>
        <div style={{ fontSize: 32, color: hot ? COLORS.blue : "#5d6272", letterSpacing: 2 }}>{hot ? "TES AMIS" : "TOI"}</div>
        <LineIcon name="controller" size={120} stroke={7} color={hot ? COLORS.blue : "#6c7180"} />
        {hot ? (
          frame >= cAt - 1 && <div style={{ ...slam(frame, cAt, 1.8), fontSize: 50, color: "#fff", background: COLORS.blue, padding: "0 20px 6px", borderRadius: 14 }}>FC 27</div>
        ) : (
          frame >= oAt - 1 && <div style={{ ...slam(frame, oAt, 1.8), fontSize: 26, color: "#fff", background: "#6c7180", padding: "4px 14px 6px", borderRadius: 12, textAlign: "center", lineHeight: 1.1 }}>ANCIENNE<br />ÉDITION</div>
        )}
      </div>
    );
  };
  return (
    <SceneShell id="hook">
      {card(fAt, 230, -5, true)}
      {card(yAt, 560, 5, false)}
      {frame >= oAt + 4 && (
        <div style={{ position: "absolute", left: 800, top: 360, width: 110, height: 110, borderRadius: "50%", background: RED, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 80, lineHeight: "110px", textAlign: "center", transform: `scale(${pop(frame, oAt + 4)})`, border: "5px solid #fff" }}>?</div>
      )}
      {frame >= cAt && <Burst x={380} y={580} r={360} rot={frame * 1.2} opacity={0.25} rays={14} />}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        <div dir="rtl" style={{ ...slam(frame, 2, 2), fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#fff", textShadow, whiteSpace: "nowrap" }}>صحابك كيلعبو FC 27… وانت؟</div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp) }} />
    </SceneShell>
  );
};

/** 3.5-7.5 s INTRO: EA SPORTS FC 27, PS5, DISPONIBLE. */
export const FCIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = fcev("intro.name"), pAt = fcev("intro.ps5"), dAt = fcev("intro.dispo");
  const enter = sp(frame, fcscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt + 2, 14, 10);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={540} y={700} r={950} rot={frame * 0.5} opacity={0.2 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 36, letterSpacing: 8 }}>EA SPORTS</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...slam(frame, nAt + 4, 2.2) }}>
          <span style={{ fontSize: 90 }}>FC</span>
          <span style={{ fontSize: 94, color: COLORS.blue, background: "#fff", padding: "0 24px 4px", borderRadius: 18, textShadow: "none" }}>27</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 540 - 180, top: 470, ...slam(frame, nAt + 2, 2.6) }}>
        <Box w={360} sweep={interpolate(frame, [nAt + 8, nAt + 26], [-0.3, 1.3], clamp)} />
      </div>
      <Row top={1060} left={320}>
        <Chip frame={frame} at={pAt} text="PS5" icon="controller" size={40} solid />
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: GREEN, padding: "8px 24px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={46} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: interpolate(frame - nAt - 2, [0, 1, 6], [0, 0.5, 0], clamp) }} />
    </SceneShell>
  );
};

/** 7.5-12.75 s the n°1 football game, with the season's latest teams, players and line-ups. */
export const FCGame: React.FC = () => {
  const frame = useSceneFrame("game");
  const oAt = fcev("gm.one"), wAt = fcev("gm.world"), tAt = fcev("gm.teams"), pAt = fcev("gm.players"), fAt = fcev("gm.form");
  const enter = sp(frame, fcscene("game").from, { damping: 13, stiffness: 120 });
  const W = 520, H = 440, X = 540 - W / 2 + 20, Y = 430;
  // 4-3-3: players drift from a loose cloud into the formation on "التشكيلات"
  const F433 = [[0.5, 0.92], [0.15, 0.72], [0.38, 0.75], [0.62, 0.75], [0.85, 0.72], [0.28, 0.5], [0.5, 0.55], [0.72, 0.5], [0.2, 0.25], [0.5, 0.2], [0.8, 0.25]];
  const form = interpolate(frame, [fAt, fAt + 14], [0, 1], { ...clamp, easing: easeOut });
  return (
    <SceneShell id="game">
      {frame >= oAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, oAt, 2.2), display: "flex", alignItems: "center", gap: 14, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 56, padding: "2px 30px 10px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>
            <LineIcon name="trophy" size={62} stroke={8} color={COLORS.blue} />N°1 du foot
          </div>
        </div>
      )}
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, borderRadius: 30, background: `repeating-linear-gradient(0deg, ${PITCH} 0 55px, #23ad5f 55px 110px)`, border: "6px solid #fff", boxShadow: "0 24px 50px rgba(6,14,90,0.45)", transform: `scale(${enter}) perspective(900px) rotateX(18deg)`, overflow: "hidden" }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <rect x={10} y={10} width={W - 32} height={H - 32} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={4} />
          <line x1={10} y1={(H - 12) / 2} x2={W - 22} y2={(H - 12) / 2} stroke="rgba(255,255,255,0.85)" strokeWidth={4} />
          <circle cx={(W - 12) / 2} cy={(H - 12) / 2} r={50} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={4} />
          <rect x={(W - 12) / 2 - 90} y={H - 22 - 70} width={180} height={70} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={4} />
          <rect x={(W - 12) / 2 - 90} y={10} width={180} height={70} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={4} />
        </svg>
        {frame >= pAt - 1 &&
          F433.map(([u, v], i) => {
            const lx = 0.5 + Math.sin(i * 2.3) * 0.32, ly = 0.5 + Math.cos(i * 1.7) * 0.3;
            const x = lerp(lx, u, form) * (W - 12), y = lerp(ly, v, form) * (H - 12);
            return <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: "50%", background: i === 0 ? "#FFE07A" : "#fff", border: `5px solid ${COLORS.blue}`, transform: `scale(${pop(frame, pAt + i)})` }} />;
          })}
        {frame >= fAt + 8 && <div style={{ position: "absolute", right: 14, top: 12, fontFamily: FONT, fontWeight: 900, fontSize: 32, color: "#fff", background: "rgba(6,14,90,0.55)", padding: "0 14px 4px", borderRadius: 10, opacity: ramp(frame, fAt + 8, fAt + 14) }}>4-3-3</div>}
      </div>
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 120, top: 420, transform: `scale(${pop(frame, wAt)}) rotate(-8deg)` }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
            <LineIcon name="pin" size={74} stroke={8} color={COLORS.blue} />
          </div>
        </div>
      )}
      <Row top={1000}>
        <Chip frame={frame} at={tAt} text="Équipes de la saison" icon="trophy" size={32} solid />
        <Chip frame={frame} at={pAt} text="Joueurs" icon="run" size={32} />
        <Chip frame={frame} at={fAt} text="Compos" icon="note" size={32} solid />
      </Row>
      <Footnote frame={frame} at={oAt + 8} top={1200} text="« N°1 » : selon l'éditeur" />
    </SceneShell>
  );
};

/** 12.75-17.25 s new mode The Grounds, plus Career, Ultimate Team and matches with friends. */
export const FCModes: React.FC = () => {
  const frame = useSceneFrame("modes");
  const nAt = fcev("md.new"), gAt = fcev("md.grounds"), cAt = fcev("md.career"), uAt = fcev("md.ut"), fAt = fcev("md.friends");
  const TILES: { at: number; icon: IconName; text: string; isNew?: boolean }[] = [
    { at: gAt, icon: "home", text: "The Grounds", isNew: true },
    { at: cAt, icon: "briefcase", text: "Carrière" },
    { at: uAt, icon: "trophy", text: "Ultimate Team" },
    { at: fAt, icon: "controller", text: "Entre amis" },
  ];
  return (
    <SceneShell id="modes">
      <Title frame={frame} at={fcscene("modes").from + 2} pill size={56}><LineIcon name="controller" size={62} stroke={8} color={COLORS.blue} />Modes de jeu</Title>
      <div style={{ position: "absolute", left: 330, top: 400, width: 600, display: "flex", flexWrap: "wrap", gap: 24 }}>
        {TILES.map((t, i) => {
          const p = frame < t.at - 1 ? 0 : sp(frame, t.at, { damping: 11, stiffness: 200, mass: 0.6 });
          return (
            <div key={i} style={{ position: "relative", width: 288, height: 230, borderRadius: 30, background: t.isNew ? "#fff" : "rgba(255,255,255,0.18)", border: t.isNew ? "none" : "4px solid rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, transform: `scale(${p})`, opacity: p > 0 ? 1 : 0, boxShadow: "0 16px 40px rgba(6,14,90,0.35)", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: t.isNew ? COLORS.blue : "#fff", whiteSpace: "nowrap" }}>
              <LineIcon name={t.icon} size={86} stroke={7} color={t.isNew ? COLORS.blue : "#fff"} progress={ramp(frame, t.at, t.at + 10)} />
              {t.text}
              {t.isNew && frame >= nAt - 1 && (
                <div style={{ position: "absolute", right: -14, top: -16, transform: `scale(${pop(frame, nAt)}) rotate(8deg)`, background: RED, color: "#fff", fontSize: 26, padding: "2px 14px 6px", borderRadius: 12, border: "4px solid #fff", letterSpacing: 2 }}>NOUVEAU</div>
              )}
            </div>
          );
        })}
      </div>
      <Footnote frame={frame} at={fAt + 4} top={1000} text="Matchs en ligne : abonnement PlayStation Plus requis" />
    </SceneShell>
  );
};

/** 17.25-21.5 s LaLiga, Champions League and many more competitions, all in one game. */
export const FCLeagues: React.FC = () => {
  const frame = useSceneFrame("leagues");
  const lAt = fcev("lg.laliga"), cAt = fcev("lg.ucl"), mAt = fcev("lg.more"), oAt = fcev("lg.one");
  const trophy = sp(frame, fcscene("leagues").from, { damping: 12, stiffness: 120 });
  const sk = shake(frame, oAt, 12, 8);
  const pill = (at: number, text: string, top: number, left: number, solid?: boolean) =>
    frame < at - 1 ? null : (
      <div style={{ position: "absolute", left, top, ...slam(frame, at, 2), background: solid ? "#fff" : "rgba(255,255,255,0.18)", border: solid ? "none" : "4px solid #fff", color: solid ? COLORS.blue : "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "6px 30px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>{text}</div>
    );
  return (
    <SceneShell id="leagues" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={540} y={560} r={800} rot={frame * 0.7} opacity={0.2 * ramp(frame, oAt, oAt + 6)} rays={20} />
      <div style={{ position: "absolute", left: 540 - 110, top: 330, transform: `scale(${trophy})` }}>
        <LineIcon name="trophy" size={220} stroke={6} color="#FFE07A" progress={ramp(frame, fcscene("leagues").from, fcscene("leagues").from + 16)} />
      </div>
      {pill(lAt, "LaLiga", 600, 340, true)}
      {pill(cAt, "Champions League", 700, 360)}
      {pill(mAt, "+ plein d'autres", 800, 420, true)}
      {frame >= oAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
          <div style={{ ...slam(frame, oAt, 2.4), background: GREEN, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: "4px 30px 10px", borderRadius: 999, border: "4px solid #fff", boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>Tout dans un seul jeu</div>
        </div>
      )}
    </SceneShell>
  );
};
