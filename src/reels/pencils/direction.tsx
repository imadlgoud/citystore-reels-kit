import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { pnev, pnscene, PNTL } from "./timeline";

// Citybot's acting for the Apple Pencil range reel: shrugs at "which one fits your iPad?", cheers when the four pencils
// land, then presents each model from the corner.
const intro = pnscene("pro"), batt = pnscene("gen2"), sleep = pnscene("gen1"), disp = pnscene("usbc");
const trust = pnscene("trust"), cta = pnscene("cta"), end = pnscene("end");
const no = pnev("hook.unsure"), here = pnev("hook.four");

const gestures: Gesture[] = [
  { from: 4, to: no - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: no, to: here - 2, arm: "left", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: no, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 4 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, batt, sleep, disp].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: pnev("uc.cheap"), to: pnev("uc.notes") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: pnev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: pnev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: pnev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: pnev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: pnev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: pnev("end.wink"), to: PNTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "neutral";
  if (f >= pnev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= pnev("cta.wave") && f < cta.to) return "happy";
  if (f >= pnev("trust.thumb") && f < trust.to) return "proud";
  if (f >= pnev("uc.cheap") && f < disp.to) return "excited";
  if (f >= pnev("g1.press") && f < sleep.to) return "happy";
  if (f >= pnev("g2.tap") && f < batt.to) return "happy";
  if (f >= pnev("pro.squeeze") && f < intro.to) return "excited";
  return "neutral";
};

export const pencilsDirection: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: pnev("pro.squeeze"), dur: 10, height: 40 },
    { at: pnev("g2.tap"), dur: 10, height: 34 },
    { at: pnev("g1.press"), dur: 10, height: 34 },
    { at: pnev("uc.cheap"), dur: 12, height: 50 },
    { at: pnev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [no, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [pnev("end.wink") - 3, -6], [pnev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [pnev("end.wink") - 4, 0.5], [pnev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [pnev("end.wink") - 4, -0.8], [pnev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
