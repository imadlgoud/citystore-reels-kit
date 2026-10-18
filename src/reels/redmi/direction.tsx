import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { rsev, rsscene, RSTL } from "./timeline";

// Citybot's acting for the Redmi 5G reel: shrugs "which one?" at the flipping phones, cheers at the fan, then presents
// each phone from the corner.
const n15 = rsscene("note15"), pro = rsscene("proplus"), n14 = rsscene("note14");
const trust = rsscene("trust"), cta = rsscene("cta"), end = rsscene("end");
const which = rsev("hook.which"), fan = rsev("hook.fan");

const gestures: Gesture[] = [
  { from: which, to: fan - 2, arm: "left", pose: { rot: 100, hand: "open" }, osc: 6 }, // shrug: "which one?"
  { from: which, to: fan - 2, arm: "right", pose: { rot: 100, hand: "open" }, osc: 6 },
  { from: fan, to: n15.from + 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: fan, to: n15.from + 2, arm: "right", pose: { rot: 160, hand: "fist" } },
  ...[n15, pro, n14].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: rsev("proplus.cam"), to: rsev("proplus.charge") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: trust.to - 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: rsev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: rsev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: rsev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: rsev("end.wink"), to: RSTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < n15.from) return f >= fan ? "excited" : "neutral";
  if (f >= rsev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= rsev("cta.wave") && f < cta.to) return "happy";
  if (f >= trust.from && f < trust.to) return "proud";
  if (f >= rsev("note14.price") && f < n14.to) return "happy";
  if (f >= rsev("proplus.cam") && f < pro.to) return "excited";
  if (f >= rsev("note15.new") && f < n15.to) return "happy";
  return "neutral";
};

export const redmiDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: n15.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: fan, dur: 12, height: 60 },
    { at: rsev("note15.new"), dur: 10, height: 36 },
    { at: rsev("proplus.cam"), dur: 12, height: 50 },
    { at: rsev("note14.price"), dur: 10, height: 40 },
    { at: trust.from + 4, dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - fan, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < n15.from
      ? f >= which && f < fan ? Math.sin((f - which) * 0.3) * 8 : kf(f, [[0, 0], [fan, 0], [fan + 6, -8], [n15.from, 4]])
      : kf(f, [[n15.from, 4], [n15.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [rsev("end.wink") - 3, -6], [rsev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < n15.from) return { x: f >= which && f < fan ? Math.sin(f * 0.2) * 0.7 : 0, y: -0.6 };
    if (f < end.from) return { x: kf(f, [[n15.from, 0], [n15.from + 10, 0.75]]), y: kf(f, [[n15.from, 0], [n15.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [rsev("end.wink") - 4, 0.5], [rsev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [rsev("end.wink") - 4, -0.8], [rsev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [fan, fan + 1, fan + 8], [0, 0.8, 0], clamp)),
};
