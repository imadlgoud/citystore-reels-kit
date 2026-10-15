import React from "react";
import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { COLORS } from "../../brand";
import { rev, rscene, RTL_READERS } from "./timeline";

// Citybot's acting for the e-readers reel: squinting at a glaring phone with tired eyes, cheering the e-readers in,
// then presenting each one from the corner.
const kobo = rscene("kobo"), cs = rscene("colorsoft"), pw = rscene("paperwhite"), eink = rscene("eink");
const trust = rscene("trust"), cta = rscene("cta"), end = rscene("end");
const phone = rev("hook.phone"), tired = rev("hook.tired"), readers = rev("hook.readers");

const gestures: Gesture[] = [
  { from: phone, to: tired - 2, arm: "right", pose: { rot: 120, hand: "point" }, osc: 4 }, // points at the glaring phone
  { from: tired, to: readers - 2, arm: "left", pose: { rot: 150, hand: "fist" }, osc: 8 }, // rubs its tired eyes
  { from: readers, to: kobo.from + 2, arm: "left", pose: { rot: 160, hand: "open" }, osc: 4 },
  { from: readers, to: kobo.from + 2, arm: "right", pose: { rot: 160, hand: "open" }, osc: 4 },
  ...[kobo, cs, pw].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: rev("kobo.write"), to: kobo.to - 2, arm: "left", pose: { rot: 70, hand: "fist" }, osc: 10 },
  { from: rev("paperwhite.light"), to: rev("paperwhite.battery") - 2, arm: "left", pose: { rot: 130, hand: "open" }, osc: 6 },
  { from: eink.from + 4, to: eink.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: trust.from + 2, to: rev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: rev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: rev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: rev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: rev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: rev("end.wink"), to: RTL_READERS.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < kobo.from) return f >= readers ? "excited" : "neutral";
  if (f >= rev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= rev("cta.wave") && f < cta.to) return "happy";
  if (f >= rev("trust.thumb") && f < trust.to) return "proud";
  if (f >= rev("eink.eyes") && f < eink.to) return "happy";
  if (f >= rev("paperwhite.light") && f < pw.to) return "happy";
  if (f >= rev("colorsoft.comics") && f < cs.to) return "excited";
  if (f >= rev("kobo.color") && f < kobo.to) return "happy";
  return "neutral";
};

/** tired face drawn on the phone screen (screen space x 108-292, y 68-287): heavy lids, red veins, eye bags, wobbly mouth */
const TiredFace: React.FC<{ p: number; f: number }> = ({ p, f }) => {
  const lid = 162 + Math.sin(f * 0.35) * 3; // heavy lid line, slowly drooping
  return (
    <g opacity={p}>
      {[160, 240].map((cx) => (
        <g key={cx}>
          {/* half-closed eye: only the lower half is open, red veins, heavy lid line on top */}
          <path d={`M ${cx - 30} 162 A 30 30 0 0 0 ${cx + 30} 162 Z`} fill="#fff" />
          <circle cx={cx + 2} cy={177} r={11} fill={COLORS.navy} />
          <path d={`M ${cx - 25} 168 L ${cx - 14} 174 M ${cx + 25} 168 L ${cx + 15} 175 M ${cx - 6} 188 L ${cx - 2} 182`} stroke="#FF4D6D" strokeWidth={3} strokeLinecap="round" />
          <path d={`M ${cx - 36} ${lid - 4} Q ${cx} ${lid + 6} ${cx + 36} ${lid - 4}`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
          {/* eye bags */}
          <path d={`M ${cx - 22} 204 Q ${cx} 214 ${cx + 22} 204`} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" />
        </g>
      ))}
      {/* wobbly mouth */}
      <path d="M 170 238 Q 185 230 200 238 T 230 238" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" />
      {/* sweat drop */}
      <path d="M 276 104 C 276 104 266 118 266 124 A 10 10 0 0 0 286 124 C 286 118 276 104 276 104 Z" fill="#BFF4FF" opacity={0.9} />
    </g>
  );
};

export const readersDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: kobo.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: readers, dur: 12, height: 60 },
    { at: rev("kobo.color"), dur: 10, height: 34 },
    { at: rev("colorsoft.comics"), dur: 10, height: 40 },
    { at: rev("paperwhite.light"), dur: 12, height: 48 },
    { at: rev("eink.eyes"), dur: 10, height: 40 },
    { at: rev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - readers, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < kobo.from
      ? f < tired ? Math.sin(f * 0.2) * 3 : f < readers ? kf(f, [[tired, 0], [tired + 6, -10], [readers - 2, -8]]) + Math.sin(f * 0.5) * 2 : kf(f, [[readers, -8], [readers + 8, 5], [kobo.from, 4]])
      : kf(f, [[kobo.from, 4], [kobo.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [rev("end.wink") - 3, -6], [rev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < kobo.from) return f < tired ? { x: 0, y: -0.7 } : f < readers ? { x: 0, y: 0.3 } : { x: 0, y: -0.6 };
    if (f < end.from) return { x: kf(f, [[kobo.from, 0], [kobo.from + 10, 0.75]]), y: kf(f, [[kobo.from, 0], [kobo.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [rev("end.wink") - 4, 0.5], [rev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [rev("end.wink") - 4, -0.8], [rev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [readers, readers + 1, readers + 8], [0, 0.8, 0], clamp)),
  faceAt: (f) => {
    if (f < tired || f > readers) return null;
    const p = interpolate(f, [tired, tired + 3, readers - 3, readers], [0, 1, 1, 0], clamp);
    return <TiredFace p={p} f={f} />;
  },
};
