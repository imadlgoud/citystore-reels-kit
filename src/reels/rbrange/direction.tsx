import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { rrev, rrscene, RRTL } from "./timeline";

// Citybot's acting for the Ray-Ban Meta range reel: stops you at "don't buy before watching", cheers at the video, then
// presents each model from the corner.
const intro = rrscene("lineup"), st = rrscene("w3"), tr = rrscene("aviator"), fd = rrscene("gen2"), batt = rrscene("all");
const trust = rrscene("trust"), cta = rrscene("cta"), end = rrscene("end");
const no = rrev("hook.stop"), here = rrev("hook.video");

const gestures: Gesture[] = [
  { from: 4, to: no - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: no, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 14 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, st, tr, fd, batt].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: rrev("w3.auto"), to: rrev("w3.light") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: rrev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: rrev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: rrev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: rrev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: rrev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: rrev("end.wink"), to: RRTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "neutral";
  if (f >= rrev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= rrev("cta.wave") && f < cta.to) return "happy";
  if (f >= rrev("trust.thumb") && f < trust.to) return "proud";
  if (f >= rrev("al.vid") && f < batt.to) return "excited";
  if (f >= rrev("g2.price") && f < fd.to) return "happy";
  if (f >= rrev("av.classic") && f < tr.to) return "happy";
  if (f >= rrev("w3.auto") && f < st.to) return "excited";
  return "neutral";
};

export const rbrangeDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: rrev("w3.auto"), dur: 10, height: 40 },
    { at: rrev("av.classic"), dur: 10, height: 34 },
    { at: rrev("g2.price"), dur: 10, height: 34 },
    { at: rrev("al.vid"), dur: 12, height: 50 },
    { at: rrev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [no, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [rrev("end.wink") - 3, -6], [rrev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [rrev("end.wink") - 4, 0.5], [rrev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [rrev("end.wink") - 4, -0.8], [rrev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
