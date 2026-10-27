import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { wbev, wbscene, WBTL } from "./timeline";

// Citybot's acting for the Apple Watch Series 11 reel: waves off the "latest model" tag, cheers when the watches land,
// then presents each feature from the corner.
const intro = wbscene("intro"), batt = wbscene("battery"), sleep = wbscene("sleep"), disp = wbscene("display");
const trust = wbscene("trust"), cta = wbscene("cta"), end = wbscene("end");
const no = wbev("hook.latest"), here = wbev("hook.watch");

const gestures: Gesture[] = [
  { from: 4, to: no - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: no, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 14 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, batt, sleep, disp].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: wbev("dp.sport"), to: disp.to - 4, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: wbev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: wbev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: wbev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: wbev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: wbev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: wbev("end.wink"), to: WBTL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "neutral";
  if (f >= wbev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= wbev("cta.wave") && f < cta.to) return "happy";
  if (f >= wbev("trust.thumb") && f < trust.to) return "proud";
  if (f >= wbev("dp.heart") && f < disp.to) return "excited";
  if (f >= wbev("sl.alert") && f < sleep.to) return "neutral";
  if (f >= wbev("sl.score") && f < sleep.to) return "happy";
  if (f >= wbev("bt.hours") && f < batt.to) return "excited";
  return "neutral";
};

export const watch11Direction: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: wbev("intro.series"), dur: 10, height: 40 },
    { at: wbev("bt.hours"), dur: 12, height: 50 },
    { at: wbev("sl.score"), dur: 10, height: 34 },
    { at: wbev("dp.sport"), dur: 10, height: 40 },
    { at: wbev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [no, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [wbev("end.wink") - 3, -6], [wbev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [wbev("end.wink") - 4, 0.5], [wbev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [wbev("end.wink") - 4, -0.8], [wbev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
