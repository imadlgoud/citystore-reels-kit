import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, rzev, rzscene, SPOT } from "./timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SHADOW = "drop-shadow(0 30px 40px rgba(6,14,90,0.5))";
const textShadow = "0 10px 30px rgba(8,20,110,0.4)";
const RAZER_GREEN = "#44D62C";

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

const Front: React.FC<{ w: number; sweep?: number; children?: React.ReactNode }> = ({ w, sweep = -1, children }) => (
  <div style={{ position: "relative", filter: SHADOW }}>
    <ProductImage src={OFFICIAL.front.src} aspect={OFFICIAL.front.aspect} width={w} sweep={sweep} />
    {children}
  </div>
);

/*
 * 0.0-3.25 s HOOK ("you hear the bullet after you die? it's not you, it's the headset!")
 * visual: a drawn game screen: crosshair, a red "K.O." stamp on "تموت", then the "BANG!" bubble arrives late with a
 *         "LAG" clock; on "فالكيت" a generic wireless headset icon gets crossed out.
 */
export const RZHook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const bAt = rzev("hook.bullet"), dAt = rzev("hook.dead"), gAt = rzev("hook.bang"), nAt = rzev("hook.notyou"), kAt = rzev("hook.kit");
  const sk = shake(frame, dAt, 16, 12);
  const screenP = sp(frame, 0, { damping: 12, stiffness: 150 });
  const shot = ramp(frame, bAt, bAt + 6);
  const x = ramp(frame, kAt + 3, kAt + 9);
  const S = { x: 170, y: 250, w: 680, h: 420 };
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <div style={{ position: "absolute", left: S.x, top: S.y, width: S.w, height: S.h, borderRadius: 30, border: "8px solid #fff", background: "linear-gradient(180deg,#1b2340,#0b0f20)", overflow: "hidden", transform: `scale(${screenP})`, boxShadow: "0 24px 60px rgba(6,14,90,0.5)" }}>
        <svg width={S.w} height={S.h} viewBox={`0 0 ${S.w} ${S.h}`} style={{ position: "absolute", inset: 0 }}>
          <path d={`M0 ${S.h * 0.75} L ${S.w * 0.2} ${S.h * 0.55} L ${S.w * 0.35} ${S.h * 0.68} L ${S.w * 0.6} ${S.h * 0.45} L ${S.w * 0.8} ${S.h * 0.62} L ${S.w} ${S.h * 0.5} V ${S.h} H 0 Z`} fill="#2a3560" />
          <circle cx={S.w / 2} cy={S.h / 2} r={46} fill="none" stroke={RAZER_GREEN} strokeWidth={5} />
          <path d={`M ${S.w / 2 - 70} ${S.h / 2} H ${S.w / 2 - 20} M ${S.w / 2 + 20} ${S.h / 2} H ${S.w / 2 + 70} M ${S.w / 2} ${S.h / 2 - 70} V ${S.h / 2 - 20} M ${S.w / 2} ${S.h / 2 + 20} V ${S.h / 2 + 70}`} stroke={RAZER_GREEN} strokeWidth={5} strokeLinecap="round" />
          {shot > 0 && shot < 1 && <line x1={S.w * 0.95} y1={S.h * 0.2} x2={lerp(S.w * 0.95, S.w / 2, shot)} y2={lerp(S.h * 0.2, S.h / 2, shot)} stroke="#FFD25A" strokeWidth={8} strokeLinecap="round" />}
        </svg>
        {frame >= dAt && <div style={{ position: "absolute", inset: 0, background: "rgba(255,40,70,0.35)", opacity: 1 - ramp(frame, dAt + 10, dAt + 30) * 0.5 }} />}
        {frame >= dAt - 1 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: S.h / 2 - 70, display: "flex", justifyContent: "center", ...slam(frame, dAt, 2.6) }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: "#fff", background: "#FF3B5C", padding: "0 34px 10px", borderRadius: 22, transform: "rotate(-6deg)" }}>K.O.</div>
          </div>
        )}
      </div>
      {/* the BANG arrives late */}
      {frame >= gAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 200, ...slam(frame, gAt, 2.4) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#FFD25A", color: "#3a2500", fontFamily: FONT, fontWeight: 900, fontSize: 50, padding: "6px 24px 10px", borderRadius: 18, transform: "rotate(8deg)", boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>
            <LineIcon name="stopwatch" size={54} stroke={8} color="#3a2500" /> BANG! <span style={{ fontSize: 30 }}>LAG</span>
          </div>
        </div>
      )}
      {/* "it's the headset": a generic wireless headset crossed out */}
      {frame >= nAt - 1 && (
        <div style={{ position: "absolute", left: 90, top: 600, width: 170, height: 170, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, nAt)})`, boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>
          <LineIcon name="headphones" size={110} stroke={7} color={COLORS.blue} />
          <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
            <circle cx={50} cy={50} r={44} fill="none" stroke="#FF3B5C" strokeWidth={8} opacity={x} />
            <path d={`M 20 20 L ${20 + 60 * x} ${20 + 60 * x}`} stroke="#FF3B5C" strokeWidth={9} strokeLinecap="round" />
          </svg>
        </div>
      )}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - dAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.25-7.25 s INTRO: Razer Hammerhead USB-C ANC, DISPONIBLE. */
export const RZIntro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = rzev("intro.name"), uAt = rzev("intro.usbc"), aAt = rzev("intro.anc"), dAt = rzev("intro.dispo");
  const enter = sp(frame, rzscene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  const t = frame / 30;
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={505} y={760} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 38, letterSpacing: 12, color: RAZER_GREEN }}>RAZER</div>
        <div style={{ ...slam(frame, nAt + 4, 2.2), fontSize: 86, letterSpacing: -1 }}>Hammerhead</div>
      </div>
      <div style={{ position: "absolute", left: 505 - 190, top: 420, transform: `translateY(${(1 - enter) * 1100 + Math.sin(t * Math.PI) * 8}px) rotate(${lerp(-10, 0, enter)}deg)` }}>
        <Front w={380} sweep={interpolate(frame, [nAt + 6, nAt + 22], [-0.3, 1.3], clamp)} />
      </div>
      <div style={{ position: "absolute", right: 110, top: 470, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-end" }}>
        <Chip frame={frame} at={uAt} text="USB-C" icon="cable" size={40} solid />
        <Chip frame={frame} at={aAt} text="ANC" icon="headphones" size={40} solid />
      </div>
      {frame >= dAt - 1 && (
        <div style={{ position: "absolute", left: 340, right: 130, top: 1150, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 12, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: "#2BD96B", padding: "8px 26px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={48} stroke={7} color="#fff" />DISPONIBLE
          </div>
        </div>
      )}
    </SceneShell>
  );
};

/** 7.25-11.0 s USB-C cable: the sound reaches you in time, no delay. */
export const RZCable: React.FC = () => {
  const frame = useSceneFrame("cable");
  const pAt = rzev("cb.plug"), tAt = rzev("cb.time"), nAt = rzev("cb.nolag");
  const enter = sp(frame, rzscene("cable").from, { damping: 13, stiffness: 120 });
  const W = 420, H = W * OFFICIAL.front.aspect, X = 120, Y = 300;
  const plug = { x: X + SPOT.plug.x * W, y: Y + SPOT.plug.y * H };
  const bud = { x: X + SPOT.bud.x * W, y: Y + SPOT.bud.y * H };
  const pulses = frame >= tAt ? [0, 1, 2].map((i) => ((frame - tAt) / 12 + i / 3) % 1) : [];
  return (
    <SceneShell id="cable">
      <div style={{ position: "absolute", left: X, top: Y, transform: `translateX(${(1 - enter) * -800}px)` }}>
        <Front w={W} />
      </div>
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: plug.x - 60, top: plug.y - 60, width: 120, height: 120, borderRadius: "50%", border: `6px solid ${RAZER_GREEN}`, transform: `scale(${pop(frame, pAt)})`, boxShadow: `0 0 30px ${RAZER_GREEN}` }} />
      )}
      {/* sound pulses travelling instantly from the plug to the earbud */}
      {pulses.map((k, i) => (
        <div key={i} style={{ position: "absolute", left: lerp(plug.x, bud.x, k) - 16, top: lerp(plug.y, bud.y, k) - 16, width: 32, height: 32, borderRadius: "50%", background: RAZER_GREEN, boxShadow: `0 0 20px ${RAZER_GREEN}`, opacity: 1 - k * 0.3 }} />
      ))}
      {frame >= pAt - 1 && (
        <div style={{ position: "absolute", left: 620, top: 330, ...slam(frame, pAt, 2.2) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "4px 28px 10px", borderRadius: 22, boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>
            <LineIcon name="cable" size={64} stroke={8} color={COLORS.blue} />USB-C
          </div>
        </div>
      )}
      {frame >= nAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 520, ...slam(frame, nAt, 2.4) }}>
          <div style={{ transform: "rotate(-6deg)", background: RAZER_GREEN, color: "#062b00", fontFamily: FONT, fontWeight: 900, fontSize: 40, lineHeight: 1.05, textAlign: "center", padding: "8px 22px 12px", borderRadius: 16, boxShadow: "0 14px 34px rgba(6,14,90,0.4)" }}>
            ZÉRO<br />RETARD
          </div>
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={pAt} text="Filaire USB-C" icon="cable" size={36} />
        <Chip frame={frame} at={tAt} text="Son en temps réel" icon="bolt" size={36} solid />
      </Row>
      <Footnote frame={frame} at={pAt + 6} top={1262} text="Nécessite un appareil avec port USB-C" />
    </SceneShell>
  );
};

/** 11.0-15.5 s active noise cancellation: blocks the noise around you, stay focused on the game. */
export const RZAnc: React.FC = () => {
  const frame = useSceneFrame("anc");
  const oAt = rzev("anc.on"), nAt = rzev("anc.noise"), fAt = rzev("anc.focus");
  const C = { x: 505, y: 560 };
  const shield = ramp(frame, oAt + 4, oAt + 14);
  const WAVES = Array.from({ length: 8 }).map((_, i) => (i / 8) * Math.PI * 2);
  return (
    <SceneShell id="anc">
      <Title frame={frame} at={oAt} pill size={50}>
        <LineIcon name="headphones" size={56} stroke={8} color={COLORS.blue} />
        Réduction de bruit active
      </Title>
      {/* noise waves coming in from all sides, stopped at the shield */}
      {frame >= nAt - 6 && WAVES.map((a, i) => {
        const k = (((frame - nAt) / 24 + i / 8) % 1 + 1) % 1;
        const r = lerp(420, 230, k);
        return (
          <svg key={i} width={1080} height={1200} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 0.85 * (1 - k * 0.6) }}>
            <path d={`M ${C.x + Math.cos(a - 0.18) * r} ${C.y + Math.sin(a - 0.18) * r} Q ${C.x + Math.cos(a) * (r + 22)} ${C.y + Math.sin(a) * (r + 22)} ${C.x + Math.cos(a + 0.18) * r} ${C.y + Math.sin(a + 0.18) * r}`} stroke="#FF6B8B" strokeWidth={9} fill="none" strokeLinecap="round" />
          </svg>
        );
      })}
      <div style={{ position: "absolute", left: C.x - 220, top: C.y - 220, width: 440, height: 440, borderRadius: "50%", border: `10px solid ${RAZER_GREEN}`, opacity: shield, transform: `scale(${lerp(0.7, 1, shield)})`, boxShadow: `0 0 40px ${RAZER_GREEN}, inset 0 0 40px rgba(68,214,44,0.4)`, background: "rgba(6,14,90,0.25)" }} />
      <div style={{ position: "absolute", left: C.x - 110, top: C.y - 110, width: 220, height: 220, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px rgba(6,14,90,0.4)" }}>
        <LineIcon name={frame >= fAt ? "controller" : "headphones"} size={130} stroke={7} color={COLORS.blue} />
      </div>
      <Row top={1090}>
        <Chip frame={frame} at={nAt} text="Bruit bloqué" icon="nosignal" size={36} />
        <Chip frame={frame} at={fAt} text="Concentré sur le jeu" icon="controller" size={36} solid />
      </Row>
    </SceneShell>
  );
};

/** drawn memory-foam ear tip */
const FoamTip: React.FC<{ s: number }> = ({ s }) => (
  <svg width={s} height={s * 1.1} viewBox="0 0 100 110">
    <defs>
      <pattern id="foam" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="rgba(255,255,255,0.25)" /><circle cx="6" cy="6" r="1" fill="rgba(255,255,255,0.18)" /></pattern>
    </defs>
    <rect x={18} y={10} width={64} height={80} rx={30} fill="#2a2d33" />
    <rect x={18} y={10} width={64} height={80} rx={30} fill="url(#foam)" />
    <rect x={40} y={86} width={20} height={20} rx={4} fill="#111" />
  </svg>
);

/** 15.5-19.5 s Comply memory-foam ear tips: comfortable and isolate the sound. */
export const RZTips: React.FC = () => {
  const frame = useSceneFrame("tips");
  const cAt = rzev("tp.comply"), mAt = rzev("tp.comfy"), iAt = rzev("tp.iso");
  const enter = sp(frame, rzscene("tips").from, { damping: 13, stiffness: 120 });
  const squeeze = frame >= mAt ? 1 - 0.18 * Math.max(0, Math.sin((frame - mAt) * 0.25)) * Math.exp(-(frame - mAt) / 30) : 1;
  return (
    <SceneShell id="tips">
      <Title frame={frame} at={cAt} pill size={52}>Embouts Comply en mousse</Title>
      <div style={{ position: "absolute", left: 90, top: 380, transform: `translateX(${(1 - enter) * -800}px)` }}>
        <Front w={360} />
      </div>
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 590, top: 400, transform: `scale(${pop(frame, cAt)}) scaleX(${squeeze})` }}>
          <div style={{ width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.18)", border: "4px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FoamTip s={190} />
          </div>
        </div>
      )}
      {frame >= iAt - 1 && (
        <div style={{ position: "absolute", left: 600, top: 740, transform: `scale(${pop(frame, iAt)})` }}>
          <LineIcon name="lock" size={110} stroke={7} />
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={mAt} text="Confort" icon="heart" size={38} />
        <Chip frame={frame} at={iAt} text="Isolation du son" icon="lock" size={38} solid />
      </Row>
    </SceneShell>
  );
};

/** 19.5-23.25 s in-line remote with mic: talk to your friends and answer calls. */
export const RZRemote: React.FC = () => {
  const frame = useSceneFrame("remote");
  const rAt = rzev("rm.remote"), mAt = rzev("rm.mic"), tAt = rzev("rm.talk"), cAt = rzev("rm.calls");
  const enter = sp(frame, rzscene("remote").from, { damping: 13, stiffness: 120 });
  const W = 700, H = W * OFFICIAL.front.aspect;
  const X = 505 - SPOT.remote.x * W, Y = 640 - SPOT.remote.y * H;
  const r = { x: X + SPOT.remote.x * W, y: Y + SPOT.remote.y * H };
  return (
    <SceneShell id="remote">
      <div style={{ position: "absolute", left: 0, top: 220, width: 1080, height: 900, overflow: "hidden", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 10%, #000 88%, transparent 100%)" }}>
        <div style={{ position: "absolute", left: X, top: Y - 220, transform: `scale(${lerp(0.85, 1, enter)})`, transformOrigin: `${SPOT.remote.x * W}px ${SPOT.remote.y * H}px` }}>
          <Front w={W} />
        </div>
      </div>
      {frame >= rAt - 1 && (
        <div style={{ position: "absolute", left: r.x - 70, top: r.y - 150, width: 140, height: 300, borderRadius: 40, border: `6px solid ${RAZER_GREEN}`, transform: `scale(${pop(frame, rAt)})`, boxShadow: `0 0 30px ${RAZER_GREEN}` }} />
      )}
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: r.x + 110, top: r.y - 200, transform: `scale(${pop(frame, mAt)})`, display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "6px 22px 10px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
          <LineIcon name="shout" size={44} stroke={8} color={COLORS.blue} />Micro
        </div>
      )}
      {(["Go go go !", "Bien joué 🔥"] as const).map((m, i) => {
        const at = tAt + i * 8;
        if (frame < at - 1) return null;
        return (
          <div key={m} style={{ position: "absolute", left: 110 + i * 30, top: 420 + i * 110, padding: "14px 26px", borderRadius: 28, borderBottomLeftRadius: 6, background: i ? `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.cyan})` : "#fff", border: i ? "3px solid #fff" : "none", color: i ? "#fff" : COLORS.navy, fontFamily: FONT, fontWeight: 800, fontSize: 36, transform: `scale(${pop(frame, at)})`, transformOrigin: "left bottom", boxShadow: "0 12px 30px rgba(6,14,90,0.3)", whiteSpace: "nowrap" }}>{m}</div>
        );
      })}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: r.x + 110, top: r.y + 40, width: 120, height: 120, borderRadius: "50%", background: "#2BD96B", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pop(frame, cAt)}) rotate(${Math.sin(frame * 1.5) * 8}deg)`, boxShadow: "0 12px 30px rgba(6,14,90,0.35)" }}>
          <LineIcon name="call" size={70} stroke={7} color="#fff" />
        </div>
      )}
      <Row top={1090}>
        <Chip frame={frame} at={rAt} text="Télécommande" icon="chip" size={36} />
        <Chip frame={frame} at={tAt} text="Parle avec tes potes" icon="chat" size={36} solid />
        <Chip frame={frame} at={cAt} text="Appels" icon="call" size={36} />
      </Row>
    </SceneShell>
  );
};
