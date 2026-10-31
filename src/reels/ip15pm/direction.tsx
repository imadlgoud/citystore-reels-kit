import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { p5ev, p5scene, P5TL } from "./timeline";

// Citybot's acting for the iPhone 15 Pro Max reel: shrugs at "in 2026?", cheers at "yes, we have it!", then presents each
// feature from the corner.
const intro = p5scene("intro"), st = p5scene("titan"), tr = p5scene("chip"), fd = p5scene("camera"), batt = p5scene("sim");
const trust = p5scene("trust"), cta = p5scene("cta"), end = p5scene("end");
const no = p5ev("hook.year"), here = p5ev("hook.yes");

const gestures: Gesture[] = [
  { from: 4, to: no - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: no, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 14 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, st, tr, fd, batt].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: p5ev("ch.games"), to: tr.to - 4, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: p5ev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: p5ev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: p5ev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: p5ev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: p5ev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: p5ev("end.wink"), to: P5TL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "neutral";
  if (f >= p5ev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= p5ev("cta.wave") && f < cta.to) return "happy";
  if (f >= p5ev("trust.thumb") && f < trust.to) return "proud";
  if (f >= p5ev("sm.usbc") && f < batt.to) return "happy";
  if (f >= p5ev("cm.x5") && f < fd.to) return "excited";
  if (f >= p5ev("ch.games") && f < tr.to) return "excited";
  if (f >= p5ev("ti.size") && f < st.to) return "happy";
  return "neutral";
};

export const ip15pmDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: p5ev("ti.size"), dur: 10, height: 34 },
    { at: p5ev("ch.chip"), dur: 12, height: 50 },
    { at: p5ev("cm.x5"), dur: 10, height: 40 },
    { at: p5ev("sm.usbc"), dur: 10, height: 34 },
    { at: p5ev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [no, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [p5ev("end.wink") - 3, -6], [p5ev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [p5ev("end.wink") - 4, 0.5], [p5ev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [p5ev("end.wink") - 4, -0.8], [p5ev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
