import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { mmev, mmscene, MMTL } from "./timeline";

// Citybot's acting for the Mac mini M6 reel: amazed by the tiny box vs the big PC, then presents each feature from the
// corner.
const intro = mmscene("intro"), chip = mmscene("chip"), ai = mmscene("ai"), ports = mmscene("ports"), last = mmscene("ports");
const trust = mmscene("trust"), cta = mmscene("cta"), end = mmscene("end");
const price = mmev("hook.hand"), here = mmev("hook.big");

const gestures: Gesture[] = [
  { from: 4, to: price - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: price, to: here - 2, arm: "left", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: price, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, chip, ai, ports].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: mmev("ai.x4"), to: mmev("ai.m4") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: mmev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: mmev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: mmev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: mmev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: mmev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: mmev("end.wink"), to: MMTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "happy";
  if (f >= mmev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= mmev("cta.wave") && f < cta.to) return "happy";
  if (f >= mmev("trust.thumb") && f < trust.to) return "proud";
  if (f >= mmev("po.size") && f < last.to) return "happy";
  if (f >= mmev("ai.x4") && f < ai.to) return "excited";
  if (f >= mmev("chip.cpu") && f < chip.to) return "proud";
  return "neutral";
};

export const macminiDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: mmev("chip.m6"), dur: 10, height: 36 },
    { at: mmev("ai.x4"), dur: 12, height: 50 },
    { at: mmev("po.size"), dur: 10, height: 34 },
    { at: mmev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [price, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [mmev("end.wink") - 3, -6], [mmev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [mmev("end.wink") - 4, 0.5], [mmev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [mmev("end.wink") - 4, -0.8], [mmev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
