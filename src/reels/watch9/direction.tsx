import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { w9ev, w9scene, W9TL } from "./timeline";

// Citybot's acting for the Galaxy Watch9 reel: shakes the gift box with its eyes, cheers when it pops open,
// then presents each feature from the corner.
const intro = w9scene("intro"), lte = w9scene("lte"), chip = w9scene("chip"), bat = w9scene("battery"), gem = w9scene("gemini");
const trust = w9scene("trust"), cta = w9scene("cta"), end = w9scene("end");
const open = w9ev("hook.open"), store = w9ev("hook.store");

const gestures: Gesture[] = [
  { from: 4, to: open - 2, arm: "right", pose: { rot: 120, hand: "point" }, osc: 6 }, // points at the shaking box
  { from: open, to: store - 2, arm: "left", pose: { rot: 160, hand: "open" }, osc: 4 },
  { from: open, to: store - 2, arm: "right", pose: { rot: 160, hand: "open" }, osc: 4 },
  { from: store, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, lte, chip, bat, gem].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: w9ev("lte.answer"), to: w9ev("lte.msgs") - 2, arm: "left", pose: { rot: 130, hand: "open" }, osc: 4 }, // "hello?"
  { from: w9ev("bat.pct"), to: w9ev("bat.w8") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: w9ev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: w9ev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: w9ev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: w9ev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: w9ev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: w9ev("end.wink"), to: W9TL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= open ? "excited" : "neutral";
  if (f >= w9ev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= w9ev("cta.wave") && f < cta.to) return "happy";
  if (f >= w9ev("trust.thumb") && f < trust.to) return "proud";
  if (f >= w9ev("gem.gemini") && f < gem.to) return "happy";
  if (f >= w9ev("bat.pct") && f < bat.to) return "excited";
  if (f >= w9ev("chip.fast") && f < chip.to) return "happy";
  if (f >= w9ev("lte.answer") && f < lte.to) return "happy";
  if (f >= w9ev("intro.name") && f < intro.to) return "happy";
  return "neutral";
};

export const watch9Direction: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: open, dur: 12, height: 60 },
    { at: w9ev("intro.name"), dur: 10, height: 34 },
    { at: w9ev("lte.answer"), dur: 10, height: 34 },
    { at: w9ev("chip.fast"), dur: 10, height: 40 },
    { at: w9ev("bat.pct"), dur: 12, height: 52 },
    { at: w9ev("gem.gemini"), dur: 10, height: 40 },
    { at: w9ev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - open, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? f < open ? Math.sin(f * 0.6) * 4 : kf(f, [[open, -8], [open + 8, 5], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [w9ev("end.wink") - 3, -6], [w9ev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return f < open ? { x: Math.sin(f * 0.5) * 0.3, y: -0.7 } : { x: 0, y: -0.8 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [w9ev("end.wink") - 4, 0.5], [w9ev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [w9ev("end.wink") - 4, -0.8], [w9ev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [open, open + 1, open + 8], [0, 0.8, 0], clamp)),
};
