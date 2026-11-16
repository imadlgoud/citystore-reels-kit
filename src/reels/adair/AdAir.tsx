import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import timelineJson from "../../../public/adair/data/timeline.json";
import { COLORS, FONT } from "../../brand";
import { pop, ramp, slam, sp } from "../../anim";
import { LineIcon } from "../../components/Icons";
import { Timeline } from "../../timeline";

/*
 * MacBook Air M4 + cadeau surprise: performance AD (25 s, 9:16). A different edit from the Citybot reels:
 *  - real store footage (the robot hook clip), punch zooms on the robot's head turns
 *  - hard cuts on every product name, full-bleed colour blocks, giant outlined names behind the product
 *  - word-by-word captions (current word highlighted), a small City Store bug, film grain
 *  - gift reveal, trust stamps over the blurred store, CTA over the robot freeze frame
 */
const TL = timelineJson as unknown as Timeline & { eventsSec: Record<string, number> };
const ev = (k: string) => TL.events[k] as number;
const sc = (id: string) => TL.scenes.find((s) => s.id === id)!;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const INK = "#0B0D17", YELLOW = "#FFD23F", RED = "#E8322E", WHITE = "#FFFFFF";
const outline = (w: number, c = INK) => `${-w}px ${-w}px 0 ${c}, ${w}px ${-w}px 0 ${c}, ${-w}px ${w}px 0 ${c}, ${w}px ${w}px 0 ${c}, 0 ${w * 1.6}px 0 ${c}`;

/* ---------------- shared bits ---------------- */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none" }}>
      <filter id="adgrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 6} /></filter>
      <rect width={1080} height={1920} filter="url(#adgrain)" />
    </svg>
  );
};

const Bug: React.FC = () => (
  <div style={{ position: "absolute", left: 44, top: 70, display: "flex", alignItems: "center", gap: 12, background: "rgba(11,13,23,0.55)", padding: "8px 18px 8px 8px", borderRadius: 999, zIndex: 40 }}>
    <Img src={staticFile("logo/logo.png")} style={{ width: 52, height: 52, borderRadius: "50%" }} />
    <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 28, color: WHITE, letterSpacing: 1 }}>citystore.ma</span>
  </div>
);

/** word-by-word captions: the phrase stays, each word pops in on its time, the current word is yellow */
const Captions: React.FC<{ hideIn: [number, number][] }> = ({ hideIn }) => {
  const frame = useCurrentFrame();
  if (hideIn.some(([a, b]) => frame >= a && frame < b)) return null;
  const c = TL.subtitles.find((s) => frame >= s.from && frame < s.to);
  if (!c) return null;
  const cur = c.words.reduce((acc, w, i) => (frame >= w.frame ? i : acc), -1);
  const ar = /[؀-ۿ]/.test(c.text);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1290, display: "flex", justifyContent: "center", zIndex: 50 }}>
      <div dir={ar ? "rtl" : "ltr"} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px", maxWidth: 960 }}>
        {c.words.map((w, i) => {
          if (i > cur) return null;
          const p = sp(frame, w.frame - 1, { damping: 12, stiffness: 300, mass: 0.5 });
          return (
            <span key={i} style={{ display: "inline-block", fontFamily: FONT, fontWeight: 900, fontSize: 84, lineHeight: 1.2, color: i === cur ? YELLOW : WHITE, textShadow: outline(5), transform: `scale(${0.6 + 0.4 * p}) translateY(${(1 - p) * 30}px)` }}>
              {w.word}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** quick flash + zoom-blur between scenes */
const CutFlash: React.FC<{ at: number; color?: string }> = ({ at, color = WHITE }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame - at, [-1, 0, 3], [0, 0.85, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ background: color, opacity: o, zIndex: 60 }} /> : null;
};

/* ---------------- HOOK: the store robot, punch zooms on the head turns ---------------- */
const HEAD = { x: 545, y: 600 };
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t1 = ev("hook.turn1"), t2 = ev("hook.turn2"), cad = ev("hook.cadeau");
  const z1 = sp(frame, t1, { damping: 18, stiffness: 260 }), z2 = sp(frame, t2, { damping: 20, stiffness: 120 });
  const zoom = interpolate(frame, [0, t1], [1, 1.06], clamp) * (1 + 0.5 * z1) * (1 + 0.42 * z2);
  const shake = (at: number) => {
    const k = frame - at;
    return k >= 0 && k < 8 ? (random(`sh${at}-${k}`) - 0.5) * 22 * (1 - k / 8) : 0;
  };
  const sx = shake(t1) + shake(t2), sy = shake(t1 + 1) + shake(t2 + 1);
  const tagIn = sp(frame, cad, { damping: 10, stiffness: 200, mass: 0.6 });
  const tagOut = 1 - ramp(frame, t1 - 4, t1);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: INK }}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${zoom})`, transformOrigin: `${HEAD.x}px ${HEAD.y}px` }}>
        <OffthreadVideo src={staticFile("adair/clip/hook.mp4")} muted style={{ width: 1080, height: 1920 }} />
      </AbsoluteFill>
      {/* vignette so captions read on the busy store */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
      {/* MacBook Air M4 title on the first word */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: 1 - ramp(frame, t1 - 6, t1) }}>
        <div style={{ ...slam(frame, 6, 2), fontFamily: FONT, fontWeight: 900, fontSize: 96, color: WHITE, textShadow: outline(5), whiteSpace: "nowrap" }}>MacBook Air M4</div>
      </div>
      {/* CADEAU SURPRISE sticker slaps on as the box comes up */}
      {frame >= cad - 1 && tagOut > 0 && (
        <div style={{ position: "absolute", left: 600, top: 760, transform: `scale(${tagIn}) rotate(-8deg)`, opacity: tagOut, display: "flex", alignItems: "center", gap: 12, background: YELLOW, color: INK, fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "12px 24px", borderRadius: 18, border: `5px solid ${INK}`, boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
          <GiftIcon size={58} /> CADEAU SURPRISE
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- LIST: hard cuts on each product name ---------------- */
type Item = { at: string; name: string; img?: string; bg: string; fg: string; w: number };
const ITEMS: Item[] = [
  { at: "p.iphone", name: "iPhone", img: "pricelist/iphones/18promax.png", bg: YELLOW, fg: INK, w: 900 },
  { at: "p.macbook", name: "MacBook", img: "pricelist/macbooks/pro14.png", bg: INK, fg: WHITE, w: 940 },
  { at: "p.ipad", name: "iPad", img: "pricelist/ipads/13.png", bg: COLORS.blue, fg: WHITE, w: 640 },
  { at: "p.airpods", name: "AirPods", img: "pricelist/airpods/pro3.png", bg: "#F2F1EC", fg: INK, w: 430 },
  { at: "p.watch", name: "Apple Watch", img: "pricelist/watches/ultra4.png", bg: "#FF5A36", fg: WHITE, w: 600 },
  { at: "p.samsung", name: "Samsung", img: "pricelist/samsung/s26ultra.png", bg: INK, fg: WHITE, w: 980 },
  { at: "p.gaming", name: "Gaming", img: "adair/ps5.png", bg: COLORS.blue, fg: WHITE, w: 640 },
];
const List: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = ITEMS.reduce((acc, it, i) => (frame >= ev(it.at) ? i : acc), -1);
  if (idx < 0) return <AbsoluteFill style={{ background: INK }} />;
  const it = ITEMS[idx];
  const at = ev(it.at);
  const p = sp(frame, at, { damping: 14, stiffness: 220, mass: 0.6 });
  const drift = (frame - at) * 0.9;
  const big = it.name.length > 8 ? 210 : 290;
  return (
    <AbsoluteFill style={{ background: it.bg, overflow: "hidden" }}>
      {/* giant outlined name behind, sliding */}
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `translateX(${80 - drift * 2}px)` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: big, letterSpacing: -6, color: "transparent", WebkitTextStroke: `4px ${it.fg}`, opacity: 0.35, whiteSpace: "nowrap" }}>{it.name.toUpperCase()}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, height: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${1.25 - 0.25 * p}) rotate(${(1 - p) * -10 + Math.sin(frame / 9) * 1.2}deg) translateY(${Math.sin(frame / 11) * 8}px)`, filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.35))" }}>
          {it.img ? (
            <Img src={staticFile(it.img)} style={{ width: it.w, maxHeight: 820, objectFit: "contain" }} />
          ) : (
            <div style={{ width: it.w, height: it.w * 0.8, display: "flex", alignItems: "center", justifyContent: "center" }}><LineIcon name="controller" size={it.w} stroke={6} color={WHITE} /></div>
          )}
        </div>
      </div>
      {/* solid name, bottom */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", justifyContent: "center" }}>
        <span style={{ ...slam(frame, at, 1.6), fontFamily: FONT, fontWeight: 900, fontSize: 110, color: it.fg, whiteSpace: "nowrap" }}>{it.name}</span>
      </div>
      {/* "وحتى le gaming" sign-off chip on the last one */}
      {it.name === "Gaming" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
          <div dir="rtl" style={{ ...slam(frame, at, 1.8), background: YELLOW, color: INK, fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: "6px 34px 12px", borderRadius: 999 }}>وحتى le gaming!</div>
        </div>
      )}
      {/* item counter dots */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1490, display: "flex", justifyContent: "center", gap: 14 }}>
        {ITEMS.map((_, i) => <div key={i} style={{ width: i === idx ? 44 : 14, height: 14, borderRadius: 7, background: it.fg, opacity: i <= idx ? 0.9 : 0.25 }} />)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- GIFT: surprise box reveal ---------------- */
const GiftIcon: React.FC<{ size: number; lid?: number }> = ({ size, lid = 0 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible" }}>
    <rect x={14} y={42} width={72} height={52} rx={6} fill={RED} stroke={INK} strokeWidth={5} />
    <rect x={44} y={42} width={12} height={52} fill={YELLOW} stroke={INK} strokeWidth={3} />
    <g transform={`translate(0 ${-lid * 60}) rotate(${-lid * 18} 50 36)`}>
      <rect x={8} y={28} width={84} height={18} rx={5} fill={RED} stroke={INK} strokeWidth={5} />
      <rect x={44} y={28} width={12} height={18} fill={YELLOW} stroke={INK} strokeWidth={3} />
      <path d="M50 28 C38 8 18 14 30 26 Z M50 28 C62 8 82 14 70 26 Z" fill={YELLOW} stroke={INK} strokeWidth={4} />
    </g>
  </svg>
);
const Gift: React.FC = () => {
  const frame = useCurrentFrame();
  const inAt = ev("gift.in"), fAt = ev("gift.first"), sAt = ev("gift.shake"), oAt = ev("gift.open"), qAt = ev("gift.q");
  const drop = sp(frame, inAt, { damping: 10, stiffness: 160, mass: 0.8 });
  const shake = frame >= sAt && frame < oAt ? Math.sin((frame - sAt) * 1.6) * 7 * (1 + (frame - sAt) / 20) : 0;
  const lid = sp(frame, oAt, { damping: 12, stiffness: 140 });
  const q = sp(frame, qAt, { damping: 9, stiffness: 160 });
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, #2A2F55 0%, ${INK} 62%)`, overflow: "hidden" }}>
      {frame >= oAt && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: ramp(frame, oAt, oAt + 6) }}>
          <g transform={`translate(540 900) rotate(${t * 20})`}>
            {Array.from({ length: 16 }).map((_, i) => <path key={i} d="M0 0 L-40 -900 L40 -900 Z" fill={YELLOW} opacity={0.12} transform={`rotate(${i * 22.5})`} />)}
          </g>
          {Array.from({ length: 40 }).map((_, i) => {
            const k = frame - oAt, a = random(`cf${i}`) * Math.PI * 2, v = 14 + random(`cv${i}`) * 22;
            const x = 540 + Math.cos(a) * v * k, y = 900 + Math.sin(a) * v * k + 0.6 * k * k;
            return <rect key={i} x={x} y={y} width={16} height={10} fill={[YELLOW, RED, WHITE, COLORS.cyan][i % 4]} transform={`rotate(${k * 20 + i * 30} ${x} ${y})`} />;
          })}
        </svg>
      )}
      <div style={{ position: "absolute", left: 540 - 260, top: 640 - (1 - drop) * 1200, transform: `rotate(${shake}deg)`, transformOrigin: "50% 90%" }}>
        <GiftIcon size={520} lid={lid} />
      </div>
      {frame >= qAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 560 - q * 220, display: "flex", justifyContent: "center", transform: `scale(${q})` }}>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 300, color: YELLOW, textShadow: outline(8) }}>?</span>
        </div>
      )}
      {frame >= fAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, fAt, 1.8), background: WHITE, color: INK, fontFamily: FONT, fontWeight: 900, fontSize: 54, padding: "10px 34px", borderRadius: 999, transform: "rotate(-3deg)" }}>1ÈRE COMMANDE</div>
        </div>
      )}
      {frame >= oAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center" }}>
          <div style={{ ...slam(frame, oAt, 2.2), fontFamily: FONT, fontWeight: 900, fontSize: 92, color: YELLOW, textShadow: outline(6), whiteSpace: "nowrap" }}>CADEAU SURPRISE</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1600, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, color: WHITE, opacity: 0.8 * ramp(frame, fAt, fAt + 8) }}>
        Cadeau surprise offert pour toute première commande
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- TRUST: stamps over the blurred real store ---------------- */
const CITIES = ["Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir", "Oujda", "Laâyoune"];
const Trust: React.FC = () => {
  const frame = useCurrentFrame();
  const o = ev("trust.orig"), g = ev("trust.gar"), l = ev("trust.liv"), m = ev("trust.maroc");
  const truck = interpolate(frame, [l, l + 40], [-260, 1180], clamp);
  // three aligned cards of the same width, straight, each with a green check; they slide in from the left
  const CARD_W = 860;
  const card = (at: number, text: string, top: number, bg = WHITE, size = 56) => {
    if (frame < at - 1) return null;
    const p = sp(frame, at, { damping: 15, stiffness: 220, mass: 0.6 });
    return (
      <div style={{ position: "absolute", left: (1080 - CARD_W) / 2, top, width: CARD_W, transform: `translateX(${(1 - p) * -260}px)`, opacity: Math.min(1, p * 1.5) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, background: bg, color: INK, fontFamily: FONT, fontWeight: 900, fontSize: size, height: 128, padding: "0 30px", borderRadius: 26, boxShadow: "0 20px 50px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>
          <svg width={74} height={74} viewBox="0 0 70 70" style={{ flexShrink: 0 }}>
            <circle cx={35} cy={35} r={33} fill="#22C55E" />
            <path d="M19 36 L30 47 L52 24" fill="none" stroke={WHITE} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - ramp(frame, at + 3, at + 11))} />
          </svg>
          {text}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, #26306A 0%, ${INK} 65%)`, overflow: "hidden" }}>
      {/* soft brand glow + faint grid */}
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)", backgroundSize: "60px 60px" }} />
      {card(o, "PRODUITS ORIGINAUX", 480)}
      {card(g, "AVEC GARANTIE", 648)}
      {frame >= l - 1 && (
        <>
          {card(l, "LIVRAISON PARTOUT AU MAROC", 816, YELLOW, 36)}
          {/* road + truck */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1130, height: 10, background: "repeating-linear-gradient(90deg, #fff 0 60px, transparent 60px 100px)", opacity: 0.6 }} />
          <svg width={240} height={130} viewBox="0 0 240 130" style={{ position: "absolute", left: truck, top: 1010 }}>
            <rect x={8} y={20} width={140} height={80} rx={10} fill={WHITE} stroke={INK} strokeWidth={6} />
            <path d="M148 46 H196 L228 74 V100 H148 Z" fill={YELLOW} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            <circle cx={50} cy={106} r={18} fill={INK} /><circle cx={190} cy={106} r={18} fill={INK} />
            <text x={78} y={70} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={22} fill={COLORS.blue}>CITY STORE</text>
          </svg>
        </>
      )}
      {frame >= m - 1 && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 1190, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {CITIES.map((c, i) => frame < m + i * 2 ? null : (
            <div key={c} style={{ transform: `scale(${pop(frame, m + i * 2)})`, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.14)", border: "3px solid rgba(255,255,255,0.8)", color: WHITE, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "6px 20px 6px 12px", borderRadius: 999 }}>
              <LineIcon name="pin" size={36} stroke={9} color={YELLOW} />{c}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------------- END: robot freeze frame, logo, tagline, CTA ---------------- */
const End: React.FC = () => {
  const frame = useCurrentFrame();
  const lAt = ev("end.logo"), tAt = ev("end.tag"), cAt = ev("end.cta"), uAt = ev("end.url");
  const url = "citystore.ma";
  const typed = Math.max(0, Math.min(url.length, Math.floor((frame - uAt) / 1.1) + 1));
  const push = 1 + (frame - lAt) * 0.0012;
  return (
    <AbsoluteFill style={{ background: INK, overflow: "hidden" }}>
      <Img src={staticFile("adair/clip/robot_hold.jpg")} style={{ position: "absolute", inset: 0, width: 1080, height: 1920, transform: `scale(${push})`, filter: `brightness(${0.55 - 0.15 * ramp(frame, cAt, cAt + 10)})` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(11,13,23,0.85) 0%, rgba(11,13,23,0.1) 38%, rgba(11,13,23,0.2) 60%, rgba(11,13,23,0.92) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...slam(frame, lAt, 1.8) }}>
        <Img src={staticFile("logo/city.png")} style={{ width: 520 }} />
        <Img src={staticFile("logo/storema.png")} style={{ width: 520 }} />
      </div>
      {frame >= tAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}>
          <div dir="rtl" style={{ ...slam(frame, tAt, 2), background: YELLOW, color: INK, fontFamily: FONT, fontWeight: 900, fontSize: 70, padding: "4px 40px 14px", borderRadius: 999 }}>الأصلي ديما!</div>
        </div>
      )}
      {frame >= cAt - 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1380, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <div style={{ ...slam(frame, cAt, 1.8), display: "flex", alignItems: "center", gap: 18, background: COLORS.blue, color: WHITE, fontFamily: FONT, fontWeight: 900, fontSize: 58, padding: "18px 44px", borderRadius: 999, boxShadow: `0 0 0 6px ${WHITE}, 0 20px 50px rgba(0,0,0,0.5)` }}>
            <LineIcon name="chat" size={64} stroke={8} color={WHITE} />
            <span dir="rtl">صيفط لينا ميساج</span>
          </div>
          {frame >= uAt - 1 && (
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: WHITE, textShadow: outline(4) }}>
              {url.slice(0, typed)}<span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }}>|</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: WHITE, opacity: ramp(frame, cAt + 6, cAt + 14) }}>
            <LineIcon name="instagram" size={40} stroke={8} color={WHITE} />@citystore.ma
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const SCENES: [string, React.FC][] = [["hook", Hook], ["list", List], ["gift", Gift], ["trust", Trust], ["end", End]];

export const AdAir: React.FC = () => {
  const frame = useCurrentFrame();
  const list = sc("list"), endS = sc("end");
  return (
    <AbsoluteFill style={{ background: INK }}>
      <Freeze frame={TL.holdFrom} active={(f) => f >= TL.holdFrom}>
        <AbsoluteFill>
          {SCENES.map(([id, Comp]) => {
            const s = sc(id);
            return (
              <Sequence key={id} from={s.from} durationInFrames={s.to - s.from} name={id} layout="none">
                <AbsoluteFill><Shift from={s.from}><Comp /></Shift></AbsoluteFill>
              </Sequence>
            );
          })}
          {frame >= list.from && frame < endS.from && <Bug />}
          <Captions hideIn={[[list.from, sc("gift").from], [ev("gift.open"), TL.totalFrames]]} />
          {[list.from, sc("gift").from, sc("trust").from, endS.from].map((a) => <CutFlash key={a} at={a} />)}
          <Grain />
        </AbsoluteFill>
      </Freeze>
      <Audio src={staticFile("adair/audio/mix.wav")} />
    </AbsoluteFill>
  );
};

/** scenes use absolute frames (events are absolute), so undo the Sequence offset */
const Shift: React.FC<{ from: number; children: React.ReactNode }> = ({ from, children }) => (
  <FrameOffset offset={from}>{children}</FrameOffset>
);
const FrameOffset: React.FC<{ offset: number; children: React.ReactNode }> = ({ offset, children }) => (
  <Sequence from={-offset} layout="none">{children}</Sequence>
);
