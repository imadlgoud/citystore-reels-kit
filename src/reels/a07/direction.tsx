import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { a7ev, a7scene, A7TL } from "./timeline";

// Citybot's acting for the Galaxy A07 reel: points at the price tag, cheers when the phone lands, then presents each
// feature from the corner.
const intro = a7scene("intro"), sc = a7scene("screen"), cb = a7scene("cambat"), up = a7scene("updates"), co = a7scene("colors");
const trust = a7scene("trust"), cta = a7scene("cta"), end = a7scene("end");
const price = a7ev("hook.price"), here = a7ev("hook.here");

const gestures: Gesture[] = [
  { from: 4, to: here - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: here, to: intro.from + 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 160, hand: "fist" } },
  ...[intro, sc, cb, up, co].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: a7ev("cb.bat"), to: a7ev("cb.day") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: a7ev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: a7ev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: a7ev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: a7ev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: a7ev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: a7ev("end.wink"), to: A7TL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : f >= price ? "happy" : "neutral";
  if (f >= a7ev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= a7ev("cta.wave") && f < cta.to) return "happy";
  if (f >= a7ev("trust.thumb") && f < trust.to) return "proud";
  if (f >= a7ev("co.noir") && f < co.to) return "happy";
  if (f >= a7ev("up.new") && f < up.to) return "happy";
  if (f >= a7ev("cb.bat") && f < cb.to) return "excited";
  if (f >= a7ev("sc.size") && f < sc.to) return "happy";
  return "neutral";
};

export const a07Direction: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 60 },
    { at: a7ev("sc.size"), dur: 10, height: 34 },
    { at: a7ev("cb.bat"), dur: 12, height: 48 },
    { at: a7ev("up.new"), dur: 10, height: 36 },
    { at: a7ev("co.rose"), dur: 10, height: 36 },
    { at: a7ev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [price, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [a7ev("end.wink") - 3, -6], [a7ev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [a7ev("end.wink") - 4, 0.5], [a7ev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [a7ev("end.wink") - 4, -0.8], [a7ev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
