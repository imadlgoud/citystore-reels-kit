import { interpolate } from "remotion";
import { clamp, Direction, Gesture, kf } from "../../components/CitybotActor";
import { Expression } from "../../citybot/Citybot";
import { hev, hscene, H10TL } from "./timeline";

// Citybot's acting for the GoPro HERO10 Black (used) reel: cheers for the camera, shakes "no" at the new-price tag,
// then presents each feature from the corner.
const intro = hscene("intro"), res = hscene("res"), sm = hscene("smooth"), wt = hscene("water"), kit = hscene("kit");
const trust = hscene("trust"), cta = hscene("cta"), end = hscene("end");
const yes = hev("hook.gopro"), no = hev("hook.cross");

const gestures: Gesture[] = [
  { from: yes, to: hev("hook.price") - 2, arm: "left", pose: { rot: 160, hand: "fist" } },
  { from: yes, to: hev("hook.price") - 2, arm: "right", pose: { rot: 160, hand: "fist" } },
  { from: hev("hook.price"), to: no - 2, arm: "right", pose: { rot: 130, hand: "point" }, osc: 4 }, // points at the price tag
  { from: no, to: intro.from + 2, arm: "right", pose: { rot: 120, hand: "open" }, osc: 24 }, // "no no"
  ...[intro, res, wt, kit].map((s) => ({ from: s.from + 6, to: s.to - 4, arm: "right" as const, pose: { rot: 140, hand: "point" as const }, osc: 3 })),
  { from: hev("sm.run"), to: sm.to - 2, arm: "left", pose: { rot: 60, hand: "fist" }, osc: 28 },
  { from: hev("sm.run"), to: sm.to - 2, arm: "right", pose: { rot: 60, hand: "fist" }, osc: 28 },
  { from: hev("trust.thumb") - 3, to: trust.to - 4, arm: "right", pose: { rot: 72, hand: "thumb" } },
  { from: cta.from + 2, to: hev("cta.wave") - 2, arm: "right", pose: { rot: 140, hand: "point" }, osc: 3 },
  { from: hev("cta.wave"), to: cta.to - 2, arm: "right", pose: { rot: 122, hand: "wave" }, osc: 20 },
  { from: end.from + 4, to: hev("end.wink") - 2, arm: "left", pose: { rot: 120, hand: "wave" }, osc: 18 },
  { from: hev("end.wink"), to: H10TL.totalFrames + 60, arm: "right", pose: { rot: 72, hand: "thumb" } },
];

const expressionAt = (f: number): Expression => {
  if (f < intro.from) return f >= no ? "neutral" : f >= yes ? "excited" : "happy";
  if (f >= hev("end.wink")) return "wink";
  if (f >= end.from) return "happy";
  if (f >= hev("cta.wave") && f < cta.to) return "happy";
  if (f >= hev("trust.thumb") && f < trust.to) return "proud";
  if (f >= hev("sm.run") && f < sm.to) return "excited";
  if (f >= hev("res.k") && f < res.to) return "happy";
  if (f >= hev("wt.self") && f < wt.to) return "happy";
  if (f >= hev("kit.ready") && f < kit.to) return "excited";
  return "neutral";
};

export const hero10Direction: Direction = {
  gestures,
  expressionAt,
  cornerFrom: intro.from - 3,
  endFrom: end.from - 2,
  hops: [
    { at: yes, dur: 12, height: 60 },
    { at: hev("res.k"), dur: 10, height: 34 },
    { at: hev("sm.jump"), dur: 12, height: 64 },
    { at: hev("wt.dive"), dur: 10, height: 30 },
    { at: hev("kit.ready"), dur: 10, height: 40 },
    { at: hev("trust.thumb"), dur: 10, height: 40 },
    { at: end.from + 3, dur: 12, height: 56 },
  ],
  squashAt: (f) => interpolate(f, [0, 7, 12, 15, 20], [1.22, 1.12, 0.84, 1.05, 1], clamp) * interpolate(f - hev("sm.fall"), [0, 3, 8, 12], [1, 0.8, 1.06, 1], clamp),
  tiltAt: (f) =>
    f < intro.from
      ? f >= no ? Math.sin((f - no) * 0.8) * 10 * Math.max(0, 1 - (f - no) / 20) : kf(f, [[0, 0], [yes, 0], [yes + 6, -8], [hev("hook.price"), 0]])
      : f >= hev("sm.run") && f < sm.to
        ? Math.sin(f * 0.7) * 5 + (f >= hev("sm.fall") ? kf(f, [[hev("sm.fall"), 0], [hev("sm.fall") + 4, 18], [hev("sm.fall") + 12, 4]]) : 0)
        : kf(f, [[intro.from, 4], [intro.from + 12, 8], [trust.from, 8], [trust.from + 8, 4], [end.from, 4], [end.from + 8, -6], [hev("end.wink") - 3, -6], [hev("end.wink") + 3, 7]]),
  lookAt: (f) => {
    if (f < intro.from) return { x: 0, y: -0.4 };
    if (f < end.from) return { x: kf(f, [[intro.from, 0], [intro.from + 10, 0.75]]), y: kf(f, [[intro.from, 0], [intro.from + 10, -0.6]]) };
    return { x: kf(f, [[end.from, 0.5], [hev("end.wink") - 4, 0.5], [hev("end.wink"), 0]]), y: kf(f, [[end.from, -0.8], [hev("end.wink") - 4, -0.8], [hev("end.wink"), 0]]) };
  },
  flashAt: (f) => Math.max(interpolate(f, [11, 12, 20], [0, 1, 0], clamp), interpolate(f, [hev("res.photo"), hev("res.photo") + 1, hev("res.photo") + 8], [0, 0.8, 0], clamp)),
};
