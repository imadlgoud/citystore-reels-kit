import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { u4ev, u4scene, U4TL } from "./timeline";

// Citybot's acting for the Apple Watch Ultra 4 reel: counts the two days, cheers at the satellite, then presents each
// feature from the corner.
const intro = u4scene("intro"), ti = u4scene("titan"), bat = u4scene("battery"), gps = u4scene("gps"), hl = u4scene("health");
const trust = u4scene("trust"), cta = u4scene("cta"), end = u4scene("end");
const price = u4ev("hook.days"), here = u4ev("hook.nonet");

const gestures: Gesture[] = [
  { from: 4, to: here - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: here, to: intro.from + 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 160, hand: "fist" } },
  ...[intro, ti, bat, gps, hl].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: u4ev("bat.84"), to: bat.to - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: u4ev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: u4ev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: u4ev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: u4ev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: u4ev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: u4ev("end.wink"), to: U4TL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : f >= price ? "happy" : "neutral";
  if (f >= u4ev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= u4ev("cta.wave") && f < cta.to) return "happy";
  if (f >= u4ev("trust.thumb") && f < trust.to) return "proud";
  if (f >= u4ev("hl.heart") && f < hl.to) return "happy";
  if (f >= u4ev("gps.sat") && f < gps.to) return "excited";
  if (f >= u4ev("bat.84") && f < bat.to) return "excited";
  if (f >= u4ev("ti.strong") && f < ti.to) return "proud";
  return "neutral";
};

export const ultra4Direction: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 60 },
    { at: u4ev("ti.strong"), dur: 10, height: 36 },
    { at: u4ev("bat.84"), dur: 12, height: 50 },
    { at: u4ev("gps.sat"), dur: 10, height: 40 },
    { at: u4ev("hl.heart"), dur: 10, height: 34 },
    { at: u4ev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [price, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [u4ev("end.wink") - 3, -6], [u4ev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [u4ev("end.wink") - 4, 0.5], [u4ev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [u4ev("end.wink") - 4, -0.8], [u4ev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
