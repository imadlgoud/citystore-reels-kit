import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { o7ev, o7scene, O7TL } from "./timeline";

// Citybot's acting for the DJI Osmo Mobile 7 reel: waves at the shaky video, cheers when the gimbal lands, then presents
// each feature from the corner.
const intro = o7scene("intro"), st = o7scene("stab"), tr = o7scene("track"), fd = o7scene("fold"), batt = o7scene("battery");
const trust = o7scene("trust"), cta = o7scene("cta"), end = o7scene("end");
const no = o7ev("hook.shake"), here = o7ev("hook.fix");

const gestures: Gesture[] = [
  { from: 4, to: no - 2, arm: "right", pose: { rot: 125, hand: "point" }, osc: 4 },
  { from: no, to: here - 2, arm: "right", pose: { rot: 150, hand: "open" }, osc: 14 },
  { from: here, to: intro.from + 2, arm: "right", pose: { rot: 72, hand: "thumb" } },
  ...[intro, st, tr, fd, batt].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: o7ev("st.steady"), to: o7ev("st.walk") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: trust.from + 2, to: o7ev("trust.thumb") - 3, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: o7ev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: o7ev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: o7ev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: o7ev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: o7ev("end.wink"), to: O7TL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= here ? "excited" : "neutral";
  if (f >= o7ev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= o7ev("cta.wave") && f < cta.to) return "happy";
  if (f >= o7ev("trust.thumb") && f < trust.to) return "proud";
  if (f >= o7ev("bt.hours") && f < batt.to) return "excited";
  if (f >= o7ev("fd.sec") && f < fd.to) return "happy";
  if (f >= o7ev("tr.kids") && f < tr.to) return "happy";
  if (f >= o7ev("st.steady") && f < st.to) return "excited";
  return "neutral";
};

export const om7Direction: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: here, dur: 12, height: 56 },
    { at: o7ev("st.steady"), dur: 10, height: 40 },
    { at: o7ev("tr.kids"), dur: 10, height: 34 },
    { at: o7ev("fd.sec"), dur: 10, height: 34 },
    { at: o7ev("bt.hours"), dur: 12, height: 50 },
    { at: o7ev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - here, [0, 3, 8, 12], [1, 0.86, 1.05, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? kf(f, [[0, 0], [no, -4], [here, 0], [here + 6, -8], [intro.from, 4]])
      : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [o7ev("end.wink") - 3, -6], [o7ev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.7 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [o7ev("end.wink") - 4, 0.5], [o7ev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [o7ev("end.wink") - 4, -0.8], [o7ev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [here, here + 1, here + 8], [0, 0.8, 0], clamp)),
};
