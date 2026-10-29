import React from "react";
import { interpolate } from "remotion";
import { COLORS, FONT } from "../../brand";
import { lerp, pop, ramp, shake, slam, sp } from "../../anim";
import { IconName, LineIcon } from "../../components/Icons";
import { ProductImage } from "../../components/ProductImage";
import { Burst, SceneShell, useSceneFrame } from "../../components/SceneShell";
import { OFFICIAL, o7ev, o7scene } from "./timeline";

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
const GREEN = "#2BD96B";

/** drawn landscape "video" (sky, sun, hills); jitter = shake amount (0 = steady) */
const VideoFrame: React.FC<{ frame: number; x: number; y: number; w: number; h: number; jitter: number; children?: React.ReactNode }> = ({ frame, x, y, w, h, jitter, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, overflow: "hidden", border: "6px solid #fff", background: "linear-gradient(180deg,#7fd3ff,#c9f0ff)", boxShadow: "0 24px 50px rgba(6,14,90,0.45)" }}>
    <svg viewBox="0 0 320 180" width={w} height={h} style={{ position: "absolute", left: 0, top: 0, transform: `translate(${Math.sin(frame * 1.7) * 26 * jitter}px, ${Math.cos(frame * 2.3) * 20 * jitter}px) rotate(${Math.sin(frame * 1.1) * 7 * jitter}deg) scale(1.14)` }}>
      <circle cx={250} cy={45} r={18} fill="#FFE07A" />
      <path d="M0 130 L70 60 L110 100 L160 40 L230 120 L270 90 L320 130 V180 H0 Z" fill="#2f6fd6" />
      <path d="M0 150 Q 80 136 160 150 T 320 148 V180 H0 Z" fill="#1e4fb0" />
    </svg>
    {children}
  </div>
);

/*
 * 0.0-3.5 s HOOK ("your phone films well... but the video always shakes? here's the fix!")
 * visual: a phone filming, its picture shaking harder and harder (red "ÇA TREMBLE"), then the gimbal with the phone slams in.
 */
export const O7Hook: React.FC = () => {
  const frame = useSceneFrame("hook");
  const gAt = o7ev("hook.good"), sAt = o7ev("hook.shake"), fAt = o7ev("hook.fix");
  const jitter = frame < sAt ? 0.25 : 1;
  const out = ramp(frame, fAt - 2, fAt + 5);
  const sk = shake(frame, fAt, 14, 10);
  return (
    <SceneShell id="hook" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={540} y={560} r={900} rot={frame * 0.6} opacity={0.2 * ramp(frame, fAt, fAt + 6)} rays={20} />
      {out < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out }}>
          <div style={{ transform: `rotate(${Math.sin(frame * 1.9) * 4 * jitter}deg)`, transformOrigin: "540px 560px" }}>
            <VideoFrame frame={frame} x={540 - 240} y={400} w={480} h={300} jitter={jitter}>
              <div style={{ position: "absolute", left: 14, top: 12, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: "#fff", background: "#FF3B5C", padding: "2px 12px", borderRadius: 999 }}>● REC</div>
            </VideoFrame>
          </div>
          {frame >= sAt - 1 && (
            <div style={{ position: "absolute", left: 600, top: 650, transform: `scale(${pop(frame, sAt)}) rotate(${-8 + Math.sin(frame * 2) * 4}deg)`, background: "#FF3B5C", color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 38, padding: "4px 20px 8px", borderRadius: 14, border: "4px solid #fff", whiteSpace: "nowrap" }}>ÇA TREMBLE !</div>
          )}
        </div>
      )}
      {frame >= fAt - 1 && (
        <div style={{ position: "absolute", left: 540 - 105, top: 330, ...slam(frame, fAt, 2.4) }}>
          <Img k="phone" w={210} sweep={interpolate(frame, [fAt + 4, fAt + 20], [-0.3, 1.3], clamp)} />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 70, top: 236, display: "flex", justifyContent: "center", zIndex: 20 }}>
        {frame < fAt - 1 ? (
          <div dir="rtl" style={{ ...slam(frame, gAt, 2), fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#fff", textShadow, whiteSpace: "nowrap", transform: frame >= sAt ? `translateX(${Math.sin(frame * 2.2) * 6}px)` : undefined }}>الفيديو ديما كيترعد؟</div>
        ) : (
          <div dir="rtl" style={{ ...slam(frame, fAt, 2.4), background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 60, padding: "2px 36px 12px", borderRadius: 999, boxShadow: "0 14px 34px rgba(6,14,90,0.4)", whiteSpace: "nowrap" }}>هاهوا الحل!</div>
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: Math.max(interpolate(frame, [0, 1, 6], [0.5, 0.5, 0], clamp), interpolate(frame - fAt, [0, 1, 6], [0, 0.5, 0], clamp)) }} />
    </SceneShell>
  );
};

/** 3.5-6.5 s INTRO: DJI Osmo Mobile 7, DISPONIBLE. */
export const O7Intro: React.FC = () => {
  const frame = useSceneFrame("intro");
  const nAt = o7ev("intro.name"), oAt = o7ev("intro.osmo"), dAt = o7ev("intro.dispo");
  const enter = sp(frame, o7scene("intro").from, { damping: 12, stiffness: 110, mass: 0.8 });
  const sk = shake(frame, nAt, 12, 8);
  return (
    <SceneShell id="intro" shakeX={sk.x} shakeY={sk.y}>
      <Burst x={540} y={700} r={900} rot={frame * 0.5} opacity={0.16 * enter} rays={20} />
      <div style={{ position: "absolute", left: 0, right: 70, top: 226, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, fontFamily: FONT, fontWeight: 900, color: "#fff", whiteSpace: "nowrap", textShadow }}>
        <div style={{ ...slam(frame, nAt, 2), fontSize: 40, letterSpacing: 10 }}>DJI</div>
        {frame >= oAt - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 16, ...slam(frame, oAt, 2.2) }}>
            <span style={{ fontSize: 80 }}>Osmo Mobile</span>
            <span style={{ fontSize: 86, color: COLORS.blue, background: "#fff", padding: "0 24px 4px", borderRadius: 18, textShadow: "none" }}>7</span>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 420, top: 420, transform: `translateY(${(1 - enter) * 1000}px) rotate(${lerp(-8, 0, enter)}deg)` }}>
        <Img k="unfolded" w={260} sweep={interpolate(frame, [oAt + 2, oAt + 20], [-0.3, 1.3], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 690, top: 520, transform: `translateX(${(1 - sp(frame, oAt + 4, { damping: 12, stiffness: 140 })) * 500}px) rotate(5deg)` }}>
        <Img k="folded" w={210} />
      </div>
      <Row top={1060}>
        {frame >= dAt - 1 && (
          <div style={{ ...slam(frame, dAt, 1.8), display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#fff", background: GREEN, padding: "8px 26px", borderRadius: 999, letterSpacing: 3, whiteSpace: "nowrap", boxShadow: "0 10px 26px rgba(6,14,90,0.3)" }}>
            <LineIcon name="store" size={48} stroke={7} color="#fff" />DISPONIBLE
          </div>
        )}
      </Row>
    </SceneShell>
  );
};

/** 6.5-11.0 s 3-axis stabiliser: steady like cinema, even when walking or running. */
export const O7Stab: React.FC = () => {
  const frame = useSceneFrame("stab");
  const aAt = o7ev("st.axes"), sAt = o7ev("st.steady"), cAt = o7ev("st.cinema"), wAt = o7ev("st.walk");
  const steady = ramp(frame, sAt - 2, sAt + 6);
  const amp = frame < wAt ? 12 : 22;
  const bx = Math.sin(frame * 1.3) * amp, by = -Math.abs(Math.sin(frame * 0.9)) * amp;
  return (
    <SceneShell id="stab">
      <Title frame={frame} at={aAt} pill size={56}>Stabilisateur 3 axes</Title>
      {/* the handle moves with the walk; the phone/video stays put */}
      <div style={{ position: "absolute", left: 340, top: 420, transform: `translate(${bx}px, ${by}px) rotate(${Math.sin(frame * 0.8) * 6}deg)` }}>
        <Img k="phone" w={190} />
      </div>
      <VideoFrame frame={frame} x={560} y={460} w={380} h={240} jitter={1 - steady}>
        {frame >= cAt - 1 && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: "#000", opacity: ramp(frame, cAt, cAt + 8) }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "#000", opacity: ramp(frame, cAt, cAt + 8) }} />
          </>
        )}
        {frame >= sAt - 1 && (
          <div style={{ position: "absolute", right: 12, top: 34, ...slam(frame, sAt, 2) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontWeight: 900, fontSize: 28, color: COLORS.blue, background: "#fff", padding: "2px 14px 6px", borderRadius: 12 }}>
              <LineIcon name="check" size={32} stroke={10} color={GREEN} />STABLE
            </div>
          </div>
        )}
      </VideoFrame>
      {frame >= wAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 760, transform: `scale(${pop(frame, wAt)}) translateX(${Math.sin(frame * 0.5) * 10}px)` }}>
          <LineIcon name="run" size={120} stroke={7} />
        </div>
      )}
      <Row top={1060}>
        <Chip frame={frame} at={sAt} text="Stable comme au cinéma" icon="play" size={34} solid />
        <Chip frame={frame} at={wAt} text="Même en marchant ou en courant" icon="run" size={32} />
      </Row>
    </SceneShell>
  );
};

/** 11.0-16.25 s ActiveTrack with the DJI Mimo app: follows you or your kids automatically, hands-free. */
export const O7Track: React.FC = () => {
  const frame = useSceneFrame("track");
  const tAt = o7ev("tr.active"), mAt = o7ev("tr.mimo"), fAt = o7ev("tr.follow"), kAt = o7ev("tr.kids"), hAt = o7ev("tr.hands");
  const enter = sp(frame, o7scene("track").from, { damping: 13, stiffness: 120 });
  // subject runs left-right; the gimbal pans to follow
  const t = Math.max(0, frame - fAt) / 30;
  const sx = 700 + Math.sin(t * 1.6) * 170;
  const pan = frame >= fAt ? Math.sin(t * 1.6) * 16 : 0;
  const box = ramp(frame, fAt, fAt + 8);
  return (
    <SceneShell id="track">
      <Title frame={frame} at={tAt} pill size={58}><LineIcon name="eye" size={64} stroke={8} color={COLORS.blue} />ActiveTrack</Title>
      <div style={{ position: "absolute", left: 320, top: 400, transform: `translateY(${(1 - enter) * 900}px) rotate(${pan}deg)`, transformOrigin: "50% 100%" }}>
        <Img k="phone" w={210} />
      </div>
      {frame >= fAt - 1 && (
        <div style={{ position: "absolute", left: sx - 70, top: 520, width: 140, height: 170 }}>
          <div style={{ position: "absolute", inset: 0, border: "5px dashed #6CF3FF", borderRadius: 18, opacity: box, transform: `scale(${lerp(1.4, 1, box)})` }} />
          <div style={{ position: "absolute", left: 20, top: 20, transform: `scaleX(${Math.cos(t * 1.6) >= 0 ? 1 : -1})` }}>
            <LineIcon name="run" size={100} stroke={7} />
          </div>
        </div>
      )}
      {frame >= kAt - 1 && (
        <div style={{ position: "absolute", left: sx + 60, top: 610, transform: `scale(${pop(frame, kAt) * 0.7})` }}>
          <LineIcon name="run" size={100} stroke={7} />
        </div>
      )}
      {frame >= mAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 360, transform: `scale(${pop(frame, mAt)})`, display: "flex", alignItems: "center", gap: 10, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 32, padding: "6px 20px 10px", borderRadius: 999, boxShadow: "0 12px 30px rgba(6,14,90,0.35)", whiteSpace: "nowrap" }}>
          <LineIcon name="phone" size={38} stroke={8} color={COLORS.blue} />App DJI Mimo
        </div>
      )}
      <Row top={1020}>
        <Chip frame={frame} at={fAt} text="Te suit automatiquement" icon="eye" size={32} solid />
        <Chip frame={frame} at={kAt} text="Toi ou tes enfants" icon="heart" size={30} />
        <Chip frame={frame} at={hAt} text="Mains libres" icon="check" size={30} solid />
      </Row>
      <Footnote frame={frame} at={mAt + 6} top={1290} text="Suivi via l'application DJI Mimo · compatibilité selon le téléphone" />
    </SceneShell>
  );
};

/** 16.25-20.25 s folds and fits in a pocket; magnetic clamp to mount the phone in a second. */
export const O7Fold: React.FC = () => {
  const frame = useSceneFrame("fold");
  const fAt = o7ev("fd.fold"), pAt = o7ev("fd.pocket"), cAt = o7ev("fd.clamp"), sAt = o7ev("fd.sec");
  const folded = frame >= fAt + 4;
  const fold = ramp(frame, fAt - 2, fAt + 6);
  const inPocket = interpolate(frame, [pAt, pAt + 10], [0, 1], { ...clamp, easing: easeOut });
  const snap = interpolate(frame, [cAt, cAt + 10], [0, 1], { ...clamp, easing: easeOut });
  const flash = frame >= cAt + 10 ? interpolate(frame, [cAt + 10, cAt + 12, cAt + 22], [0, 1, 0], clamp) : 0;
  return (
    <SceneShell id="fold">
      <Title frame={frame} at={fAt} pill size={56}><LineIcon name="fold" size={62} stroke={8} color={COLORS.blue} />Pliable</Title>
      {/* left: unfolded -> folded -> slides into a drawn pocket */}
      <div style={{ position: "absolute", left: 300, top: 380, width: 300, height: 560 }}>
        {frame >= pAt - 1 && (
          <svg width={300} height={420} viewBox="0 0 300 420" style={{ position: "absolute", left: 0, top: 220, opacity: ramp(frame, pAt - 1, pAt + 6) }}>
            <path d="M20 10 H280 V330 Q150 420 20 330 Z" fill="rgba(30,79,176,0.92)" stroke="#fff" strokeWidth={8} />
            <path d="M20 10 Q150 80 280 10" fill="none" stroke="#fff" strokeWidth={6} strokeDasharray="14 12" />
          </svg>
        )}
        <div style={{ position: "absolute", left: folded ? 60 : 70, top: folded ? lerp(40, 190, inPocket) : 0, opacity: folded ? 1 : 1 - fold, clipPath: inPocket > 0 ? `inset(0 0 ${inPocket * 40}% 0)` : undefined }}>
          {folded ? <Img k="folded" w={190} /> : <Img k="unfolded" w={180} />}
        </div>
      </div>
      {/* right: magnetic clamp snaps onto a phone back */}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 640, top: 420, width: 260, height: 460, transform: `scale(${pop(frame, cAt)})` }}>
          <div style={{ position: "absolute", left: 40, top: 0, width: 180, height: 360, borderRadius: 34, background: "linear-gradient(160deg,#3a3f4c,#1b1d24)", border: "5px solid #fff", boxShadow: "0 18px 40px rgba(6,14,90,0.45)" }} />
          <div style={{ position: "absolute", left: 130 - 90, top: lerp(-160, 140, snap), opacity: snap }}>
            <Img k="clamp" w={180} />
          </div>
          {flash > 0 && <div style={{ position: "absolute", left: 30, top: 110, width: 200, height: 120, borderRadius: 60, border: "8px solid #6CF3FF", opacity: flash, transform: `scale(${1 + (1 - flash) * 0.6})` }} />}
          {frame >= sAt - 1 && (
            <div style={{ position: "absolute", left: 60, top: 380, ...slam(frame, sAt, 2), display: "flex", alignItems: "center", gap: 8, background: "#fff", color: COLORS.blue, fontFamily: FONT, fontWeight: 900, fontSize: 36, padding: "4px 18px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
              <LineIcon name="stopwatch" size={40} stroke={8} color={COLORS.blue} />1 s
            </div>
          )}
        </div>
      )}
      <Row top={1060}>
        <Chip frame={frame} at={pAt} text="Tient dans la poche" icon="fold" size={34} />
        <Chip frame={frame} at={cAt} text="Pince magnétique" icon="magnet" size={34} solid />
      </Row>
    </SceneShell>
  );
};

/** 20.25-22.5 s battery up to 10 h of filming. */
export const O7Battery: React.FC = () => {
  const frame = useSceneFrame("battery");
  const bAt = o7ev("bt.battery"), hAt = o7ev("bt.hours");
  const enter = sp(frame, o7scene("battery").from, { damping: 13, stiffness: 120 });
  const h = Math.round(10 * easeOut(ramp(frame, hAt, hAt + 14)));
  const fill = easeOut(ramp(frame, bAt, hAt + 14));
  return (
    <SceneShell id="battery">
      <Title frame={frame} at={bAt} pill size={56}><LineIcon name="battery" size={64} stroke={8} color={COLORS.blue} />Batterie</Title>
      <div style={{ position: "absolute", left: 330, top: 420, transform: `translateX(${(1 - enter) * -800}px)` }}>
        <Img k="unfolded" w={220} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 520, width: 320, height: 150, borderRadius: 30, border: "10px solid #fff", padding: 10, background: "rgba(6,14,90,0.2)", boxShadow: "0 18px 44px rgba(6,14,90,0.35)", transform: `scale(${enter})` }}>
        <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 16, background: "linear-gradient(90deg,#2BD96B,#9CFFB8)" }} />
        <div style={{ position: "absolute", right: -32, top: 44, width: 20, height: 52, borderRadius: 6, background: "#fff" }} />
        {frame >= hAt - 1 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: FONT, color: COLORS.navy }}>
            <span style={{ fontWeight: 900, fontSize: 70 }}>{h}</span><span style={{ fontWeight: 900, fontSize: 40 }}>h</span>
          </div>
        )}
      </div>
      <Row top={1060}>
        <Chip frame={frame} at={hAt} text="Jusqu'à 10 h de tournage" icon="stopwatch" size={34} solid />
      </Row>
      <Footnote frame={frame} at={hAt + 4} top={1200} text="Autonomie variable selon l'usage" />
    </SceneShell>
  );
};
